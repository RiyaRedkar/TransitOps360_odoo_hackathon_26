# Database Design Document: TransitOps360

## Overview

This document provides a comprehensive database design for the TransitOps360 fleet operations ERP platform. The design follows PostgreSQL best practices and is optimized for a 6-hour hackathon implementation while maintaining production-quality standards.

### Design Principles

1. **UUID Primary Keys**: All tables use UUID for globally unique identifiers
2. **Audit Trail**: Every table includes created_at, updated_at, created_by fields
3. **Soft Deletes**: Use is_active flag instead of hard deletes for data preservation
4. **Event-Driven**: Dedicated events table for complete audit trail
5. **Referential Integrity**: Foreign keys with appropriate CASCADE/RESTRICT behavior
6. **State Management**: Enums for status fields to prevent invalid values
7. **JSONB for Flexibility**: Metadata stored as JSONB for schema-less data

### Database Strategy

- **RDBMS**: PostgreSQL 14+
- **Migration Tool**: Alembic
- **ORM**: SQLAlchemy 2.0+
- **Connection Pooling**: pgBouncer (production)
- **Backup Strategy**: Point-in-time recovery (PITR)

---

## Complete Entity Relationship Diagram

```mermaid
erDiagram
    users ||--o{ vehicles : creates
    users ||--o{ drivers : creates
    users ||--o{ trips : creates
    users ||--o{ maintenance_logs : creates
    users ||--o{ fuel_logs : creates
    users ||--o{ expenses : creates
    users ||--o{ events : performs
    users }o--|| roles : has
    
    vehicles ||--o{ vehicle_documents : has
    vehicles ||--o{ trips : assigned_to
    vehicles ||--o{ maintenance_logs : has
    vehicles ||--o{ fuel_logs : has
    vehicles ||--o{ expenses : incurs
    
    drivers ||--o{ driver_documents : has
    drivers ||--o{ trips : assigned_to
    
    trips }o--|| vehicles : uses
    trips }o--|| drivers : uses
    
    users {
        uuid id PK
        varchar username UK
        varchar password_hash
        varchar email UK
        uuid role_id FK
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    roles {
        uuid id PK
        varchar name UK
        jsonb permissions
        timestamp created_at
    }
    
    vehicles {
        uuid id PK
        varchar registration_number UK
        varchar make
        varchar model
        integer year
        decimal capacity_kg
        varchar fuel_type
        enum status
        decimal acquisition_cost
        decimal fuel_efficiency
        integer health_score
        uuid created_by FK
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    vehicle_documents {
        uuid id PK
        uuid vehicle_id FK
        varchar document_type
        varchar document_number
        date expiry_date
        varchar file_url
        uuid uploaded_by FK
        timestamp created_at
    }
    
    drivers {
        uuid id PK
        varchar name
        varchar license_number UK
        date license_expiry
        varchar phone
        varchar email
        date hire_date
        enum status
        integer safety_score
        uuid created_by FK
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    driver_documents {
        uuid id PK
        uuid driver_id FK
        varchar document_type
        varchar document_number
        date expiry_date
        varchar file_url
        uuid uploaded_by FK
        timestamp created_at
    }
    
    trips {
        uuid id PK
        varchar origin
        varchar destination
        decimal distance_km
        decimal cargo_weight_kg
        text cargo_description
        uuid vehicle_id FK
        uuid driver_id FK
        enum status
        decimal revenue
        timestamp dispatched_at
        timestamp completed_at
        uuid created_by FK
        timestamp created_at
        timestamp updated_at
    }
    
    maintenance_logs {
        uuid id PK
        uuid vehicle_id FK
        varchar maintenance_type
        text description
        date scheduled_date
        enum status
        decimal cost
        timestamp completed_at
        uuid created_by FK
        timestamp created_at
        timestamp updated_at
    }
    
    fuel_logs {
        uuid id PK
        uuid vehicle_id FK
        decimal quantity_liters
        decimal cost
        decimal odometer_reading
        decimal cost_per_unit
        uuid created_by FK
        timestamp created_at
    }
    
    expenses {
        uuid id PK
        uuid vehicle_id FK
        varchar expense_type
        decimal amount
        text description
        uuid created_by FK
        timestamp created_at
    }
    
    events {
        uuid id PK
        varchar event_type
        varchar entity_type
        uuid entity_id
        uuid performed_by FK
        jsonb metadata
        timestamp created_at
    }
    
    notifications {
        uuid id PK
        uuid user_id FK
        text message
        varchar type
        boolean is_read
        jsonb metadata
        timestamp created_at
    }
```

---

## Table Specifications

### 1. users

**Purpose**: Store user accounts for authentication and authorization

**Fields**:

| Field | Data Type | Constraints | Description |
|-------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique user identifier |
| username | VARCHAR(50) | NOT NULL, UNIQUE | Login username |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| email | VARCHAR(255) | NOT NULL, UNIQUE | User email address |
| role_id | UUID | NOT NULL, FOREIGN KEY → roles(id) | User role for RBAC |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Soft delete flag |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Foreign Keys**:
- `role_id` → `roles(id)` ON DELETE RESTRICT

**Indexes**:
- `idx_users_username` ON username (UNIQUE, for login queries)
- `idx_users_email` ON email (UNIQUE, for lookup/recovery)
- `idx_users_role_id` ON role_id (for RBAC queries)
- `idx_users_is_active` ON is_active (filter active users)

**Relationships**:
- Many-to-One: users → roles
- One-to-Many: users → vehicles (created_by)
- One-to-Many: users → drivers (created_by)
- One-to-Many: users → trips (created_by)
- One-to-Many: users → events (performed_by)

**Constraints**:
- CHECK: LENGTH(username) >= 3
- CHECK: email LIKE '%@%'
- CHECK: LENGTH(password_hash) >= 60 (bcrypt hash length)

---

### 2. roles

**Purpose**: Define user roles and their permissions for RBAC

**Fields**:

| Field | Data Type | Constraints | Description |
|-------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique role identifier |
| name | VARCHAR(50) | NOT NULL, UNIQUE | Role name (Fleet_Manager, Dispatcher, etc) |
| permissions | JSONB | NOT NULL, DEFAULT '[]'::jsonb | Array of permission strings |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |

