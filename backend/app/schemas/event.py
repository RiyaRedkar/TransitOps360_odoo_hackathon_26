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


class EventResponse(EventBase):
    """Event response schema."""
    id: uuid.UUID
    performed_by: Optional[uuid.UUID]
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


class NotificationResponse(NotificationBase):
    """Notification response schema."""
    id: uuid.UUID
    user_id: uuid.UUID
    is_read: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
