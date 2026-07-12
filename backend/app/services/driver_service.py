from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.driver import Driver, DriverStatus
from app.schemas.driver import DriverCreate, DriverUpdate
from datetime import datetime
import uuid


class DriverService:
    """Business logic for driver management."""
    
    @staticmethod
    def get_all(
        db: Session,
        status: Optional[DriverStatus] = None,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Driver]:
        """Get all drivers with optional filtering."""
        query = db.query(Driver).filter(Driver.is_active == True)
        
        if status:
            query = query.filter(Driver.status == status)
        
        if search:
            query = query.filter(
                or_(
                    Driver.first_name.ilike(f"%{search}%"),
                    Driver.last_name.ilike(f"%{search}%"),
                    Driver.license_number.ilike(f"%{search}%"),
                    Driver.phone.ilike(f"%{search}%")
                )
            )
        
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_id(db: Session, driver_id: uuid.UUID) -> Optional[Driver]:
        """Get driver by ID."""
        return db.query(Driver).filter(
            Driver.id == driver_id,
            Driver.is_active == True
        ).first()
    
    @staticmethod
    def get_by_license(db: Session, license_number: str) -> Optional[Driver]:
        """Get driver by license number."""
        return db.query(Driver).filter(
            Driver.license_number == license_number,
            Driver.is_active == True
        ).first()
    
    @staticmethod
    def get_available(db: Session) -> List[Driver]:
        """Get all available drivers for dispatch."""
        return db.query(Driver).filter(
            Driver.status == DriverStatus.AVAILABLE,
            Driver.is_active == True
        ).all()
    
    @staticmethod
    def create(db: Session, driver_data: DriverCreate) -> Driver:
        """Create a new driver."""
        # Check for duplicate license
        existing = DriverService.get_by_license(db, driver_data.license_number)
        if existing:
            raise ValueError(f"Driver with license {driver_data.license_number} already exists")
        
        # Create driver
        driver = Driver(
            id=uuid.uuid4(),
            first_name=driver_data.first_name,
            last_name=driver_data.last_name,
            email=driver_data.email,
            phone=driver_data.phone,
            license_number=driver_data.license_number,
            license_expiry=driver_data.license_expiry,
            date_of_birth=driver_data.date_of_birth,
            hire_date=driver_data.hire_date,
            status=driver_data.status or DriverStatus.AVAILABLE,
            address=driver_data.address,
            city=driver_data.city,
            state=driver_data.state,
            zip_code=driver_data.zip_code,
            emergency_contact_name=driver_data.emergency_contact_name,
            emergency_contact_phone=driver_data.emergency_contact_phone,
            is_active=True
        )
        
        db.add(driver)
        db.commit()
        db.refresh(driver)
        
        return driver
    
    @staticmethod
    def update(db: Session, driver_id: uuid.UUID, driver_data: DriverUpdate) -> Optional[Driver]:
        """Update driver information."""
        driver = DriverService.get_by_id(db, driver_id)
        if not driver:
            return None
        
        # Update fields if provided
        update_data = driver_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(driver, field, value)
        
        driver.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(driver)
        
        return driver
    
    @staticmethod
    def update_status(db: Session, driver_id: uuid.UUID, status: DriverStatus) -> Optional[Driver]:
        """Update driver status."""
        driver = DriverService.get_by_id(db, driver_id)
        if not driver:
            return None
        
        driver.status = status
        driver.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(driver)
        
        return driver
    
    @staticmethod
    def delete(db: Session, driver_id: uuid.UUID) -> bool:
        """Soft delete a driver."""
        driver = DriverService.get_by_id(db, driver_id)
        if not driver:
            return False
        
        driver.is_active = False
        driver.updated_at = datetime.utcnow()
        
        db.commit()
        
        return True
