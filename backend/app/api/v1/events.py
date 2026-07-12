from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from app.api.deps import get_db, get_current_active_user
from app.models.user import User
from app.schemas.event import EventResponse, NotificationResponse
from app.services.event_service import EventService
import uuid

router = APIRouter()


@router.get("/timeline", response_model=List[EventResponse])
async def get_timeline(
    limit: int = Query(50, ge=1, le=200, description="Number of events to return"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get global activity timeline.
    Returns recent events across all entities.
    """
    events = EventService.get_timeline(db, limit=limit)
    return events


@router.get("/entity/{entity_type}/{entity_id}", response_model=List[EventResponse])
async def get_entity_timeline(
    entity_type: str,
    entity_id: uuid.UUID,
    limit: int = Query(50, ge=1, le=200, description="Number of events to return"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get timeline for specific entity (vehicle, driver, trip, etc.).
    Returns events filtered by entity type and ID.
    """
    events = EventService.get_timeline(
        db,
        entity_type=entity_type,
        entity_id=entity_id,
        limit=limit
    )
    return events


@router.get("/notifications", response_model=List[NotificationResponse])
async def get_notifications(
    unread_only: bool = Query(False, description="Return only unread notifications"),
    limit: int = Query(50, ge=1, le=200, description="Number of notifications to return"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get notifications for current user.
    """
    notifications = EventService.get_notifications(
        db,
        user_id=current_user.id,
        unread_only=unread_only,
        limit=limit
    )
    return notifications


@router.patch("/notifications/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_read(
    notification_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Mark notification as read.
    """
    notification = EventService.mark_notification_read(db, notification_id)
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Notification with ID {notification_id} not found"
        )
    
    # Verify notification belongs to current user
    if notification.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only mark your own notifications as read"
        )
    
    return notification
