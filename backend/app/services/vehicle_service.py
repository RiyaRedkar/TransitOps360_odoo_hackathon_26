from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.vehicle import Vehicle, VehicleStatus
from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleStatusUpdate
from datetime import datetime
import uuid


class VehicleService:
    """Business logic for vehicle management."""
    
    @staticmethod
    def get_all(
        db: Session,
        status: Optional[VehicleStatus] = None,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Vehicle]:
        """Get all vehicles with optional filtering."""
        query = db.query(Vehicle).filter(Vehicle.is_active == True)
        
        if status:
            query = query.filter(Vehicle.status == status)
        
        if search:
            query = query.filter(
                or_(
                    Vehicle.plate_number.ilike(f"%{search}%"),
                    Vehicle.make.ilike(f"%{search}%"),
                    Vehicle.model.ilike(f"%{search}%"),
                    Vehicle.vin.ilike(f"%{search}%")
                )
            )
        
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_id(db: Session, vehicle_id: uuid.UUID) -> Optional[Vehicle]:
        """Get vehicle by ID."""
        return db.query(Vehicle).filter(
            Vehicle.id == vehicle_id,
            Vehicle.is_active == True
        ).first()
    
    @staticmethod
    def get_by_plate(db: Session, plate_number: str) -> Optional[Vehicle]:
        """Get vehicle by plate number."""
        return db.query(Vehicle).filter(
            Vehicle.plate_number == plate_number,
            Vehicle.is_active == True
        ).first()
    
    @staticmethod
    def get_available(db: Session) -> List[Vehicle]:
        """Get all available vehicles for dispatch."""
        return db.query(Vehicle).filter(
            Vehicle.status == VehicleStatus.AVAILABLE,
            Vehicle.is_active == True
        ).all()
    
    @staticmethod
    def create(db: Session, vehicle_data: VehicleCreate) -> Vehicle:
        """Create a new vehicle."""
        # Check for duplicate plate number
        existing = VehicleService.get_by_plate(db, vehicle_data.plate_number)
        if existing:
            raise ValueError(f"Vehicle with plate number {vehicle_data.plate_number} already exists")
        
        # Create vehicle
        vehicle = Vehicle(
            id=uuid.uuid4(),
            plate_number=vehicle_data.plate_number,
            make=vehicle_data.make,
            model=vehicle_data.model,
            year=vehicle_data.year,
            vin=vehicle_data.vin,
            status=vehicle_data.status or VehicleStatus.AVAILABLE,
            capacity=vehicle_data.capacity,
            fuel_type=vehicle_data.fuel_type,
            current_mileage=vehicle_data.current_mileage or 0,
            last_service_date=vehicle_data.last_service_date,
            next_service_due=vehicle_data.next_service_due,
            insurance_expiry=vehicle_data.insurance_expiry,
            registration_expiry=vehicle_data.registration_expiry,
            is_active=True
        )
        
        db.add(vehicle)
        db.commit()
        db.refresh(vehicle)
        
        return vehicle
    
    @staticmethod
    def update(db: Session, vehicle_id: uuid.UUID, vehicle_data: VehicleUpdate) -> Optional[Vehicle]:
        """Update vehicle information."""
        vehicle = VehicleService.get_by_id(db, vehicle_id)
        if not vehicle:
            return None
        
        # Update fields if provided
        update_data = vehicle_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(vehicle, field, value)
        
        vehicle.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(vehicle)
        
        return vehicle
    
    @staticmethod
    def update_status(
        db: Session,
        vehicle_id: uuid.UUID,
        status_data: VehicleStatusUpdate
    ) -> Optional[Vehicle]:
        """Update vehicle status with validation."""
        vehicle = VehicleService.get_by_id(db, vehicle_id)
        if not vehicle:
            return None
        
        # Validate status transition
        VehicleService._validate_status_transition(vehicle.status, status_data.status)
        
        vehicle.status = status_data.status
        vehicle.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(vehicle)
        
        return vehicle
    
    @staticmethod
    def delete(db: Session, vehicle_id: uuid.UUID) -> bool:
        """Soft delete a vehicle."""
        vehicle = VehicleService.get_by_id(db, vehicle_id)
        if not vehicle:
            return False
        
        vehicle.is_active = False
        vehicle.updated_at = datetime.utcnow()
        
        db.commit()
        
        return True
    
    @staticmethod
    def _validate_status_transition(current: VehicleStatus, new: VehicleStatus):
        """Validate vehicle status transitions."""
        # Define valid transitions
        valid_transitions = {
            VehicleStatus.AVAILABLE: [
                VehicleStatus.ON_TRIP,
                VehicleStatus.MAINTENANCE,
                VehicleStatus.OUT_OF_SERVICE
            ],
            VehicleStatus.ON_TRIP: [
                VehicleStatus.AVAILABLE,
                VehicleStatus.MAINTENANCE
            ],
            VehicleStatus.MAINTENANCE: [
                VehicleStatus.AVAILABLE,
                VehicleStatus.OUT_OF_SERVICE
            ],
            VehicleStatus.OUT_OF_SERVICE: [
                VehicleStatus.MAINTENANCE,
                VehicleStatus.AVAILABLE
            ]
        }
        
        if new not in valid_transitions.get(current, []):
            raise ValueError(
                f"Invalid status transition from {current.value} to {new.value}"
            )
