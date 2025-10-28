from beanie import Document, PydanticObjectId, Link
from pydantic import EmailStr, Field
from typing import Optional
from datetime import datetime

class User(Document):
    username: str
    email: EmailStr
    password: str  # Hash bcrypt
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"

class Item(Document):
    name: str
    quantity: int = 1
    purchased: bool = False
    user_id: PydanticObjectId  # NUEVO: Relacionar con usuario
    created_at: datetime = Field(default_factory=datetime.utcnow)
    purchased_at: Optional[datetime] = None

    class Settings:
        name = "items"

class ShoppingList(Document):
    name: str
    items: list[PydanticObjectId] = Field(default_factory=list)
    user_id: PydanticObjectId  # NUEVO: Relacionar con usuario
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "shopping_lists"

class Stats(Document):
    total_users: int
    total_items: int
    total_lists: int
    items_purchased: int
    items_pending: int
    generated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "stats"