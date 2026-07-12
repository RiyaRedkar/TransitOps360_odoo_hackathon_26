from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from decimal import Decimal
from typing import Optional, List
import uuid
from app.models.trip import TripStatus


class TripBase(BaseModel):
    """Base trip schema."""
    origin: str = Field(..., min_length=1, max_length=200)
    destination: str = Field(..., min_length=1, max_length=200)
    distance_km: Decimal = Field(..., gt=0)
    cargo_weight_kg: Decimal = Field(..., gt=0)
    cargo_description: Optional[str] = None
    revenue: Optional[Decimal] = Field(None, ge=0)


class TripCreate(TripBase):
    """Trip creation schema."""
    pass


class TripDispatch(BaseModel):
    """Trip dispatch schema."""
    vehicle_id: uuid.UUID
    driver_id: uuid.UUID


class TripUpdate(BaseModel):
    """Trip update schema."""
    origin: Optional[str] = Field(None, min_length=1, max_length=200)
    destination: Optional[str] = Field(None, min_length=1, max_length=200)
    distance_km: Optional[Decimal] = Field(None, gt=0)
    cargo_weight_kg: Optional[Decimal] = Field(None, gt=0)
    cargo_description: Optional[str] = None
    revenue: Optional[Decimal] = Field(None, ge=0)


class TripResponse(TripBase):
    """Trip response schema."""
    id: uuid.UUID
    vehicle_id: Optional[uuid.UUID]
    driver_id: Optional[uuid.UUID]
    status: TripStatus
    dispatched_at: Optional[datetime]
    completed_at: Optional[datetime]
    created_by: Optional[uuid.UUID]
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class TripListResponse(BaseModel):
    """Trip list response schema."""
    items: List[TripResponse]
    total: int
