# Repository Structure Document: TransitOps360

## Overview

This document defines the complete repository structure for the TransitOps360 fleet operations ERP platform, optimized for a 6-hour hackathon with 2 developers (Developer A: Frontend Lead, Developer B: Backend Lead).

### Repository Goals

1. **Clear Ownership**: Frontend and backend have separate directories with no cross-ownership
2. **Parallel Development**: Developers can work independently without merge conflicts
3. **Rapid Setup**: Minimal configuration, sensible defaults, quick start commands
4. **Production Ready**: Clean architecture, type safety, scalability considerations
5. **Hackathon Optimized**: Monorepo structure for easy navigation and deployment

### Technology Stack Summary

**Frontend**:
- React 19 + TypeScript
- Vite (build tool)
- TailwindCSS + shadcn/ui
- TanStack Query (server state)
- React Hook Form + Zod (forms/validation)
- Recharts (data visualization)

**Backend**:
- FastAPI + Python 3.12+
- PostgreSQL (database)
- SQLAlchemy 2.0 (ORM)
- Alembic (migrations)
- JWT Authentication (python-jose)
- bcrypt (password hashing)
- Pydantic (validation)

**DevOps**:
- Docker + Docker Compose
- PostgreSQL container
- Vite dev server (HMR)
- FastAPI uvicorn (auto-reload)

---

## Complete Repository Tree

