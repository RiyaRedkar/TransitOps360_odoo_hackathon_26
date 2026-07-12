# REST API Specification: TransitOps360

## Overview

This document provides a complete REST API specification for the TransitOps360 fleet operations platform. All endpoints follow RESTful conventions and are organized by functional domain.

### API Base URL

```
Development: http://localhost:8000/api
Production: https://api.transitops360.com/api
```

### API Version

```
Current Version: v1
Path Prefix: /api/v1
```

### Authentication

All endpoints (except `/auth/login`) require JWT authentication via the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

### Standard Response Format

**Success Response** (200, 201):
```json
{
  "data": { /* resource or list */ },
  "message": "Success message",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Error Response** (400, 401, 403, 404, 422, 500):
```json
{
  "error": "Error message",
  "detail": "Detailed error information",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Validation Error Response** (422):
```json
{
  "error": "Validation failed",
  "errors": [
    {
      "field": "field_name",
      "message": "Error message",
      "code": "VALIDATION_CODE"
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### HTTP Status Codes

- **200 OK**: Successful GET, PUT, PATCH
- **201 Created**: Successful POST (resource created)
- **204 No Content**: Successful DELETE
- **400 Bad Request**: Invalid request format
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **422 Unprocessable Entity**: Validation failed
- **500 Internal Server Error**: Unexpected server error

---

## 1. Authentication Service

### 1.1 User Login

**Route**: `POST /api/v1/auth/login`

**Purpose**: Authenticate user and issue JWT token

**Request Body**:
```json
{
  "username": "fleet_manager_1",
  "password": "securepassword123"
}
```

**Validation Rules**:
- `username`: Required, string, 3-50 characters
- `password`: Required, string, 8-255 characters

**Response** (200):
```json
{
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 3600,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "fleet_manager_1",
      "email": "manager@example.com",
      "role": "Fleet_Manager"
    }
  },
  "message": "Login successful",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Permissions**: None (public endpoint)

**Error Cases**:
- **401 Unauthorized**: Invalid credentials
  ```json
  {
    "error": "Invalid username or password",
    "code": "INVALID_CREDENTIALS"
  }
  ```
- **422 Validation Error**: Missing or invalid fields
- **429 Too Many Requests**: Rate limit exceeded (5 attempts per minute per IP)

---

### 1.2 Get Current User

**Route**: `GET /api/v1/auth/me`

**Purpose**: Retrieve authenticated user profile

**Request Body**: None (JWT in Authorization header)

**Response** (200):
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "fleet_manager_1",
    "email": "manager@example.com",
    "role": {
      "id": "role-uuid",
      "name": "Fleet_Manager",
      "permissions": [
        "manage_vehicles",
        "manage_drivers",
        "view_maintenance",
        "view_analytics"
      ]
    },
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**Permissions**: Authenticated user


**Error Cases**:
- **401 Unauthorized**: Invalid or expired token

---

### 1.3 Refresh Token

**Route**: `POST /api/v1/auth/refresh`

**Purpose**: Refresh expired JWT token

**Request Body**:
```json
{
  "refresh_token": "refresh_token_string"
}
```

**Response** (200):
```json
{
  "data": {
    "access_token": "new_jwt_token",
    "token_type": "bearer",
    "expires_in": 3600
  }
}
```

**Permissions**: Valid refresh token

**Error Cases**:
- **401 Unauthorized**: Invalid or expired refresh token

---

## 2. Fleet Service - Vehicles

### 2.1 List Vehicles

**Route**: `GET /api/v1/vehicles`

**Purpose**: Retrieve list of vehicles with filtering, search, and pagination

**Query Parameters**:
- `page`: integer, default 1
- `per_page`: integer, default 20, max 100
- `status`: enum (Available, On Trip, In Shop, Retired)
- `fuel_type`: string (Diesel, Petrol, CNG, Electric)
- `year`: integer
- `search`: string (search by registration, make, model)
- `sort_by`: string (registration_number, health_score, created_at)
- `sort_order`: string (asc, desc), default desc

**Request Body**: None

**Response** (200):
```json
{
  "data": [
    {
      "id": "vehicle-uuid",
      "registration_number": "MH12AB1234",
      "make": "Tata",
      "model": "Ace",
      "year": 2023,
      "capacity_kg": 1500.00,
      "fuel_type": "Diesel",
      "status": "Available",
      "acquisition_cost": 500000.00,
      "fuel_efficiency": 18.50,
      "health_score": 95,
      "is_active": true,
      "created_by": {
        "id": "user-uuid",
        "username": "fleet_manager_1"
      },
      "created_at": "2024-01-10T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 45,
    "pages": 3
  }
}
```

**Permissions**: 
- Fleet_Manager: Full access
- Dispatcher: View only
- Safety_Officer: View only
- Financial_Analyst: View only

**Error Cases**:
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Insufficient permissions
- **422 Validation Error**: Invalid query parameters

---

### 2.2 Get Vehicle by ID

**Route**: `GET /api/v1/vehicles/{id}`

**Purpose**: Retrieve detailed information for a specific vehicle

**Path Parameters**:
- `id`: UUID of the vehicle

**Request Body**: None

**Response** (200):
```json
{
  "data": {
    "id": "vehicle-uuid",
    "registration_number": "MH12AB1234",
    "make": "Tata",
    "model": "Ace",
    "year": 2023,
    "capacity_kg": 1500.00,
    "fuel_type": "Diesel",
    "status": "Available",
    "acquisition_cost": 500000.00,
    "fuel_efficiency": 18.50,
    "health_score": 95,
    "is_active": true,
    "created_by": {
      "id": "user-uuid",
      "username": "fleet_manager_1"
    },
    "created_at": "2024-01-10T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z",
    "documents": [
      {
        "id": "doc-uuid",
        "document_type": "insurance",
        "document_number": "INS12345",
        "expiry_date": "2025-01-10",
        "uploaded_by": "user-uuid"
      }
    ]
  }
}
```

**Permissions**: All roles (view access)

**Error Cases**:
- **401 Unauthorized**: Missing or invalid token
- **404 Not Found**: Vehicle not found
  ```json
  {
    "error": "Vehicle not found",
    "code": "RESOURCE_NOT_FOUND"
  }
  ```

---

### 2.3 Create Vehicle

**Route**: `POST /api/v1/vehicles`

**Purpose**: Register a new vehicle in the fleet

**Request Body**:
```json
{
  "registration_number": "MH12AB1234",
  "make": "Tata",
  "model": "Ace",
  "year": 2023,
  "capacity_kg": 1500.00,
  "fuel_type": "Diesel",
  "acquisition_cost": 500000.00,
  "fuel_efficiency": 18.50
}
```

