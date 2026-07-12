from pydantic import BaseModel, ConfigDict
from typing import List, Dict, Any
from decimal import Decimal


class DashboardSummary(BaseModel):
    """Dashboard summary schema."""
    total_vehicles: int
    active_vehicles: int
    on_trip_vehicles: int
    in_shop_vehicles: int
    total_drivers: int
    available_drivers: int
    on_trip_drivers: int
    total_trips: int
    active_trips: int
    completed_trips_today: int
    pending_maintenance: int
    today_fuel_cost: Decimal
    
    model_config = ConfigDict(from_attributes=True)


class FleetHealthItem(BaseModel):
    """Fleet health item schema."""
    status: str
    count: int
    percentage: float


class FleetHealthResponse(BaseModel):
    """Fleet health response schema."""
    distribution: List[FleetHealthItem]
    average_health_score: float
    total_vehicles: int


class ComplianceItem(BaseModel):
    """Compliance item schema."""
    entity_type: str  # 'vehicle' or 'driver'
    entity_id: str
    entity_name: str
    document_type: str
    expiry_date: str
    days_until_expiry: int
    is_expired: bool


class ComplianceResponse(BaseModel):
    """Compliance response schema."""
    expiring_soon: List[ComplianceItem]  # < 30 days
    expired: List[ComplianceItem]
    total_items: int


class DispatchRecommendation(BaseModel):
    """Dispatch recommendation schema."""
    vehicle_id: str
    vehicle_registration: str
    driver_id: str
    driver_name: str
    score: float
    capacity_match_score: float
    fuel_efficiency_score: float
    health_score: float
    availability_score: float
    reasons: List[str]


class DispatchRecommendationResponse(BaseModel):
    """Dispatch recommendation response schema."""
    recommendations: List[DispatchRecommendation]
    total: int


class CostBreakdown(BaseModel):
    """Cost breakdown schema."""
    category: str
    amount: Decimal
    percentage: float


class CostIntelligence(BaseModel):
    """Cost intelligence schema."""
    total_fuel_cost: Decimal
    total_maintenance_cost: Decimal
    total_expenses: Decimal
    total_cost: Decimal
    total_revenue: Decimal
    net_profit: Decimal
    roi_percentage: float
    breakdown: List[CostBreakdown]
    high_cost_vehicles: List[Dict[str, Any]]
    low_roi_vehicles: List[Dict[str, Any]]
