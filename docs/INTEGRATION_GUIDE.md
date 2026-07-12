# Frontend-Backend Integration Guide

## Quick Start

### Prerequisites
- PostgreSQL running on `localhost:5432`
- Node.js and npm installed
- Python 3.9+ installed

---

## Part 1: Backend Setup

### Step 1: Database Setup

```bash
# Create PostgreSQL database
psql -U postgres -c "CREATE DATABASE transitops360;"

# Or using psql prompt:
psql -U postgres
# CREATE DATABASE transitops360;
# \q
```

### Step 2: Install Backend Dependencies

```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### Step 3: Create Environment File

```bash
# backend/.env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/transitops360
SECRET_KEY=your-secret-key-use-openssl-rand-hex-32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
APP_ENV=development
DEBUG=true
API_VERSION=v1
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5176,http://localhost:3000
```

### Step 4: Run Database Migrations

```bash
cd backend
alembic upgrade head
```

### Step 5: Seed Demo Data (Optional but Recommended)

Create `backend/seed_demo_data.py`:

```python
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models.base import Base
from app.models.user import User
from app.core.security import get_password_hash

# Create tables
Base.metadata.create_all(bind=engine)

# Create session
db = SessionLocal()

# Create demo user
demo_user = User(
    username="admin",
    email="admin@transit.com",
    first_name="Admin",
    last_name="User",
    password_hash=get_password_hash("admin123"),
    is_active=True,
    role="fleet_manager"
)

db.add(demo_user)
db.commit()
print("Demo user created: admin@transit.com / admin123")
db.close()
```

Run it:
```bash
python backend/seed_demo_data.py
```

### Step 6: Start Backend Server

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started server process [1234]
INFO:     Started Reloader process
```

**Verify Backend is Running:**
- Open http://localhost:8000/health → Should return `{"status": "healthy"}`
- Open http://localhost:8000/docs → Swagger UI with all endpoints
- Open http://localhost:8000/redoc → ReDoc documentation

---

## Part 2: Frontend Setup

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Check Environment Variables

**File: `frontend/.env`**
```
VITE_API_BASE_URL=http://localhost:8000
VITE_API_VERSION=v1
VITE_APP_NAME=TransitOps360
VITE_APP_ENV=development
VITE_ENABLE_ANALYTICS=false
```

### Step 3: Start Frontend Dev Server

```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v5.4.21 ready in 349 ms

➜  Local:   http://localhost:5176/
➜  press h + enter to show help
```

---

## Part 3: Testing the Integration

### Test 1: Health Check

```bash
curl http://localhost:8000/health
# Expected: {"status":"healthy"}
```

### Test 2: Login (Before Frontend Integration)

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Expected Response:
# {
#   "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "token_type": "bearer",
#   "user": {
#     "id": "...",
#     "username": "admin",
#     "email": "admin@transit.com",
#     ...
#   }
# }
```

### Test 3: Frontend Login Flow

1. Open http://localhost:5176 in browser
2. Login page should load
3. Enter credentials:
   - Email: `admin@transit.com`
   - Password: `admin123`
4. Click "Sign In"

**Expected Behavior:**
- API call to `POST /api/v1/auth/login` should succeed
- JWT token stored in localStorage
- Redirect to dashboard
- All pages should render

### Test 4: Check Console for Errors

Open browser DevTools (F12):
- Go to Console tab
- Check for any red errors
- Go to Network tab
- Check API requests to `http://localhost:8000/api/v1/*`
- Verify response status codes are 200

### Test 5: List Vehicles (After Login)

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:8000/api/v1/vehicles

# Replace YOUR_JWT_TOKEN with actual token from login
```

---

## Available Service Methods

### Auth Service (`frontend/src/services/authService.ts`)

```typescript
import authService from '@/services/authService'

// Login
const response = await authService.login({
  username: 'admin',
  password: 'admin123'
})

// Get current user
const user = await authService.getCurrentUser()

// Refresh token
const newToken = await authService.refreshToken()

// Logout
authService.logout()

// Check authentication
if (authService.isAuthenticated()) {
  // User is logged in
}
```

### Vehicle Service (`frontend/src/services/vehicleService.ts`)

```typescript
import vehicleService from '@/services/vehicleService'

// Get all vehicles
const vehicles = await vehicleService.getAll({
  status: 'available',
  limit: 50
})

// Get vehicle by ID
const vehicle = await vehicleService.getById(vehicleId)

// Create vehicle
const newVehicle = await vehicleService.create({
  plate: 'MH12AB1234',
  make: 'Tata',
  model: 'Ace',
  year: 2023,
  vin: 'VIN123456',
  fuel_type: 'diesel',
  capacity: 1000
})

// Update vehicle
await vehicleService.update(vehicleId, {
  status: 'maintenance'
})

// Update status
await vehicleService.updateStatus(vehicleId, 'on_trip')

// Delete vehicle
await vehicleService.delete(vehicleId)
```

### Driver Service (`frontend/src/services/driverService.ts`)

```typescript
import driverService from '@/services/driverService'

// Get all drivers
const drivers = await driverService.getAll({
  status: 'active',
  limit: 50
})

// Get available drivers
const availableDrivers = await driverService.getAvailable()

// Create driver
const newDriver = await driverService.create({
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  phone: '+91 98765 43210',
  license_number: 'DL123456',
  license_expiry: '2025-12-31',
  experience_years: 5
})
```

### Trip Service (`frontend/src/services/tripService.ts`)

```typescript
import tripService from '@/services/tripService'

// Get all trips
const trips = await tripService.getAll({
  status: 'in_progress',
  limit: 50
})

// Create trip
const newTrip = await tripService.create({
  vehicle_id: 'vehicle-uuid',
  driver_id: 'driver-uuid',
  origin: 'Mumbai',
  destination: 'Pune'
})