**Validation Rules**:
- `registration_number`: Required, string, 5-20 chars, unique, alphanumeric
- `make`: Required, string, 1-50 chars
- `model`: Required, string, 1-50 chars
- `year`: Required, integer, 1900 <= year <= current_year + 1
- `capacity_kg`: Required, decimal, > 0
- `fuel_type`: Required, enum (Diesel, Petrol, CNG, Electric)
- `acquisition_cost`: Required, decimal, >= 0
- `fuel_efficiency`: Optional, decimal, > 0

**Response** (201):
```json
{
  "data": {
    "id": "new-vehicle-uuid",
    "registration_number": "MH12AB1234",
    "make": "Tata",
    "model": "Ace",
    "year": 2023,
    "capacity_kg": 1500.00,
    "fuel_type": "Diesel",
    "status": "Available",
    "acquisition_cost": 500000.00,
    "fuel_efficiency": 18.50,
    "health_score": 100,
    "is_active": true,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  "message": "Vehicle registered successfully"
}
```

**Permissions**: Fleet_Manager only

**Error Cases**:
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: User is not Fleet_Manager
- **422 Validation Error**: 
  - Duplicate registration number
  ```json
  {
    "error": "Validation failed",
    "errors": [
      {
        "field": "registration_number",
        "message": "Vehicle with registration number MH12AB1234 already exists",
        "code": "DUPLICATE_REGISTRATION"
      }
    ]
  }
  ```
  - Invalid field values
- **500 Internal Server Error**: Database error

**Business Rules**:
- Registration number must be unique
- Initial status is "Available"
- Initial health_score is 100
- Generates VEHICLE_CREATED event

---

### 2.4 Update Vehicle

**Route**: `PUT /api/v1/vehicles/{id}`

**Purpose**: Update vehicle information (except status)

**Path Parameters**:
- `id`: UUID of the vehicle

**Request Body**:
```json
{
  "make": "Tata",
  "model": "Ace XL",
  "year": 2023,
  "capacity_kg": 1800.00,
  "fuel_type": "Diesel",
  "acquisition_cost": 550000.00,
  "fuel_efficiency": 19.00
}
```

**Validation Rules**: Same as Create Vehicle (except registration_number is immutable)

**Response** (200):
```json
{
  "data": {
    "id": "vehicle-uuid",
    "registration_number": "MH12AB1234",
    "make": "Tata",
    "model": "Ace XL",
    "year": 2023,
    "capacity_kg": 1800.00,
    "fuel_type": "Diesel",
    "status": "Available",
    "acquisition_cost": 550000.00,
    "fuel_efficiency": 19.00,
    "health_score": 95,
    "is_active": true,
    "updated_at": "2024-01-15T11:00:00Z"
  },
  "message": "Vehicle updated successfully"
}
```

**Permissions**: Fleet_Manager only

**Error Cases**:
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: User is not Fleet_Manager
- **404 Not Found**: Vehicle not found
- **422 Validation Error**: Invalid field values

**Business Rules**:
- Cannot update registration_number (immutable)
- Cannot update status via this endpoint (use PATCH /vehicles/{id}/status)
- Generates VEHICLE_UPDATED event

---

### 2.5 Update Vehicle Status

**Route**: `PATCH /api/v1/vehicles/{id}/status`

**Purpose**: Change vehicle operational status

**Path Parameters**:
- `id`: UUID of the vehicle

**Request Body**:
```json
{
  "status": "In Shop",
  "reason": "Scheduled maintenance"
}
```

**Validation Rules**:
- `status`: Required, enum (Available, On Trip, In Shop, Retired)
- `reason`: Optional, string, max 500 chars

**Response** (200):
```json
{
  "data": {
    "id": "vehicle-uuid",
    "registration_number": "MH12AB1234",
    "status": "In Shop",
    "updated_at": "2024-01-15T11:00:00Z"
  },
  "message": "Vehicle status updated successfully"
}
```

**Permissions**: Fleet_Manager, System (for automated status changes)

**Error Cases**:
- **400 Bad Request**: Invalid state transition
  ```json
  {
    "error": "Invalid state transition",
    "detail": "Cannot transition from 'Retired' to 'Available'",
    "code": "INVALID_STATE_TRANSITION"
  }
  ```
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Vehicle not found

**Business Rules**:
- Valid transitions: Available ↔ On Trip, Available ↔ In Shop, Available → Retired
- Retired is terminal state (no transitions out)
- Status changes via trip dispatch/completion handled automatically
- Generates VEHICLE_STATUS_CHANGED event

---

### 2.6 Delete Vehicle (Soft Delete)

**Route**: `DELETE /api/v1/vehicles/{id}`

**Purpose**: Soft delete a vehicle (set is_active = false)

**Path Parameters**:
- `id`: UUID of the vehicle

**Request Body**: None

**Response** (204): No content

**Permissions**: Fleet_Manager only

**Error Cases**:
- **400 Bad Request**: Vehicle has active trips
  ```json
  {
    "error": "Cannot delete vehicle with active trips",
    "code": "VEHICLE_HAS_ACTIVE_TRIPS"
  }
  ```
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Vehicle not found

**Business Rules**:
- Cannot delete vehicle with status "On Trip"
- Cannot delete if active maintenance exists
- Soft delete only (preserves audit trail)

---

### 2.7 Get Available Vehicles

**Route**: `GET /api/v1/vehicles/available`

**Purpose**: Retrieve list of vehicles available for dispatch

**Query Parameters**:
- `min_capacity`: decimal (filter by minimum capacity)

**Request Body**: None

**Response** (200):
```json
{
  "data": [
    {
      "id": "vehicle-uuid",
      "registration_number": "MH12AB1234",
      "make": "Tata",
      "model": "Ace",
      "capacity_kg": 1500.00,
      "fuel_type": "Diesel",
      "fuel_efficiency": 18.50,
      "health_score": 95,
      "status": "Available"
    }
  ]
}
```

**Permissions**: Fleet_Manager, Dispatcher

**Error Cases**:
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Insufficient permissions

**Business Rules**:
- Only returns vehicles with status = "Available" and is_active = true
- Filters out retired or in-shop vehicles
- Used for dispatch recommendations

---

## 3. Fleet Service - Drivers

### 3.1 List Drivers

**Route**: `GET /api/v1/drivers`

**Purpose**: Retrieve list of drivers with filtering and pagination

**Query Parameters**:
- `page`: integer, default 1
- `per_page`: integer, default 20, max 100
- `status`: enum (Available, On Trip, Off Duty, Suspended)
- `search`: string (search by name, license_number)
- `license_expiry_before`: date (filter by license expiry date)

**Request Body**: None