```
transitops360/
├── frontend/                          # Developer A ownership
│   ├── public/                        # Static assets
│   │   ├── favicon.ico
│   │   └── logo.svg
│   ├── src/
│   │   ├── api/                       # API client layer
│   │   │   ├── client.ts             # Axios instance with interceptors
│   │   │   ├── auth.ts               # Authentication API calls
│   │   │   ├── vehicles.ts           # Vehicles API calls
│   │   │   ├── drivers.ts            # Drivers API calls
│   │   │   ├── trips.ts              # Trips API calls
│   │   │   ├── maintenance.ts        # Maintenance API calls
│   │   │   ├── intelligence.ts       # Intelligence/analytics API calls
│   │   │   └── events.ts             # Events/timeline API calls
│   │   ├── components/                # React components (Atomic Design)
│   │   │   ├── layout/               # Layout components
│   │   │   │   ├── AppLayout.tsx     # Main app layout wrapper
│   │   │   │   ├── Sidebar.tsx       # Navigation sidebar
│   │   │   │   ├── TopNav.tsx        # Top navigation bar
│   │   │   │   └── Footer.tsx        # Footer component
│   │   │   ├── ui/                    # shadcn/ui primitives
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── form.tsx
│   │   │   │   └── ... (other shadcn components)
│   │   │   ├── shared/               # Shared/reusable components
│   │   │   │   ├── StatusBadge.tsx   # Status indicator component
│   │   │   │   ├── DataTable.tsx     # Generic data table
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   ├── ErrorBoundary.tsx
│   │   │   │   ├── EmptyState.tsx
│   │   │   │   └── ConfirmDialog.tsx
│   │   │   ├── vehicles/             # Vehicle module components
│   │   │   │   ├── VehicleList.tsx
│   │   │   │   ├── VehicleDetail.tsx
│   │   │   │   ├── VehicleForm.tsx
│   │   │   │   └── VehicleStatusSelect.tsx
│   │   │   ├── drivers/              # Driver module components
│   │   │   │   ├── DriverList.tsx
│   │   │   │   ├── DriverDetail.tsx
│   │   │   │   ├── DriverForm.tsx
│   │   │   │   └── DriverStatusSelect.tsx
│   │   │   ├── trips/                # Trip module components
│   │   │   │   ├── TripList.tsx
│   │   │   │   ├── TripDetail.tsx
│   │   │   │   ├── TripDispatchForm.tsx
│   │   │   │   └── TripStatusBadge.tsx
│   │   │   ├── maintenance/          # Maintenance components
│   │   │   │   ├── MaintenanceList.tsx
│   │   │   │   ├── MaintenanceForm.tsx
│   │   │   │   └── MaintenanceHistory.tsx
│   │   │   ├── dashboard/            # Dashboard components
│   │   │   │   ├── MetricsCards.tsx
│   │   │   │   ├── FleetHealthChart.tsx
│   │   │   │   ├── UtilizationChart.tsx
│   │   │   │   ├── CostChart.tsx
│   │   │   │   ├── AlertsWidget.tsx
│   │   │   │   └── ActivityTimeline.tsx
│   │   │   ├── intelligence/         # Intelligence module components
│   │   │   │   ├── ComplianceTable.tsx
│   │   │   │   ├── DispatchRecommendations.tsx
│   │   │   │   ├── CostAnalysis.tsx
│   │   │   │   └── CommandCenter.tsx
│   │   │   └── auth/                 # Auth components
│   │   │       └── LoginForm.tsx
│   │   ├── contexts/                 # React contexts
│   │   │   ├── AuthContext.tsx       # Auth state provider
│   │   │   └── ThemeContext.tsx      # Theme provider (optional)
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useAuth.ts            # Auth hook
│   │   │   ├── useVehicles.ts        # Vehicles CRUD hooks
│   │   │   ├── useDrivers.ts         # Drivers CRUD hooks
│   │   │   ├── useTrips.ts           # Trips CRUD hooks
│   │   │   ├── useMaintenance.ts     # Maintenance hooks
│   │   │   ├── useDashboard.ts       # Dashboard data hooks
│   │   │   ├── useIntelligence.ts    # Intelligence hooks
│   │   │   └── useEvents.ts          # Events timeline hooks
│   │   ├── pages/                    # Route-level page components
│   │   │   ├── LoginPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── VehiclesPage.tsx
│   │   │   ├── VehicleDetailPage.tsx
│   │   │   ├── DriversPage.tsx
│   │   │   ├── DriverDetailPage.tsx
│   │   │   ├── TripsPage.tsx
│   │   │   ├── TripDetailPage.tsx
│   │   │   ├── MaintenancePage.tsx
│   │   │   ├── CompliancePage.tsx
│   │   │   ├── CostIntelligencePage.tsx
│   │   │   ├── ActivityPage.tsx
│   │   │   └── NotFoundPage.tsx
│   │   ├── lib/                      # Utility libraries
│   │   │   ├── utils.ts              # General utilities (cn helper, etc)
│   │   │   ├── constants.ts          # App constants
│   │   │   ├── validators.ts         # Zod schemas
│   │   │   └── formatters.ts         # Date/number formatters
│   │   ├── types/                    # TypeScript type definitions
│   │   │   ├── index.ts              # Re-exports all types
│   │   │   ├── auth.ts               # Auth types
│   │   │   ├── vehicle.ts            # Vehicle types
│   │   │   ├── driver.ts             # Driver types
│   │   │   ├── trip.ts               # Trip types
│   │   │   ├── maintenance.ts        # Maintenance types
│   │   │   ├── intelligence.ts       # Intelligence/analytics types
│   │   │   └── api.ts                # API response/request types
│   │   ├── App.tsx                   # Root app component
│   │   ├── main.tsx                  # App entry point
│   │   ├── index.css                 # Global styles + Tailwind imports
│   │   └── vite-env.d.ts            # Vite type definitions
│   ├── .env.example                  # Environment variables template
│   ├── .eslintrc.cjs                 # ESLint configuration
│   ├── .gitignore                    # Git ignore rules
│   ├── components.json               # shadcn/ui configuration
│   ├── index.html                    # HTML entry point
│   ├── package.json                  # Frontend dependencies
│   ├── postcss.config.js             # PostCSS configuration
│   ├── tailwind.config.js            # Tailwind configuration
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── tsconfig.node.json            # TypeScript config for Vite
│   └── vite.config.ts                # Vite configuration
│
├── backend/                           # Developer B ownership
│   ├── alembic/                       # Database migrations
│   │   ├── versions/                 # Migration files
│   │   │   └── 001_initial_schema.py
│   │   ├── env.py                    # Alembic environment config
│   │   ├── script.py.mako            # Migration template
│   │   └── alembic.ini               # Alembic configuration
│   ├── app/
│   │   ├── api/                      # API layer (routers)
│   │   │   ├── v1/                   # API version 1
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth.py           # Auth endpoints (login, me, refresh)
│   │   │   │   ├── vehicles.py       # Vehicles CRUD endpoints
│   │   │   │   ├── drivers.py        # Drivers CRUD endpoints
│   │   │   │   ├── trips.py          # Trips CRUD + dispatch endpoints
│   │   │   │   ├── maintenance.py    # Maintenance endpoints
│   │   │   │   ├── fuel.py           # Fuel logs endpoints
│   │   │   │   ├── expenses.py       # Expenses endpoints
│   │   │   │   ├── intelligence.py   # Intelligence/analytics endpoints
│   │   │   │   ├── events.py         # Events/timeline endpoints
│   │   │   │   └── reports.py        # Reports/export endpoints
│   │   │   └── deps.py               # API dependencies (auth, db session)
│   │   ├── core/                     # Core application config
│   │   │   ├── __init__.py
│   │   │   ├── config.py             # Settings (Pydantic BaseSettings)
│   │   │   ├── security.py           # JWT utilities, password hashing
│   │   │   └── database.py           # Database connection, session factory
│   │   ├── models/                   # SQLAlchemy ORM models
│   │   │   ├── __init__.py
│   │   │   ├── user.py               # User and Role models
│   │   │   ├── vehicle.py            # Vehicle and VehicleDocument models
│   │   │   ├── driver.py             # Driver and DriverDocument models
│   │   │   ├── trip.py               # Trip model
│   │   │   ├── maintenance.py        # MaintenanceLog model
│   │   │   ├── fuel.py               # FuelLog model
│   │   │   ├── expense.py            # Expense model
│   │   │   ├── event.py              # Event model
│   │   │   ├── notification.py       # Notification model
│   │   │   └── base.py               # Base model with common fields
│   │   ├── schemas/                  # Pydantic schemas (request/response)
│   │   │   ├── __init__.py
│   │   │   ├── auth.py               # Login, Token, UserResponse schemas
│   │   │   ├── vehicle.py            # VehicleCreate, VehicleUpdate, VehicleResponse
│   │   │   ├── driver.py             # DriverCreate, DriverUpdate, DriverResponse
│   │   │   ├── trip.py               # TripCreate, TripDispatch, TripResponse
│   │   │   ├── maintenance.py        # MaintenanceCreate, MaintenanceResponse
│   │   │   ├── fuel.py               # FuelLogCreate, FuelLogResponse
│   │   │   ├── expense.py            # ExpenseCreate, ExpenseResponse
│   │   │   ├── intelligence.py       # Dashboard, Analytics schemas
│   │   │   └── event.py              # EventResponse schema
│   │   ├── services/                 # Business logic layer
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py       # Authentication logic
│   │   │   ├── vehicle_service.py    # Vehicle business logic
│   │   │   ├── driver_service.py     # Driver business logic
│   │   │   ├── trip_service.py       # Trip dispatch logic
│   │   │   ├── maintenance_service.py # Maintenance workflow logic
│   │   │   ├── event_service.py      # Event logging
│   │   │   ├── dispatch_recommender.py # Smart dispatch algorithm
│   │   │   ├── fleet_health.py       # Health score calculation
│   │   │   ├── compliance_service.py # Compliance tracking
│   │   │   └── cost_intelligence.py  # Cost analysis logic
│   │   ├── repositories/             # Data access layer
│   │   │   ├── __init__.py
│   │   │   ├── base.py               # Base repository with CRUD methods
│   │   │   ├── user_repository.py
│   │   │   ├── vehicle_repository.py
│   │   │   ├── driver_repository.py
│   │   │   ├── trip_repository.py
│   │   │   ├── maintenance_repository.py
│   │   │   ├── fuel_repository.py
│   │   │   ├── expense_repository.py
│   │   │   └── event_repository.py
│   │   ├── middleware/               # Custom middleware
│   │   │   ├── __init__.py
│   │   │   ├── cors.py               # CORS configuration
│   │   │   ├── error_handler.py      # Global error handling
│   │   │   └── logging.py            # Request logging
│   │   ├── utils/                    # Utility functions
│   │   │   ├── __init__.py
│   │   │   ├── validators.py         # Business rule validators
│   │   │   ├── enums.py              # Status enums
│   │   │   └── helpers.py            # Helper functions
│   │   ├── tests/                    # Backend tests
│   │   │   ├── __init__.py
│   │   │   ├── conftest.py           # Pytest fixtures
│   │   │   ├── test_auth.py
│   │   │   ├── test_vehicles.py
│   │   │   ├── test_drivers.py
│   │   │   ├── test_trips.py
│   │   │   ├── test_dispatch.py      # Property-based tests
│   │   │   └── test_intelligence.py
│   │   ├── __init__.py
│   │   └── main.py                   # FastAPI app initialization
│   ├── scripts/                      # Management scripts
│   │   ├── seed_data.py              # Seed demo data
│   │   ├── init_db.py                # Initialize database
│   │   └── create_user.py            # Create admin user
│   ├── .env.example                  # Environment variables template
│   ├── .gitignore                    # Git ignore rules
│   ├── alembic.ini                   # Alembic configuration
│   ├── pyproject.toml                # Python project config + dependencies
│   ├── pytest.ini                    # Pytest configuration
│   └── requirements.txt              # Python dependencies (generated from pyproject.toml)
│
├── .github/                           # GitHub workflows (optional)
│   └── workflows/
│       ├── ci.yml                     # Continuous integration
│       └── deploy.yml                 # Deployment workflow
│
├── docs/                              # Documentation
│   ├── API.md                         # API documentation
│   ├── ARCHITECTURE.md                # Architecture overview
│   ├── DATABASE.md                    # Database schema docs
│   └── SETUP.md                       # Development setup guide
│
├── .gitignore                         # Root gitignore
├── docker-compose.yml                 # Docker services definition
├── Dockerfile.frontend                # Frontend Docker image
├── Dockerfile.backend                 # Backend Docker image
├── Makefile                           # Common commands
└── README.md                          # Project overview + quick start

```

