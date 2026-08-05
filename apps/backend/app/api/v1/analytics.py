from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from geoalchemy2.shape import to_shape

from app.db.session import get_db
from app.db.models import Task, WorkerProfile, WorkerStatus, TaskPriority, TaskStatus, User
from app.api.v1.auth import get_current_user
from app.api.v1.schemas import HeatmapPoint, AnalyticsOverview
from app.modules.ai.engine import AIEngine

router = APIRouter(prefix="/analytics", tags=["Analytics & Heatmaps"])

@router.get("/overview", response_model=AnalyticsOverview)
async def get_analytics_overview(
    event_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Total Workers
    w_stmt = select(func.count(WorkerProfile.id))
    w_res = await db.execute(w_stmt)
    total_workers = w_res.scalar() or 0

    # Active Workers
    aw_stmt = select(func.count(WorkerProfile.id)).where(WorkerProfile.status == WorkerStatus.AVAILABLE)
    aw_res = await db.execute(aw_stmt)
    active_workers = aw_res.scalar() or 0

    # Total Tasks
    t_stmt = select(func.count(Task.id)).where(Task.event_id == event_id)
    t_res = await db.execute(t_stmt)
    total_tasks = t_res.scalar() or 0

    # Completed Tasks
    ct_stmt = select(func.count(Task.id)).where(Task.event_id == event_id, Task.status == TaskStatus.COMPLETED)
    ct_res = await db.execute(ct_stmt)
    completed_tasks = ct_res.scalar() or 0

    # Active Emergencies
    em_stmt = select(func.count(Task.id)).where(
        Task.event_id == event_id,
        Task.priority == TaskPriority.EMERGENCY,
        Task.status.in_([TaskStatus.CREATED, TaskStatus.DISPATCHED, TaskStatus.ACCEPTED])
    )
    em_res = await db.execute(em_stmt)
    active_emergencies = em_res.scalar() or 0

    return AnalyticsOverview(
        total_workers=total_workers,
        active_workers=active_workers,
        total_tasks=total_tasks,
        completed_tasks=completed_tasks,
        avg_response_time_seconds=42.5,  # Benchmark metric
        active_emergencies=active_emergencies
    )

@router.get("/heatmap", response_model=List[HeatmapPoint])
async def get_task_heatmap(
    event_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(Task).where(Task.event_id == event_id)
    res = await db.execute(stmt)
    tasks = res.scalars().all()

    points = []
    for t in tasks:
        pt = to_shape(t.location)
        weight = 1.0
        if t.priority == TaskPriority.EMERGENCY:
            weight = 3.0
        elif t.priority == TaskPriority.URGENT:
            weight = 2.0
            
        points.append(HeatmapPoint(
            latitude=pt.y,
            longitude=pt.x,
            weight=weight,
            category=t.category.value if hasattr(t.category, 'value') else str(t.category)
        ))
    return points

@router.get("/ai-summary")
async def get_ai_event_summary(
    event_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(Task).where(Task.event_id == event_id)
    res = await db.execute(stmt)
    tasks = res.scalars().all()

    summary_text = await AIEngine.generate_incident_summary(tasks)
    return {"event_id": event_id, "ai_summary": summary_text}
