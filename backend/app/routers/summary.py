from fastapi import APIRouter, Depends, Query
from app.auth import get_current_user, AuthenticatedUser
from app.database import supabase
from datetime import date
import calendar

router = APIRouter(prefix="/summary", tags=["summary"])


@router.get("")
async def get_summary(
    current_user: AuthenticatedUser = Depends(get_current_user),
    month: int = Query(default=date.today().month),
    year: int = Query(default=date.today().year)
):
    start = date(year, month, 1)
    end = date(year, month, calendar.monthrange(year, month)[1])

    expenses_res = supabase.table("expenses").select(
        "amount, currency, category_id"
    ).eq("user_id", current_user.id).gte(
        "date", str(start)
    ).lte("date", str(end)).execute()

    budgets_res = supabase.table("budgets").select(
        "amount, currency, category_id"
    ).eq("user_id", current_user.id).eq(
        "month", month
    ).eq("year", year).execute()

    total_spent = sum(e["amount"] for e in expenses_res.data)
    total_budgeted = sum(b["amount"] for b in budgets_res.data)

    spent_by_category = {}
    for e in expenses_res.data:
        cat_id = e["category_id"]
        spent_by_category[cat_id] = spent_by_category.get(cat_id, 0) + e["amount"]

    return {
        "month": month,
        "year": year,
        "total_spent": round(total_spent, 2),
        "total_budgeted": round(total_budgeted, 2),
        "remaining": round(total_budgeted - total_spent, 2),
        "spent_by_category": spent_by_category,
        "expense_count": len(expenses_res.data)
    }