**Response** (200):
```json
{
  "data": [
    {
      "id": "driver-uuid",
      "name": "John Doe",
      "license_number": "DL1234567890",
      "license_expiry": "2025-12-31",
      "phone": "+911234567890",
      "email": "john.doe@example.com",
      "hire_date": "2022-01-15",
      "status": "Available",
      "safety_score": 98,
      "is_active": true,
      "created_at": "2022-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 30,
    "pages": 2
  }
}
```

**Permissions**: Fleet_Manager, Dispatcher, Safety_Officer (view only)

**Error Cases**:
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Insufficient permissions

---

### 3.2 Get Driver by ID

**Route**: `GET /api/v1/drivers/{id}`

**Purpose**: Retrieve detailed information for a specific driver

**Path Parameters**:
- `id`: UUID of the driver

**Request Body**: None

**Response** (200):
```json
{
  "data": {
    "id": "driver-uuid",
    "name": "John Doe",
    "license_number": "DL1234567890",
    "license_expiry": "2025-12-31",
    "phone": "+911234567890",
    "email": "john.doe@example.com",
    "hire_date": "2022-01-15",
    "status": "Available",
    "safety_score": 98,
    "is_active": true,
    "created_at": "2022-01-15T10:00:00Z",
    "documents": [
      {
        "id": "doc-uuid",
        "document_type": "license",
        "document_number": "DL1234567890",
        "expiry_date": "2025-12-31"
      }
    ]
  }
}
```

**Permissions**: Fleet_Manager, Dispatcher, Safety_Officer

**Error Cases**:
- **401 Unauthorized**: Missing or invalid token
- **404 Not Found**: Driver not found

---

### 3.3 Create Driver

**Route**: `POST /api/v1/drivers`

**Purpose**: Register a new driver

**Request Body**:
```json
{
  "name": "John Doe",
  "license_number": "DL1234567890",
  "license_expiry": "2025-12-31",
  "phone": "+911234567890",
  "email": "john.doe@example.com",
  "hire_date": "2024-01-15"
}
```

**Validation Rules**:
- `name`: Required, string, 3-100 chars
- `license_number`: Required, string, 5-50 chars, unique, alphanumeric
- `license_expiry`: Required, date, must be > today
- `phone`: Required, string, valid phone format
- `email`: Optional, string, valid email format
- `hire_date`: Required, date, <= today

**Response** (201):
```json
{
  "data": {
    "id": "new-driver-uuid",
    "name": "John Doe",
    "license_number": "DL1234567890",
    "license_expiry": "2025-12-31",
    "phone": "+911234567890",
    "email": "john.doe@example.com",
    "hire_date": "2024-01-15",
    "status": "Available",
    "safety_score": 100,
    "is_active": true,
    "created_at": "2024-01-15T10:30:00Z"
  },
  "message": "Driver registered successfully"
}
```

**Permissions**: Fleet_Manager only

**Error Cases**:
- **403 Forbidden**: User is not Fleet_Manager
- **422 Validation Error**: 
  - Duplicate license number
  - Expired license
  - Invalid hire date

**Business Rules**:
- License number must be unique
- Initial status is "Available"
- Initial safety_score is 100
- Generates DRIVER_CREATED event

---

### 3.4 Get Available Drivers

**Route**: `GET /api/v1/drivers/available`

**Purpose**: Retrieve list of drivers available for dispatch

**Request Body**: None

**Response** (200):
```json
{
  "data": [
    {
      "id": "driver-uuid",
      "name": "John Doe",
      "license_number": "DL1234567890",
      "license_expiry": "2025-12-31",
      "safety_score": 98,
      "status": "Available"
    }
  ]
}
```

**Permissions**: Fleet_Manager, Dispatcher

**Error Cases**:
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Insufficient permissions

**Business Rules**:
- Only returns drivers with status = "Available" and is_active = true
- Filters out expired licenses
- Filters out suspended drivers

---

## 4. Operations Service - Trips

### 4.1 List Trips

**Route**: `GET /api/v1/trips`

**Purpose**: Retrieve list of trips with filtering and pagination

**Query Parameters**:
- `page`: integer, default 1
- `per_page`: integer, default 20, max 100
- `status`: enum (Draft, Dispatched, Completed, Cancelled)
- `vehicle_id`: UUID
- `driver_id`: UUID
- `date_from`: date
- `date_to`: date

**Request Body**: None

**Response** (200):
```json
{
  "data": [
    {
      "id": "trip-uuid",
      "origin": "Mumbai",
      "destination": "Pune",
      "distance_km": 150.00,
      "cargo_weight_kg": 1200.00,
      "cargo_description": "Electronics",
      "vehicle": {
        "id": "vehicle-uuid",
        "registration_number": "MH12AB1234"
      },
      "driver": {
        "id": "driver-uuid",
        "name": "John Doe"
      },
      "status": "Dispatched",
      "revenue": 15000.00,
      "dispatched_at": "2024-01-15T08:00:00Z",
      "created_at": "2024-01-14T15:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "pages": 8
  }
}
```

**Permissions**: All roles (view access)

---

### 4.2 Create Trip

**Route**: `POST /api/v1/trips`

**Purpose**: Create a new trip in Draft status


**Request Body**:
```json
{
  "origin": "Mumbai",
  "destination": "Pune",
  "distance_km": 150.00,
  "cargo_weight_kg": 1200.00,
  "cargo_description": "Electronics",
  "revenue": 15000.00
}
```

**Validation Rules**:
- `origin`: Required, string, 1-200 chars
- `destination`: Required, string, 1-200 chars
- `distance_km`: Required, decimal, > 0
- `cargo_weight_kg`: Required, decimal, > 0
- `cargo_description`: Optional, string, max 1000 chars
- `revenue`: Optional, decimal, >= 0

**Response** (201):
```json
{
  "data": {
    "id": "new-trip-uuid",
    "origin": "Mumbai",
    "destination": "Pune",
    "distance_km": 150.00,
    "cargo_weight_kg": 1200.00,
    "cargo_description": "Electronics",
    "vehicle_id": null,
    "driver_id": null,
    "status": "Draft",
    "revenue": 15000.00,
    "created_at": "2024-01-15T10:30:00Z"
  },
  "message": "Trip created successfully"
}
```

**Permissions**: Fleet_Manager, Dispatcher

**Error Cases**:
- **403 Forbidden**: Insufficient permissions
- **422 Validation Error**: Invalid field values

**Business Rules**:
- Initial status is "Draft"
- Vehicle and driver are null until dispatch
- Generates TRIP_CREATED event

---

### 4.3 Dispatch Trip

**Route**: `POST /api/v1/trips/{id}/dispatch`

**Purpose**: Assign vehicle and driver to trip and change status to Dispatched

**Path Parameters**:
- `id`: UUID of the trip

**Request Body**:
```json
{
  "vehicle_id": "vehicle-uuid",
  "driver_id": "driver-uuid"
}
```

