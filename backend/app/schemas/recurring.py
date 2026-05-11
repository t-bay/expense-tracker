from pydantic import BaseModel
from uuid import UUID
from typing import Optional
from datetime import datetime, date
from app.schemas.expenses import CurrencyCode


class RecurringCreate(BaseModel):
    category_id: UUID
    amount: float
    currency: CurrencyCode
    description: Optional[str] = None
    start_date: date
    end_date: Optional[date] = None


class RecurringUpdate(BaseModel):
    amount: Optional[float] = None
    currency: Optional[CurrencyCode] = None
    description: Optional[str] = None
    end_date: Optional[date] = None
    is_active: Optional[bool] = None


class RecurringResponse(BaseModel):
    id: UUID
    user_id: UUID
    category_id: UUID
    amount: float
    currency: CurrencyCode
    description: Optional[str]
    frequency: str
    start_date: date
    end_date: Optional[date]
    next_due: date
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
