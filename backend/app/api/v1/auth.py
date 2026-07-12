from fastapi import APIRouter

router = APIRouter()


@router.post("/login")
async def login():
    """
    User login endpoint.
    TODO: Implement JWT authentication logic.
    """
    return {"message": "Login endpoint - to be implemented"}


@router.get("/me")
async def get_current_user():
    """
    Get current authenticated user.
    TODO: Implement JWT token validation and user retrieval.
    """
    return {"message": "Get current user - to be implemented"}


@router.post("/refresh")
async def refresh_token():
    """
    Refresh JWT access token.
    TODO: Implement token refresh logic.
    """
    return {"message": "Refresh token - to be implemented"}