**Validation Rules**:
- `vehicle_id`: Required, UUID, must exist
- `driver_id`: Required, UUID, must exist

**Response** (200):
```json
{
  "data": {
    "id": "trip-uuid",
    "origin": "Mumbai",
    "destination": "Pune",
    "distance_km": 150.00,
    "cargo_weight_kg": 1200.00,
    "vehicle": {
      "id": "vehicle-uuid",
      "registration_number": "MH12AB1234",
      "status": "On Trip"
    },
    "driver": {
      "id": "driver-uuid",
      "name": "John Doe",
      "status": "On Trip"
    },
    "status": "Dispatched",
    "dispatched_at": "2024-01-15T10:35:00Z"
  },
  "message": "Trip dispatched successfully"
}
```

**Permissions**: Fleet_Manager, Dispatcher

**Error Cases**:
- **400 Bad Request**: Business rule violation
  ```json
  {
    "error": "Dispatch validation failed",
    "detail": "Cargo weight (1500 kg) exceeds vehicle capacity (1200 kg)",
    "code": "CAPACITY_EXCEEDED"
  }
  ```
  
  Other validation errors:
  - `VEHICLE_NOT_AVAILABLE`: Vehicle status is not Available
  - `DRIVER_NOT_AVAILABLE`: Driver status is not Available
  - `LICENSE_EXPIRED`: Driver license is expired
  - `VEHICLE_NOT_FOUND`: Vehicle does not exist
  - `DRIVER_NOT_FOUND`: Driver does not exist
  - `TRIP_ALREADY_DISPATCHED`: Trip is not in Draft status

- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Trip not found

**Business Rules**:
- Trip status must be "Draft"
- Cargo weight must be <= vehicle capacity
- Vehicle status must be "Available"
- Driver status must be "Available"
- Driver license must not be expired
- On success:
  - Trip status → "Dispatched"
  - Vehicle status → "On Trip"
  - Driver status → "On Trip"
  - Set dispatched_at timestamp
- Generates TRIP_DISPATCHED event with full metadata

---

### 4.4 Complete Trip

**Route**: `POST /api/v1/trips/{id}/complete`

**Purpose**: Mark trip as completed and return resources to available

**Path Parameters**:
- `id`: UUID of the trip

**Request Body**: None (or optional completion details)

**Response** (200):
```json
{
  "data": {
    "id": "trip-uuid",
    "status": "Completed",
    "completed_at": "2024-01-15T14:30:00Z",
    "vehicle": {
      "id": "vehicle-uuid",
      "status": "Available"
    },
    "driver": {
      "id": "driver-uuid",
      "status": "Available"
    }
  },
  "message": "Trip completed successfully"
}
```

**Permissions**: Fleet_Manager, Dispatcher

**Error Cases**:
- **400 Bad Request**: Trip is not in "Dispatched" status
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Trip not found

**Business Rules**:
- Trip status must be "Dispatched"
- On success:
  - Trip status → "Completed"
  - Vehicle status → "Available"
  - Driver status → "Available"
  - Set completed_at timestamp
- Generates TRIP_COMPLETED event

---

### 4.5 Cancel Trip

**Route**: `POST /api/v1/trips/{id}/cancel`

**Purpose**: Cancel a trip and return resources to available (if dispatched)

**Path Parameters**:
- `id`: UUID of the trip

**Request Body**:
```json
{
  "reason": "Customer cancelled order"
}
```

**Response** (200):
```json
{
  "data": {
    "id": "trip-uuid",
    "status": "Cancelled",
    "vehicle": {
      "id": "vehicle-uuid",
      "status": "Available"
    },
    "driver": {
      "id": "driver-uuid",
      "status": "Available"
    }
  },
  "message": "Trip cancelled successfully"
}
```

**Permissions**: Fleet_Manager, Dispatcher

**Error Cases**:
- **400 Bad Request**: Trip is already Completed
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Trip not found

**Business Rules**:
- Can cancel from "Draft" or "Dispatched" status
- Cannot cancel "Completed" trips
- If dispatched:
  - Vehicle status → "Available"
  - Driver status → "Available"
- Generates TRIP_CANCELLED event

---

## 5. Operations Service - Maintenance

### 5.1 List Maintenance Logs

**Route**: `GET /api/v1/maintenance`

**Purpose**: Retrieve maintenance logs with filtering

**Query Parameters**:
- `page`: integer, default 1
- `per_page`: integer, default 20
- `vehicle_id`: UUID
- `status`: enum (Active, Completed)
- `maintenance_type`: string

**Request Body**: None

**Response** (200):
```json
{
  "data": [
    {
      "id": "maintenance-uuid",
      "vehicle": {
        "id": "vehicle-uuid",
        "registration_number": "MH12AB1234"
      },
      "maintenance_type": "Scheduled",
      "description": "500 km service",
      "scheduled_date": "2024-01-20",
      "status": "Active",
      "cost": null,
      "completed_at": null,
      "created_at": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 50,
    "pages": 3
  }
}
```

**Permissions**: Fleet_Manager (full), Others (view only)

---

### 5.2 Create Maintenance Request

**Route**: `POST /api/v1/maintenance`

**Purpose**: Open maintenance request for a vehicle


**Request Body**:
```json
{
  "vehicle_id": "vehicle-uuid",
  "maintenance_type": "Scheduled",
  "description": "500 km service",
  "scheduled_date": "2024-01-20"
}
```

**Validation Rules**:
- `vehicle_id`: Required, UUID, must exist
- `maintenance_type`: Required, enum (Scheduled, Breakdown, Inspection)
- `description`: Optional, string, max 1000 chars
- `scheduled_date`: Required, date

**Response** (201):
```json
{
  "data": {
    "id": "new-maintenance-uuid",
    "vehicle": {
      "id": "vehicle-uuid",
      "registration_number": "MH12AB1234",
      "status": "In Shop"
    },
    "maintenance_type": "Scheduled",
    "description": "500 km service",
    "scheduled_date": "2024-01-20",
    "status": "Active",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "message": "Maintenance request created successfully"
}
```

**Permissions**: Fleet_Manager

**Error Cases**:
- **400 Bad Request**: Vehicle is already in maintenance
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Vehicle not found
- **422 Validation Error**: Invalid maintenance_type

**Business Rules**:
- Vehicle status transitions to "In Shop"
- Cannot create if vehicle already has active maintenance
- Initial status is "Active"
- Generates MAINTENANCE_OPENED event

---

### 5.3 Complete Maintenance

**Route**: `POST /api/v1/maintenance/{id}/complete`

**Purpose**: Mark maintenance as completed and return vehicle to service

**Path Parameters**:
- `id`: UUID of the maintenance log

