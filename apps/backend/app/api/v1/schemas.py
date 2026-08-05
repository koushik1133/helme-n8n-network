from typing import List, Optional, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from app.db.models import UserRole, WorkerStatus, TaskCategory, TaskPriority, TaskStatus

# Token Schemas
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    roles: List[str] = []
    org_id: Optional[str] = None

# User & Auth Schemas
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    org_id: str
    role: UserRole = UserRole.WORKER
    phone_number: Optional[str] = None

class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    role: UserRole
    org_id: str
    is_active: bool

    class Config:
        from_attributes = True

# GPS & Location Schemas
class LocationUpdate(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    accuracy_meters: float = 0.0
    speed: float = 0.0
    heading: float = 0.0
    battery_level: int = Field(100, ge=0, le=100)
    network_quality: str = "4G"
    is_spoofed: bool = False

# Worker Schemas
class WorkerProfileOut(BaseModel):
    id: str
    user_id: str
    status: WorkerStatus
    skills: List[str]
    battery_level: int
    network_quality: str
    active_tasks_count: int
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    class Config:
        from_attributes = True

# Task Schemas
class TaskCreate(BaseModel):
    event_id: str
    title: str
    description: Optional[str] = None
    category: TaskCategory = TaskCategory.CUSTOM
    priority: TaskPriority = TaskPriority.MEDIUM
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    location_text: Optional[str] = None
    zone_id: Optional[str] = None
    required_skills: List[str] = []
    required_equipment: List[str] = []
    auto_dispatch: bool = True

class AITaskCreate(BaseModel):
    event_id: str
    raw_text: Optional[str] = None
    image_url: Optional[str] = None
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    auto_dispatch: bool = True

class TaskStatusUpdate(BaseModel):
    status: TaskStatus
    photo_url: Optional[str] = None
    notes: Optional[str] = None

class TaskOut(BaseModel):
    id: str
    event_id: str
    title: str
    description: Optional[str]
    category: TaskCategory
    priority: TaskPriority
    status: TaskStatus
    latitude: float
    longitude: float
    location_text: Optional[str]
    required_skills: List[str]
    required_equipment: List[str]
    assigned_worker_id: Optional[str]
    before_photo_url: Optional[str]
    after_photo_url: Optional[str]
    dispatch_score: Optional[float]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Analytics & Heatmap Schemas
class HeatmapPoint(BaseModel):
    latitude: float
    longitude: float
    weight: float
    category: str

class AnalyticsOverview(BaseModel):
    total_workers: int
    active_workers: int
    total_tasks: int
    completed_tasks: int
    avg_response_time_seconds: float
    active_emergencies: int
