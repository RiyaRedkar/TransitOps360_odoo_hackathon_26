from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime, date
from typing import Optional, List
import uuid
from app.models.driver import DriverStatus


class DriverBase(BaseModel):
    """Base driver schema."""
    name: str = Field(..., min_length=1, max_length=100)
    license_number: str = Field(..., min_length=1, max_length=50)
    license_expiry: date
    phone: str = Field(..., max_length=20)
    email: Optional[EmailStr] = None
    hire_date: date


class DriverCreate(DriverBase):
    """Driver creation schema."""
    pass


class DriverUpdate(BaseModel):
    """Driver update schema."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    email: Optional[EmailStr] = None
    status: Optional[DriverStatus] = None


class DriverResponse(DriverBase):
    """Driver response schema."""
    id: uuid.UUID
    status: DriverStatus
    safety_score: int
    is_active: bool
    created_by: Optional[uuid.UUID]
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class DriverDocumentBase(BaseModel):
    """Base driver document schema."""
    document_type: str = Field(..., pattern="^(license|medical_certificate)$")
    document_number: str = Field(..., min_length=1, max_length=100)
    expiry_date: date
    file_url: Optional[str] = Field(None, max_length=500)


class DriverDocumentCreate(DriverDocumentBase):
    """Driver document creation schema."""
    driver_id: uuid.UUID


class DriverDocumentResponse(DriverDocumentBase):
    """Driver document response schema."""
    id: uuid.UUID
    driver_id: uuid.UUID
    uploaded_by: Optional[uuid.UUID]
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class DriverListResponse(BaseModel):
    """Driver list response schema."""
    items: List[DriverResponse]
    total: int
