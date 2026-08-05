from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from geoalchemy2.elements import WKTElement
from geoalchemy2.shape import to_shape

from app.db.session import get_db
from app.db.models import WorkerProfile, WorkerLocation, User, WorkerStatus
from app.api.v1.auth import get_current_user
from app.api.v1.schemas import LocationUpdate, WorkerProfileOut
from app.modules.notifications.websocket_manager import ws_manager

router = APIRouter(prefix="/workers", tags=["Worker Operations"])

@router.post("/location")
async def update_worker_location(
    loc_in: LocationUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(WorkerProfile).where(WorkerProfile.user_id == current_user.id)
    res = await db.execute(stmt)
    worker = res.scalar_one_or_none()
    
    if not worker:
        raise HTTPException(status_code=404, detail="Worker profile not found")

    # Update telemetry
    worker.battery_level = loc_in.battery_level
    worker.network_quality = loc_in.network_quality

    wkt_point = WKTElement(f"POINT({loc_in.longitude} {loc_in.latitude})", srid=4326)

    # Upsert Location
    stmt_loc = select(WorkerLocation).where(WorkerLocation.worker_id == worker.id)
    res_loc = await db.execute(stmt_loc)
    loc = res_loc.scalar_one_or_none()

    if not loc:
        loc = WorkerLocation(
            worker_id=worker.id,
            location=wkt_point,
            accuracy_meters=loc_in.accuracy_meters,
            speed=loc_in.speed,
            heading=loc_in.heading,
            is_spoofed=loc_in.is_spoofed
        )
        db.add(loc)
    else:
        loc.location = wkt_point
        loc.accuracy_meters = loc_in.accuracy_meters
        loc.speed = loc_in.speed
        loc.heading = loc_in.heading
        loc.is_spoofed = loc_in.is_spoofed

    await db.commit()

    # Broadcast location update to WebSocket clients
    await ws_manager.broadcast_to_event(
        "global",  # or specific active event_id
        {
            "type": "WORKER_LOCATION_UPDATED",
            "payload": {
                "worker_id": str(worker.id),
                "latitude": loc_in.latitude,
                "longitude": loc_in.longitude,
                "battery": loc_in.battery_level,
                "status": worker.status.value
            }
        }
    )

    return {"status": "ok", "updated": True}

@router.get("", response_model=List[WorkerProfileOut])
async def list_workers(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(WorkerProfile, WorkerLocation).outerjoin(
        WorkerLocation, WorkerProfile.id == WorkerLocation.worker_id
    )
    res = await db.execute(stmt)
    rows = res.all()

    out = []
    for worker, loc in rows:
        lat, lng = None, None
        if loc and loc.location:
            pt = to_shape(loc.location)
            lat, lng = pt.y, pt.x
            
        out.append(WorkerProfileOut(
            id=str(worker.id),
            user_id=str(worker.user_id),
            status=worker.status,
            skills=worker.skills or [],
            battery_level=worker.battery_level,
            network_quality=worker.network_quality,
            active_tasks_count=worker.active_tasks_count,
            latitude=lat,
            longitude=lng
        ))
    return out
