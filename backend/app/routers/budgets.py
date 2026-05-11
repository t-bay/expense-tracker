from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.auth import get_current_user, AuthenticatedUser
from app.database import supabase
from app.schemas.budgets import BudgetCreate, BudgetUpdate, BudgetResponse
from typing import List, Optional

router = APIRouter(prefix="/budgets", tags=["budgets"])


@router.get("", response_model=List[BudgetResponse])
async def get_budgets(
    current_user: AuthenticatedUser = Depends(get_current_user),
    month: Optional[int] = Query(None),
    year: Optional[int] = Query(None)
):
    query = supabase.table("budgets").select("*").eq("user_id", current_user.id)

    if month:
        query = query.eq("month", month)
    if year:
        query = query.eq("year", year)

    response = query.order("year", desc=True).order("month", desc=True).execute()
    return response.data


@router.post("", response_model=BudgetResponse, status_code=status.HTTP_201_CREATED)
async def create_budget(
    payload: BudgetCreate,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    data = {
        **payload.model_dump(),
        "user_id": current_user.id,
        "category_id": str(payload.category_id),
        "currency": payload.currency.value
    }
    try:
        response = supabase.table("budgets").insert(data).execute()
        return response.data[0]
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A budget already exists for this category and month"
        )


@router.put("/{budget_id}", response_model=BudgetResponse)
async def update_budget(
    budget_id: str,
    payload: BudgetUpdate,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    existing = supabase.table("budgets").select("*").eq(
        "id", budget_id
    ).eq("user_id", current_user.id).execute()

    if not existing.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found"
        )

    update_data = {}
    for k, v in payload.model_dump().items():
        if v is not None:
            update_data[k] = v.value if k == "currency" else v

    response = supabase.table("budgets").update(update_data).eq(
        "id", budget_id
    ).execute()
    return response.data[0]


@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_budget(
    budget_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    existing = supabase.table("budgets").select("*").eq(
        "id", budget_id
    ).eq("user_id", current_user.id).execute()

    if not existing.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found"
        )

    supabase.table("budgets").delete().eq("id", budget_id).execute()