// Update trip status
await tripService.updateStatus(tripId, 'completed')

// Complete trip
await tripService.complete(tripId, {
  fuel_consumed: 25.5,
  distance: 150,
  duration: 180,
  cost: 2500
})

// Cancel trip
await tripService.cancel(tripId)
```

---

## Integration with Pages (Example)

### Update DashboardPage to Fetch Real Data

```typescript
import { useEffect, useState } from 'react'
import vehicleService from '@/services/vehicleService'
import tripService from '@/services/tripService'

export default function DashboardPage() {
  const [vehicles, setVehicles] = useState([])
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesData, tripsData] = await Promise.all([
          vehicleService.getAll({ limit: 100 }),
          tripService.getAll({ limit: 100 })
        ])
        setVehicles(vehiclesData)
        setTrips(tripsData)
      } catch (err) {
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {/* Use vehicles and trips data */}
    </div>
  )
}
```

---

## Debugging Integration Issues

### Issue 1: CORS Errors

**Error:** `Access to XMLHttpRequest at 'http://localhost:8000/api/v1/...' from origin 'http://localhost:5176' has been blocked`

**Solution:**
- Check backend CORS configuration in `backend/app/core/config.py`
- Ensure `http://localhost:5176` is in `ALLOWED_ORIGINS`
- Restart backend server

### Issue 2: 401 Unauthorized

**Error:** `Response status 401`

**Solution:**
- Check JWT token is being sent correctly
- Verify token in localStorage: Open DevTools → Application → LocalStorage
- Ensure token hasn't expired (30 min default)
- Try refreshing token via `authService.refreshToken()`

### Issue 3: 404 Endpoint Not Found

**Error:** `GET http://localhost:8000/api/v1/vehicles 404`

**Solution:**
- Verify backend is running and listening on port 8000
- Check route registration in `backend/app/main.py`
- Verify endpoint path is correct
- Check Swagger UI at http://localhost:8000/docs

### Issue 4: Network Timeout

**Error:** `Error: timeout of 10000ms exceeded`

**Solution:**
- Ensure backend is running
- Check network connectivity
- Increase timeout in `frontend/src/api/client.ts` if needed
- Check database is not overloaded

### Issue 5: Database Connection Error

**Error:** `could not connect to server: Connection refused`

**Solution:**
- Ensure PostgreSQL is running
- Check connection string in `backend/.env`
- Verify database exists: `psql -U postgres -l`
- Check PostgreSQL credentials

---

## Running Full Stack

### Setup (One-time)

```bash
# Terminal 1: Setup Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
# Create .env file with database URL
alembic upgrade head  # Apply migrations
# Optional: python seed_demo_data.py

# Terminal 2: Setup Frontend
cd frontend
npm install
```

### Development (Daily)

```bash
# Terminal 1: Backend
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev

# Open browser to http://localhost:5176
```

---

## Common Commands

```bash
# Backend
uvicorn app.main:app --reload                    # Start dev server
alembic upgrade head                              # Apply migrations
alembic downgrade -1                              # Rollback migration
python -m pytest                                  # Run tests

# Frontend
npm run dev                                       # Start dev server
npm run build                                     # Build for production
npm run lint                                      # Run ESLint
npm run type-check                                # TypeScript check

# Database
psql -U postgres                                  # Connect to PostgreSQL
\c transitops360                                  # Connect to database
\dt                                               # List tables
```

---

## Endpoints Reference

### Authentication
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh` - Refresh token

### Vehicles
- `GET /api/v1/vehicles` - List vehicles
- `GET /api/v1/vehicles/available` - Get available vehicles
- `GET /api/v1/vehicles/{id}` - Get vehicle
- `POST /api/v1/vehicles` - Create vehicle
- `PUT /api/v1/vehicles/{id}` - Update vehicle
- `PATCH /api/v1/vehicles/{id}/status` - Update status
- `DELETE /api/v1/vehicles/{id}` - Delete vehicle

### Drivers
- `GET /api/v1/drivers` - List drivers
- `GET /api/v1/drivers/available` - Get available drivers
- `GET /api/v1/drivers/{id}` - Get driver
- `POST /api/v1/drivers` - Create driver
- `PUT /api/v1/drivers/{id}` - Update driver
- `PATCH /api/v1/drivers/{id}/status` - Update status

### Trips
- `GET /api/v1/trips` - List trips
- `GET /api/v1/trips/{id}` - Get trip
- `POST /api/v1/trips` - Create trip
- `PATCH /api/v1/trips/{id}/status` - Update trip status

### Maintenance
- `GET /api/v1/maintenance` - List maintenance records
- `GET /api/v1/maintenance/{id}` - Get maintenance record
- `POST /api/v1/maintenance` - Create maintenance record

### Intelligence/Analytics
- `GET /api/v1/intelligence/dashboard` - Dashboard analytics
- `GET /api/v1/intelligence/reports` - Reports

---

## Deployment Checklist

- [ ] Backend environment variables updated for production
- [ ] Frontend .env updated with production API URL
- [ ] Database backups configured
- [ ] SSL/TLS certificates obtained
- [ ] CORS origins updated for production domain
- [ ] JWT secret key changed to production value
- [ ] Debug mode disabled
- [ ] Error logging configured
- [ ] Rate limiting implemented
- [ ] API documentation reviewed

---

## Support

For issues:
1. Check browser DevTools (F12) Console and Network tabs
2. Check backend server logs
3. Verify environment variables
4. Test with curl/Postman
5. Check integration status: `INTEGRATION_STATUS.md`

---

**Status**: ✅ Ready for integration testing

All services are properly configured and ready to use!
