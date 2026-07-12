from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import auth, vehicles, drivers, trips, maintenance, intelligence, events

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.API_VERSION,
    description="Fleet Operations ERP with Operational Intelligence",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=f"/api/{settings.API_VERSION}/auth", tags=["Authentication"])
app.include_router(vehicles.router, prefix=f"/api/{settings.API_VERSION}/vehicles", tags=["Vehicles"])
app.include_router(drivers.router, prefix=f"/api/{settings.API_VERSION}/drivers", tags=["Drivers"])
app.include_router(trips.router, prefix=f"/api/{settings.API_VERSION}/trips", tags=["Trips"])
app.include_router(maintenance.router, prefix=f"/api/{settings.API_VERSION}/maintenance", tags=["Maintenance"])
app.include_router(intelligence.router, prefix=f"/api/{settings.API_VERSION}/intelligence", tags=["Intelligence"])
app.include_router(events.router, prefix=f"/api/{settings.API_VERSION}/events", tags=["Events"])

@app.get("/")
async def root():
    return {
        "message": "TransitOps360 API",
        "version": settings.API_VERSION,
        "docs": "/docs",
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}
