from sqlalchemy import Column, String, Numeric, ForeignKey, Text, DateTime, Enum as SQLEnum, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from app.core.database import Base
from app.models.base import BaseModel


class TripStatus(str, enum.Enum):
    """Trip status enum."""
    DRAFT = "Draft"
    DISPATCHED = "Dispatched"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"


class Trip(Base, BaseModel):
    """Trip model for operations management."""
    __tablename__ = "trips"
    
    origin = Column(String(200), nullable=False)
    destination = Column(String(200), nullable=False)
    distance_km = Column(Numeric(10, 2), nullable=False)
    cargo_weight_kg = Column(Numeric(10, 2), nullable=False)
    cargo_description = Column(Text, nullable=True)
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id", ondelete="RESTRICT"), nullable=True, index=True)
    driver_id = Column(UUID(as_uuid=True), ForeignKey("drivers.id", ondelete="RESTRICT"), nullable=True, index=True)
    status = Column(SQLEnum(TripStatus), nullable=False, default=TripStatus.DRAFT, index=True)
    revenue = Column(Numeric(12, 2), nullable=True)
    dispatched_at = Column(DateTime, nullable=True, index=True)
    completed_at = Column(DateTime, nullable=True, index=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    
    # Relationships
    vehicle = relationship("Vehicle", back_populates="trips")
    driver = relationship("Driver", back_populates="trips")
    creator = relationship("User", back_populates="trips", foreign_keys=[created_by])
    
    __table_args__ = (
        CheckConstraint("distance_km > 0", name="check_distance_positive"),
        CheckConstraint("cargo_weight_kg > 0", name="check_cargo_weight_positive"),
        CheckConstraint("revenue IS NULL OR revenue >= 0", name="check_revenue_positive"),
        CheckConstraint(
            "completed_at IS NULL OR dispatched_at IS NULL OR completed_at > dispatched_at",
            name="check_completed_after_dispatched"
        ),
        CheckConstraint(
            "dispatched_at IS NULL OR dispatched_at > created_at",
            name="check_dispatched_after_created"
        ),
    )
