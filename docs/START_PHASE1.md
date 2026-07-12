# Quick Start Guide - Phase 1

## Prerequisites

- Docker & Docker Compose (for PostgreSQL)
- Python 3.12+
- PostgreSQL 15 (or use Docker container)

---

## 5-Minute Setup

### 1. Start PostgreSQL

```bash
cd d:\Projects\TransitOps360_odoo_hackathon_26
docker-compose up -d postgres
```

Wait 10 seconds for PostgreSQL to initialize.

### 2. Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Create environment file
copy .env.example .env  # Windows
# cp .env.example .env  # Linux/Mac

# Edit .env if needed (optional - defaults work)
```

### 3. Initialize Database

```bash
# Generate and apply migration
alembic revision --autogenerate -m "initial schema"
alembic upgrade head

# Seed initial data (roles + admin user)
python scripts\seed_data.py  # Windows
# python scripts/seed_data.py  # Linux/Mac
```

Expected output:
```
Starting database seeding...
1. Seeding roles...
Created role: Fleet_Manager
Created role: Dispatcher
Created role: Safety_Officer
Created role: Financial_Analyst
2. Seeding admin user...
Created admin user: username='admin', password='admin123'
✅ Database seeding completed successfully!
```

### 4. Start Backend Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend running at:
- **API**: http://localhost:8000
- **Swagger UI**: http://localhost:8000/docs
- **Health**: http://localhost:8000/health

---

## Verify Installation

### Test 1: Health Check

Open browser: http://localhost:8000/health

Expected: `{"status":"healthy"}`

### Test 2: API Documentation

Open browser: http://localhost:8000/docs

You should see Swagger UI with all API endpoints.

### Test 3: Login

In Swagger UI:
1. Expand `POST /api/v1/auth/login`
2. Click "Try it out"
3. Enter:
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```
4. Click "Execute"

Expected: JWT token + user profile

### Test 4: Protected Endpoint

1. Copy the `access_token` from login response
2. Click "Authorize" button at top of Swagger UI
3. Enter: `Bearer <your_token>`
4. Click "Authorize"
5. Try `GET /api/v1/auth/me`

Expected: Your user profile

---

## Demo Credentials

```
Username: admin
Password: admin123
Email: admin@transit.com
Role: Fleet_Manager (full access to all endpoints)
```

---

## What's Implemented

✅ **Database**:
- 12 tables (users, roles, vehicles, drivers, trips, etc.)
- 4 status enums
- All constraints and indexes
- Foreign key relationships

✅ **Authentication**:
- JWT token generation
- Login endpoint (`POST /auth/login`)
- Get current user (`GET /auth/me`)
- Token refresh (`POST /auth/refresh`)
- Bcrypt password hashing

✅ **Seed Data**:
- 4 roles with permissions
- Admin user (fleet manager)

✅ **API Documentation**:
- Swagger UI at /docs
- ReDoc at /redoc
- OpenAPI spec auto-generated

---

## Next Steps

1. ✅ Phase 1 is complete and working
2. 📋 Next: Implement Phase 2 (CRUD operations)
3. 📋 After that: Phase 3 (Operations management)

---

## Troubleshooting

### Port 8000 already in use

```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

### PostgreSQL not starting

```bash
docker-compose down
docker-compose up -d postgres
docker ps  # verify it's running
```

### Import errors

Make sure you're in backend directory and venv is activated:
```bash
cd backend
venv\Scripts\activate  # Windows
pwd  # should show: .../backend
```

### Alembic errors

```bash
# Reset migrations
rm -rf alembic/versions/*.py
alembic revision --autogenerate -m "initial schema"
alembic upgrade head
```

---

## Commands Reference

```bash
# Start PostgreSQL
docker-compose up -d postgres

# Stop PostgreSQL
docker-compose down

# Start backend
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload

# Run seed data
python scripts\seed_data.py

# Create migration
alembic revision --autogenerate -m "description"

# Apply migration
alembic upgrade head

# Rollback migration
alembic downgrade -1

# Check database
docker exec -it transitops360_db psql -U postgres -d transitops360
```

---

**Status**: ✅ Phase 1 Complete and Running

**Good luck with development!** 🚀
