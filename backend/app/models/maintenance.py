from sqlalchemy import Column, String, Numeric, ForeignKey, Text, Date, DateTime, Enum as SQLEnum, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from app.core.database import Base
from app.models.base import BaseModel


class MaintenanceStatus(str, enum.Enum):
    """Maintenance status enum."""
    ACTIVE = "Active"
    COMPLETED = "Completed"


class MaintenanceLog(Base, BaseModel):
    """Maintenance log model for vehicle maintenance tracking."""
    __tablename__ = "maintenance_logs"
    
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id", ondelete="CASCADE"), nullable=False, index=True)
    maintenance_type = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    scheduled_date = Column(Date, nullable=False, index=True)
    status = Column(SQLEnum(MaintenanceStatus), nullable=False, default=MaintenanceStatus.ACTIVE, index=True)
    cost = Column(Numeric(10, 2), nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    
    # Relationships
    vehicle = relationship("Vehicle", back_populates="maintenance_logs")
    creator = relationship("User", back_populates="maintenance_logs", foreign_keys=[created_by])
    
    __table_args__ = (
        CheckConstraint(
            "maintenance_type IN ('Scheduled', 'Breakdown', 'Inspection')",
            name="check_maintenance_type"
        ),
        CheckConstraint("cost IS NULL OR cost >= 0", name="check_cost_positive"),
        CheckConstraint(
            "completed_at IS NULL OR completed_at > created_at",
            name="check_completed_after_created"
        ),
    )


class FuelLog(Base):
    """Fuel log model for fuel consumption tracking."""
    __tablename__ = "fuel_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=lambda: __import__('uuid').uuid4(), index=True)
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id", ondelete="CASCADE"), nullable=False, index=True)
    quantity_liters = Column(Numeric(8, 2), nullable=False)
    cost = Column(Numeric(10, 2), nullable=False)
    odometer_reading = Column(Numeric(10, 2), nullable=False)
    cost_per_unit = Column(Numeric(6, 2), nullable=False)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, nullable=False, default=lambda: __import__('datetime').datetime.utcnow())
    
    # Relationships
    vehicle = relationship("Vehicle", back_populates="fuel_logs")
    creator = relationship("User", back_populates="fuel_logs", foreign_keys=[created_by])
    
    __table_args__ = (
        CheckConstraint("quantity_liters > 0", name="check_quantity_positive"),
        CheckConstraint("cost > 0", name="check_cost_positive"),
        CheckConstraint("odometer_reading > 0", name="check_odometer_positive"),
        CheckConstraint("cost_per_unit > 0", name="check_cost_per_unit_positive"),
    )


class Expense(Base):
    """Expense model for operational expense tracking."""
    __tablename__ = "expenses"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=lambda: __import__('uuid').uuid4(), index=True)
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id", ondelete="CASCADE"), nullable=False, index=True)
    expense_type = Column(String(50), nullable=False, index=True)
    amount = Column(Numeric(10, 2), nullable=False)
    description = Column(Text, nullable=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, nullable=False, default=lambda: __import__('datetime').datetime.utcnow())
    
    # Relationships
    vehicle = relationship("Vehicle", back_populates="expenses")
    creator = relationship("User", back_populates="expenses", foreign_keys=[created_by])
    
    __table_args__ = (
        CheckConstraint(
            "expense_type IN ('tolls', 'repairs', 'other')",
            name="check_expense_type"
        ),
        CheckConstraint("amount > 0", name="check_amount_positive"),
    )
