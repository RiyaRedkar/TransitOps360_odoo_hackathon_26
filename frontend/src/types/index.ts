// Common types
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
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

// TODO: Add entity interfaces (Vehicle, Driver, Trip, etc.)
