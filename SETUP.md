# TransitOps360 - Development Setup Guide

## Prerequisites

Ensure you have the following installed:

- **Docker & Docker Compose** (for PostgreSQL)
- **Python 3.12+** (backend)
- **Node.js 20+** (frontend)
- **Git**

## Quick Start (5 Minutes)

### Option 1: Using Docker Compose (Recommended)

```bash
# 1. Clone repository
git clone <repository-url>
cd transitops360

# 2. Create environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Start all services
docker-compose up -d

# 4. Access applications
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Manual Setup

#### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/transitops360
# SECRET_KEY=your-secret-key (generate with: openssl rand -hex 32)

# Start PostgreSQL (if not using Docker)
docker-compose up -d postgres

# Run database migrations
alembic upgrade head

# Start backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at:
- API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

#### Frontend Setup

```bash
# Navigate to frontend (new terminal)
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

Frontend will be available at: http://localhost:5173

## Verify Installation

### Backend Health Check

```bash
curl http://localhost:8000/health
# Expected: {"status":"healthy"}
```

### Frontend Access

Open browser to http://localhost:5173
- You should see the login page

### API Documentation

Open browser to http://localhost:8000/docs
- Interactive Swagger UI with all endpoints

## Database Management

### Create Migration

```bash
cd backend
alembic revision --autogenerate -m "description"
```

### Apply Migration

```bash
alembic upgrade head
```

### Rollback Migration

```bash
alembic downgrade -1
```

### Reset Database

```bash
# Drop all tables
alembic downgrade base

# Recreate all tables
alembic upgrade head
```

## Development Workflow

### Developer A (Frontend Lead)

```bash
# 1. Create feature branch
git checkout -b feat/frontend-foundation

# 2. Start frontend dev server
cd frontend
npm run dev

# 3. Implement features in /frontend directory
# - src/pages/
# - src/components/
# - src/api/
# - src/hooks/

# 4. Test your changes
npm run build  # Ensure no compilation errors

# 5. Commit and push
git add .
git commit -m "feat: initial frontend setup with auth UI"
git push origin feat/frontend-foundation

# 6. Merge to main at hour boundary
git checkout main
git pull origin main
git merge feat/frontend-foundation
git push origin main
```

### Developer B (Backend Lead)

```bash
# 1. Create feature branch
git checkout -b feat/backend-foundation

# 2. Start backend dev server
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# 3. Implement features in /backend directory
# - app/models/
# - app/schemas/
# - app/services/
# - app/repositories/
# - app/api/v1/

# 4. Test your changes
pytest  # Run tests

# 5. Commit and push
git add .
git commit -m "feat: database schema and auth API"
git push origin feat/backend-foundation

# 6. Merge to main at hour boundary
git checkout main
git pull origin main
git merge feat/backend-foundation
git push origin main
```

## Common Commands

### Backend

```bash
# Start server
uvicorn app.main:app --reload

# Run tests
pytest

# Run tests with coverage
pytest --cov=app

# Lint code
ruff check app/

# Format code
black app/
```

### Frontend

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
tsc --noEmit
```

### Docker

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild services
docker-compose up -d --build

# Remove volumes (reset database)
docker-compose down -v
```

## Troubleshooting

### Backend won't start

**Issue**: `alembic.util.exc.CommandError: Can't locate revision identified by`

**Solution**:
```bash
# Delete alembic versions
rm backend/alembic/versions/*.py

# Recreate initial migration
alembic revision --autogenerate -m "initial schema"
alembic upgrade head
```

### Frontend build errors

**Issue**: `Module not found` or type errors

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database connection errors

**Issue**: `could not connect to server: Connection refused`

**Solution**:
```bash
# Ensure PostgreSQL is running
docker-compose up -d postgres

# Check if port 5432 is available
lsof -i :5432  # Linux/Mac
netstat -ano | findstr :5432  # Windows

# Update DATABASE_URL in backend/.env if needed
```

### CORS errors in frontend

**Issue**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution**:
```bash
# Ensure backend ALLOWED_ORIGINS includes frontend URL
# In backend/.env:
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Project Structure

```
transitops360/
├── backend/              # Developer B ownership
│   ├── app/
│   │   ├── api/v1/      # API routers
│   │   ├── core/        # Config, database, security
│   │   ├── models/      # SQLAlchemy models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── services/    # Business logic
│   │   ├── repositories/ # Data access
│   │   └── tests/       # Backend tests
│   ├── alembic/         # Database migrations
│   ├── requirements.txt
│   └── .env.example
├── frontend/            # Developer A ownership
│   ├── src/
│   │   ├── api/        # API client
│   │   ├── components/ # React components
│   │   ├── hooks/      # Custom hooks
│   │   ├── pages/      # Route pages
│   │   ├── types/      # TypeScript types
│   │   └── lib/        # Utilities
│   ├── package.json
│   └── .env.example
├── docker-compose.yml
├── Makefile
├── README.md
└── CONTRIBUTING.md
```

## Next Steps

1. **Read CONTRIBUTING.md** for git workflow and team collaboration
2. **Review README.md** for project overview
3. **Check API documentation** at http://localhost:8000/docs
4. **Start implementing** based on the execution plan

## Support

For issues or questions:
- Check documentation in `/docs`
- Review API spec: http://localhost:8000/docs
- Contact team leads

---

**Ready to build? Let's ship! 🚀**
