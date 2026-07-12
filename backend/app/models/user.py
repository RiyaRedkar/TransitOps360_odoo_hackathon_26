from sqlalchemy import Column, String, Boolean, ForeignKey, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import BaseModel


class Role(Base, BaseModel):
    """Role model for RBAC."""
    __tablename__ = "roles"
    
    name = Column(String(50), nullable=False, unique=True, index=True)
    permissions = Column(JSONB, nullable=False, default=list)
    
    # Relationships
    users = relationship("User", back_populates="role")
    
    __table_args__ = (
        CheckConstraint(
            "name IN ('Fleet_Manager', 'Dispatcher', 'Safety_Officer', 'Financial_Analyst')",
            name="check_role_name"
        ),
    )


class User(Base, BaseModel):
    """User model for authentication and authorization."""
    __tablename__ = "users"
    
    username = Column(String(50), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    role_id = Column(UUID(as_uuid=True), ForeignKey("roles.id", ondelete="RESTRICT"), nullable=False, index=True)
    is_active = Column(Boolean, nullable=False, default=True, index=True)
    
    # Relationships
    role = relationship("Role", back_populates="users")
    vehicles = relationship("Vehicle", back_populates="creator", foreign_keys="Vehicle.created_by")
    drivers = relationship("Driver", back_populates="creator", foreign_keys="Driver.created_by")
    trips = relationship("Trip", back_populates="creator", foreign_keys="Trip.created_by")
    maintenance_logs = relationship("MaintenanceLog", back_populates="creator", foreign_keys="MaintenanceLog.created_by")
    fuel_logs = relationship("FuelLog", back_populates="creator", foreign_keys="FuelLog.created_by")
    expenses = relationship("Expense", back_populates="creator", foreign_keys="Expense.created_by")
    events = relationship("Event", back_populates="performer", foreign_keys="Event.performed_by")
    
    __table_args__ = (
        CheckConstraint("LENGTH(username) >= 3", name="check_username_length"),
        CheckConstraint("email LIKE '%@%'", name="check_email_format"),
        CheckConstraint("LENGTH(password_hash) >= 60", name="check_password_hash_length"),
    )