**Request Body**:
```json
{
  "cost": 5000.00
}
```

**Validation Rules**:
- `cost`: Required, decimal, >= 0

**Response** (200):
```json
{
  "data": {
    "id": "maintenance-uuid",
    "vehicle": {
      "id": "vehicle-uuid",
      "registration_number": "MH12AB1234",
      "status": "Available"
    },
    "status": "Completed",
    "cost": 5000.00,
    "completed_at": "2024-01-20T15:00:00Z"
  },
  "message": "Maintenance completed successfully"
}
```

**Permissions**: Fleet_Manager

**Error Cases**:
- **400 Bad Request**: Maintenance is not Active
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Maintenance not found

**Business Rules**:
- Maintenance status must be "Active"
- Vehicle status transitions to "Available"
- Sets completed_at timestamp
- Records maintenance cost
- Generates MAINTENANCE_CLOSED event

---

## 6. Operations Service - Fuel & Expenses

### 6.1 Create Fuel Log

**Route**: `POST /api/v1/fuel`

**Purpose**: Log fuel consumption for a vehicle

**Request Body**:
```json
{
  "vehicle_id": "vehicle-uuid",
  "quantity_liters": 45.50,
  "cost": 5005.00,
  "odometer_reading": 15250.00
}
```

**Validation Rules**:
- `vehicle_id`: Required, UUID, must exist
- `quantity_liters`: Required, decimal, > 0
- `cost`: Required, decimal, > 0
- `odometer_reading`: Required, decimal, > 0

**Response** (201):
```json
{
  "data": {
    "id": "fuel-log-uuid",
    "vehicle": {
      "id": "vehicle-uuid",
      "registration_number": "MH12AB1234"
    },
    "quantity_liters": 45.50,
    "cost": 5005.00,
    "odometer_reading": 15250.00,
    "cost_per_unit": 110.00,
    "created_at": "2024-01-15T11:00:00Z"
  },
  "message": "Fuel log created successfully"
}
```

**Permissions**: Fleet_Manager, Dispatcher

**Error Cases**:
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Vehicle not found
- **422 Validation Error**: Invalid values

**Business Rules**:
- Calculates cost_per_unit automatically (cost / quantity_liters)
- Immutable record (no updates after creation)
- Generates FUEL_LOGGED event

---

### 6.2 List Fuel Logs

**Route**: `GET /api/v1/fuel`

**Purpose**: Retrieve fuel logs with filtering

**Query Parameters**:
- `vehicle_id`: UUID
- `date_from`: date
- `date_to`: date
- `page`: integer
- `per_page`: integer

**Request Body**: None

**Response** (200):
```json
{
  "data": [
    {
      "id": "fuel-log-uuid",
      "vehicle": {
        "id": "vehicle-uuid",
        "registration_number": "MH12AB1234"
      },
      "quantity_liters": 45.50,
      "cost": 5005.00,
      "odometer_reading": 15250.00,
      "cost_per_unit": 110.00,
      "created_at": "2024-01-15T11:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 200,
    "pages": 10
  }
}
```

**Permissions**: All roles (view access)

---

### 6.3 Create Expense

**Route**: `POST /api/v1/expenses`

**Purpose**: Log an operational expense


**Request Body**:
```json
{
  "vehicle_id": "vehicle-uuid",
  "expense_type": "tolls",
  "amount": 350.00,
  "description": "Mumbai-Pune toll charges"
}
```

**Validation Rules**:
- `vehicle_id`: Required, UUID, must exist
- `expense_type`: Required, enum (tolls, repairs, other)
- `amount`: Required, decimal, > 0
- `description`: Optional, string, max 500 chars

**Response** (201):
```json
{
  "data": {
    "id": "expense-uuid",
    "vehicle": {
      "id": "vehicle-uuid",
      "registration_number": "MH12AB1234"
    },
    "expense_type": "tolls",
    "amount": 350.00,
    "description": "Mumbai-Pune toll charges",
    "created_at": "2024-01-15T11:00:00Z"
  },
  "message": "Expense logged successfully"
}
```

**Permissions**: Fleet_Manager, Dispatcher, Financial_Analyst

**Error Cases**:
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Vehicle not found
- **422 Validation Error**: Invalid expense_type or amount

**Business Rules**:
- Immutable record (no updates after creation)
- Generates EXPENSE_LOGGED event

---

## 7. Intelligence Service - Dashboard

### 7.1 Get Dashboard Summary

**Route**: `GET /api/v1/dashboard/summary`

**Purpose**: Retrieve aggregated dashboard metrics in a single API call

**Query Parameters**: None

**Request Body**: None

**Response** (200):
```json
{
  "data": {
    "metrics": {
      "total_vehicles": 50,
      "active_vehicles": 42,
      "vehicles_on_trip": 18,
      "vehicles_in_shop": 3,
      "vehicles_retired": 5,
      "total_drivers": 30,
      "drivers_on_duty": 20,
      "active_trips": 18,
      "pending_trips": 5,
      "fleet_utilization": 75.5,
      "maintenance_count": 3
    },
    "active_trips": [
      {
        "id": "trip-uuid",
        "origin": "Mumbai",
        "destination": "Pune",
        "vehicle": {
          "id": "vehicle-uuid",
          "registration_number": "MH12AB1234"
        },
        "driver": {
          "id": "driver-uuid",
          "name": "John Doe"
        },
        "dispatched_at": "2024-01-15T08:00:00Z",
        "expected_completion": "2024-01-15T14:00:00Z"
      }
    ],
    "alerts": [
      {
        "id": "alert-uuid",
        "type": "LICENSE_EXPIRING",
        "severity": "HIGH",
        "message": "Driver license expiring in 15 days",
        "entity_type": "Driver",
        "entity_id": "driver-uuid",
        "entity_name": "John Doe",
        "created_at": "2024-01-15T08:00:00Z"
      }
    ],
    "recent_activity": [
      {
        "id": "event-uuid",
        "event_type": "TRIP_DISPATCHED",
        "entity_type": "Trip",
        "entity_id": "trip-uuid",
        "performed_by": {
          "id": "user-uuid",
          "username": "dispatcher_1"
        },
        "timestamp": "2024-01-15T10:35:00Z",
        "summary": "Trip dispatched from Mumbai to Pune"
      }
    ]
  }
}
```

**Permissions**: All roles (data filtered by role)

**Error Cases**:
- **401 Unauthorized**: Missing or invalid token

**Business Rules**:
- Single endpoint for all dashboard data (performance optimization)
- Data filtered based on user role
- Fleet utilization calculated as: (vehicles_on_trip / active_vehicles) * 100
- Recent activity limited to last 10 events

---

## 8. Intelligence Service - Analytics

### 8.1 Get Fleet Health Summary

