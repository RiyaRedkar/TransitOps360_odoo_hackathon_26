from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.api.deps import get_db, get_current_active_user
from app.models.user import User
from app.models.maintenance import MaintenanceStatus
from app.schemas.maintenance import (
    MaintenanceLogResponse,
    MaintenanceLogCreate,
    MaintenanceLogUpdate,
    FuelLogResponse,
    FuelLogCreate,
    ExpenseResponse,
    ExpenseCreate
)
from app.services.maintenance_service import MaintenanceService
import uuid

router = APIRouter()


# ============= Maintenance Logs =============

@router.get("", response_model=List[MaintenanceLogResponse])
async def list_maintenance(
    vehicle_id: Optional[uuid.UUID] = Query(None, description="Filter by vehicle ID"),
    status: Optional[MaintenanceStatus] = Query(None, description="Filter by status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """List all maintenance logs with optional filtering."""
    logs = MaintenanceService.get_all_maintenance(
        db,
        vehicle_id=vehicle_id,
        status=status,
        skip=skip,
        limit=limit
    )
    return logs


@router.get("/{maintenance_id}", response_model=MaintenanceLogResponse)
async def get_maintenance(
    maintenance_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get maintenance log by ID."""
    maintenance = MaintenanceService.get_maintenance_by_id(db, maintenance_id)
    if not maintenance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Maintenance log with ID {maintenance_id} not found"
        )
    return maintenance


@router.post("", response_model=MaintenanceLogResponse, status_code=status.HTTP_201_CREATED)
async def create_maintenance(
    maintenance_data: MaintenanceLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create maintenance log (sets vehicle to maintenance if scheduled for today/past)."""
    try:
        maintenance = MaintenanceService.create_maintenance(
            db,
            maintenance_data,
            current_user.id
        )
        return maintenance
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.patch("/{maintenance_id}/complete", response_model=MaintenanceLogResponse)
async def complete_maintenance(
    maintenance_id: uuid.UUID,
    cost: Optional[float] = Query(None, description="Final maintenance cost"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Complete maintenance (closes maintenance, releases vehicle to available)."""
    try:
        maintenance = MaintenanceService.complete_maintenance(db, maintenance_id, cost)
        return maintenance
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.put("/{maintenance_id}", response_model=MaintenanceLogResponse)
async def update_maintenance(
    maintenance_id: uuid.UUID,
    maintenance_data: MaintenanceLogUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update maintenance log information."""
    maintenance = MaintenanceService.update_maintenance(db, maintenance_id, maintenance_data)
    if not maintenance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Maintenance log with ID {maintenance_id} not found"
        )
    return maintenance


# ============= Fuel Logs =============

@router.get("/fuel", response_model=List[FuelLogResponse])
async def list_fuel_logs(
    vehicle_id: Optional[uuid.UUID] = Query(None, description="Filter by vehicle ID"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """List all fuel logs with optional filtering."""
    logs = MaintenanceService.get_all_fuel_logs(db, vehicle_id=vehicle_id, skip=skip, limit=limit)
    return logs


@router.post("/fuel", response_model=FuelLogResponse, status_code=status.HTTP_201_CREATED)
async def create_fuel_log(
    fuel_data: FuelLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create fuel log (updates vehicle mileage)."""
    try:
        fuel_log = MaintenanceService.create_fuel_log(db, fuel_data, current_user.id)
        return fuel_log
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


# ============= Expenses =============

@router.get("/expenses", response_model=List[ExpenseResponse])
async def list_expenses(
    vehicle_id: Optional[uuid.UUID] = Query(None, description="Filter by vehicle ID"),
    expense_type: Optional[str] = Query(None, description="Filter by expense type"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """List all expenses with optional filtering."""
    expenses = MaintenanceService.get_all_expenses(
        db,
        vehicle_id=vehicle_id,
        expense_type=expense_type,
        skip=skip,
        limit=limit
    )
    return expenses


@router.post("/expenses", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
async def create_expense(
    expense_data: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create expense record."""
    try:
        expense = MaintenanceService.create_expense(db, expense_data, current_user.id)
        return expense
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
