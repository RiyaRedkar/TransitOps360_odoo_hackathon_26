from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.api.deps import get_db, get_current_active_user
from app.models.user import User
from app.models.trip import TripStatus
from app.schemas.trip import TripResponse, TripCreate, TripUpdate, TripDispatch
from app.services.trip_service import TripService
import uuid

router = APIRouter()


@router.get("", response_model=List[TripResponse])
async def list_trips(
    status: Optional[TripStatus] = Query(None, description="Filter by trip status"),
    driver_id: Optional[uuid.UUID] = Query(None, description="Filter by driver ID"),
    vehicle_id: Optional[uuid.UUID] = Query(None, description="Filter by vehicle ID"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """List all trips with optional filtering."""
    trips = TripService.get_all(
        db,
        status=status,
        driver_id=driver_id,
        vehicle_id=vehicle_id,
        skip=skip,
        limit=limit
    )
    return trips


@router.get("/{trip_id}", response_model=TripResponse)
async def get_trip(
    trip_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get trip by ID."""
    trip = TripService.get_by_id(db, trip_id)
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with ID {trip_id} not found"
        )
    return trip


@router.post("", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
async def create_trip(
    trip_data: TripCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new trip."""
    trip = TripService.create(db, trip_data, current_user.id)
    return trip


@router.post("/{trip_id}/dispatch", response_model=TripResponse)
async def dispatch_trip(
    trip_id: uuid.UUID,
    dispatch_data: TripDispatch,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Dispatch trip with vehicle and driver assignment.
    Validates availability and prevents double-booking.
    """
    try:
        trip = TripService.dispatch(db, trip_id, dispatch_data)
        return trip
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/{trip_id}/complete", response_model=TripResponse)
async def complete_trip(
    trip_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Complete trip and release driver/vehicle resources."""
    try:
        trip = TripService.complete_trip(db, trip_id)
        return trip
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/{trip_id}/cancel", response_model=TripResponse)
async def cancel_trip(
    trip_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Cancel trip and release driver/vehicle resources."""
    try:
        trip = TripService.cancel_trip(db, trip_id)
        return trip
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.put("/{trip_id}", response_model=TripResponse)
async def update_trip(
    trip_id: uuid.UUID,
    trip_data: TripUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update trip information."""
    trip = TripService.update(db, trip_id, trip_data)
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with ID {trip_id} not found"
        )
    return trip
