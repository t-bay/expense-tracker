from unittest.mock import MagicMock

CAT_ID = "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22"

MOCK_EXPENSES = [
    {"amount": 50.00, "currency": "CAD", "category_id": CAT_ID},
    {"amount": 120.00, "currency": "CAD", "category_id": CAT_ID},
]

MOCK_BUDGETS = [
    {"amount": 500.00, "currency": "CAD", "category_id": CAT_ID},
]


def test_get_summary(client, mock_supabase):
    expenses_response = MagicMock()
    expenses_response.data = MOCK_EXPENSES
    mock_supabase["summary"].table.return_value.select.return_value \
        .eq.return_value.gte.return_value.lte.return_value \
        .execute.return_value = expenses_response

    budgets_response = MagicMock()
    budgets_response.data = MOCK_BUDGETS
    mock_supabase["summary"].table.return_value.select.return_value \
        .eq.return_value.eq.return_value.eq.return_value \
        .execute.return_value = budgets_response

    response = client.get("/summary?month=5&year=2025")
    assert response.status_code == 200
    data = response.json()
    assert data["total_spent"] == 170.00
    assert data["total_budgeted"] == 500.00
    assert data["remaining"] == 330.00
    assert data["expense_count"] == 2
