# TransitOps360 - Quick Reference Card

## 🚀 Start Services

```bash
make dev                    # Start everything with Docker Compose
# OR
./start.sh                  # Start with script (Linux/Mac)
# OR manual:
docker-compose up -d        # Just PostgreSQL
cd backend && uvicorn app.main:app --reload
cd frontend && npm run dev
```

## 🌐 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | React UI |
| Backend | http://localhost:8000 | FastAPI API |
| API Docs | http://localhost:8000/docs | Swagger UI |
| Database | localhost:5432 | PostgreSQL |

## 📁 File Ownership

| Developer | Owns | Never Touch |
|-----------|------|-------------|
| A (Frontend) | `/frontend/**` | `/backend/**` |
| B (Backend) | `/backend/**` | `/frontend/**` |

## 🔀 Git Workflow (Hourly)

```bash
# Start hour
git checkout -b feat/your-feature

# End hour
git add .
git commit -m "feat: description"
git checkout main
git pull origin main
git merge feat/your-feature
git push origin main
```

## 🐍 Backend Commands

```bash
# Start server
uvicorn app.main:app --reload

# Database migration
alembic revision --autogenerate -m "description"
alembic upgrade head

# Tests
pytest
pytest --cov=app

# Access Python shell
python
>>> from app.core.database import SessionLocal
>>> db = SessionLocal()
```

## ⚛️ Frontend Commands

```bash
# Start dev server
npm run dev

# Build
npm run build

# Type check
tsc --noEmit

# Lint
npm run lint
```

## 📊 Backend Structure

```
app/
├── api/v1/          → Routers (HTTP endpoints)
├── services/        → Business logic (ONLY here!)
├── repositories/    → Database queries
├── models/          → SQLAlchemy ORM models
├── schemas/         → Pydantic request/response
└── core/            → Config, database, security
```

**Layer Rule**: Router → Service → Repository

## 🎨 Frontend Structure

```
src/
├── pages/           → Route components
├── components/      → Reusable UI
├── hooks/           → TanStack Query hooks
├── api/             → Axios client
├── types/           → TypeScript types
└── lib/             → Utilities
```

## 🔐 Authentication Flow

**Backend**:
```python
from app.core.security import create_access_token
token = create_access_token({"sub": user.id})
return {"access_token": token, "token_type": "bearer"}
```

**Frontend**:
```typescript
// Login
const { data } = await client.post('/auth/login', credentials)
localStorage.setItem('access_token', data.access_token)

// Auto-inject token
// Already configured in src/api/client.ts
```

## 📝 Create New Entity (Backend)

```bash
# 1. Model (app/models/vehicle.py)
class Vehicle(Base, BaseModel):
    __tablename__ = "vehicles"
    registration_number = Column(String, unique=True)
    status = Column(Enum(VehicleStatus))

# 2. Schema (app/schemas/vehicle.py)
class VehicleCreate(BaseModel):
    registration_number: str
    
class VehicleResponse(VehicleCreate):
    id: str
    created_at: datetime

# 3. Repository (app/repositories/vehicle_repository.py)
def get_all(db: Session) -> List[Vehicle]:
    return db.query(Vehicle).all()

# 4. Service (app/services/vehicle_service.py)
def create_vehicle(db: Session, data: VehicleCreate) -> Vehicle:
    vehicle = Vehicle(**data.dict())
    db.add(vehicle)
    db.commit()
    return vehicle

# 5. Router (app/api/v1/vehicles.py)
@router.post("", response_model=VehicleResponse)
def create(data: VehicleCreate, db: Session = Depends(get_db)):
    return vehicle_service.create_vehicle(db, data)

# 6. Migration
alembic revision --autogenerate -m "add vehicles"
alembic upgrade head
```

## 📝 Create New Page (Frontend)

```bash
# 1. Page (src/pages/VehiclesPage.tsx)
export default function VehiclesPage() {
  return <div>Vehicles</div>
}

# 2. Route (src/App.tsx)
<Route path="/vehicles" element={<VehiclesPage />} />

# 3. API Client (src/api/vehicles.ts)
export const vehiclesApi = {
  getAll: () => client.get('/vehicles')
}

# 4. Hook (src/hooks/useVehicles.ts)
export const useVehicles = () => {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: vehiclesApi.getAll
  })
}

# 5. Type (src/types/index.ts)
export interface Vehicle {
  id: string
  registration_number: string
}
```

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 8000 in use | `lsof -i :8000` then `kill <PID>` |
| Port 5173 in use | `lsof -i :5173` then `kill <PID>` |
| Database error | `docker-compose down -v && docker-compose up -d postgres` |
| CORS error | Check `ALLOWED_ORIGINS` in backend/.env |
| Import error | Check `__init__.py` files exist |
| Type error | `cd frontend && npm run build` to see full errors |

## 📊 Status Enums

**Vehicle**: Available, On Trip, In Shop, Retired  
**Driver**: Available, On Trip, Off Duty, Suspended  
**Trip**: Draft, Dispatched, Completed, Cancelled  
**Maintenance**: Active, Completed

## 🧪 Testing

**Backend**:
```bash
# Unit test
def test_create_vehicle():
    vehicle = create_vehicle(db, data)
    assert vehicle.status == "Available"

# Run tests
pytest -v
```

**Frontend**:
```bash
# Manual testing
# 1. Login at /login
# 2. Navigate to feature
# 3. Test CRUD operations
# 4. Check API calls in DevTools Network tab
```

## 🎯 Integration Checkpoints

| Time | Test |
|------|------|
| 1:00 | Login works, JWT returned |
| 2:00 | Create vehicle end-to-end |
| 3:00 | Dispatch trip with validation |
| 4:00 | Dashboard shows metrics |
| 5:00 | All features smoke tested |

## 📞 Emergency Commands

```bash
# Nuclear reset
docker-compose down -v
rm -rf backend/alembic/versions/*.py
rm -rf frontend/node_modules
make clean

# Fresh start
docker-compose up -d postgres
cd backend && alembic upgrade head
cd frontend && npm install && npm run dev
```

## 💡 Pro Tips

1. **Backend**: Always test endpoints in Swagger UI first
2. **Frontend**: Use React DevTools to inspect component state
3. **Both**: Commit every hour (mandatory!)
4. **Both**: Pull main before merging to avoid conflicts
5. **Backend**: Business logic goes in services, nowhere else
6. **Frontend**: Keep components small and focused

---

**Need more details?** → See `SETUP.md` or `CONTRIBUTING.md`

**Ready to ship!** 🚀
