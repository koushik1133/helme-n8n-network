import uuid
import enum
from datetime import datetime
from sqlalchemy import (
    Column, String, Text, Boolean, Integer, Float, DateTime, Enum, 
    ForeignKey, Table, Index, JSON, ARRAY
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from geoalchemy2 import Geometry
from app.db.session import Base

# Enums
class UserRole(str, enum.Enum):
    SUPER_ADMIN = "SUPER_ADMIN"
    ORG_ADMIN = "ORG_ADMIN"
    OPERATIONS_HEAD = "OPERATIONS_HEAD"
    MANAGER = "MANAGER"
    SUPERVISOR = "SUPERVISOR"
    TEAM_LEAD = "TEAM_LEAD"
    WORKER = "WORKER"
    CLIENT = "CLIENT"
    VIEWER = "VIEWER"

class WorkerStatus(str, enum.Enum):
    AVAILABLE = "AVAILABLE"
    BUSY = "BUSY"
    IN_TRANSIT = "IN_TRANSIT"
    ON_SITE = "ON_SITE"
    OFFLINE = "OFFLINE"
    SHIFT_ENDED = "SHIFT_ENDED"

class TaskPriority(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    URGENT = "URGENT"
    EMERGENCY = "EMERGENCY"

class TaskStatus(str, enum.Enum):
    CREATED = "CREATED"
    ANALYZED_BY_AI = "ANALYZED_BY_AI"
    DISPATCHED = "DISPATCHED"
    ACCEPTED = "ACCEPTED"
    IN_TRANSIT = "IN_TRANSIT"
    ON_SITE = "ON_SITE"
    PAUSED = "PAUSED"
    COMPLETED = "COMPLETED"
    VERIFIED = "VERIFIED"
    REJECTED = "REJECTED"
    TIMEOUT = "TIMEOUT"
    CANCELLED = "CANCELLED"

class TaskCategory(str, enum.Enum):
    LIGHTING = "LIGHTING"
    AUDIO = "AUDIO"
    ELECTRICAL = "ELECTRICAL"
    MEDICAL = "MEDICAL"
    SECURITY = "SECURITY"
    PARKING = "PARKING"
    TRAFFIC = "TRAFFIC"
    GENERATOR = "GENERATOR"
    CLEANING = "CLEANING"
    VIP = "VIP"
    FIRE = "FIRE"
    FOOD = "FOOD"
    WATER = "WATER"
    CAMERA = "CAMERA"
    DECORATION = "DECORATION"
    CUSTOM = "CUSTOM"

# Models

class Organization(Base):
    __tablename__ = "organizations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)
    
    users = relationship("User", back_populates="organization")
    events = relationship("Event", back_populates="organization")

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone_number = Column(String(50), unique=True, nullable=True, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.WORKER)
    is_active = Column(Boolean, default=True)
    device_token = Column(String(255), nullable=True)  # FCM/Push token
    version = Column(Integer, default=1, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)

    organization = relationship("Organization", back_populates="users")
    worker_profile = relationship("WorkerProfile", back_populates="user", uselist=False)

class Venue(Base):
    __tablename__ = "venues"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    name = Column(String(255), nullable=False)
    address = Column(Text, nullable=True)
    boundary_polygon = Column(Geometry("POLYGON", srid=4326), nullable=True)
    layout_map_url = Column(String(512), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    zones = relationship("VenueZone", back_populates="venue")
    events = relationship("Event", back_populates="venue")

class VenueZone(Base):
    __tablename__ = "venue_zones"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    venue_id = Column(UUID(as_uuid=True), ForeignKey("venues.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    code = Column(String(50), nullable=False)
    zone_type = Column(String(50), nullable=False, default="GENERAL") # VIP, STAGE, MEDICAL, ENTRY_GATE
    boundary = Column(Geometry("POLYGON", srid=4326), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    venue = relationship("Venue", back_populates="zones")

class Event(Base):
    __tablename__ = "events"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    venue_id = Column(UUID(as_uuid=True), ForeignKey("venues.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    organization = relationship("Organization", back_populates="events")
    venue = relationship("Venue", back_populates="events")
    tasks = relationship("Task", back_populates="event")

class WorkerProfile(Base):
    __tablename__ = "worker_profiles"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    skills = Column(JSONB, default=list, nullable=False)  # ["ELECTRICIAN", "AUDIO_ENG", "FIRST_AID"]
    certifications = Column(JSONB, default=list, nullable=False)
    languages = Column(JSONB, default=list, nullable=False)
    status = Column(Enum(WorkerStatus), default=WorkerStatus.OFFLINE, nullable=False, index=True)
    battery_level = Column(Integer, default=100) # 0-100
    network_quality = Column(String(20), default="4G") # 5G, 4G, 3G, WIFI
    assigned_zone_id = Column(UUID(as_uuid=True), ForeignKey("venue_zones.id"), nullable=True)
    active_tasks_count = Column(Integer, default=0, nullable=False)
    emergency_contact = Column(String(100), nullable=True)
    equipment_assigned = Column(JSONB, default=list, nullable=False)
    version = Column(Integer, default=1, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="worker_profile")
    current_location = relationship("WorkerLocation", back_populates="worker", uselist=False)

class WorkerLocation(Base):
    __tablename__ = "worker_locations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    worker_id = Column(UUID(as_uuid=True), ForeignKey("worker_profiles.id", ondelete="CASCADE"), unique=True, nullable=False)
    location = Column(Geometry("POINT", srid=4326), nullable=False)
    accuracy_meters = Column(Float, default=0.0)
    speed = Column(Float, default=0.0) # m/s
    heading = Column(Float, default=0.0)
    is_spoofed = Column(Boolean, default=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, index=True)

    worker = relationship("WorkerProfile", back_populates="current_location")

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id"), nullable=False, index=True)
    zone_id = Column(UUID(as_uuid=True), ForeignKey("venue_zones.id"), nullable=True)
    created_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    assigned_worker_id = Column(UUID(as_uuid=True), ForeignKey("worker_profiles.id"), nullable=True, index=True)
    
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(Enum(TaskCategory), nullable=False, default=TaskCategory.CUSTOM, index=True)
    priority = Column(Enum(TaskPriority), nullable=False, default=TaskPriority.MEDIUM, index=True)
    status = Column(Enum(TaskStatus), nullable=False, default=TaskStatus.CREATED, index=True)
    
    location = Column(Geometry("POINT", srid=4326), nullable=False)
    location_text = Column(String(255), nullable=True)
    
    required_skills = Column(JSONB, default=list, nullable=False)
    required_equipment = Column(JSONB, default=list, nullable=False)
    
    before_photo_url = Column(String(512), nullable=True)
    after_photo_url = Column(String(512), nullable=True)
    
    ai_extracted = Column(Boolean, default=False)
    ai_confidence = Column(Float, default=1.0)
    dispatch_score = Column(Float, nullable=True)
    
    accepted_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    version = Column(Integer, default=1, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)

    event = relationship("Event", back_populates="tasks")
    assignments = relationship("TaskAssignment", back_populates="task")

class TaskAssignment(Base):
    __tablename__ = "task_assignments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    task_id = Column(UUID(as_uuid=True), ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False)
    worker_id = Column(UUID(as_uuid=True), ForeignKey("worker_profiles.id"), nullable=False)
    action = Column(String(50), nullable=False) # DISPATCHED, ACCEPTED, REJECTED, TIMEOUT
    score = Column(Float, nullable=False)
    reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    task = relationship("Task", back_populates="assignments")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=True)
    user_id = Column(UUID(as_uuid=True), nullable=True)
    action = Column(String(100), nullable=False) # e.g. TASK_DISPATCHED, WORKER_LOCATION_UPDATED
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(UUID(as_uuid=True), nullable=False)
    payload = Column(JSONB, nullable=True)
    ip_address = Column(String(45), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

class IncidentReport(Base):
    __tablename__ = "incident_reports"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id"), nullable=False)
    reporter_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    severity = Column(Enum(TaskPriority), default=TaskPriority.HIGH, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    media_url = Column(String(512), nullable=True)
    location = Column(Geometry("POINT", srid=4326), nullable=False)
    ai_summary = Column(Text, nullable=True)
    resolved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# PostGIS Indices for High-Speed Spatial Querying
Index("idx_worker_locations_geom", WorkerLocation.location, postgresql_using="gist")
Index("idx_tasks_geom", Task.location, postgresql_using="gist")
Index("idx_venues_boundary", Venue.boundary_polygon, postgresql_using="gist")
Index("idx_venue_zones_boundary", VenueZone.boundary, postgresql_using="gist")
