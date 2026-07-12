from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_, case
from app.models.vehicle import Vehicle, VehicleStatus
from app.models.driver import Driver, DriverStatus
from app.models.trip import Trip, TripStatus
from app.models.maintenance import MaintenanceLog, MaintenanceStatus, FuelLog, Expense
from datetime import datetime, timedelta, date
from decimal import Decimal
import uuid


class IntelligenceService:
    """Business intelligence and analytics service."""
    
    @staticmethod
    def get_dashboard_summary(db: Session) -> Dict[str, Any]:
        """Get dashboard summary metrics."""
        # Vehicle counts by status
        total_vehicles = db.query(Vehicle).filter(Vehicle.is_active == True).count()
        available_vehicles = db.query(Vehicle).filter(
            Vehicle.is_active == True,
            Vehicle.status == VehicleStatus.AVAILABLE
        ).count()
        on_trip_vehicles = db.query(Vehicle).filter(
            Vehicle.is_active == True,
            Vehicle.status == VehicleStatus.ON_TRIP
        ).count()
        maintenance_vehicles = db.query(Vehicle).filter(
            Vehicle.is_active == True,
            Vehicle.status == VehicleStatus.IN_SHOP
        ).count()
        
        # Driver counts
        total_drivers = db.query(Driver).filter(Driver.is_active == True).count()
        available_drivers = db.query(Driver).filter(
            Driver.is_active == True,
            Driver.status == DriverStatus.AVAILABLE
        ).count()
        on_trip_drivers = db.query(Driver).filter(
            Driver.is_active == True,
            Driver.status == DriverStatus.ON_TRIP
        ).count()
        
        # Trip counts
        active_trips = db.query(Trip).filter(
            Trip.status == TripStatus.DISPATCHED
        ).count()
        completed_today = db.query(Trip).filter(
            Trip.status == TripStatus.COMPLETED,
            func.date(Trip.completed_at) == date.today()
        ).count()
        
        # Maintenance counts
        pending_maintenance = db.query(MaintenanceLog).filter(
            MaintenanceLog.status == MaintenanceStatus.ACTIVE
        ).count()
        
        # Today's fuel cost
        today_fuel_cost = db.query(func.sum(FuelLog.cost)).filter(
            func.date(FuelLog.created_at) == date.today()
        ).scalar() or Decimal(0)
        
        # Today's revenue
        today_revenue = db.query(func.sum(Trip.revenue)).filter(
            Trip.status == TripStatus.COMPLETED,
            func.date(Trip.completed_at) == date.today()
        ).scalar() or Decimal(0)
        
        return {
            "vehicles": {
                "total": total_vehicles,
                "available": available_vehicles,
                "on_trip": on_trip_vehicles,
                "maintenance": maintenance_vehicles,
                "utilization_rate": round((on_trip_vehicles / total_vehicles * 100) if total_vehicles > 0 else 0, 2)
            },
            "drivers": {
                "total": total_drivers,
                "available": available_drivers,
                "on_trip": on_trip_drivers,
                "utilization_rate": round((on_trip_drivers / total_drivers * 100) if total_drivers > 0 else 0, 2)
            },
            "trips": {
                "active": active_trips,
                "completed_today": completed_today
            },
            "maintenance": {
                "pending": pending_maintenance
            },
            "costs": {
                "fuel_today": float(today_fuel_cost),
                "revenue_today": float(today_revenue)
            }
        }
    
    @staticmethod
    def get_fleet_health(db: Session) -> Dict[str, Any]:
        """Get fleet health metrics by vehicle status."""
        status_distribution = db.query(
            Vehicle.status,
            func.count(Vehicle.id).label('count')
        ).filter(
            Vehicle.is_active == True
        ).group_by(Vehicle.status).all()
        
        health_data = {
            "status_distribution": [
                {"status": status.value, "count": count}
                for status, count in status_distribution
            ]
        }
        
        # Upcoming maintenance (next 30 days)
        upcoming_maintenance = db.query(func.count(MaintenanceLog.id)).filter(
            MaintenanceLog.status == MaintenanceStatus.ACTIVE,
            MaintenanceLog.scheduled_date <= date.today() + timedelta(days=30)
        ).scalar() or 0
        
        health_data["upcoming_maintenance_30_days"] = upcoming_maintenance
        
        return health_data
    
    @staticmethod
    def get_compliance_alerts(db: Session) -> Dict[str, Any]:
        """Get compliance alerts for expiring documents."""
        today = date.today()
        warning_threshold = today + timedelta(days=30)
        critical_threshold = today + timedelta(days=7)
        
        # Driver license expiry
        expiring_licenses = db.query(Driver).filter(
            Driver.is_active == True,
            Driver.license_expiry.isnot(None),
            Driver.license_expiry <= warning_threshold
        ).all()
        
        # For now, vehicle documents are in separate table
        # Return empty lists for vehicle compliance
        
        def categorize_expiry(expiry_date):
            if expiry_date <= today:
                return "expired"
            elif expiry_date <= critical_threshold:
                return "critical"
            else:
                return "warning"
        
        return {
            "driver_licenses": [
                {
                    "driver_id": str(driver.id),
                    "driver_name": f"{driver.first_name} {driver.last_name}",
                    "license_number": driver.license_number,
                    "expiry_date": driver.license_expiry.isoformat(),
                    "status": categorize_expiry(driver.license_expiry)
                }
                for driver in expiring_licenses
            ],
            "vehicle_insurance": [],  # Placeholder - would need vehicle_documents join
            "vehicle_registration": [],  # Placeholder - would need vehicle_documents join
            "summary": {
                "total_alerts": len(expiring_licenses),
                "expired": sum(1 for d in expiring_licenses if d.license_expiry <= today),
                "critical": sum(1 for d in expiring_licenses if today < d.license_expiry <= critical_threshold)
            }
        }
    
    @staticmethod
    def get_dispatch_recommendations(db: Session) -> List[Dict[str, Any]]:
        """Get smart dispatch recommendations (best driver/vehicle pairs)."""
        # Get available drivers
        available_drivers = db.query(Driver).filter(
            Driver.is_active == True,
            Driver.status == DriverStatus.AVAILABLE
        ).all()
        
        # Get available vehicles
        available_vehicles = db.query(Vehicle).filter(
            Vehicle.is_active == True,
            Vehicle.status == VehicleStatus.AVAILABLE
        ).all()
        
        if not available_drivers or not available_vehicles:
            return []
        
        # Calculate recent performance for each driver
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        
        recommendations = []
        
        for driver in available_drivers:
            # Get driver's trip history
            recent_trips = db.query(func.count(Trip.id)).filter(
                Trip.driver_id == driver.id,
                Trip.status == TripStatus.COMPLETED,
                Trip.completed_at >= thirty_days_ago
            ).scalar() or 0
            
            for vehicle in available_vehicles:
                # Basic compatibility score
                score = 100
                
                # Bonus for experienced driver
                if recent_trips > 10:
                    score += 20
                elif recent_trips > 5:
                    score += 10
                
                # Bonus for newer vehicles
                if vehicle.year >= datetime.now().year - 2:
                    score += 10
                
                recommendations.append({
                    "driver": {
                        "id": str(driver.id),
                        "name": f"{driver.first_name} {driver.last_name}",
                        "license_number": driver.license_number,
                        "recent_trips": recent_trips
                    },
                    "vehicle": {
                        "id": str(vehicle.id),
                        "registration_number": vehicle.registration_number,
                        "make_model": f"{vehicle.make} {vehicle.model}",
                        "year": vehicle.year
                    },
                    "compatibility_score": score,
                    "reason": f"Driver completed {recent_trips} trips in last 30 days"
                })
        
        # Sort by score descending
        recommendations.sort(key=lambda x: x["compatibility_score"], reverse=True)
        
        return recommendations[:10]  # Top 10 recommendations
    
    @staticmethod
    def get_cost_intelligence(db: Session) -> Dict[str, Any]:
        """Get cost analytics and trends."""
        # Last 30 days
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        
        # Total fuel costs
        total_fuel_cost = db.query(func.sum(FuelLog.cost)).filter(
            FuelLog.created_at >= thirty_days_ago
        ).scalar() or Decimal(0)
        
        # Total maintenance costs
        total_maintenance_cost = db.query(func.sum(MaintenanceLog.cost)).filter(
            MaintenanceLog.updated_at >= thirty_days_ago,
            MaintenanceLog.cost.isnot(None)
        ).scalar() or Decimal(0)
        
        # Total other expenses
        total_expenses = db.query(func.sum(Expense.amount)).filter(
            Expense.created_at >= thirty_days_ago
        ).scalar() or Decimal(0)
        
        # Total revenue
        total_revenue = db.query(func.sum(Trip.revenue)).filter(
            Trip.status == TripStatus.COMPLETED,
            Trip.completed_at >= thirty_days_ago,
            Trip.revenue.isnot(None)
        ).scalar() or Decimal(0)
        
        # Cost per vehicle
        active_vehicles = db.query(Vehicle).filter(Vehicle.is_active == True).count()
        
        total_costs = total_fuel_cost + total_maintenance_cost + total_expenses
        
        return {
            "period": "last_30_days",
            "costs": {
                "fuel": float(total_fuel_cost),
                "maintenance": float(total_maintenance_cost),
                "other_expenses": float(total_expenses),
                "total": float(total_costs)
            },
            "revenue": {
                "total": float(total_revenue),
                "profit": float(total_revenue - total_costs)
            },
            "per_vehicle": {
                "average_cost": float(total_costs / active_vehicles) if active_vehicles > 0 else 0
            }
        }
