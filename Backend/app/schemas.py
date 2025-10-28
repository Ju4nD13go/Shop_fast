from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_serializer
from beanie import PydanticObjectId

# ========== USER SCHEMAS ==========
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: PydanticObjectId
    username: str
    email: EmailStr
    created_at: datetime

    @field_serializer("id")
    def serialize_id(self, v: PydanticObjectId) -> str:
        return str(v)

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# ========== ITEM SCHEMAS ==========
class ItemCreate(BaseModel):
    name: str
    quantity: int = Field(default=1, ge=1)

class ItemUpdate(BaseModel):
    name: Optional[str] = None
    quantity: Optional[int] = Field(default=None, ge=1)

class ItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: PydanticObjectId
    name: str
    quantity: int
    purchased: bool
    user_id: PydanticObjectId
    created_at: datetime

    @field_serializer("id", "user_id")
    def serialize_id(self, v: PydanticObjectId) -> str:
        return str(v)

class ItemPurchase(BaseModel):
    purchased: bool = True

# ========== LIST SCHEMAS ==========
class ListCreate(BaseModel):
    name: str
    item_ids: list[str] = Field(default_factory=list)

class ListUpdate(BaseModel):
    name: Optional[str] = None
    item_ids: Optional[list[str]] = None

class ListResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: PydanticObjectId
    name: str
    items: list[PydanticObjectId] = Field(default_factory=list)
    user_id: PydanticObjectId
    created_at: datetime

    @field_serializer("id", "user_id")
    def _ser_id(self, v: PydanticObjectId) -> str:
        return str(v)

    @field_serializer("items")
    def _ser_items(self, v: list[PydanticObjectId]) -> list[str]:
        return [str(x) for x in v]

# ========== STATS SCHEMAS ==========
class StatsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    total_users: int
    total_items: int
    total_shopping_lists: int
    items_purchased: int
    items_pending: int
    created_at: datetime