**Route**: `GET /api/v1/analytics/health`

**Purpose**: Retrieve fleet health scores and risk analysis

**Query Parameters**: None

**Request Body**: None

**Response** (200):
```json
{
  "data": {
    "fleet_health_summary": {
      "average_health_score": 82.5,
      "healthy_vehicles": 35,
      "at_risk_vehicles": 12,
      "critical_vehicles": 3
    },
    "vehicles": [
      {
        "id": "vehicle-uuid",
        "registration_number": "MH12AB1234",
        "health_score": 95,
        "risk_level": "Healthy",
        "factors": {
          "maintenance_status": "Current",
          "age_years": 2,
          "maintenance_frequency": 2,
          "fuel_efficiency": "Above average"
        }
      }
    ]
  }
}
```

**Permissions**: Fleet_Manager, Dispatcher (view access)

**Error Cases**:
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Insufficient permissions

**Business Rules**:
- Health score calculated per vehicle:
  - Base score: 100
  - Deduct 20 if overdue maintenance
  - Deduct 10 if age > 5 years
  - Deduct 15 if maintenance frequency > 4/year
  - Deduct 10 if fuel efficiency below fleet average
  - Minimum score: 0
- Risk levels: Healthy (90-100), Moderate (70-89), Warning (50-69), Critical (0-49)

---

### 8.2 Get Compliance Summary

**Route**: `GET /api/v1/analytics/compliance`

**Purpose**: Retrieve compliance status for all vehicles and drivers

**Query Parameters**: None

**Request Body**: None

**Response** (200):
```json
{
  "data": {
    "compliance_summary": {
      "total_items": 150,
      "compliant": 120,
      "expiring_soon": 20,
      "expired": 10
    },
    "expiring_documents": [
      {
        "entity_type": "Driver",
        "entity_id": "driver-uuid",
        "entity_name": "John Doe",
        "document_type": "license",
        "expiry_date": "2024-02-01",
        "days_until_expiry": 17,
        "status": "EXPIRING"
      },
      {
        "entity_type": "Vehicle",
        "entity_id": "vehicle-uuid",
        "entity_name": "MH12AB1234",
        "document_type": "insurance",
        "expiry_date": "2024-01-20",
        "days_until_expiry": 5,
        "status": "CRITICAL"
      }
    ]
  }
}
```

**Permissions**: Fleet_Manager, Safety_Officer

**Error Cases**:
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Insufficient permissions

**Business Rules**:
- Expiring soon: within 30 days
- Critical: within 7 days
- Expired: past expiry date
- Tracks: driver licenses, vehicle insurance, permits, fitness certificates, PUC

---

### 8.3 Get Cost Intelligence

**Route**: `GET /api/v1/analytics/costs`

**Purpose**: Retrieve cost analysis and optimization insights

**Query Parameters**:
- `date_from`: date (default: 30 days ago)
- `date_to`: date (default: today)

**Request Body**: None

**Response** (200):
```json
{
  "data": {
    "cost_summary": {
      "total_cost": 500000.00,
      "fuel_cost": 300000.00,
      "maintenance_cost": 150000.00,
      "other_expenses": 50000.00,
      "average_cost_per_km": 15.50,
      "average_cost_per_trip": 2500.00
    },
    "highest_cost_vehicles": [
      {
        "vehicle_id": "vehicle-uuid",
        "registration_number": "MH12AB1234",
        "total_cost": 25000.00,
        "fuel_cost": 15000.00,
        "maintenance_cost": 8000.00,
        "other_expenses": 2000.00
      }
    ],
    "lowest_roi_vehicles": [
      {
        "vehicle_id": "vehicle-uuid",
        "registration_number": "MH12AB5678",
        "total_revenue": 50000.00,
        "total_cost": 60000.00,
        "roi_percentage": -16.67
      }
    ],
    "insights": [
      {
        "type": "FUEL_OVERSPEND",
        "severity": "MEDIUM",
        "message": "Vehicle MH12AB1234 consuming 20% more fuel than expected",
        "vehicle_id": "vehicle-uuid"
      }
    ]
  }
}
```

**Permissions**: Fleet_Manager, Financial_Analyst

**Error Cases**:
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Insufficient permissions

**Business Rules**:
- Total cost = fuel + maintenance + expenses
- ROI = ((revenue - cost) / cost) * 100
- Cost per km = total cost / total distance traveled
- Fuel overspend detected when consumption > expected (based on distance and vehicle efficiency)

---

## 9. Intelligence Service - Recommendations

### 9.1 Get Dispatch Recommendations

**Route**: `POST /api/v1/recommendations/dispatch`

**Purpose**: Get smart recommendations for vehicle and driver assignment

**Request Body**:
```json
{
  "trip_id": "trip-uuid"
}
```

**Validation Rules**:
- `trip_id`: Required, UUID, must exist and be in Draft status

**Response** (200):
```json
{
  "data": {
    "recommendations": [
      {
        "rank": 1,
        "score": 92.5,
        "vehicle": {
          "id": "vehicle-uuid",
          "registration_number": "MH12AB1234",
          "make": "Tata",
          "model": "Ace",
          "capacity_kg": 1500.00,
          "fuel_efficiency": 18.50,
          "health_score": 95,
          "status": "Available"
        },
        "driver": {
          "id": "driver-uuid",
          "name": "John Doe",
          "license_number": "DL1234567890",
          "safety_score": 98,
          "status": "Available"
        },
        "reasoning": {
          "capacity_match": "Excellent (80% utilization)",
          "fuel_efficiency": "Above fleet average",
          "health_score": "Healthy vehicle",
          "availability": "Immediately available",
          "driver_safety": "Excellent safety record"
        },
        "score_breakdown": {
          "capacity_match_score": 38.0,
          "fuel_efficiency_score": 28.5,
          "health_score": 19.0,
          "availability_score": 7.0
        }
      },
      {
        "rank": 2,
        "score": 87.3,
        "vehicle": { /* ... */ },
        "driver": { /* ... */ },
        "reasoning": { /* ... */ },
        "score_breakdown": { /* ... */ }
      }
    ],
    "trip": {
      "id": "trip-uuid",
      "origin": "Mumbai",
      "destination": "Pune",
      "cargo_weight_kg": 1200.00,
      "distance_km": 150.00
    }
  }
}
```

**Permissions**: Dispatcher, Fleet_Manager

**Error Cases**:
- **400 Bad Request**: Trip is not in Draft status
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Trip not found

**Business Rules**:
- Scoring Formula (total = 100):
  - 40% Capacity Match: (cargo_weight / vehicle_capacity) score, optimal at 70-90% utilization
  - 30% Fuel Efficiency: vehicle fuel efficiency relative to fleet average
  - 20% Health Score: vehicle health_score / 100
  - 10% Availability: bonus for immediately available vs scheduled
