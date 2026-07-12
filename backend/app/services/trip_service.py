from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.trip import Trip, TripStatus
from app.models.driver import Driver, DriverStatus
from app.models.vehicle import Vehicle, VehicleStatus
from app.schemas.trip import TripCreate, TripDispatch, TripUpdate
from datetime import datetime
import uuid


class TripService:
    """Business logic for trip management and dispatch."""
    
    @staticmethod
    def get_all(
        db: Session,
        status: Optional[TripStatus] = None,
        driver_id: Optional[uuid.UUID] = None,
        vehicle_id: Optional[uuid.UUID] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Trip]:
        """Get all trips with optional filtering."""
        query = db.query(Trip)
        
        if status:
            query = query.filter(Trip.status == status)
        
        if driver_id:
            query = query.filter(Trip.driver_id == driver_id)
        
        if vehicle_id:
            query = query.filter(Trip.vehicle_id == vehicle_id)
        
        return query.order_by(Trip.created_at.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_id(db: Session, trip_id: uuid.UUID) -> Optional[Trip]:
        """Get trip by ID."""
        return db.query(Trip).filter(Trip.id == trip_id).first()
    
    @staticmethod
    def create(db: Session, trip_data: TripCreate, created_by: uuid.UUID) -> Trip:
        """Create a new trip."""
        trip = Trip(
            id=uuid.uuid4(),
            origin=trip_data.origin,
            destination=trip_data.destination,
            distance_km=trip_data.distance_km,
            cargo_weight_kg=trip_data.cargo_weight_kg,
            cargo_description=trip_data.cargo_description,
            revenue=trip_data.revenue,
            status=TripStatus.DRAFT,
            created_by=created_by
        )
        
        db.add(trip)
        db.commit()
        db.refresh(trip)
        
        return trip
    
    @staticmethod
    def dispatch(db: Session, trip_id: uuid.UUID, dispatch_data: TripDispatch) -> Trip:
        """
        Dispatch a trip by assigning driver and vehicle.
        Validates availability.
        """
        trip = TripService.get_by_id(db, trip_id)
        if not trip:
            raise ValueError(f"Trip with ID {trip_id} not found")
        
        if trip.status != TripStatus.DRAFT:
            raise ValueError(f"Cannot dispatch trip with status {trip.status.value}")
        
        # Validate driver availability
        driver = db.query(Driver).filter(
            Driver.id == dispatch_data.driver_id,
            Driver.is_active == True
        ).first()
        
        if not driver:
            raise ValueError(f"Driver with ID {dispatch_data.driver_id} not found")
        
        if driver.status != DriverStatus.AVAILABLE:
            raise ValueError(f"Driver {driver.first_name} {driver.last_name} is not available (status: {driver.status.value})")
        
        # Validate vehicle availability
        vehicle = db.query(Vehicle).filter(
            Vehicle.id == dispatch_data.vehicle_id,
            Vehicle.is_active == True
        ).first()
        
        if not vehicle:
            raise ValueError(f"Vehicle with ID {dispatch_data.vehicle_id} not found")
        
        if vehicle.status != VehicleStatus.AVAILABLE:
            raise ValueError(f"Vehicle {vehicle.plate_number} is not available (status: {vehicle.status.value})")
        
        # All validations passed - dispatch the trip
        trip.driver_id = dispatch_data.driver_id
        trip.vehicle_id = dispatch_data.vehicle_id
        trip.status = TripStatus.DISPATCHED
        trip.dispatched_at = datetime.utcnow()
        trip.updated_at = datetime.utcnow()
        
        # Update driver and vehicle status
        driver.status = DriverStatus.ON_TRIP
        driver.updated_at = datetime.utcnow()
        
        vehicle.status = VehicleStatus.ON_TRIP
        vehicle.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(trip)
        
        return trip
    
    @staticmethod
    def complete_trip(db: Session, trip_id: uuid.UUID) -> Trip:
        """Complete a trip and release resources."""
        trip = TripService.get_by_id(db, trip_id)
        if not trip:
            raise ValueError(f"Trip with ID {trip_id} not found")
        
        if trip.status != TripStatus.DISPATCHED:
            raise ValueError(f"Cannot complete trip with status {trip.status.value}")
        
        trip.status = TripStatus.COMPLETED
        trip.completed_at = datetime.utcnow()
        trip.updated_at = datetime.utcnow()
        
        # Release driver
        if trip.driver:
            trip.driver.status = DriverStatus.AVAILABLE
            trip.driver.updated_at = datetime.utcnow()
        
        # Release vehicle
        if trip.vehicle:
            trip.vehicle.status = VehicleStatus.AVAILABLE
            trip.vehicle.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(trip)
        
        return trip
    
    @staticmethod
    def cancel_trip(db: Session, trip_id: uuid.UUID) -> Trip:
        """Cancel a trip and release resources."""
        trip = TripService.get_by_id(db, trip_id)
        if not trip:
            raise ValueError(f"Trip with ID {trip_id} not found")
        
        if trip.status in [TripStatus.COMPLETED, TripStatus.CANCELLED]:
            raise ValueError(f"Cannot cancel trip with status {trip.status.value}")
        
        trip.status = TripStatus.CANCELLED
        trip.updated_at = datetime.utcnow()
        
        # Release driver if assigned
        if trip.driver:
            trip.driver.status = DriverStatus.AVAILABLE
            trip.driver.updated_at = datetime.utcnow()
        
        # Release vehicle if assigned
        if trip.vehicle:
            trip.vehicle.status = VehicleStatus.AVAILABLE
            trip.vehicle.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(trip)
        
        return trip
    
    @staticmethod
    def update(db: Session, trip_id: uuid.UUID, trip_data: TripUpdate) -> Optional[Trip]:
        """Update trip information."""
        trip = TripService.get_by_id(db, trip_id)
        if not trip:
            return None
        
        # Update fields if provided
        update_data = trip_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(trip, field, value)
        
        trip.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(trip)
        
        return trip
