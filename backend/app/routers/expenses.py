from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.auth import get_current_user, AuthenticatedUser
from app.database import supabase
from app.schemas.expenses import ExpenseCreate, ExpenseUpdate, ExpenseResponse
from typing import List, Optional

router = APIRouter(prefix="/expenses", tags=["expenses"])


@router.get("", response_model=List[ExpenseResponse])
async def get_expenses(
    current_user: AuthenticatedUser = Depends(get_current_user),
    category_id: Optional[str] = Query(None),
    month: Optional[int] = Query(None),
    year: Optional[int] = Query(None),
    limit: int = Query(50, le=200),
    offset: int = Query(0)
):
    query = supabase.table("expenses").select("*").eq(
        "user_id", current_user.id
    )

    if category_id:
        query = query.eq("category_id", category_id)
    if month and year:
        from datetime import date
        start = date(year, month, 1)
        import calendar
        end = date(year, month, calendar.monthrange(year, month)[1])
        query = query.gte("date", str(start)).lte("date", str(end))

    response = query.order("date", desc=True).range(offset, offset + limit - 1).execute()
    return response.data


@router.get("/{expense_id}", response_model=ExpenseResponse)
async def get_expense(
    expense_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    response = supabase.table("expenses").select("*").eq(
        "id", expense_id
    ).eq("user_id", current_user.id).execute()

    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )
    return response.data[0]


@router.post("", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
async def create_expense(
    payload: ExpenseCreate,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    data = {
        **payload.model_dump(),
        "user_id": current_user.id,
        "category_id": str(payload.category_id),
        "date": str(payload.date),
        "currency": payload.currency.value
    }
    response = supabase.table("expenses").insert(data).execute()
    return response.data[0]


@router.put("/{expense_id}", response_model=ExpenseResponse)
async def update_expense(
    expense_id: str,
    payload: ExpenseUpdate,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    existing = supabase.table("expenses").select("*").eq(
        "id", expense_id
    ).eq("user_id", current_user.id).execute()

    if not existing.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )

    update_data = {}
    for k, v in payload.model_dump().items():
        if v is not None:
            if k == "currency":
                update_data[k] = v.value
            elif k in ["category_id", "date"]:
                update_data[k] = str(v)
            else:
                update_data[k] = v

    response = supabase.table("expenses").update(update_data).eq(
        "id", expense_id
    ).execute()
    return response.data[0]


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_expense(
    expense_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    existing = supabase.table("expenses").select("*").eq(
        "id", expense_id
    ).eq("user_id", current_user.id).execute()

    if not existing.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )

    supabase.table("expenses").delete().eq("id", expense_id).execute()
