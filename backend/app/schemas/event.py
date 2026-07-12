from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List, Dict, Any
import uuid


class EventBase(BaseModel):
    """Base event schema."""
    event_type: str
    entity_type: str
    entity_id: uuid.UUID
    metadata: Dict[str, Any] = {}


class EventCreate(EventBase):
    """Event creation schema."""
    performed_by: Optional[uuid.UUID] = None


class EventResponse(BaseModel):
    """Event response schema."""
    id: uuid.UUID
    event_type: str
    entity_type: str
    entity_id: uuid.UUID
    performed_by: Optional[uuid.UUID]
    metadata_json: Dict[str, Any]
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class EventListResponse(BaseModel):
    """Event list response schema."""
    items: List[EventResponse]
    total: int


class NotificationBase(BaseModel):
    """Base notification schema."""
    message: str
    type: str
    metadata: Dict[str, Any] = {}


class NotificationCreate(NotificationBase):
    """Notification creation schema."""
    user_id: uuid.UUID


class NotificationResponse(BaseModel):
    """Notification response schema."""
    id: uuid.UUID
    user_id: uuid.UUID
    message: str
    type: str
    is_read: bool
    metadata_json: Dict[str, Any]
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
