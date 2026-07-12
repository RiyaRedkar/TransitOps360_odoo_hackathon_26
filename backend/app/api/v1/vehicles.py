from fastapi import APIRouter

router = APIRouter()


@router.get("")
async def list_vehicles():
    """
    List all vehicles.
    TODO: Implement vehicle listing with filters.
    """
    return {"message": "List vehicles - to be implemented"}


@router.get("/{vehicle_id}")
async def get_vehicle(vehicle_id: str):
    """
    Get vehicle by ID.
    TODO: Implement vehicle retrieval.
    """
    return {"message": f"Get vehicle {vehicle_id} - to be implemented"}


@router.post("")
async def create_vehicle():
    """
    Create new vehicle.
    TODO: Implement vehicle creation.
    """
    return {"message": "Create vehicle - to be implemented"}


@router.put("/{vehicle_id}")
async def update_vehicle(vehicle_id: str):
    """
    Update vehicle.
    TODO: Implement vehicle update.
    """
    return {"message": f"Update vehicle {vehicle_id} - to be implemented"}


@router.patch("/{vehicle_id}/status")
async def update_vehicle_status(vehicle_id: str):
    """
    Update vehicle status.
    TODO: Implement status transition validation.
    """
    return {"message": f"Update vehicle {vehicle_id} status - to be implemented"}
