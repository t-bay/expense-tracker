from pydantic import BaseModel, UUID4
from typing import Optional
from datetime import datetime, date
from enum import Enum


class CurrencyCode(str, Enum):
    NGN = "NGN"
    CAD = "CAD"
    USD = "USD"
    GBP = "GBP"
    AED = "AED"


class ExpenseCreate(BaseModel):
    category_id: UUID4
    amount: float
    currency: CurrencyCode
    description: Optional[str] = None
    date: date


class ExpenseUpdate(BaseModel):
    category_id: Optional[UUID4] = None
    amount: Optional[float] = None
    currency: Optional[CurrencyCode] = None
    description: Optional[str] = None
    date: Optional[date] = None


class ExpenseResponse(BaseModel):
    id: UUID4
    user_id: UUID4
    category_id: UUID4
    recurring_id: Optional[UUID4]
    amount: float
    currency: CurrencyCode
    description: Optional[str]
    date: date
    is_recurring: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
