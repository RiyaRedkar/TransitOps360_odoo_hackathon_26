from sqlalchemy import Column, String, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.core.database import Base


class Event(Base):
    """Event model for audit trail."""
    __tablename__ = "events"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=lambda: __import__('uuid').uuid4(), index=True)
    event_type = Column(String(50), nullable=False, index=True)
    entity_type = Column(String(50), nullable=False, index=True)
    entity_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    performed_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    metadata_json = Column(JSONB, nullable=False, default=dict)
    created_at = Column(DateTime, nullable=False, default=lambda: __import__('datetime').datetime.utcnow(), index=True)
    
    # Relationships
    performer = relationship("User", back_populates="events", foreign_keys=[performed_by])


class Notification(Base):
    """Notification model for user alerts."""
    __tablename__ = "notifications"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=lambda: __import__('uuid').uuid4(), index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    message = Column(Text, nullable=False)
    type = Column(String(50), nullable=False, index=True)
    is_read = Column(Boolean, nullable=False, default=False, index=True)
    metadata_json = Column(JSONB, nullable=False, default=dict)
    created_at = Column(DateTime, nullable=False, default=lambda: __import__('datetime').datetime.utcnow(), index=True)
    
    # Relationships
    user = relationship("User")
