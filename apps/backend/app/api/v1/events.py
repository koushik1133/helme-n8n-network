from typing import List
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.db.models import Event, Venue, VenueZone, User
from app.api.v1.auth import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/events", tags=["Events & Venues"])

class EventCreate(BaseModel):
    name: str
    description: str
    venue_id: str
    start_time: datetime
    end_time: datetime

class EventOut(BaseModel):
    id: str
    name: str
    description: str
    venue_id: str
    start_time: datetime
    end_time: datetime
    is_active: bool

    class Config:
        from_attributes = True

@router.post("", response_model=EventOut)
async def create_event(
    event_in: EventCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    event = Event(
        org_id=current_user.org_id,
        venue_id=event_in.venue_id,
        name=event_in.name,
        description=event_in.description,
        start_time=event_in.start_time,
        end_time=event_in.end_time,
        is_active=True
    )
    db.add(event)
    await db.commit()
    await db.refresh(event)
    return event

@router.get("", response_model=List[EventOut])
async def list_events(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(Event).where(Event.org_id == current_user.org_id, Event.is_active == True)
    res = await db.execute(stmt)
    return res.scalars().all()