---

## Folder Responsibilities

### Frontend (`/frontend`)

**Owner**: Developer A (Frontend Lead)

**Responsibilities**:
- User interface implementation (React components)
- Client-side routing (React Router)
- State management (TanStack Query + React Context)
- Form handling and validation (React Hook Form + Zod)
- API integration (Axios client)
- Data visualization (Recharts)
- Responsive design (TailwindCSS)
- Accessibility compliance (WCAG 2.1 AA)

**Key Directories**:

**`src/api/`**: API client layer
- Axios instance with request/response interceptors
- JWT token injection in headers
- Error handling and retries
- API endpoint functions grouped by domain
- **Rule**: All HTTP calls go through this layer, components never call axios directly

**`src/components/`**: React components following Atomic Design
- `layout/`: App shell (sidebar, topnav, footer)
- `ui/`: shadcn/ui primitives (button, card, table, etc)
- `shared/`: Reusable components (DataTable, StatusBadge, LoadingSpinner)
- `{module}/`: Domain-specific components (vehicles, drivers, trips, dashboard)
- `auth/`: Authentication components
- **Rule**: Components are organized by abstraction level, not by route

**`src/hooks/`**: Custom React hooks
- TanStack Query hooks for data fetching (useVehicles, useDrivers, etc)
- Custom hooks for business logic (useAuth, useDashboard)
- **Rule**: Hooks encapsulate stateful logic, components stay lean

