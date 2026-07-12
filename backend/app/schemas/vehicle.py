from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, date
from decimal import Decimal
from typing import Optional, List
import uuid
from app.models.vehicle import VehicleStatus


class VehicleBase(BaseModel):
    """Base vehicle schema."""
    registration_number: str = Field(..., min_length=1, max_length=20)
    make: str = Field(..., min_length=1, max_length=50)
    model: str = Field(..., min_length=1, max_length=50)
    year: int = Field(..., ge=1900)
    capacity_kg: Decimal = Field(..., gt=0)
    fuel_type: str = Field(..., max_length=20)
    acquisition_cost: Decimal = Field(..., ge=0)
    fuel_efficiency: Optional[Decimal] = Field(None, gt=0)


class VehicleCreate(VehicleBase):
    """Vehicle creation schema."""
    pass


class VehicleUpdate(BaseModel):
    """Vehicle update schema."""
    make: Optional[str] = Field(None, min_length=1, max_length=50)
    model: Optional[str] = Field(None, min_length=1, max_length=50)
    capacity_kg: Optional[Decimal] = Field(None, gt=0)
    fuel_efficiency: Optional[Decimal] = Field(None, gt=0)


class VehicleStatusUpdate(BaseModel):
    """Vehicle status update schema."""
    status: VehicleStatus


class VehicleResponse(VehicleBase):
    """Vehicle response schema."""
    id: uuid.UUID
    status: VehicleStatus
    health_score: int
    is_active: bool
    created_by: Optional[uuid.UUID]
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class VehicleDocumentBase(BaseModel):
    """Base vehicle document schema."""
    document_type: str = Field(..., pattern="^(insurance|permit|fitness_certificate|puc)$")
    document_number: str = Field(..., min_length=1, max_length=100)
    expiry_date: date
    file_url: Optional[str] = Field(None, max_length=500)


class VehicleDocumentCreate(VehicleDocumentBase):
    """Vehicle document creation schema."""
    vehicle_id: uuid.UUID


class VehicleDocumentResponse(VehicleDocumentBase):
    """Vehicle document response schema."""
    id: uuid.UUID
    vehicle_id: uuid.UUID
    uploaded_by: Optional[uuid.UUID]
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class VehicleListResponse(BaseModel):
    """Vehicle list response schema."""
    items: List[VehicleResponse]
    total: int
