from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, Date, Enum as SQLEnum, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from app.core.database import Base
from app.models.base import BaseModel


class DriverStatus(str, enum.Enum):
    """Driver status enum."""
    AVAILABLE = "Available"
    ON_TRIP = "On Trip"
    OFF_DUTY = "Off Duty"
    SUSPENDED = "Suspended"


class Driver(Base, BaseModel):
    """Driver model for personnel management."""
    __tablename__ = "drivers"
    
    name = Column(String(100), nullable=False)
    license_number = Column(String(50), nullable=False, unique=True, index=True)
    license_expiry = Column(Date, nullable=False, index=True)
    phone = Column(String(20), nullable=False)
    email = Column(String(255), nullable=True)
    hire_date = Column(Date, nullable=False)
    status = Column(SQLEnum(DriverStatus), nullable=False, default=DriverStatus.AVAILABLE, index=True)
    safety_score = Column(Integer, nullable=False, default=100)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    is_active = Column(Boolean, nullable=False, default=True, index=True)
    
    # Relationships
    creator = relationship("User", back_populates="drivers", foreign_keys=[created_by])
    documents = relationship("DriverDocument", back_populates="driver", cascade="all, delete-orphan")
    trips = relationship("Trip", back_populates="driver")
    
    __table_args__ = (
        CheckConstraint("license_expiry > hire_date", name="check_license_expiry_after_hire"),
        CheckConstraint("safety_score >= 0 AND safety_score <= 100", name="check_safety_score_range"),
    )


class DriverDocument(Base, BaseModel):
    """Driver document model for compliance tracking."""
    __tablename__ = "driver_documents"
    
    driver_id = Column(UUID(as_uuid=True), ForeignKey("drivers.id", ondelete="CASCADE"), nullable=False, index=True)
    document_type = Column(String(50), nullable=False, index=True)
    document_number = Column(String(100), nullable=False)
    expiry_date = Column(Date, nullable=False, index=True)
    file_url = Column(String(500), nullable=True)
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    # Relationships
    driver = relationship("Driver", back_populates="documents")
    uploader = relationship("User")
    
    __table_args__ = (
        CheckConstraint(
            "document_type IN ('license', 'medical_certificate')",
            name="check_driver_document_type"
        ),
        CheckConstraint("expiry_date > created_at::date", name="check_expiry_after_creation"),
    )
