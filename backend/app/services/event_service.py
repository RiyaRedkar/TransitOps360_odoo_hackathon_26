from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.event import Event, Notification
from datetime import datetime
import uuid


class EventService:
    """Service for event tracking and notifications."""
    
    @staticmethod
    def create_event(
        db: Session,
        event_type: str,
        entity_type: str,
        entity_id: uuid.UUID,
        performed_by: Optional[uuid.UUID] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Event:
        """Create a new event for audit trail."""
        event = Event(
            id=uuid.uuid4(),
            event_type=event_type,
            entity_type=entity_type,
            entity_id=entity_id,
            performed_by=performed_by,
            metadata_json=metadata or {}
        )
        
        db.add(event)
        db.commit()
        db.refresh(event)
        
        return event
    
    @staticmethod
    def get_timeline(
        db: Session,
        entity_type: Optional[str] = None,
        entity_id: Optional[uuid.UUID] = None,
        limit: int = 50
    ) -> List[Event]:
        """
        Get activity timeline.
        If entity_type and entity_id provided, returns events for that entity.
        Otherwise returns global timeline.
        """
        query = db.query(Event)
        
        if entity_type and entity_id:
            query = query.filter(
                Event.entity_type == entity_type,
                Event.entity_id == entity_id
            )
        
        return query.order_by(Event.created_at.desc()).limit(limit).all()
    
    @staticmethod
    def get_notifications(
        db: Session,
        user_id: uuid.UUID,
        unread_only: bool = False,
        limit: int = 50
    ) -> List[Notification]:
        """Get notifications for a user."""
        query = db.query(Notification).filter(Notification.user_id == user_id)
        
        if unread_only:
            query = query.filter(Notification.is_read == False)
        
        return query.order_by(Notification.created_at.desc()).limit(limit).all()
    
    @staticmethod
    def mark_notification_read(
        db: Session,
        notification_id: uuid.UUID
    ) -> Optional[Notification]:
        """Mark notification as read."""
        notification = db.query(Notification).filter(
            Notification.id == notification_id
        ).first()
        
        if notification:
            notification.is_read = True
            db.commit()
            db.refresh(notification)
        
        return notification
    
    @staticmethod
    def create_notification(
        db: Session,
        user_id: uuid.UUID,
        message: str,
        notification_type: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Notification:
        """Create a notification for a user."""
        notification = Notification(
            id=uuid.uuid4(),
            user_id=user_id,
            message=message,
            type=notification_type,
            is_read=False,
            metadata_json=metadata or {}
        )
        
        db.add(notification)
        db.commit()
        db.refresh(notification)
        
        return notification