**`src/pages/`**: Route-level components
- One page per route
- Compose smaller components
- Minimal logic (mostly layout and data orchestration)
- **Rule**: Pages don't contain business logic, delegate to hooks/components

**`src/types/`**: TypeScript type definitions
- Shared types/interfaces for entities
- API request/response types
- Enums and constants
- **Rule**: Types mirror backend Pydantic schemas for consistency

**`src/lib/`**: Utility libraries
- Formatters (date, currency, distance)
- Validators (Zod schemas)
- Helper functions (cn helper for class merging)
- Constants (status colors, role permissions)

**Merge Conflict Prevention**:
- Developer A owns ALL files under `/frontend`
- Developer B should never modify frontend files
- API contract defined in advance (API specification document)

---

### Backend (`/backend`)

**Owner**: Developer B (Backend Lead)

**Responsibilities**:
- REST API implementation (FastAPI)
- Business logic (service layer)
- Data access (repository pattern)
- Database schema (SQLAlchemy models)
- Migrations (Alembic)
- Authentication & authorization (JWT + RBAC)
- Property-based testing (Hypothesis)
- API documentation (OpenAPI/Swagger)

**Key Directories**:

**`app/api/v1/`**: API routers (route handlers)
- Define HTTP endpoints (GET, POST, PUT, PATCH, DELETE)
- Parse request parameters (path, query, body)
- Call service layer methods
- Return Pydantic schema responses
- Handle HTTP exceptions
- **Rule**: Routers are thin, no business logic, delegate to services

**`app/services/`**: Business logic layer
- Implements domain workflows (dispatch trip, open maintenance)
- Validates business rules (capacity checks, status transitions)
- Coordinates across repositories (trip dispatch updates vehicle + driver)
- Generates events for audit trail
- **Rule**: Services contain ALL business logic, routers and repositories have none

