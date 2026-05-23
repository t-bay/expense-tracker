from fastapi import APIRouter, Depends, HTTPException, status
from app.auth import get_current_user, AuthenticatedUser
from app.database import supabase
from app.schemas.recurring import RecurringCreate, RecurringUpdate, RecurringResponse
from typing import List
from datetime import date
from dateutil.relativedelta import relativedelta

router = APIRouter(prefix="/recurring", tags=["recurring"])


def calculate_next_due(start_date: date) -> date:
    today = date.today()
    next_due = start_date
    while next_due <= today:
        next_due = next_due + relativedelta(months=1)
    return next_due


@router.get("", response_model=List[RecurringResponse])
async def get_recurring(
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    response = supabase.table("recurring").select("*").eq(
        "user_id", current_user.id
    ).order("created_at", desc=True).execute()
    return response.data


@router.post("", response_model=RecurringResponse, status_code=status.HTTP_201_CREATED)
async def create_recurring(
    payload: RecurringCreate,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    next_due = calculate_next_due(payload.start_date)
    data = {
        **payload.model_dump(),
        "user_id": current_user.id,
        "category_id": str(payload.category_id),
        "currency": payload.currency.value,
        "start_date": str(payload.start_date),
        "end_date": str(payload.end_date) if payload.end_date else None,
        "next_due": str(next_due),
        "frequency": "monthly"
    }
    response = supabase.table("recurring").insert(data).execute()
    return response.data[0]


@router.put("/{recurring_id}", response_model=RecurringResponse)
async def update_recurring(
    recurring_id: str,
    payload: RecurringUpdate,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    existing = supabase.table("recurring").select("*").eq(
        "id", recurring_id
    ).eq("user_id", current_user.id).execute()

    if not existing.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recurring rule not found"
        )

    update_data = {}
    for k, v in payload.model_dump().items():
        if v is not None:
            if k == "currency":
                update_data[k] = v.value
            elif k == "end_date":
                update_data[k] = str(v)
            else:
                update_data[k] = v

    response = supabase.table("recurring").update(update_data).eq(
        "id", recurring_id
    ).execute()
    return response.data[0]


@router.delete("/{recurring_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_recurring(
    recurring_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    existing = supabase.table("recurring").select("*").eq(
        "id", recurring_id
    ).eq("user_id", current_user.id).execute()

    if not existing.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recurring rule not found"
        )

    supabase.table("recurring").delete().eq("id", recurring_id).execute()
