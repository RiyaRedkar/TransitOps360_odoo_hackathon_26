from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.api.deps import get_db, get_current_active_user
from app.models.user import User
from app.models.driver import DriverStatus
from app.schemas.driver import DriverResponse, DriverCreate, DriverUpdate
from app.services.driver_service import DriverService
import uuid

router = APIRouter()


@router.get("", response_model=List[DriverResponse])
async def list_drivers(
    status: Optional[DriverStatus] = Query(None, description="Filter by driver status"),
    search: Optional[str] = Query(None, description="Search in name, license, phone"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """List all drivers with optional filtering."""
    drivers = DriverService.get_all(db, status=status, search=search, skip=skip, limit=limit)
    return drivers


@router.get("/available", response_model=List[DriverResponse])
async def list_available_drivers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all available drivers for dispatch."""
    drivers = DriverService.get_available(db)
    return drivers


@router.get("/{driver_id}", response_model=DriverResponse)
async def get_driver(
    driver_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get driver by ID."""
    driver = DriverService.get_by_id(db, driver_id)
    if not driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Driver with ID {driver_id} not found"
        )
    return driver


@router.post("", response_model=DriverResponse, status_code=status.HTTP_201_CREATED)
async def create_driver(
    driver_data: DriverCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new driver."""
    try:
        driver = DriverService.create(db, driver_data)
        return driver
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.put("/{driver_id}", response_model=DriverResponse)
async def update_driver(
    driver_id: uuid.UUID,
    driver_data: DriverUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update driver information."""
    driver = DriverService.update(db, driver_id, driver_data)
    if not driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Driver with ID {driver_id} not found"
        )
    return driver


@router.patch("/{driver_id}/status")
async def update_driver_status(
    driver_id: uuid.UUID,
    status: DriverStatus,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update driver status."""
    driver = DriverService.update_status(db, driver_id, status)
    if not driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Driver with ID {driver_id} not found"
        )
    return driver


@router.delete("/{driver_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_driver(
    driver_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Soft delete a driver."""
    success = DriverService.delete(db, driver_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Driver with ID {driver_id} not found"
        )
    return None
