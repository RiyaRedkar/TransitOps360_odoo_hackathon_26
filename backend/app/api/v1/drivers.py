from fastapi import APIRouter

router = APIRouter()


@router.get("")
async def list_drivers():
    """
    List all drivers.
    TODO: Implement driver listing with filters.
    """
    return {"message": "List drivers - to be implemented"}


@router.get("/{driver_id}")
async def get_driver(driver_id: str):
    """
    Get driver by ID.
    TODO: Implement driver retrieval.
    """
    return {"message": f"Get driver {driver_id} - to be implemented"}


@router.post("")
async def create_driver():
    """
    Create new driver.
    TODO: Implement driver creation with license validation.
    """
    return {"message": "Create driver - to be implemented"}


@router.get("/available")
async def get_available_drivers():
    """
    Get available drivers for dispatch.
    TODO: Implement availability filtering.
    """
    return {"message": "Get available drivers - to be implemented"}
