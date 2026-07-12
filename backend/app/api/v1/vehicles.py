from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.api.deps import get_db, get_current_active_user
from app.models.user import User
from app.models.vehicle import VehicleStatus
from app.schemas.vehicle import (
    VehicleResponse,
    VehicleCreate,
    VehicleUpdate,
    VehicleStatusUpdate
)
from app.services.vehicle_service import VehicleService
import uuid

router = APIRouter()


@router.get("", response_model=List[VehicleResponse])
async def list_vehicles(
    status: Optional[VehicleStatus] = Query(None, description="Filter by vehicle status"),
    search: Optional[str] = Query(None, description="Search in plate, make, model, VIN"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """List all vehicles with optional filtering."""
    vehicles = VehicleService.get_all(db, status=status, search=search, skip=skip, limit=limit)
    return vehicles


@router.get("/available", response_model=List[VehicleResponse])
async def list_available_vehicles(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all available vehicles for dispatch."""
    vehicles = VehicleService.get_available(db)
    return vehicles


@router.get("/{vehicle_id}", response_model=VehicleResponse)
async def get_vehicle(
    vehicle_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get vehicle by ID."""
    vehicle = VehicleService.get_by_id(db, vehicle_id)
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vehicle with ID {vehicle_id} not found"
        )
    return vehicle


@router.post("", response_model=VehicleResponse, status_code=status.HTTP_201_CREATED)
async def create_vehicle(
    vehicle_data: VehicleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new vehicle."""
    try:
        vehicle = VehicleService.create(db, vehicle_data)
        return vehicle
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.put("/{vehicle_id}", response_model=VehicleResponse)
async def update_vehicle(
    vehicle_id: uuid.UUID,
    vehicle_data: VehicleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update vehicle information."""
    vehicle = VehicleService.update(db, vehicle_id, vehicle_data)
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vehicle with ID {vehicle_id} not found"
        )
    return vehicle


@router.patch("/{vehicle_id}/status", response_model=VehicleResponse)
async def update_vehicle_status(
    vehicle_id: uuid.UUID,
    status_data: VehicleStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update vehicle status with validation."""
    try:
        vehicle = VehicleService.update_status(db, vehicle_id, status_data)
        if not vehicle:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Vehicle with ID {vehicle_id} not found"
            )
        return vehicle
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.delete("/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_vehicle(
    vehicle_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Soft delete a vehicle."""
    success = VehicleService.delete(db, vehicle_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vehicle with ID {vehicle_id} not found"
        )
    return None
