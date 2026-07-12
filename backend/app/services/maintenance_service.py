from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models.maintenance import MaintenanceLog, MaintenanceStatus, FuelLog, Expense
from app.models.vehicle import Vehicle, VehicleStatus
from app.schemas.maintenance import (
    MaintenanceLogCreate,
    MaintenanceLogUpdate,
    FuelLogCreate,
    ExpenseCreate
)
from datetime import datetime, date
import uuid


class MaintenanceService:
    """Business logic for maintenance management."""
    
    @staticmethod
    def get_all_maintenance(
        db: Session,
        vehicle_id: Optional[uuid.UUID] = None,
        status: Optional[MaintenanceStatus] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[MaintenanceLog]:
        """Get all maintenance logs with optional filtering."""
        query = db.query(MaintenanceLog).filter(MaintenanceLog.is_active == True)
        
        if vehicle_id:
            query = query.filter(MaintenanceLog.vehicle_id == vehicle_id)
        
        if status:
            query = query.filter(MaintenanceLog.status == status)
        
        return query.order_by(MaintenanceLog.scheduled_date.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_maintenance_by_id(db: Session, maintenance_id: uuid.UUID) -> Optional[MaintenanceLog]:
        """Get maintenance log by ID."""
        return db.query(MaintenanceLog).filter(
            MaintenanceLog.id == maintenance_id,
            MaintenanceLog.is_active == True
        ).first()
    
    @staticmethod
    def create_maintenance(
        db: Session,
        maintenance_data: MaintenanceLogCreate,
        created_by: uuid.UUID
    ) -> MaintenanceLog:
        """Create a new maintenance log."""
        # Verify vehicle exists
        vehicle = db.query(Vehicle).filter(
            Vehicle.id == maintenance_data.vehicle_id,
            Vehicle.is_active == True
        ).first()
        
        if not vehicle:
            raise ValueError(f"Vehicle with ID {maintenance_data.vehicle_id} not found")
        
        # Create maintenance log
        maintenance = MaintenanceLog(
            id=uuid.uuid4(),
            vehicle_id=maintenance_data.vehicle_id,
            maintenance_type=maintenance_data.maintenance_type,
            description=maintenance_data.description,
            scheduled_date=maintenance_data.scheduled_date,
            status=MaintenanceStatus.ACTIVE,
            cost=maintenance_data.cost,
            created_by=created_by,
            is_active=True
        )
        
        # If scheduled for today or past, set vehicle to maintenance
        if maintenance_data.scheduled_date <= date.today():
            vehicle.status = VehicleStatus.MAINTENANCE
            vehicle.updated_at = datetime.utcnow()
        
        db.add(maintenance)
        db.commit()
        db.refresh(maintenance)
        
        return maintenance
    
    @staticmethod
    def complete_maintenance(
        db: Session,
        maintenance_id: uuid.UUID,
        cost: Optional[float] = None
    ) -> MaintenanceLog:
        """Complete a maintenance log and release vehicle."""
        maintenance = MaintenanceService.get_maintenance_by_id(db, maintenance_id)
        if not maintenance:
            raise ValueError(f"Maintenance log with ID {maintenance_id} not found")
        
        if maintenance.status == MaintenanceStatus.COMPLETED:
            raise ValueError("Maintenance is already completed")
        
        maintenance.status = MaintenanceStatus.COMPLETED
        maintenance.completed_at = datetime.utcnow()
        if cost is not None:
            maintenance.cost = cost
        maintenance.updated_at = datetime.utcnow()
        
        # Release vehicle back to available if currently in maintenance
        if maintenance.vehicle and maintenance.vehicle.status == VehicleStatus.MAINTENANCE:
            maintenance.vehicle.status = VehicleStatus.AVAILABLE
            maintenance.vehicle.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(maintenance)
        
        return maintenance
    
    @staticmethod
    def update_maintenance(
        db: Session,
        maintenance_id: uuid.UUID,
        maintenance_data: MaintenanceLogUpdate
    ) -> Optional[MaintenanceLog]:
        """Update maintenance log information."""
        maintenance = MaintenanceService.get_maintenance_by_id(db, maintenance_id)
        if not maintenance:
            return None
        
        # Update fields if provided
        update_data = maintenance_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(maintenance, field, value)
        
        maintenance.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(maintenance)
        
        return maintenance
    
    @staticmethod
    def get_all_fuel_logs(
        db: Session,
        vehicle_id: Optional[uuid.UUID] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[FuelLog]:
        """Get all fuel logs with optional filtering."""
        query = db.query(FuelLog)
        
        if vehicle_id:
            query = query.filter(FuelLog.vehicle_id == vehicle_id)
        
        return query.order_by(FuelLog.created_at.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def create_fuel_log(
        db: Session,
        fuel_data: FuelLogCreate,
        created_by: uuid.UUID
    ) -> FuelLog:
        """Create a new fuel log."""
        # Verify vehicle exists
        vehicle = db.query(Vehicle).filter(
            Vehicle.id == fuel_data.vehicle_id,
            Vehicle.is_active == True
        ).first()
        
        if not vehicle:
            raise ValueError(f"Vehicle with ID {fuel_data.vehicle_id} not found")
        
        fuel_log = FuelLog(
            id=uuid.uuid4(),
            vehicle_id=fuel_data.vehicle_id,
            quantity_liters=fuel_data.quantity_liters,
            cost=fuel_data.cost,
            odometer_reading=fuel_data.odometer_reading,
            cost_per_unit=fuel_data.cost_per_unit,
            created_by=created_by
        )
        
        # Update vehicle mileage
        vehicle.current_mileage = fuel_data.odometer_reading
        vehicle.updated_at = datetime.utcnow()
        
        db.add(fuel_log)
        db.commit()
        db.refresh(fuel_log)
        
        return fuel_log
    
    @staticmethod
    def get_all_expenses(
        db: Session,
        vehicle_id: Optional[uuid.UUID] = None,
        expense_type: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Expense]:
        """Get all expenses with optional filtering."""
        query = db.query(Expense)
        
        if vehicle_id:
            query = query.filter(Expense.vehicle_id == vehicle_id)
        
        if expense_type:
            query = query.filter(Expense.expense_type == expense_type)
        
        return query.order_by(Expense.created_at.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def create_expense(
        db: Session,
        expense_data: ExpenseCreate,
        created_by: uuid.UUID
    ) -> Expense:
        """Create a new expense."""
        # Verify vehicle exists
        vehicle = db.query(Vehicle).filter(
            Vehicle.id == expense_data.vehicle_id,
            Vehicle.is_active == True
        ).first()
        
        if not vehicle:
            raise ValueError(f"Vehicle with ID {expense_data.vehicle_id} not found")
        
        expense = Expense(
            id=uuid.uuid4(),
            vehicle_id=expense_data.vehicle_id,
            expense_type=expense_data.expense_type,
            amount=expense_data.amount,
            description=expense_data.description,
            created_by=created_by
        )
        
        db.add(expense)
        db.commit()
        db.refresh(expense)
        
        return expense
