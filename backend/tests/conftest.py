import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from app.main import app
from app.auth import get_current_user, AuthenticatedUser

MOCK_USER = AuthenticatedUser(
    id="a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    email="test@example.com",
    role="authenticated"
)

def override_get_current_user():
    return MOCK_USER

app.dependency_overrides[get_current_user] = override_get_current_user


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def mock_supabase():
    with patch("app.routers.categories.supabase") as mock_cat, \
         patch("app.routers.expenses.supabase") as mock_exp, \
         patch("app.routers.budgets.supabase") as mock_bud, \
         patch("app.routers.recurring.supabase") as mock_rec, \
         patch("app.routers.summary.supabase") as mock_sum:
        yield {
            "categories": mock_cat,
            "expenses": mock_exp,
            "budgets": mock_bud,
            "recurring": mock_rec,
            "summary": mock_sum
        }