**`app/repositories/`**: Data access layer
- CRUD operations on database tables
- Complex queries (filtering, sorting, pagination)
- No business logic, pure data operations
- **Rule**: Repositories abstract SQLAlchemy, services never write raw SQL

**`app/models/`**: SQLAlchemy ORM models
- Define database tables
- Relationships (foreign keys)
- Indexes and constraints
- **Rule**: Models mirror database schema exactly

**`app/schemas/`**: Pydantic schemas
- Request validation (Create, Update schemas)
- Response serialization (Response schemas)
- Type coercion and validation rules
- **Rule**: Schemas define API contract, frontend types must match

**`app/core/`**: Core configuration
- `config.py`: Environment variables, app settings
- `security.py`: JWT encoding/decoding, password hashing
- `database.py`: Database connection, session management
- **Rule**: Core is imported by all other modules, imports nothing from app/

**`alembic/versions/`**: Database migrations
- Auto-generated migration scripts
- Schema evolution history
- **Rule**: Never edit migrations after merging, create new migration instead

**Merge Conflict Prevention**:
- Developer B owns ALL files under `/backend`
- Developer A should never modify backend files
- Shared types defined via API specification, not code sharing

---

### Shared Responsibilities (`/docs`, `/docker-compose.yml`)

**Documentation (`/docs`)**:
- Both developers contribute
- API documentation (OpenAPI spec from FastAPI)
- Architecture diagrams
- Database schema documentation
- Setup instructions

**Docker Configuration (`docker-compose.yml`, Dockerfiles)**:
- Developer B creates initial setup
- Both developers can modify as needed
- **Conflict Resolution**: Discuss changes before modifying

**Root Files (`README.md`, `Makefile`, `.gitignore`)**:
- README.md: Both can update (merge manually if conflicts)
- Makefile: Common commands for both frontend/backend
- .gitignore: Combine frontend + backend ignore rules

---

## Module Boundaries

### Clear Separation of Concerns

**Layer Architecture** (Backend):
```
API Layer (Routers)
  ↓ calls
Service Layer (Business Logic)
  ↓ calls
Repository Layer (Data Access)
  ↓ calls
Database (PostgreSQL)
```

**Dependency Rules**:
1. Routers depend on Services, NOT Repositories or Models
2. Services depend on Repositories, NOT Routers
3. Repositories depend on Models, NOT Services
4. Models depend on nothing (pure SQLAlchemy)
5. Schemas depend on nothing (pure Pydantic)

**Module Boundaries** (Backend Services):

| Service | Dependencies | Responsibilities |
|---------|--------------|------------------|
| auth_service | user_repository | Login, JWT generation, password hashing |
| vehicle_service | vehicle_repository, event_service | Vehicle CRUD, status management |
| driver_service | driver_repository, event_service | Driver CRUD, license validation |
| trip_service | trip_repository, vehicle_service, driver_service, event_service | Trip dispatch, validation |
| maintenance_service | maintenance_repository, vehicle_service, event_service | Maintenance workflow |
| dispatch_recommender | vehicle_service, driver_service, fleet_health | Smart dispatch algorithm |
| fleet_health | vehicle_repository, maintenance_repository, fuel_repository | Health score calculation |
| compliance_service | vehicle_repository, driver_repository | Expiry tracking |
| cost_intelligence | fuel_repository, expense_repository, maintenance_repository | Cost analysis |
| event_service | event_repository | Event logging |

**Cross-Module Communication**:
- Services call other services (allowed)
- Services never call repositories of other services (prohibited)
- Example: trip_service calls vehicle_service.update_status(), NOT vehicle_repository.update()

---

## Shared Types and Interfaces

### Frontend Types (`frontend/src/types/`)

**Purpose**: Define TypeScript interfaces that match backend Pydantic schemas

