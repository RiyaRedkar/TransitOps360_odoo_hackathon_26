// Common types
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
}

// Auth types
export interface User {
  id: string
  username: string
  email: string
  role: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}

// Entity status enums
export enum VehicleStatus {
  AVAILABLE = 'Available',
  ON_TRIP = 'On Trip',
  IN_SHOP = 'In Shop',
  RETIRED = 'Retired',
}

export enum DriverStatus {
  AVAILABLE = 'Available',
  ON_TRIP = 'On Trip',
  OFF_DUTY = 'Off Duty',
  SUSPENDED = 'Suspended',
}

export enum TripStatus {
  DRAFT = 'Draft',
  DISPATCHED = 'Dispatched',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export enum MaintenanceStatus {
  SCHEDULED = 'Scheduled',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
}

// Vehicle types
export interface Vehicle {
  id: string
  registration_number: string
  make: string
  model: string
  year: number
  capacity_kg: number
  fuel_type: string
  status: VehicleStatus
  acquisition_cost: number
  fuel_efficiency?: number
  health_score: number
  is_active: boolean
  created_by?: string
  created_at: string
  updated_at: string
}

export interface VehicleCreate {
  registration_number: string
  make: string
  model: string
  year: number
  capacity_kg: number
  fuel_type: string
  acquisition_cost: number
  fuel_efficiency?: number
}

export interface VehicleUpdate {
  make?: string
  model?: string
  capacity_kg?: number
  fuel_efficiency?: number
}

export interface VehicleStatusUpdate {
  status: VehicleStatus
}

// Driver types
export interface Driver {
  id: string
  name: string
  license_number: string
  license_expiry: string
  phone: string
  email?: string
  hire_date: string
  status: DriverStatus
  safety_score: number
  is_active: boolean
  created_by?: string
  created_at: string
  updated_at: string
}

export interface DriverCreate {
  name: string
  license_number: string
  license_expiry: string
  phone: string
  email?: string
  hire_date: string
}

export interface DriverUpdate {
  name?: string
  phone?: string
  email?: string
  status?: DriverStatus
}

// Trip types
export interface Trip {
  id: string
  vehicle_id?: string
  driver_id?: string
  origin: string
  destination: string
  distance_km: number
  cargo_weight_kg: number
  cargo_description?: string
  revenue?: number
  status: TripStatus
  dispatched_at?: string
  completed_at?: string
  created_by?: string
  created_at: string
  updated_at: string
}

export interface TripCreate {
  origin: string
  destination: string
  distance_km: number
  cargo_weight_kg: number
  cargo_description?: string
  revenue?: number
}

export interface TripDispatch {
  vehicle_id: string
  driver_id: string
}

export interface TripUpdate {
  origin?: string
  destination?: string
  distance_km?: number
  cargo_weight_kg?: number
  cargo_description?: string
  revenue?: number
}

// Maintenance types
export interface MaintenanceLog {
  id: string
  vehicle_id: string
  maintenance_type: 'Scheduled' | 'Breakdown' | 'Inspection'
  description?: string
  scheduled_date: string
  cost?: number
  status: MaintenanceStatus
  completed_at?: string
  created_by?: string
  created_at: string
  updated_at: string
}

export interface MaintenanceLogCreate {
  vehicle_id: string
  maintenance_type: 'Scheduled' | 'Breakdown' | 'Inspection'
  description?: string
  scheduled_date: string
  cost?: number
}

export interface MaintenanceLogUpdate {
  description?: string
  cost?: number
}

export interface MaintenanceLogComplete {
  cost?: number
}

export interface FuelLog {
  id: string
  vehicle_id: string
  quantity_liters: number
  cost: number
  odometer_reading: number
  cost_per_unit: number
  created_by?: string
  created_at: string
}

export interface FuelLogCreate {
  vehicle_id: string
  quantity_liters: number
  cost: number
  odometer_reading: number
}

export interface Expense {
  id: string
  vehicle_id: string
  expense_type: 'tolls' | 'repairs' | 'other'
  amount: number
  description?: string
  created_by?: string
  created_at: string
}

export interface ExpenseCreate {
  vehicle_id: string
  expense_type: 'tolls' | 'repairs' | 'other'
  amount: number
  description?: string
}

// Intelligence types
export interface DashboardSummary {
  vehicles: {
    total: number
    available: number
    on_trip: number
    maintenance: number
    utilization_rate: number
  }
  drivers: {
    total: number
    available: number
    on_trip: number
    utilization_rate: number
  }
  trips: {
    active: number
    completed_today: number
  }
  maintenance: {
    pending: number
  }
  costs: {
    fuel_today: number
    revenue_today: number
  }
}

export interface FleetHealthItem {
  status: string
  count: number
  percentage: number
}

export interface FleetHealthResponse {
  distribution: FleetHealthItem[]
  average_health_score: number
  total_vehicles: number
}

export interface ComplianceItem {
  entity_type: 'vehicle' | 'driver'
  entity_id: string
  entity_name: string
  document_type: string
  expiry_date: string
  days_until_expiry: number
  is_expired: boolean
}

export interface ComplianceResponse {
  expiring_soon: ComplianceItem[]
  expired: ComplianceItem[]
  total_items: number
}

export interface DispatchRecommendation {
  vehicle_id: string
  vehicle_registration: string
  driver_id: string
  driver_name: string
  score: number
  capacity_match_score: number
  fuel_efficiency_score: number
  health_score: number
  availability_score: number
  reasons: string[]
}

export interface DispatchRecommendationResponse {
  recommendations: DispatchRecommendation[]
  total: number
}

export interface CostBreakdown {
  category: string
  amount: number
  percentage: number
}

export interface CostIntelligence {
  total_fuel_cost: number
  total_maintenance_cost: number
  total_expenses: number
  total_cost: number
  total_revenue: number
  net_profit: number
  roi_percentage: number
  breakdown: CostBreakdown[]
  high_cost_vehicles: Record<string, any>[]
  low_roi_vehicles: Record<string, any>[]
}
