from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime
from typing import Optional, List
import uuid


class RoleBase(BaseModel):
    """Base role schema."""
    name: str = Field(..., max_length=50)
    permissions: List[str] = Field(default_factory=list)


class RoleResponse(RoleBase):
    """Role response schema."""
    id: uuid.UUID
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class UserBase(BaseModel):
    """Base user schema."""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr


class UserCreate(UserBase):
    """User creation schema."""
    password: str = Field(..., min_length=8)
    role_id: uuid.UUID


class UserUpdate(BaseModel):
    """User update schema."""
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    role_id: Optional[uuid.UUID] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    """User response schema."""
    id: uuid.UUID
    role_id: uuid.UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    role: Optional[RoleResponse] = None
    
    model_config = ConfigDict(from_attributes=True)


class LoginRequest(BaseModel):
    """Login request schema."""
    username: str
    password: str


class Token(BaseModel):
    """Token response schema."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenData(BaseModel):
    """Token data schema for JWT payload."""
    sub: str  # user_id
    username: Optional[str] = None
    exp: Optional[datetime] = None