**Structure**:
```typescript
// frontend/src/types/vehicle.ts
export enum VehicleStatus {
  AVAILABLE = "Available",
  ON_TRIP = "On Trip",
  IN_SHOP = "In Shop",
  RETIRED = "Retired"
}

export interface Vehicle {
  id: string;
  registration_number: string;
  make: string;
  model: string;
  year: number;
  capacity_kg: number;
  fuel_type: string;
  status: VehicleStatus;
  acquisition_cost: number;
  fuel_efficiency?: number;
  health_score: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VehicleCreate {
  registration_number: string;
  make: string;
  model: string;
  year: number;
  capacity_kg: number;
  fuel_type: string;
  acquisition_cost: number;
  fuel_efficiency?: number;
}

export interface VehicleUpdate {
  make?: string;
  model?: string;
  capacity_kg?: number;
  fuel_efficiency?: number;
}
```

**Synchronization Strategy**:
1. Backend defines Pydantic schemas (source of truth)
2. Frontend creates matching TypeScript types
3. Use OpenAPI spec as reference (auto-generated by FastAPI)
4. Developer A manually translates schemas to TypeScript
5. During integration, verify type compatibility

**Enums** (must match exactly):
- VehicleStatus: Available, On Trip, In Shop, Retired
- DriverStatus: Available, On Trip, Off Duty, Suspended
- TripStatus: Draft, Dispatched, Completed, Cancelled
- MaintenanceStatus: Active, Completed
- ExpenseType: tolls, repairs, other
- DocumentType (Vehicle): insurance, permit, fitness_certificate, puc
- DocumentType (Driver): license, medical_certificate

---

### Backend Schemas (`backend/app/schemas/`)

**Purpose**: Define request/response contracts for API endpoints

**Pattern**:
```python
# backend/app/schemas/vehicle.py
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime
from enum import Enum

class VehicleStatus(str, Enum):
    AVAILABLE = "Available"
    ON_TRIP = "On Trip"
    IN_SHOP = "In Shop"
    RETIRED = "Retired"

class VehicleBase(BaseModel):
    registration_number: str = Field(..., min_length=1, max_length=20)
    make: str = Field(..., min_length=1, max_length=50)
    model: str = Field(..., min_length=1, max_length=50)
    year: int = Field(..., ge=1900)
    capacity_kg: float = Field(..., gt=0)
    fuel_type: str = Field(..., max_length=20)
    acquisition_cost: float = Field(..., ge=0)
    fuel_efficiency: Optional[float] = Field(None, gt=0)

class VehicleCreate(VehicleBase):
    pass

class VehicleUpdate(BaseModel):
    make: Optional[str] = Field(None, min_length=1, max_length=50)
    model: Optional[str] = Field(None, min_length=1, max_length=50)
    capacity_kg: Optional[float] = Field(None, gt=0)
    fuel_efficiency: Optional[float] = Field(None, gt=0)

class VehicleResponse(VehicleBase):
    id: str
    status: VehicleStatus
    health_score: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
```

**Rules**:
- Use Pydantic v2 syntax (ConfigDict, Field)
- Create schemas extend Base schemas
- Update schemas have all Optional fields
- Response schemas include id, timestamps, computed fields
- Use Field for validation constraints
- Enums inherit from str for JSON serialization

---

## Environment Variables

### Frontend (`frontend/.env.example`)

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_API_VERSION=v1

# App Configuration
VITE_APP_NAME=TransitOps360
VITE_APP_ENV=development

# Feature Flags (optional)
VITE_ENABLE_ANALYTICS=false
```

**Rules**:
- All env vars must be prefixed with `VITE_` for Vite to expose them
- Never commit `.env` file (only `.env.example`)
- Access via `import.meta.env.VITE_API_BASE_URL`

---

### Backend (`backend/.env.example`)

```bash
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/transitops360
DATABASE_POOL_SIZE=10
DATABASE_MAX_OVERFLOW=20

# JWT Configuration
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# App Configuration
APP_NAME=TransitOps360
APP_ENV=development
DEBUG=true
API_VERSION=v1

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Server Configuration
HOST=0.0.0.0
PORT=8000
WORKERS=1
```

**Rules**:
- Never commit `.env` file
- Use Pydantic BaseSettings for type-safe config
- Generate SECRET_KEY with `openssl rand -hex 32`
- In production, set DEBUG=false

---

## Database Migration Strategy

### Alembic Configuration

**Setup**:
```bash
# Initialize Alembic (already done in structure)
cd backend
alembic init alembic

# Configure alembic.ini
sqlalchemy.url = postgresql://postgres:postgres@localhost:5432/transitops360
```

**Migration Workflow**:

**1. Create Initial Schema** (Hour 1 of Hackathon):
```bash
# Auto-generate migration from SQLAlchemy models
alembic revision --autogenerate -m "initial schema"

