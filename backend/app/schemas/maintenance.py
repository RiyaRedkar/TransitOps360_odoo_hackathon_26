from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, date
from decimal import Decimal
from typing import Optional, List
import uuid
from app.models.maintenance import MaintenanceStatus


class MaintenanceLogBase(BaseModel):
    """Base maintenance log schema."""
    vehicle_id: uuid.UUID
    maintenance_type: str = Field(..., pattern="^(Scheduled|Breakdown|Inspection)$")
    description: Optional[str] = None
    scheduled_date: date
    cost: Optional[Decimal] = Field(None, ge=0)


class MaintenanceLogCreate(MaintenanceLogBase):
    """Maintenance log creation schema."""
    pass


class MaintenanceLogUpdate(BaseModel):
    """Maintenance log update schema."""
    description: Optional[str] = None
    cost: Optional[Decimal] = Field(None, ge=0)


class MaintenanceLogComplete(BaseModel):
    """Maintenance log completion schema."""
    cost: Optional[Decimal] = Field(None, ge=0)


class MaintenanceLogResponse(MaintenanceLogBase):
    """Maintenance log response schema."""
    id: uuid.UUID
    status: MaintenanceStatus
    completed_at: Optional[datetime]
    created_by: Optional[uuid.UUID]
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class MaintenanceLogListResponse(BaseModel):
    """Maintenance log list response schema."""
    items: List[MaintenanceLogResponse]
    total: int


class FuelLogBase(BaseModel):
    """Base fuel log schema."""
    vehicle_id: uuid.UUID
    quantity_liters: Decimal = Field(..., gt=0)
    cost: Decimal = Field(..., gt=0)
    odometer_reading: Decimal = Field(..., gt=0)


class FuelLogCreate(FuelLogBase):
    """Fuel log creation schema."""
    pass


class FuelLogResponse(FuelLogBase):
    """Fuel log response schema."""
    id: uuid.UUID
    cost_per_unit: Decimal
    created_by: Optional[uuid.UUID]
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class FuelLogListResponse(BaseModel):
    """Fuel log list response schema."""
    items: List[FuelLogResponse]
    total: int


class ExpenseBase(BaseModel):
    """Base expense schema."""
    vehicle_id: uuid.UUID
    expense_type: str = Field(..., pattern="^(tolls|repairs|other)$")
    amount: Decimal = Field(..., gt=0)
    description: Optional[str] = None


class ExpenseCreate(ExpenseBase):
    """Expense creation schema."""
    pass


class ExpenseResponse(ExpenseBase):
    """Expense response schema."""
    id: uuid.UUID
    created_by: Optional[uuid.UUID]
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class ExpenseListResponse(BaseModel):
    """Expense list response schema."""
    items: List[ExpenseResponse]
    total: int
