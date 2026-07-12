# Database models module
# Import all models here for Alembic auto-generation
from app.models.base import BaseModel, TimestampMixin
from app.models.user import User, Role
from app.models.vehicle import Vehicle, VehicleDocument, VehicleStatus
from app.models.driver import Driver, DriverDocument, DriverStatus
from app.models.trip import Trip, TripStatus
from app.models.maintenance import MaintenanceLog, FuelLog, Expense, MaintenanceStatus
from app.models.event import Event, Notification

__all__ = [
    "BaseModel",
    "TimestampMixin",
    "User",
    "Role",
    "Vehicle",
    "VehicleDocument",
    "VehicleStatus",
    "Driver",
    "DriverDocument",
    "DriverStatus",
    "Trip",
    "TripStatus",
    "MaintenanceLog",
    "MaintenanceStatus",
    "FuelLog",
    "Expense",
    "Event",
    "Notification",
]