# Review generated migration file
# Edit if needed (add seed data, custom SQL)

# Apply migration
alembic upgrade head
```

**2. Seed Initial Data** (Hour 1):
```python
# Add to migration file or separate seed script
def upgrade():
    # Create tables (auto-generated)
    ...
    
    # Seed roles
    op.execute("""
        INSERT INTO roles (id, name, permissions, created_at) VALUES
        (gen_random_uuid(), 'Fleet_Manager', '["vehicles:*", "drivers:*", "maintenance:*"]'::jsonb, NOW()),
        (gen_random_uuid(), 'Dispatcher', '["trips:*", "vehicles:read", "drivers:read"]'::jsonb, NOW()),
        (gen_random_uuid(), 'Safety_Officer', '["drivers:*", "compliance:*"]'::jsonb, NOW()),
        (gen_random_uuid(), 'Financial_Analyst', '["reports:*", "costs:read"]'::jsonb, NOW());
    """)
```

**3. Schema Changes During Development**:
```bash
# Make changes to SQLAlchemy models
# Generate migration
alembic revision --autogenerate -m "add fuel_efficiency to vehicles"

# Apply migration
alembic upgrade head

# Rollback if needed
alembic downgrade -1
```

**Rules**:
- NEVER edit migrations after they're merged to main
- Always use `--autogenerate` to detect model changes
- Review generated migrations before applying
- Test migrations on clean database before committing
- Include both upgrade() and downgrade() functions

**Migration Naming Convention**:
```
001_initial_schema.py
002_add_vehicle_health_score.py
003_add_trip_revenue.py
```

---

## Development Workflow

### Initial Setup (Both Developers)

**1. Clone Repository**:
```bash
git clone <repository-url>
cd transitops360
```

**2. Setup Backend** (Developer B leads, Developer A follows):
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/transitops360

# Run migrations
alembic upgrade head

# Seed demo data (optional)
python scripts/seed_data.py

# Start development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**3. Setup Frontend** (Developer A leads, Developer B follows):
```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

**4. Verify Setup**:
- Backend: http://localhost:8000/docs (OpenAPI/Swagger UI)
- Frontend: http://localhost:5173
- Database: Connect with pgAdmin or psql

---

### Hour-by-Hour Development Flow

**Hour 1: Foundation**

Developer A:
```bash
git checkout -b feat/frontend-foundation
# Create app layout, routing, login page
git add .
git commit -m "feat: initial frontend setup with auth UI"
git push origin feat/frontend-foundation
git checkout main
git merge feat/frontend-foundation
```

Developer B:
```bash
git checkout -b feat/backend-foundation
# Create models, migrations, auth endpoints
git add .
git commit -m "feat: database schema and auth API"
git push origin feat/backend-foundation
git checkout main
git merge feat/backend-foundation
```

**Integration Test** (Both, 1:00):
```bash
# Frontend: Login with demo credentials
# Backend: Verify JWT token returned
# Success: Redirect to dashboard
```

**Hours 2-5**: Same pattern (new branch per hour, merge at hour boundary)

**Hour 6: Demo Preparation**:
```bash
# Both developers work on fix/demo-polish
git checkout -b fix/demo-polish
# Add error handling, seed data, docs
git add .
git commit -m "fix: error handling and demo polish"
git push origin fix/demo-polish
```

---

### Daily Development Commands

**Backend**:
```bash
# Start server
uvicorn app.main:app --reload

# Run tests
pytest

# Run tests with coverage
pytest --cov=app --cov-report=html

# Generate migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Lint code
ruff check app/

# Format code
black app/
```

**Frontend**:
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check
npm run type-check
```

---

## Docker Setup

### Docker Compose Configuration

**`docker-compose.yml`**:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: transitops360_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: transitops360
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: transitops360_backend
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/transitops360
      SECRET_KEY: ${SECRET_KEY}
      ALLOWED_ORIGINS: http://localhost:5173
    ports:
      - "8000:8000"
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./backend:/app
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: transitops360_frontend
    environment:
      VITE_API_BASE_URL: http://localhost:8000
    ports:
      - "5173:5173"
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm run dev -- --host

volumes:
  postgres_data:
```

**`Dockerfile.backend`**:
```dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Run migrations and start server
CMD alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**`Dockerfile.frontend`**:
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy application
COPY . .

# Start dev server
CMD ["npm", "run", "dev", "--", "--host"]
```

