from fastapi import APIRouter, Depends, HTTPException, status
from app.auth import get_current_user, AuthenticatedUser
from app.database import supabase
from app.schemas.categories import CategoryCreate, CategoryUpdate, CategoryResponse
from typing import List

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=List[CategoryResponse])
async def get_categories(
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    response = supabase.table("categories").select("*").or_(
        f"is_default.eq.true,user_id.eq.{current_user.id}"
    ).order("name").execute()
    return response.data


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    payload: CategoryCreate,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    data = {
        **payload.model_dump(),
        "user_id": current_user.id,
        "is_default": False
    }
    response = supabase.table("categories").insert(data).execute()
    return response.data[0]


@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: str,
    payload: CategoryUpdate,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    existing = supabase.table("categories").select("*").eq(
        "id", category_id
    ).eq("user_id", current_user.id).execute()

    if not existing.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found or not editable"
        )

    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    response = supabase.table("categories").update(update_data).eq(
        "id", category_id
    ).execute()
    return response.data[0]


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    existing = supabase.table("categories").select("*").eq(
        "id", category_id
    ).eq("user_id", current_user.id).execute()

    if not existing.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found or not deletable"
        )

    supabase.table("categories").delete().eq("id", category_id).execute()