**Foreign Keys**: None

**Indexes**:
- `idx_roles_name` ON name (UNIQUE, for role lookup)

**Relationships**:
- One-to-Many: roles → users

**Constraints**:
- CHECK: name IN ('Fleet_Manager', 'Dispatcher', 'Safety_Officer', 'Financial_Analyst')

**Sample Data**:
```sql
-- Fleet_Manager: Full access to vehicles, maintenance, analytics
-- Dispatcher: Trip management, vehicle/driver assignment
-- Safety_Officer: Driver management, compliance tracking
-- Financial_Analyst: Cost analysis, ROI, expense tracking
```

---

### 3. vehicles

**Purpose**: Store fleet vehicle records with status and metadata

**Fields**:

| Field | Data Type | Constraints | Description |
|-------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique vehicle identifier |
| registration_number | VARCHAR(20) | NOT NULL, UNIQUE | Vehicle registration plate |
| make | VARCHAR(50) | NOT NULL | Manufacturer (Tata, Mahindra, etc) |
| model | VARCHAR(50) | NOT NULL | Vehicle model |
| year | INTEGER | NOT NULL, CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM NOW())+1) | Manufacturing year |
| capacity_kg | DECIMAL(10,2) | NOT NULL, CHECK (capacity_kg > 0) | Cargo capacity in kilograms |
| fuel_type | VARCHAR(20) | NOT NULL | Diesel, Petrol, CNG, Electric |
| status | vehicle_status_enum | NOT NULL, DEFAULT 'Available' | Current operational status |
| acquisition_cost | DECIMAL(12,2) | NOT NULL, CHECK (acquisition_cost >= 0) | Purchase cost for ROI calculation |
| fuel_efficiency | DECIMAL(5,2) | CHECK (fuel_efficiency > 0) | Kilometers per liter |
| health_score | INTEGER | NOT NULL, DEFAULT 100, CHECK (health_score >= 0 AND health_score <= 100) | Vehicle health (0-100) |
| created_by | UUID | NOT NULL, FOREIGN KEY → users(id) | User who created record |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Soft delete flag |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Enum**: vehicle_status_enum
```sql
CREATE TYPE vehicle_status_enum AS ENUM ('Available', 'On Trip', 'In Shop', 'Retired');
```

**Foreign Keys**:
- `created_by` → `users(id)` ON DELETE SET NULL