**Usage**:
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild after code changes
docker-compose up -d --build
```

---

## Startup Commands

### Quick Start (Recommended for Hackathon)

**Makefile** (create at root):
```makefile
.PHONY: help install dev test clean

help:
	@echo "TransitOps360 Development Commands"
	@echo "make install    - Install all dependencies"
	@echo "make dev        - Start all services"
	@echo "make test       - Run all tests"
	@echo "make clean      - Clean generated files"

install:
	@echo "Installing backend dependencies..."
	cd backend && pip install -r requirements.txt
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

dev:
	@echo "Starting PostgreSQL..."
	docker-compose up -d postgres
	@echo "Starting backend..."
	cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
	@echo "Starting frontend..."
	cd frontend && npm run dev

test:
	@echo "Running backend tests..."
	cd backend && pytest
	@echo "Running frontend tests..."
	cd frontend && npm run test

clean:
	@echo "Cleaning Python cache..."
	find backend -type d -name __pycache__ -exec rm -rf {} +
	find backend -type f -name "*.pyc" -delete
	@echo "Cleaning node_modules..."
	rm -rf frontend/node_modules
```

**Usage**:
```bash
# First time setup
make install

# Start development
make dev

# Run tests
make test
```

---

### Individual Service Startup

**Backend Only**:
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

**Frontend Only**:
```bash
cd frontend
npm run dev
```

**Database Only**:
```bash
docker-compose up postgres
```

---

## Integration Strategy

### API Contract Alignment

**Step 1: Backend Defines Contract** (Developer B, Hour 1):
- Create Pydantic schemas in `backend/app/schemas/`
- Implement API endpoints in `backend/app/api/v1/`
- FastAPI auto-generates OpenAPI spec at `/docs`

**Step 2: Frontend Consumes Contract** (Developer A, Hour 1):
- Visit `http://localhost:8000/docs`
- Review endpoint signatures
- Create matching TypeScript types in `frontend/src/types/`
- Implement API client functions in `frontend/src/api/`

**Step 3: Integration Testing** (Both, Hourly):
- Test each endpoint with Postman or curl
- Verify request/response format matches
- Handle error cases
- Test happy path in UI

---

### CORS Configuration

**Backend** (`backend/app/main.py`):
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### Authentication Flow

**1. Login** (Frontend → Backend):
```typescript
// frontend/src/api/auth.ts
export const authApi = {
  login: async (username: string, password: string) => {
    const response = await client.post('/auth/login', { username, password });
    localStorage.setItem('access_token', response.data.access_token);
    return response.data;
  }
}
```

**2. Token Injection** (Frontend):
```typescript
// frontend/src/api/client.ts
import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**3. Token Validation** (Backend):
```python
# backend/app/api/deps.py
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    user = verify_token(token)  # Implement in core/security.py
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user
```

---

### Error Handling

**Backend** (Consistent error format):
```python
# backend/app/middleware/error_handler.py
from fastapi import Request, status
from fastapi.responses import JSONResponse

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "message": str(exc),
                "type": exc.__class__.__name__,
                "detail": getattr(exc, "detail", None)
            }
        }
    )
```

**Frontend** (Error interceptor):
```typescript
// frontend/src/api/client.ts
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## Summary

This repository structure provides:

✅ **Clear Ownership**: Frontend (Developer A) and Backend (Developer B) have separate directories
✅ **Parallel Development**: No merge conflicts, independent work streams
✅ **Rapid Setup**: Docker Compose, Makefile, sensible defaults
✅ **Production Ready**: Clean architecture, type safety, scalability
✅ **Hackathon Optimized**: Monorepo, minimal configuration, fast iteration

**Next Steps**:
1. Create repository with this structure
2. Initialize frontend (Vite + React + TypeScript + TailwindCSS)
3. Initialize backend (FastAPI + SQLAlchemy + Alembic)
4. Setup Docker Compose with PostgreSQL
5. Verify both developers can run `make dev` successfully
6. Begin Hour 1 implementation

**Critical Success Factors**:
- Both developers commit every hour (mandatory)
- Follow strict layering (Router → Service → Repository)
- API contract defined upfront (Pydantic schemas)
- Integration testing at hourly sync points
- No cross-ownership (frontend/backend separation)

---

**Document Complete** ✅