- Only includes vehicles with:
  - Status = Available
  - Capacity >= cargo_weight
  - is_active = true
- Only includes drivers with:
  - Status = Available
  - License not expired
  - is_active = true
- Returns top 5 recommendations sorted by score descending

---

## 10. Events & Activity Timeline

### 10.1 Get Activity Timeline

**Route**: `GET /api/v1/events`

**Purpose**: Retrieve audit trail of system events


**Query Parameters**:
- `page`: integer, default 1
- `per_page`: integer, default 20, max 100
- `entity_type`: string (Vehicle, Driver, Trip, etc)
- `entity_id`: UUID
- `event_type`: string (TRIP_DISPATCHED, etc)
- `performed_by`: UUID
- `date_from`: date
- `date_to`: date

**Request Body**: None

**Response** (200):
```json
{
  "data": [
    {
      "id": "event-uuid",
      "event_type": "TRIP_DISPATCHED",
      "entity_type": "Trip",
      "entity_id": "trip-uuid",
      "performed_by": {
        "id": "user-uuid",
        "username": "dispatcher_1"
      },
      "metadata": {
        "trip_details": {
          "origin": "Mumbai",
          "destination": "Pune",
          "distance_km": 150,
          "cargo_weight_kg": 1200
        },
        "vehicle": {
          "id": "vehicle-uuid",
          "registration_number": "MH12AB1234",
          "previous_status": "Available",
          "new_status": "On Trip"
        },
        "driver": {
          "id": "driver-uuid",
          "name": "John Doe",
          "previous_status": "Available",
          "new_status": "On Trip"
        }
      },
      "created_at": "2024-01-15T10:35:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 500,
    "pages": 25
  }
}
```

**Permissions**: All roles (view access)

**Error Cases**:
- **401 Unauthorized**: Missing or invalid token

**Business Rules**:
- Events are immutable (cannot be updated or deleted)
- Events ordered by created_at DESC
- Metadata stored as JSONB for flexible structure

---

### 10.2 Get Entity Timeline

**Route**: `GET /api/v1/events/entity/{entity_type}/{entity_id}`

**Purpose**: Retrieve all events for a specific entity

**Path Parameters**:
- `entity_type`: string (Vehicle, Driver, Trip, etc)
- `entity_id`: UUID

**Request Body**: None

**Response** (200):
```json
{
  "data": {
    "entity": {
      "type": "Vehicle",
      "id": "vehicle-uuid",
      "name": "MH12AB1234"
    },
    "events": [
      {
        "id": "event-uuid",
        "event_type": "VEHICLE_CREATED",
        "performed_by": {
          "id": "user-uuid",
          "username": "fleet_manager_1"
        },
        "metadata": { /* creation details */ },
        "created_at": "2024-01-10T10:00:00Z"
      },
      {
        "id": "event-uuid-2",
        "event_type": "VEHICLE_STATUS_CHANGED",
        "performed_by": {
          "id": "user-uuid-2",
          "username": "system"
        },
        "metadata": {
          "previous_status": "Available",
          "new_status": "On Trip",
          "reason": "Trip dispatched"
        },
        "created_at": "2024-01-15T10:35:00Z"
      }
    ]
  }
}
```

**Permissions**: All roles (view access)

**Error Cases**:
- **401 Unauthorized**: Missing or invalid token
- **404 Not Found**: Entity not found

---

## 11. Reports & Export

### 11.1 Export Utilization Report

**Route**: `GET /api/v1/reports/utilization/export`

**Purpose**: Export fleet utilization report to CSV or PDF

**Query Parameters**:
- `format`: enum (csv, pdf), required
- `date_from`: date
- `date_to`: date
- `vehicle_id`: UUID (optional, for single vehicle)

**Request Body**: None

**Response** (200):
- For CSV: `Content-Type: text/csv`, file download
- For PDF: `Content-Type: application/pdf`, file download

**Permissions**: Fleet_Manager, Financial_Analyst

**Error Cases**:
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Insufficient permissions
- **422 Validation Error**: Invalid format or date range

**Business Rules**:
- Report includes: vehicle, total trips, total distance, total operational hours, utilization percentage
- Utilization calculated as: (days with completed trips / total days in range) * 100
- CSV format for spreadsheet analysis
- PDF format for presentations

---

### 11.2 Export Cost Report

**Route**: `GET /api/v1/reports/costs/export`

**Purpose**: Export cost analysis report to CSV or PDF

**Query Parameters**:
- `format`: enum (csv, pdf), required
- `date_from`: date
- `date_to`: date
- `vehicle_id`: UUID (optional)

**Request Body**: None

**Response** (200):
- For CSV: `Content-Type: text/csv`, file download
- For PDF: `Content-Type: application/pdf`, file download

**Permissions**: Fleet_Manager, Financial_Analyst

**Error Cases**:
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Insufficient permissions
- **422 Validation Error**: Invalid format or date range

**Business Rules**:
- Report includes: vehicle, fuel cost, maintenance cost, expense cost, total cost, revenue, ROI
- Costs aggregated for specified date range
- ROI calculated per vehicle

---

## API Implementation Standards

### Request Validation

**Pydantic Schemas**:
- All request bodies validated using Pydantic models
- Type checking and coercion automatic
- Custom validators for business rules

**Example**:
```python
from pydantic import BaseModel, validator, Field
from datetime import date

class VehicleCreate(BaseModel):
    registration_number: str = Field(..., min_length=5, max_length=20)
    make: str = Field(..., min_length=1, max_length=50)
    model: str = Field(..., min_length=1, max_length=50)
    year: int = Field(..., ge=1900)
    capacity_kg: float = Field(..., gt=0)
    fuel_type: str
    acquisition_cost: float = Field(..., ge=0)
    fuel_efficiency: float = Field(None, gt=0)
    
    @validator('fuel_type')
    def validate_fuel_type(cls, v):
        if v not in ['Diesel', 'Petrol', 'CNG', 'Electric']:
            raise ValueError('Invalid fuel type')
        return v
    
    @validator('year')
    def validate_year(cls, v):
        current_year = date.today().year
        if v > current_year + 1:
            raise ValueError('Year cannot be in future')
        return v
```

### Response Serialization

**Pydantic Response Models**:
- Consistent serialization across all endpoints
- Exclude sensitive fields (password_hash)
- DateTime serialization to ISO 8601
- UUID serialization to string

### Error Handling

**Exception Hierarchy**:
```python
class TransitOpsException(Exception):
    """Base exception"""
    pass

class BusinessRuleViolation(TransitOpsException):
    """Business rule validation failed"""
    pass

class ResourceNotFound(TransitOpsException):
    """Resource does not exist"""
    pass

class DispatchValidationError(BusinessRuleViolation):
    """Trip dispatch validation failed"""
    pass
```