**Indexes**:
- `idx_vehicles_registration_number` ON registration_number (UNIQUE, for search)
- `idx_vehicles_status` ON status (filter by availability)
- `idx_vehicles_is_active` ON is_active WHERE is_active = TRUE (active vehicles)
- `idx_vehicles_health_score` ON health_score (sort by health)
- `idx_vehicles_created_by` ON created_by (user's vehicles)

**Relationships**:
- Many-to-One: vehicles → users (created_by)
- One-to-Many: vehicles → vehicle_documents
- One-to-Many: vehicles → trips
- One-to-Many: vehicles → maintenance_logs
- One-to-Many: vehicles → fuel_logs
- One-to-Many: vehicles → expenses

**Constraints**:
- UNIQUE: registration_number
- CHECK: status transitions follow state machine (enforced in application layer)

**State Machine**:
```
Available → On Trip → Available
Available → In Shop → Available
Available → Retired (terminal state)
```

---

### 4. vehicle_documents

**Purpose**: Store vehicle compliance documents with expiry tracking

**Fields**:

| Field | Data Type | Constraints | Description |
|-------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique document identifier |
| vehicle_id | UUID | NOT NULL, FOREIGN KEY → vehicles(id) | Associated vehicle |
| document_type | VARCHAR(50) | NOT NULL | insurance, permit, fitness_certificate, puc |
| document_number | VARCHAR(100) | NOT NULL | Document reference number |
| expiry_date | DATE | NOT NULL | Document expiration date |
| file_url | VARCHAR(500) | | URL to stored document file |
| uploaded_by | UUID | NOT NULL, FOREIGN KEY → users(id) | User who uploaded document |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Upload timestamp |

**Foreign Keys**:
- `vehicle_id` → `vehicles(id)` ON DELETE CASCADE
- `uploaded_by` → `users(id)` ON DELETE SET NULL

**Indexes**:
- `idx_vehicle_docs_vehicle_id` ON vehicle_id (vehicle's documents)
- `idx_vehicle_docs_expiry_date` ON expiry_date (compliance alerts)
- `idx_vehicle_docs_type` ON document_type (filter by type)

**Relationships**:
- Many-to-One: vehicle_documents → vehicles
- Many-to-One: vehicle_documents → users (uploaded_by)

**Constraints**:
- CHECK: document_type IN ('insurance', 'permit', 'fitness_certificate', 'puc')
- CHECK: expiry_date > created_at

---

### 5. drivers

**Purpose**: Store driver records with license and status tracking

**Fields**:

| Field | Data Type | Constraints | Description |
|-------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique driver identifier |
| name | VARCHAR(100) | NOT NULL | Driver full name |
| license_number | VARCHAR(50) | NOT NULL, UNIQUE | Driving license number |
| license_expiry | DATE | NOT NULL | License expiration date |
| phone | VARCHAR(20) | NOT NULL | Contact phone number |
| email | VARCHAR(255) | | Driver email address |
| hire_date | DATE | NOT NULL | Date driver was hired |
| status | driver_status_enum | NOT NULL, DEFAULT 'Available' | Current availability status |
| safety_score | INTEGER | NOT NULL, DEFAULT 100, CHECK (safety_score >= 0 AND safety_score <= 100) | Driver safety rating (0-100) |
| created_by | UUID | NOT NULL, FOREIGN KEY → users(id) | User who created record |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Soft delete flag |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Enum**: driver_status_enum
```sql
CREATE TYPE driver_status_enum AS ENUM ('Available', 'On Trip', 'Off Duty', 'Suspended');
```

**Foreign Keys**:
- `created_by` → `users(id)` ON DELETE SET NULL

**Indexes**:
- `idx_drivers_license_number` ON license_number (UNIQUE, for search)
- `idx_drivers_status` ON status (filter by availability)
- `idx_drivers_license_expiry` ON license_expiry (compliance alerts)
- `idx_drivers_is_active` ON is_active WHERE is_active = TRUE (active drivers)
- `idx_drivers_safety_score` ON safety_score (sort by safety)
- `idx_drivers_created_by` ON created_by (user's drivers)

**Relationships**:
- Many-to-One: drivers → users (created_by)
- One-to-Many: drivers → driver_documents
- One-to-Many: drivers → trips

**Constraints**:
- UNIQUE: license_number
- CHECK: license_expiry > hire_date
- CHECK: phone matches pattern (enforced in application layer)

**State Machine**:
```
Available → On Trip → Available
Available → Off Duty → Available
Available → Suspended → Available
```

---

### 6. driver_documents

**Purpose**: Store driver compliance documents (license, medical certificates)

**Fields**:

| Field | Data Type | Constraints | Description |
|-------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique document identifier |
| driver_id | UUID | NOT NULL, FOREIGN KEY → drivers(id) | Associated driver |
| document_type | VARCHAR(50) | NOT NULL | license, medical_certificate |
| document_number | VARCHAR(100) | NOT NULL | Document reference number |
| expiry_date | DATE | NOT NULL | Document expiration date |
| file_url | VARCHAR(500) | | URL to stored document file |
| uploaded_by | UUID | NOT NULL, FOREIGN KEY → users(id) | User who uploaded document |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Upload timestamp |

**Foreign Keys**:
- `driver_id` → `drivers(id)` ON DELETE CASCADE
- `uploaded_by` → `users(id)` ON DELETE SET NULL

**Indexes**:
- `idx_driver_docs_driver_id` ON driver_id (driver's documents)
- `idx_driver_docs_expiry_date` ON expiry_date (compliance alerts)
- `idx_driver_docs_type` ON document_type (filter by type)

**Relationships**:
- Many-to-One: driver_documents → drivers
- Many-to-One: driver_documents → users (uploaded_by)

**Constraints**:
- CHECK: document_type IN ('license', 'medical_certificate')
- CHECK: expiry_date > created_at

---

### 7. trips

**Purpose**: Store trip records with lifecycle tracking

**Fields**:

| Field | Data Type | Constraints | Description |
|-------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique trip identifier |
| origin | VARCHAR(200) | NOT NULL | Starting location |
| destination | VARCHAR(200) | NOT NULL | Ending location |
| distance_km | DECIMAL(10,2) | NOT NULL, CHECK (distance_km > 0) | Trip distance in kilometers |
| cargo_weight_kg | DECIMAL(10,2) | NOT NULL, CHECK (cargo_weight_kg > 0) | Cargo weight in kilograms |
| cargo_description | TEXT | | Description of cargo |
| vehicle_id | UUID | FOREIGN KEY → vehicles(id) | Assigned vehicle (NULL until dispatch) |
| driver_id | UUID | FOREIGN KEY → drivers(id) | Assigned driver (NULL until dispatch) |
| status | trip_status_enum | NOT NULL, DEFAULT 'Draft' | Current trip status |
| revenue | DECIMAL(12,2) | CHECK (revenue >= 0) | Trip revenue for ROI calculation |
| dispatched_at | TIMESTAMP | | Dispatch timestamp |
| completed_at | TIMESTAMP | | Completion timestamp |
| created_by | UUID | NOT NULL, FOREIGN KEY → users(id) | User who created trip |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Enum**: trip_status_enum
```sql
CREATE TYPE trip_status_enum AS ENUM ('Draft', 'Dispatched', 'Completed', 'Cancelled');
```

**Foreign Keys**:
- `vehicle_id` → `vehicles(id)` ON DELETE RESTRICT
- `driver_id` → `drivers(id)` ON DELETE RESTRICT
- `created_by` → `users(id)` ON DELETE SET NULL

**Indexes**:
- `idx_trips_status` ON status (filter by status)
- `idx_trips_vehicle_id` ON vehicle_id (vehicle's trips)
- `idx_trips_driver_id` ON driver_id (driver's trips)
- `idx_trips_dispatched_at` ON dispatched_at (chronological queries)
- `idx_trips_completed_at` ON completed_at (completion reports)
- `idx_trips_created_at` ON created_at (recent trips)

**Relationships**:
- Many-to-One: trips → vehicles
- Many-to-One: trips → drivers
- Many-to-One: trips → users (created_by)

**Constraints**:
- CHECK: completed_at > dispatched_at (if both NOT NULL)
- CHECK: dispatched_at > created_at (if dispatched_at NOT NULL)
- CHECK: vehicle_id and driver_id are both NULL or both NOT NULL (for status != 'Draft')

**State Machine**:
```
Draft → Dispatched → Completed
Draft → Cancelled
Dispatched → Cancelled
```

**Business Rules** (enforced in application layer):
- Cargo weight ≤ vehicle capacity
- Vehicle status = Available at dispatch
- Driver status = Available at dispatch
- Driver license not expired at dispatch

---

### 8. maintenance_logs

**Purpose**: Track vehicle maintenance requests and completion

**Fields**:

| Field | Data Type | Constraints | Description |
|-------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique maintenance identifier |
| vehicle_id | UUID | NOT NULL, FOREIGN KEY → vehicles(id) | Vehicle being maintained |
| maintenance_type | VARCHAR(50) | NOT NULL | Scheduled, Breakdown, Inspection |
| description | TEXT | | Maintenance details |
| scheduled_date | DATE | NOT NULL | Planned maintenance date |
| status | maintenance_status_enum | NOT NULL, DEFAULT 'Active' | Current maintenance status |
| cost | DECIMAL(10,2) | CHECK (cost >= 0) | Maintenance cost |
| completed_at | TIMESTAMP | | Completion timestamp |
| created_by | UUID | NOT NULL, FOREIGN KEY → users(id) | User who created maintenance |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Enum**: maintenance_status_enum
```sql
CREATE TYPE maintenance_status_enum AS ENUM ('Active', 'Completed');
```

**Foreign Keys**:
- `vehicle_id` → `vehicles(id)` ON DELETE CASCADE
- `created_by` → `users(id)` ON DELETE SET NULL

**Indexes**:
- `idx_maintenance_vehicle_id` ON vehicle_id (vehicle's maintenance history)
- `idx_maintenance_status` ON status (filter active maintenance)
- `idx_maintenance_scheduled_date` ON scheduled_date (overdue maintenance)
- `idx_maintenance_created_at` ON created_at (recent maintenance)

**Relationships**:
- Many-to-One: maintenance_logs → vehicles
- Many-to-One: maintenance_logs → users (created_by)

**Constraints**:
- CHECK: maintenance_type IN ('Scheduled', 'Breakdown', 'Inspection')
- CHECK: completed_at > created_at (if completed_at NOT NULL)

**Business Rules** (enforced in application layer):
- Opening maintenance transitions vehicle status to "In Shop"
- Closing maintenance transitions vehicle status to "Available"


---

### 9. fuel_logs

**Purpose**: Record fuel consumption for cost tracking and efficiency analysis

**Fields**:

| Field | Data Type | Constraints | Description |
|-------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique fuel log identifier |
| vehicle_id | UUID | NOT NULL, FOREIGN KEY → vehicles(id) | Vehicle refueled |
| quantity_liters | DECIMAL(8,2) | NOT NULL, CHECK (quantity_liters > 0) | Fuel quantity in liters |
| cost | DECIMAL(10,2) | NOT NULL, CHECK (cost > 0) | Total fuel cost |
| odometer_reading | DECIMAL(10,2) | NOT NULL, CHECK (odometer_reading > 0) | Odometer reading at refuel |
| cost_per_unit | DECIMAL(6,2) | NOT NULL, CHECK (cost_per_unit > 0) | Cost per liter (calculated) |
| created_by | UUID | NOT NULL, FOREIGN KEY → users(id) | User who logged fuel |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Log timestamp |

**Foreign Keys**:
- `vehicle_id` → `vehicles(id)` ON DELETE CASCADE
- `created_by` → `users(id)` ON DELETE SET NULL

**Indexes**:
- `idx_fuel_logs_vehicle_id` ON vehicle_id (vehicle's fuel history)
- `idx_fuel_logs_created_at` ON created_at (chronological queries)
- `idx_fuel_logs_vehicle_created` ON (vehicle_id, created_at) (vehicle fuel timeline)

**Relationships**:
- Many-to-One: fuel_logs → vehicles
- Many-to-One: fuel_logs → users (created_by)

**Constraints**:
- CHECK: cost_per_unit = cost / quantity_liters (enforced in application layer)

**Notes**:
- Immutable records (no updates after creation)
- Used for fuel efficiency calculation (distance / fuel consumed)

---

### 10. expenses

**Purpose**: Track operational expenses (tolls, repairs, misc)

**Fields**:

| Field | Data Type | Constraints | Description |
|-------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique expense identifier |
| vehicle_id | UUID | NOT NULL, FOREIGN KEY → vehicles(id) | Vehicle associated with expense |
| expense_type | VARCHAR(50) | NOT NULL | tolls, repairs, other |
| amount | DECIMAL(10,2) | NOT NULL, CHECK (amount > 0) | Expense amount |
| description | TEXT | | Expense details |
| created_by | UUID | NOT NULL, FOREIGN KEY → users(id) | User who logged expense |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Log timestamp |

**Foreign Keys**:
- `vehicle_id` → `vehicles(id)` ON DELETE CASCADE
- `created_by` → `users(id)` ON DELETE SET NULL

**Indexes**:
- `idx_expenses_vehicle_id` ON vehicle_id (vehicle's expenses)
- `idx_expenses_type` ON expense_type (filter by type)
- `idx_expenses_created_at` ON created_at (chronological queries)
- `idx_expenses_vehicle_created` ON (vehicle_id, created_at) (vehicle expense timeline)

**Relationships**:
- Many-to-One: expenses → vehicles
- Many-to-One: expenses → users (created_by)

**Constraints**:
- CHECK: expense_type IN ('tolls', 'repairs', 'other')

**Notes**:
- Immutable records (no updates after creation)
- Used for total operational cost calculation

---

### 11. events

**Purpose**: Immutable audit trail for all significant system actions


**Fields**:

| Field | Data Type | Constraints | Description |
|-------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique event identifier |
| event_type | VARCHAR(50) | NOT NULL | VEHICLE_CREATED, TRIP_DISPATCHED, etc |
| entity_type | VARCHAR(50) | NOT NULL | Vehicle, Driver, Trip, etc |
| entity_id | UUID | NOT NULL | ID of affected entity |
| performed_by | UUID | FOREIGN KEY → users(id) | User who performed action |
| metadata | JSONB | NOT NULL, DEFAULT '{}'::jsonb | Additional event details |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Event timestamp |

**Foreign Keys**:
- `performed_by` → `users(id)` ON DELETE SET NULL

**Indexes**:
- `idx_events_entity` ON (entity_type, entity_id) (entity timeline)
- `idx_events_created_at` ON created_at DESC (recent activity)
- `idx_events_type` ON event_type (filter by type)
- `idx_events_performed_by` ON performed_by (user actions)
- `idx_events_metadata` USING GIN (metadata) (JSONB queries)

**Relationships**:
- Many-to-One: events → users (performed_by)

**Constraints**:
- CHECK: event_type IN ('VEHICLE_CREATED', 'VEHICLE_UPDATED', 'VEHICLE_STATUS_CHANGED', 'VEHICLE_RETIRED', 
  'DRIVER_CREATED', 'DRIVER_UPDATED', 'DRIVER_STATUS_CHANGED', 
  'TRIP_CREATED', 'TRIP_DISPATCHED', 'TRIP_COMPLETED', 'TRIP_CANCELLED',
  'MAINTENANCE_OPENED', 'MAINTENANCE_CLOSED', 
  'FUEL_LOGGED', 'EXPENSE_LOGGED')

**Notes**:
- Immutable records (no updates or deletes)
- Partitioning by created_at for large datasets (production optimization)
- JSONB metadata stores action-specific details

**Sample Metadata Structures**:

```json
// TRIP_DISPATCHED
{
  "trip_details": {
    "origin": "Mumbai",
    "destination": "Pune",
    "distance_km": 150,
    "cargo_weight_kg": 1200
  },
  "vehicle": {
    "id": "uuid",
    "registration_number": "MH12AB1234",
    "previous_status": "Available",
    "new_status": "On Trip"
  },
  "driver": {
    "id": "uuid",
    "name": "John Doe",
    "previous_status": "Available",
    "new_status": "On Trip"
  }
}

// MAINTENANCE_OPENED
{
  "vehicle": {
    "id": "uuid",
    "registration_number": "MH12AB1234",
    "previous_status": "Available",
    "new_status": "In Shop"
  },
  "maintenance_type": "Scheduled",
  "description": "500 km service",
  "scheduled_date": "2024-01-20"
}
```

---

### 12. notifications

**Purpose**: Store user notifications for operational alerts

**Fields**:

| Field | Data Type | Constraints | Description |
|-------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique notification identifier |
| user_id | UUID | NOT NULL, FOREIGN KEY → users(id) | Recipient user |
| message | TEXT | NOT NULL | Notification message |
| type | VARCHAR(50) | NOT NULL | ALERT, COMPLIANCE, TRIP, etc |
| is_read | BOOLEAN | NOT NULL, DEFAULT FALSE | Read status |
| metadata | JSONB | DEFAULT '{}'::jsonb | Additional notification details |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Notification timestamp |

**Foreign Keys**:
- `user_id` → `users(id)` ON DELETE CASCADE

**Indexes**:
- `idx_notifications_user_id` ON user_id (user's notifications)
- `idx_notifications_is_read` ON (user_id, is_read) (unread notifications)
- `idx_notifications_created_at` ON created_at DESC (recent notifications)
- `idx_notifications_type` ON type (filter by type)

**Relationships**:
- Many-to-One: notifications → users

**Constraints**:
- CHECK: type IN ('ALERT', 'COMPLIANCE', 'TRIP', 'MAINTENANCE', 'COST')

---

## Entity Relationships Summary

### Primary Relationships

**User-Centric**:
- users → roles (Many-to-One)
- users → vehicles (One-to-Many via created_by)
- users → drivers (One-to-Many via created_by)
- users → trips (One-to-Many via created_by)
- users → events (One-to-Many via performed_by)
- users → notifications (One-to-Many)

**Fleet Assets**:
- vehicles → vehicle_documents (One-to-Many)
- vehicles → trips (One-to-Many)
- vehicles → maintenance_logs (One-to-Many)
- vehicles → fuel_logs (One-to-Many)
- vehicles → expenses (One-to-Many)

**Personnel**:
- drivers → driver_documents (One-to-Many)
- drivers → trips (One-to-Many)

**Operations**:
- trips → vehicles (Many-to-One)
- trips → drivers (Many-to-One)

---

## State Tracking Strategy

### Vehicle State Machine

**States**: Available, On Trip, In Shop, Retired


**Transitions**:
```
Available → On Trip (when trip dispatched)
On Trip → Available (when trip completed/cancelled)
Available → In Shop (when maintenance opened)
In Shop → Available (when maintenance closed)
Available → Retired (permanent, no reverse)
```

**Enforcement**:
- Enum type prevents invalid status values
- Application layer validates transitions
- Events table records all status changes
- Foreign key constraints prevent deletion of vehicles with active trips

### Driver State Machine

**States**: Available, On Trip, Off Duty, Suspended

**Transitions**:
```
Available → On Trip (when trip dispatched)
On Trip → Available (when trip completed/cancelled)
Available → Off Duty (manual change)
Off Duty → Available (manual change)
Available → Suspended (manual/automatic)
Suspended → Available (manual change)
```

**Enforcement**:
- Enum type prevents invalid status values
- Application layer validates transitions
- Events table records all status changes
- License expiry validation prevents dispatch

### Trip State Machine

**States**: Draft, Dispatched, Completed, Cancelled

**Transitions**:
```
Draft → Dispatched (when dispatch executed)
Draft → Cancelled (manual cancellation)
Dispatched → Completed (when trip completed)
Dispatched → Cancelled (manual cancellation)
```

**Enforcement**:
- Enum type prevents invalid status values
- Application layer validates business rules
- Timestamps track lifecycle (created_at, dispatched_at, completed_at)
- Events table records all status changes
- Status changes trigger vehicle/driver status updates

### Maintenance State Machine

**States**: Active, Completed

**Transitions**:
```
Active → Completed (when maintenance closed)
```

**Enforcement**:
- Enum type prevents invalid status values
- Completed_at timestamp tracks completion
- Active maintenance prevents vehicle dispatch
- Closing maintenance returns vehicle to Available

---

## Audit Strategy

### Multi-Layered Audit Trail

**Layer 1: Timestamp Tracking (All Tables)**
- `created_at`: Record creation timestamp
- `updated_at`: Last modification timestamp (updated via trigger)
- `created_by`: User who created the record

**Layer 2: Soft Deletes**
- `is_active`: Boolean flag for logical deletion
- Preserves data for audit and historical analysis
- Queries filter WHERE is_active = TRUE

**Layer 3: Event System (events table)**
- Immutable event records for all significant actions
- JSONB metadata stores complete before/after state
- Indexed by entity for timeline reconstruction
- Never updated or deleted

**Layer 4: Relationship Preservation**
- Foreign keys use SET NULL on user deletion (not CASCADE)
- Preserves audit trail even when users are removed
- RESTRICT on operational tables prevents data loss

### Audit Triggers (PostgreSQL)

**Update Timestamp Trigger**:
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Repeat for vehicles, drivers, trips, maintenance_logs
```

### Audit Queries

**Entity Timeline**:
```sql
-- Get all events for a specific vehicle
SELECT 
    e.event_type,
    e.created_at,
    u.username as performed_by_user,
    e.metadata
FROM events e
LEFT JOIN users u ON e.performed_by = u.id
WHERE e.entity_type = 'Vehicle' 
  AND e.entity_id = '<vehicle_uuid>'
ORDER BY e.created_at DESC;
```

**User Action History**:
```sql
-- Get all actions performed by a user
SELECT 
    e.event_type,
    e.entity_type,
    e.entity_id,
    e.created_at,
    e.metadata
FROM events e
WHERE e.performed_by = '<user_uuid>'
ORDER BY e.created_at DESC;
```

**Change Tracking**:
```sql
-- Track status changes for a trip
SELECT 
    e.created_at,
    e.metadata->>'previous_status' as old_status,
    e.metadata->>'new_status' as new_status,
    u.username
FROM events e
LEFT JOIN users u ON e.performed_by = u.id
WHERE e.entity_type = 'Trip' 
  AND e.entity_id = '<trip_uuid>'
  AND e.event_type LIKE '%STATUS_CHANGED'
ORDER BY e.created_at;
```

---

## Index Strategy

### Performance-Critical Indexes

**Authentication & Authorization**:
- `idx_users_username` (UNIQUE) - Login queries
- `idx_users_email` (UNIQUE) - Password recovery
- `idx_roles_name` (UNIQUE) - Role lookup

**Vehicle Operations**:
- `idx_vehicles_registration_number` (UNIQUE) - Search by registration
- `idx_vehicles_status` - Filter available vehicles for dispatch
- `idx_vehicles_health_score` - Sort by vehicle health
- `idx_vehicles_is_active WHERE is_active = TRUE` (PARTIAL) - Active vehicles only

**Driver Operations**:
- `idx_drivers_license_number` (UNIQUE) - Search by license
- `idx_drivers_status` - Filter available drivers for dispatch
- `idx_drivers_license_expiry` - Compliance alerts (expiring licenses)

**Trip Management**:
- `idx_trips_status` - Filter active/pending trips
- `idx_trips_vehicle_id` - Vehicle trip history
- `idx_trips_driver_id` - Driver trip history
- `idx_trips_dispatched_at` - Chronological dispatch queries
- `idx_trips_completed_at` - Completion reports

**Maintenance & Costs**:
- `idx_maintenance_vehicle_id` - Vehicle maintenance history
- `idx_maintenance_status` - Active maintenance filter
- `idx_maintenance_scheduled_date` - Overdue maintenance alerts
- `idx_fuel_logs_vehicle_created` ON (vehicle_id, created_at) - Fuel timeline
- `idx_expenses_vehicle_created` ON (vehicle_id, created_at) - Expense timeline

**Audit Trail**:
- `idx_events_entity` ON (entity_type, entity_id) - Entity timeline reconstruction
- `idx_events_created_at DESC` - Recent activity feed
- `idx_events_performed_by` - User action history
- `idx_events_metadata` USING GIN - JSONB queries

**Compliance Tracking**:
- `idx_vehicle_docs_expiry_date` - Document expiry alerts
- `idx_driver_docs_expiry_date` - Document expiry alerts
- `idx_notifications_is_read` ON (user_id, is_read) - Unread notifications

### Composite Indexes

**Multi-Column Indexes** (for common query patterns):
```sql
CREATE INDEX idx_trips_vehicle_status ON trips(vehicle_id, status);
CREATE INDEX idx_trips_driver_status ON trips(driver_id, status);
CREATE INDEX idx_vehicles_status_active ON vehicles(status, is_active);
CREATE INDEX idx_drivers_status_active ON drivers(status, is_active);
```

---

## Database Constraints Summary

### Unique Constraints

- users.username
- users.email
- roles.name
- vehicles.registration_number
- drivers.license_number

### Check Constraints

**Data Validity**:
- vehicles.capacity_kg > 0
- vehicles.acquisition_cost >= 0
- vehicles.year >= 1900 AND year <= current_year + 1
- vehicles.health_score >= 0 AND health_score <= 100
- drivers.safety_score >= 0 AND safety_score <= 100
- trips.distance_km > 0
- trips.cargo_weight_kg > 0
- fuel_logs.quantity_liters > 0
- fuel_logs.cost > 0
- expenses.amount > 0

**Business Logic**:
- trips.completed_at > dispatched_at (if both NOT NULL)
- trips.dispatched_at > created_at (if dispatched_at NOT NULL)
- maintenance_logs.completed_at > created_at (if completed_at NOT NULL)

**Enum Validation**:
- roles.name IN predefined role list
- vehicle_documents.document_type IN valid types
- driver_documents.document_type IN valid types
- maintenance_logs.maintenance_type IN valid types
- expenses.expense_type IN valid types
- events.event_type IN valid event types
- notifications.type IN valid notification types

### Foreign Key Constraints

**CASCADE Behavior** (child records deleted with parent):
- vehicle_documents.vehicle_id → vehicles(id)
- driver_documents.driver_id → drivers(id)
- maintenance_logs.vehicle_id → vehicles(id)
- fuel_logs.vehicle_id → vehicles(id)
- expenses.vehicle_id → vehicles(id)
- notifications.user_id → users(id)

**RESTRICT Behavior** (prevent deletion if children exist):
- users.role_id → roles(id)
- trips.vehicle_id → vehicles(id)
- trips.driver_id → drivers(id)

**SET NULL Behavior** (preserve audit trail):
- vehicles.created_by → users(id)
- drivers.created_by → users(id)
- trips.created_by → users(id)
- maintenance_logs.created_by → users(id)
- fuel_logs.created_by → users(id)
- expenses.created_by → users(id)
- events.performed_by → users(id)
- vehicle_documents.uploaded_by → users(id)
- driver_documents.uploaded_by → users(id)

---

## Data Types Rationale

### UUID vs Serial Integer

**Choice**: UUID for all primary keys

**Rationale**:
- Globally unique across distributed systems
- No sequential ID guessing (security)
- Easier horizontal scaling
- Merge data from multiple sources without conflicts

**Tradeoff**: Slightly larger storage (16 bytes vs 4 bytes) - acceptable for hackathon scale

### DECIMAL vs FLOAT

**Choice**: DECIMAL for all monetary and precise numeric values

**Fields**: capacity_kg, distance_km, cargo_weight_kg, acquisition_cost, cost, amount, revenue, quantity_liters, odometer_reading, cost_per_unit, fuel_efficiency

**Rationale**:
- Exact precision for financial calculations
- No floating-point rounding errors
- Essential for ROI and cost calculations

### VARCHAR vs TEXT

**Choice**: 
- VARCHAR with length limits for structured data (registration_number, license_number, name)
- TEXT for unbounded content (description, cargo_description, message)

**Rationale**:
- VARCHAR length constraints provide validation
- TEXT for flexibility where content length varies significantly

### JSONB vs JSON

**Choice**: JSONB for metadata columns

**Rationale**:
- Binary storage (faster, smaller)
- Indexable with GIN indexes
- Supports operators for querying nested data
- Flexible schema for event metadata

### TIMESTAMP vs TIMESTAMPTZ

**Choice**: TIMESTAMP (without timezone)

**Rationale**:
- Application handles timezone conversion
- Simpler for MVP/hackathon
- PostgreSQL stores UTC internally regardless

---

## Performance Optimization

### Query Optimization

**Prepared Statements**:
- Use parameterized queries via SQLAlchemy
- Prevents SQL injection
- Improves query plan caching

**Connection Pooling**:
- SQLAlchemy connection pool (size: 20)
- Reduces connection overhead
- Reuses database connections

**Pagination**:
- LIMIT/OFFSET for list queries
- Default page size: 20 records
- Maximum page size: 100 records

**Eager Loading**:
- Use SQLAlchemy `joinedload` for related entities
- Prevents N+1 query problem
- Example: Load trips with vehicle and driver in single query

### Index Usage Monitoring

**Query Plan Analysis**:
```sql
EXPLAIN ANALYZE
SELECT * FROM vehicles WHERE status = 'Available' AND is_active = TRUE;
```

**Index Usage Statistics**:
```sql
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan ASC;
```

### Partitioning Strategy (Future Optimization)

**events table partitioning**:
- Partition by created_at (monthly or quarterly)
- Archive old events to separate tables
- Improves query performance for recent events
- Reduces table size for active queries

---

## Migration Strategy (Alembic)

### Initial Migration

**Step 1**: Create enums
```python
# alembic/versions/001_initial.py
from alembic import op

def upgrade():
    # Create enum types
    op.execute("CREATE TYPE vehicle_status_enum AS ENUM ('Available', 'On Trip', 'In Shop', 'Retired');")
    op.execute("CREATE TYPE driver_status_enum AS ENUM ('Available', 'On Trip', 'Off Duty', 'Suspended');")
    op.execute("CREATE TYPE trip_status_enum AS ENUM ('Draft', 'Dispatched', 'Completed', 'Cancelled');")
    op.execute("CREATE TYPE maintenance_status_enum AS ENUM ('Active', 'Completed');")
```

**Step 2**: Create core tables (users, roles)

**Step 3**: Create operational tables (vehicles, drivers, trips, maintenance_logs)

**Step 4**: Create support tables (fuel_logs, expenses, events, notifications)

**Step 5**: Create foreign keys and indexes

**Step 6**: Insert seed data (roles)

### Seed Data Strategy

**Roles** (required for system operation):
```sql
INSERT INTO roles (id, name, permissions, created_at) VALUES
('uuid-1', 'Fleet_Manager', '["manage_vehicles", "manage_drivers", "view_maintenance", "view_analytics", "view_reports"]'::jsonb, NOW()),
('uuid-2', 'Dispatcher', '["create_trips", "dispatch_trips", "view_vehicles", "view_drivers", "view_analytics"]'::jsonb, NOW()),
('uuid-3', 'Safety_Officer', '["manage_drivers", "view_compliance", "view_drivers"]'::jsonb, NOW()),
('uuid-4', 'Financial_Analyst', '["view_expenses", "view_analytics", "view_reports", "log_expenses"]'::jsonb, NOW());
```

**Demo Users** (for hackathon demo):
```sql
-- Create demo users for each role
-- Password: "demo123" (hashed with bcrypt)
```

**Sample Vehicles** (5-10 vehicles with varied attributes)

**Sample Drivers** (5-10 drivers with varied license expiry dates)

**Sample Trips** (mix of Draft, Dispatched, Completed statuses)

---

## Security Considerations

### Database-Level Security

**Row-Level Security** (optional enhancement):
```sql
-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own data
CREATE POLICY users_select_policy ON users
    FOR SELECT
    USING (id = current_setting('app.user_id')::uuid);
```

**Connection Security**:
- Use SSL/TLS for database connections (production)
- Environment variables for credentials (never hardcode)
- Separate database users for application vs admin

**Password Storage**:
- NEVER store plaintext passwords
- Use bcrypt with salt rounds = 12
- Application layer handles hashing

### Injection Prevention

**Parameterized Queries** (SQLAlchemy ORM):
```python
# GOOD - Parameterized
session.query(Vehicle).filter(Vehicle.registration_number == user_input).first()

# BAD - String concatenation
session.execute(f"SELECT * FROM vehicles WHERE registration_number = '{user_input}'")
```

**Input Validation**:
- Pydantic schemas validate all inputs
- Type checking at API layer
- Length constraints enforced

---

## Backup & Recovery Strategy

### Backup Types

**Full Backup** (Daily):
```bash
pg_dump -Fc transitops360_db > backup_full_$(date +%Y%m%d).dump
```

**Incremental Backup** (WAL archiving):
```sql
-- Enable WAL archiving in postgresql.conf
archive_mode = on
archive_command = 'cp %p /var/lib/postgresql/archive/%f'
```

**Point-in-Time Recovery** (PITR):
- Continuous WAL archiving
- Restore to any point in time
- Essential for production

### Recovery Procedures

**Restore Full Backup**:
```bash
pg_restore -d transitops360_db backup_full_20240115.dump
```

**PITR Restore**:
```bash
# Restore base backup + replay WAL logs to specific timestamp
```

---

## Database Monitoring

### Key Metrics

**Connection Pool**:
- Active connections
- Idle connections
- Connection errors

**Query Performance**:
- Slow query log (queries > 1 second)
- Query execution time percentiles (p50, p95, p99)
- Most frequent queries

**Table Statistics**:
- Table size growth
- Index usage rates
- Dead tuple percentage (VACUUM monitoring)

**Lock Monitoring**:
- Lock wait time
- Deadlock frequency
- Long-running transactions

### Monitoring Queries

**Active Connections**:
```sql
SELECT 
    datname,
    usename,
    application_name,
    state,
    COUNT(*)
FROM pg_stat_activity
WHERE datname = 'transitops360_db'
GROUP BY datname, usename, application_name, state;
```

**Slow Queries**:
```sql
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    max_time
FROM pg_stat_statements
WHERE mean_time > 1000  -- queries averaging > 1 second
ORDER BY mean_time DESC
LIMIT 10;
```

**Table Sizes**:
```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## Scalability Considerations

### Vertical Scaling (Short-term)

**Hardware Upgrades**:
- Increase RAM (PostgreSQL heavily caches)
- Faster SSD storage
- More CPU cores for parallel queries

**Configuration Tuning**:
```ini
# postgresql.conf
shared_buffers = 256MB          # 25% of RAM
effective_cache_size = 1GB      # 50-75% of RAM
maintenance_work_mem = 64MB
work_mem = 4MB
max_connections = 100
```

### Horizontal Scaling (Long-term)

**Read Replicas**:
- PostgreSQL streaming replication
- Route read-only queries to replicas
- Primary handles all writes

**Sharding Strategy** (if needed):
- Shard by organization/tenant (multi-tenancy)
- Consistent hashing for distribution
- Application-level routing

**Caching Layer**:
- Redis for session data
- Application-level caching for dashboard aggregations
- Cache invalidation on writes

---

## Testing Strategy

### Database Testing

**Unit Tests** (Repository Layer):
- Test CRUD operations
- Verify constraints enforcement
- Test transaction rollback

**Integration Tests**:
- Test foreign key cascades
- Verify trigger behavior
- Test complex joins

**Performance Tests**:
- Benchmark query execution times
- Load testing with realistic data volumes
- Index effectiveness validation

### Test Database Setup

**Fixtures**:
```python
# conftest.py
@pytest.fixture
def test_db():
    # Create test database
    # Run migrations
    # Seed with test data
    yield db_session
    # Teardown: drop test database
```

**Test Data Isolation**:
- Each test gets fresh database state
- Use transactions and rollback
- Parallel test execution safe

---

## Implementation Checklist

### Phase 1: Core Schema
- [ ] Create UUID extension
- [ ] Create enum types
- [ ] Create users and roles tables
- [ ] Implement authentication
- [ ] Create seed data for roles

### Phase 2: Fleet Module
- [ ] Create vehicles table
- [ ] Create vehicle_documents table
- [ ] Create drivers table
- [ ] Create driver_documents table
- [ ] Implement soft delete

### Phase 3: Operations Module
- [ ] Create trips table
- [ ] Create maintenance_logs table
- [ ] Create fuel_logs table
- [ ] Create expenses table
- [ ] Implement foreign key constraints

### Phase 4: Intelligence Module
- [ ] Create events table
- [ ] Create notifications table
- [ ] Implement JSONB indexes
- [ ] Create event logging triggers

### Phase 5: Indexes & Constraints
- [ ] Create all unique indexes
- [ ] Create performance indexes
- [ ] Create composite indexes
- [ ] Add check constraints

### Phase 6: Audit & Triggers
- [ ] Create updated_at trigger function
- [ ] Apply trigger to all tables
- [ ] Test soft delete behavior
- [ ] Verify event logging

### Phase 7: Seed Data
- [ ] Insert role definitions
- [ ] Create demo users
- [ ] Create sample vehicles
- [ ] Create sample drivers
- [ ] Create sample trips

### Phase 8: Testing
- [ ] Unit test constraints
- [ ] Integration test cascades
- [ ] Load test with sample data
- [ ] Verify all indexes used

---

## Appendix: Quick Reference

### Connection String

```
DATABASE_URL=postgresql://username:password@localhost:5432/transitops360_db
```

### Common Queries

**Get Available Vehicles**:
```sql
SELECT * FROM vehicles 
WHERE status = 'Available' 
  AND is_active = TRUE
ORDER BY health_score DESC;
```

**Get Expiring Driver Licenses**:
```sql
SELECT 
    id,
    name,
    license_number,
    license_expiry,
    license_expiry - CURRENT_DATE as days_until_expiry
FROM drivers
WHERE license_expiry <= CURRENT_DATE + INTERVAL '30 days'
  AND is_active = TRUE
ORDER BY license_expiry;
```

**Get Active Trips with Vehicle and Driver**:
```sql
SELECT 
    t.id,
    t.origin,
    t.destination,
    v.registration_number,
    d.name as driver_name,
    t.dispatched_at
FROM trips t
JOIN vehicles v ON t.vehicle_id = v.id
JOIN drivers d ON t.driver_id = d.id
WHERE t.status = 'Dispatched'
ORDER BY t.dispatched_at DESC;
```

**Calculate Vehicle Total Cost**:
```sql
SELECT 
    v.id,
    v.registration_number,
    COALESCE(SUM(f.cost), 0) as fuel_cost,
    COALESCE(SUM(m.cost), 0) as maintenance_cost,
    COALESCE(SUM(e.amount), 0) as expense_cost,
    COALESCE(SUM(f.cost), 0) + COALESCE(SUM(m.cost), 0) + COALESCE(SUM(e.amount), 0) as total_cost
FROM vehicles v
LEFT JOIN fuel_logs f ON v.id = f.vehicle_id
LEFT JOIN maintenance_logs m ON v.id = m.vehicle_id AND m.status = 'Completed'
LEFT JOIN expenses e ON v.id = e.vehicle_id
WHERE v.id = '<vehicle_uuid>'
GROUP BY v.id, v.registration_number;
```

---

## Document Status

**Status**: Complete - Ready for Implementation

**Created**: 2024-01-15

**Database**: PostgreSQL 14+

**Migration Tool**: Alembic

**ORM**: SQLAlchemy 2.0+

This database design document provides complete specifications for implementing the TransitOps360 database within the 6-hour hackathon timeframe. All tables, relationships, indexes, and constraints are production-ready while optimized for rapid development.

**Next Steps**: Generate Alembic migration scripts and implement SQLAlchemy ORM models.
