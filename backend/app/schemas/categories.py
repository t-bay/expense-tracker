from pydantic import BaseModel
from uuid import UUID
from typing import Optional
from datetime import datetime


class CategoryCreate(BaseModel):
    name: str
    icon: Optional[str] = None


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    icon: Optional[str] = None


class CategoryResponse(BaseModel):
    id: UUID
    name: str
    icon: Optional[str]
    is_default: bool
    user_id: Optional[UUID]
    created_at: datetime

    class Config:
        from_attributes = True
