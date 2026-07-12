from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from app.api.deps import get_db, get_current_active_user
from app.models.user import User
from app.services.intelligence_service import IntelligenceService

router = APIRouter()


@router.get("/dashboard-summary", response_model=Dict[str, Any])
async def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get dashboard summary metrics.
    Returns vehicle counts, driver counts, trip stats, maintenance status, and costs.
    """
    summary = IntelligenceService.get_dashboard_summary(db)
    return summary


@router.get("/fleet-health", response_model=Dict[str, Any])
async def get_fleet_health(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get fleet health metrics.
    Returns vehicle status distribution and upcoming maintenance.
    """
    health = IntelligenceService.get_fleet_health(db)
    return health


@router.get("/compliance", response_model=Dict[str, Any])
async def get_compliance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get compliance status and expiring documents.
    Returns expiring driver licenses, vehicle insurance, and registration.
    """
    compliance = IntelligenceService.get_compliance_alerts(db)
    return compliance


@router.get("/dispatch-recommendations", response_model=List[Dict[str, Any]])
async def get_dispatch_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get smart dispatch recommendations.
    Returns best driver/vehicle pairs based on availability and performance.
    """
    recommendations = IntelligenceService.get_dispatch_recommendations(db)
    return recommendations


@router.get("/costs", response_model=Dict[str, Any])
async def get_cost_intelligence(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get cost intelligence and analytics.
    Returns fuel costs, maintenance costs, revenue, and profitability.
    """
    costs = IntelligenceService.get_cost_intelligence(db)
    return costs