**HTTP Exception Mapping**:
- `ResourceNotFound` → 404
- `BusinessRuleViolation` → 400
- `PermissionDenied` → 403
- Validation errors → 422
- Unhandled exceptions → 500

### Authentication Middleware

**JWT Validation**:
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer

security = HTTPBearer()

async def get_current_user(token: str = Depends(security)):
    try:
        payload = decode_jwt(token.credentials)
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401)
        user = get_user_by_id(user_id)
        if not user or not user.is_active:
            raise HTTPException(status_code=401)
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

### RBAC Authorization

**Permission Decorators**:
```python
from functools import wraps

def require_role(*allowed_roles):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, current_user = Depends(get_current_user), **kwargs):
            if current_user.role.name not in allowed_roles:
                raise HTTPException(status_code=403, detail="Insufficient permissions")
            return await func(*args, current_user=current_user, **kwargs)
        return wrapper
    return decorator

# Usage
@router.post("/vehicles")
@require_role("Fleet_Manager")
async def create_vehicle(data: VehicleCreate, current_user: User = Depends(get_current_user)):
    pass
```

---

## Rate Limiting

**Strategy**:
- Authentication endpoints: 5 requests/minute per IP
- Standard endpoints: 100 requests/minute per user
- Report exports: 10 requests/hour per user

**Implementation**: Redis-based token bucket algorithm

---

## API Versioning Strategy

**Current**: `/api/v1/*`

**Future Versions**:
- `/api/v2/*` for breaking changes
- Maintain v1 for backward compatibility (6 months deprecation period)
- Version in URL path (not header) for clarity

---

## CORS Configuration

**Development**:
```python
CORS_ORIGINS = [
    "http://localhost:3000",  # React dev server
    "http://localhost:5173",  # Vite dev server
]
```

**Production**:
```python
CORS_ORIGINS = [
    "https://app.transitops360.com"
]
```

**Settings**:
- Allow credentials: True
- Allow methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
- Allow headers: Authorization, Content-Type

---

## API Documentation

**Automatic Documentation**:
- Swagger UI: `/docs`
- ReDoc: `/redoc`
- OpenAPI JSON: `/openapi.json`

**FastAPI Auto-generates**:
- Request/response schemas
- Validation rules
- Authentication requirements
- Error responses

**Custom Documentation**:
- Add `summary` and `description` to each endpoint
- Add `tags` for grouping
- Add `response_model` for type safety

---

## Testing Strategy

### API Testing

**Unit Tests** (Service Layer):
- Test business logic in isolation
- Mock repository layer
- Verify validation rules

**Integration Tests** (API Endpoints):
```python
from fastapi.testclient import TestClient

def test_create_vehicle(client: TestClient, auth_headers):
    response = client.post(
        "/api/v1/vehicles",
        json={
            "registration_number": "TEST1234",
            "make": "Tata",
            "model": "Ace",
            "year": 2023,
            "capacity_kg": 1500,
            "fuel_type": "Diesel",
            "acquisition_cost": 500000
        },
        headers=auth_headers
    )
    assert response.status_code == 201
    data = response.json()["data"]
    assert data["registration_number"] == "TEST1234"
    assert data["status"] == "Available"
```

**Property-Based Tests** (Business Rules):
- Test dispatch validation with random inputs
- Test cost calculations with varied data
- Test state transitions

---

## Performance Optimization

### Query Optimization

**N+1 Query Prevention**:
```python
# Use SQLAlchemy joinedload
trips = session.query(Trip).options(
    joinedload(Trip.vehicle),
    joinedload(Trip.driver)
).filter(Trip.status == "Dispatched").all()
```

**Pagination**:
```python
# Use offset and limit
vehicles = session.query(Vehicle).offset(skip).limit(limit).all()
```

**Indexing**:
- All foreign keys indexed
- Status fields indexed for filtering
- Composite indexes for common query patterns

### Caching Strategy

**Dashboard Endpoint**:
- Cache for 30 seconds (frequently accessed)
- Invalidate on write operations

**Static Data**:
- Cache role definitions indefinitely
- Cache enum values

**Implementation**: Redis with TTL

---

## Security Best Practices

### Input Sanitization

**SQL Injection Prevention**:
- Use SQLAlchemy ORM (parameterized queries)
- Never concatenate user input into SQL

**XSS Prevention**:
- API returns JSON (not HTML)
- Frontend handles sanitization

### Password Security

**Hashing**:
```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)
```

**Requirements**:
- Minimum 8 characters
- Bcrypt with 12 rounds

### Token Security

**JWT Configuration**:
- Algorithm: HS256
- Expiration: 1 hour
- Secret key from environment variable
- Token rotation on refresh

---

## Deployment Considerations

### Environment Variables

**Required**:
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/transitops360
JWT_SECRET_KEY=your-secret-key-min-32-chars
JWT_ALGORITHM=HS256
JWT_EXPIRATION_MINUTES=60
```

**Optional**:
```env
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
LOG_LEVEL=INFO
REDIS_URL=redis://localhost:6379
```

### Health Check Endpoints

**Liveness Probe**:
```
GET /health
Response: {"status": "ok", "timestamp": "2024-01-15T10:30:00Z"}
```

**Readiness Probe**:
```
GET /health/ready
Response: {
  "status": "ready",
  "database": "connected",
  "redis": "connected"
}
```

---

## API Summary

### Endpoint Count by Service

- **Authentication**: 3 endpoints
- **Vehicles**: 7 endpoints
- **Drivers**: 4 endpoints
- **Trips**: 5 endpoints
- **Maintenance**: 3 endpoints
- **Fuel & Expenses**: 4 endpoints
- **Dashboard**: 1 endpoint
- **Analytics**: 3 endpoints
- **Recommendations**: 1 endpoint
- **Events**: 2 endpoints
- **Reports**: 2 endpoints

**Total**: 35 API endpoints

### HTTP Method Distribution

- **GET**: 18 endpoints (read operations)
- **POST**: 14 endpoints (create, actions)
- **PUT**: 1 endpoint (full update)
- **PATCH**: 1 endpoint (partial update)
- **DELETE**: 1 endpoint (soft delete)

---

## Document Status

**Status**: Complete - Ready for Implementation

**Created**: 2024-01-15

**API Version**: v1

**Framework**: FastAPI

**Authentication**: JWT Bearer Token

This REST API specification provides complete endpoint definitions for implementing the TransitOps360 backend within the 6-hour hackathon timeframe. All endpoints follow RESTful conventions, enforce business rules, and include comprehensive error handling.

**Next Steps**: Implement FastAPI route handlers, service layer, and repository layer following this specification.
