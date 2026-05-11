from pydantic import BaseModel, UUID4, field_validator
from typing import Optional
from datetime import datetime
from app.schemas.expenses import CurrencyCode


class BudgetCreate(BaseModel):
    category_id: UUID4
    amount: float
    currency: CurrencyCode
    month: int
    year: int

    @field_validator("month")
    @classmethod
    def validate_month(cls, v):
        if not 1 <= v <= 12:
            raise ValueError("Month must be between 1 and 12")
        return v

    @field_validator("year")
    @classmethod
    def validate_year(cls, v):
        if v < 2020:
            raise ValueError("Year must be 2020 or later")
        return v


class BudgetUpdate(BaseModel):
    amount: Optional[float] = None
    currency: Optional[CurrencyCode] = None


class BudgetResponse(BaseModel):
    id: UUID4
    user_id: UUID4
    category_id: UUID4
    amount: float
    currency: CurrencyCode
    month: int
    year: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
