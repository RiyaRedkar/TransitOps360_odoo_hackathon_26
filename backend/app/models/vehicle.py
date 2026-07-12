from sqlalchemy import Column, String, Integer, Numeric, Boolean, ForeignKey, Date, Text, Enum as SQLEnum, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from app.core.database import Base
from app.models.base import BaseModel


class VehicleStatus(str, enum.Enum):
    """Vehicle status enum."""
    AVAILABLE = "Available"
    ON_TRIP = "On Trip"
    IN_SHOP = "In Shop"
    RETIRED = "Retired"


class Vehicle(Base, BaseModel):
    """Vehicle model for fleet management."""
    __tablename__ = "vehicles"
    
    registration_number = Column(String(20), nullable=False, unique=True, index=True)
    make = Column(String(50), nullable=False)
    model = Column(String(50), nullable=False)
    year = Column(Integer, nullable=False)
    capacity_kg = Column(Numeric(10, 2), nullable=False)
    fuel_type = Column(String(20), nullable=False)
    status = Column(SQLEnum(VehicleStatus), nullable=False, default=VehicleStatus.AVAILABLE, index=True)
    acquisition_cost = Column(Numeric(12, 2), nullable=False)
    fuel_efficiency = Column(Numeric(5, 2), nullable=True)
    health_score = Column(Integer, nullable=False, default=100)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    is_active = Column(Boolean, nullable=False, default=True, index=True)
    
    # Relationships
    creator = relationship("User", back_populates="vehicles", foreign_keys=[created_by])
    documents = relationship("VehicleDocument", back_populates="vehicle", cascade="all, delete-orphan")
    trips = relationship("Trip", back_populates="vehicle")
    maintenance_logs = relationship("MaintenanceLog", back_populates="vehicle", cascade="all, delete-orphan")
    fuel_logs = relationship("FuelLog", back_populates="vehicle", cascade="all, delete-orphan")
    expenses = relationship("Expense", back_populates="vehicle", cascade="all, delete-orphan")
    
    __table_args__ = (
        CheckConstraint("year >= 1900 AND year <= EXTRACT(YEAR FROM NOW()) + 1", name="check_vehicle_year"),
        CheckConstraint("capacity_kg > 0", name="check_capacity_positive"),
        CheckConstraint("acquisition_cost >= 0", name="check_acquisition_cost_positive"),
        CheckConstraint("fuel_efficiency IS NULL OR fuel_efficiency > 0", name="check_fuel_efficiency_positive"),
        CheckConstraint("health_score >= 0 AND health_score <= 100", name="check_health_score_range"),
    )


class VehicleDocument(Base, BaseModel):
    """Vehicle document model for compliance tracking."""
    __tablename__ = "vehicle_documents"
    
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id", ondelete="CASCADE"), nullable=False, index=True)
    document_type = Column(String(50), nullable=False, index=True)
    document_number = Column(String(100), nullable=False)
    expiry_date = Column(Date, nullable=False, index=True)
    file_url = Column(String(500), nullable=True)
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    # Relationships
    vehicle = relationship("Vehicle", back_populates="documents")
    uploader = relationship("User")
    
    __table_args__ = (
        CheckConstraint(
            "document_type IN ('insurance', 'permit', 'fitness_certificate', 'puc')",
            name="check_vehicle_document_type"
        ),
        CheckConstraint("expiry_date > created_at::date", name="check_expiry_after_creation"),
    )
