from fastapi import APIRouter

router = APIRouter()


@router.get("/timeline")
async def get_timeline():
    """
    Get activity timeline.
    TODO: Implement event timeline with filtering.
    """
    return {"message": "Timeline - to be implemented"}


@router.get("/entity/{entity_type}/{entity_id}")
async def get_entity_timeline(entity_type: str, entity_id: str):
    """
    Get timeline for specific entity.
    TODO: Implement entity-specific timeline.
    """
    return {"message": f"Timeline for {entity_type}/{entity_id} - to be implemented"}
