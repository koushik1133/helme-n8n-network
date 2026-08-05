from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func
from geoalchemy2.elements import WKTElement
from geoalchemy2.shape import to_shape

from app.db.session import get_db
from app.db.models import Task, WorkerProfile, TaskStatus, TaskPriority, TaskCategory, User
from app.api.v1.auth import get_current_user
from app.api.v1.schemas import TaskCreate, AITaskCreate, TaskStatusUpdate, TaskOut
from app.modules.dispatch.engine import DispatchEngine
from app.modules.ai.engine import AIEngine
from app.modules.notifications.websocket_manager import ws_manager

router = APIRouter(prefix="/tasks", tags=["Tasks Operations"])

def task_to_out(task: Task) -> TaskOut:
    point = to_shape(task.location)
    return TaskOut(
        id=str(task.id),
        event_id=str(task.event_id),
        title=task.title,
        description=task.description,
        category=task.category,
        priority=task.priority,
        status=task.status,
        latitude=point.y,
        longitude=point.x,
        location_text=task.location_text,
        required_skills=task.required_skills or [],
        required_equipment=task.required_equipment or [],
        assigned_worker_id=str(task.assigned_worker_id) if task.assigned_worker_id else None,
        before_photo_url=task.before_photo_url,
        after_photo_url=task.after_photo_url,
        dispatch_score=task.dispatch_score,
        created_at=task.created_at,
        updated_at=task.updated_at
    )

@router.post("", response_model=TaskOut)
async def create_task(
    task_in: TaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check spatial duplicate task
    dup = await AIEngine.detect_duplicate_task(db, task_in.latitude, task_in.longitude, task_in.category.value)
    if dup:
        raise HTTPException(
            status_code=409, 
            detail=f"Duplicate task detected nearby ({dup.title}). ID: {dup.id}"
        )

    wkt_point = WKTElement(f"POINT({task_in.longitude} {task_in.latitude})", srid=4326)
    
    task = Task(
        event_id=task_in.event_id,
        created_by_id=current_user.id,
        zone_id=task_in.zone_id,
        title=task_in.title,
        description=task_in.description,
        category=task_in.category,
        priority=task_in.priority,
        location=wkt_point,
        location_text=task_in.location_text,
        required_skills=task_in.required_skills,
        required_equipment=task_in.required_equipment,
        status=TaskStatus.CREATED
    )
    db.add(task)
    await db.commit()
    await db.refresh(task)

    # Auto Dispatch if requested
    if task_in.auto_dispatch:
        assigned_worker = await DispatchEngine.auto_assign_task(db, str(task.id))
        await db.refresh(task)

    out = task_to_out(task)

    # Real-time WebSocket Broadcast to Manager Dashboard
    await ws_manager.broadcast_to_event(
        str(task.event_id),
        {"type": "TASK_CREATED", "payload": out.dict(mode="json")}
    )

    return out

@router.post("/ai-extract", response_model=TaskOut)
async def create_task_via_ai(
    ai_in: AITaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Voice or Vision AI automated task creation."""
    extracted = {}
    if ai_in.raw_text:
        extracted = await AIEngine.extract_task_from_text(ai_in.raw_text)
    elif ai_in.image_url:
        extracted = await AIEngine.extract_task_from_image_meta(ai_in.image_url)
    else:
        raise HTTPException(status_code=400, detail="Must supply raw_text or image_url")

    wkt_point = WKTElement(f"POINT({ai_in.longitude} {ai_in.latitude})", srid=4326)

    task = Task(
        event_id=ai_in.event_id,
        created_by_id=current_user.id,
        title=extracted["title"],
        description=extracted["description"],
        category=TaskCategory(extracted["category"]),
        priority=TaskPriority(extracted["priority"]),
        location=wkt_point,
        required_skills=extracted["required_skills"],
        required_equipment=extracted["required_equipment"],
        ai_extracted=True,
        ai_confidence=extracted["ai_confidence"],
        before_photo_url=extracted.get("before_photo_url"),
        status=TaskStatus.ANALYZED_BY_AI
    )
    db.add(task)
    await db.commit()
    await db.refresh(task)

    if ai_in.auto_dispatch:
        await DispatchEngine.auto_assign_task(db, str(task.id))
        await db.refresh(task)

    out = task_to_out(task)
    await ws_manager.broadcast_to_event(
        str(task.event_id),
        {"type": "TASK_CREATED_AI", "payload": out.dict(mode="json")}
    )
    return out

@router.get("", response_model=List[TaskOut])
async def list_tasks(
    event_id: str,
    status_filter: Optional[TaskStatus] = None,
    priority_filter: Optional[TaskPriority] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(Task).where(Task.event_id == event_id)
    if status_filter:
        stmt = stmt.where(Task.status == status_filter)
    if priority_filter:
        stmt = stmt.where(Task.priority == priority_filter)
        
    stmt = stmt.order_by(Task.created_at.desc())
    res = await db.execute(stmt)
    tasks = res.scalars().all()
    return [task_to_out(t) for t in tasks]

@router.patch("/{task_id}/status", response_model=TaskOut)
async def update_task_status(
    task_id: str,
    update_in: TaskStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(Task).where(Task.id == task_id)
    res = await db.execute(stmt)
    task = res.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.status = update_in.status
    if update_in.photo_url:
        if update_in.status == TaskStatus.ACCEPTED or update_in.status == TaskStatus.IN_TRANSIT:
            task.before_photo_url = update_in.photo_url
        elif update_in.status == TaskStatus.COMPLETED or update_in.status == TaskStatus.VERIFIED:
            task.after_photo_url = update_in.photo_url

    await db.commit()
    await db.refresh(task)

    out = task_to_out(task)
    await ws_manager.broadcast_to_event(
        str(task.event_id),
        {"type": "TASK_STATUS_UPDATED", "payload": out.dict(mode="json")}
    )
    return out
