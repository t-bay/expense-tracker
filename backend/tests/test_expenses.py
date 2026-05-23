from unittest.mock import MagicMock

USER_ID  = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
CAT_ID   = "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22"
EXP_ID   = "d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44"

MOCK_EXPENSE = {
    "id": EXP_ID,
    "user_id": USER_ID,
    "category_id": CAT_ID,
    "recurring_id": None,
    "amount": 50.00,
    "currency": "CAD",
    "description": "Groceries",
    "date": "2025-05-01",
    "is_recurring": False,
    "created_at": "2025-05-01T00:00:00+00:00",
    "updated_at": "2025-05-01T00:00:00+00:00"
}


def test_get_expenses(client, mock_supabase):
    mock_response = MagicMock()
    mock_response.data = [MOCK_EXPENSE]
    mock_supabase["expenses"].table.return_value.select.return_value \
        .eq.return_value.order.return_value.range.return_value \
        .execute.return_value = mock_response

    response = client.get("/expenses")
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_get_expense_by_id(client, mock_supabase):
    mock_response = MagicMock()
    mock_response.data = [MOCK_EXPENSE]
    mock_supabase["expenses"].table.return_value.select.return_value \
        .eq.return_value.eq.return_value.execute.return_value = mock_response

    response = client.get(f"/expenses/{EXP_ID}")
    assert response.status_code == 200
    assert response.json()["amount"] == 50.00


def test_get_expense_not_found(client, mock_supabase):
    mock_response = MagicMock()
    mock_response.data = []
    mock_supabase["expenses"].table.return_value.select.return_value \
        .eq.return_value.eq.return_value.execute.return_value = mock_response

    response = client.get("/expenses/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a99")
    assert response.status_code == 404


def test_create_expense(client, mock_supabase):
    mock_response = MagicMock()
    mock_response.data = [MOCK_EXPENSE]
    mock_supabase["expenses"].table.return_value.insert.return_value \
        .execute.return_value = mock_response

    response = client.post("/expenses", json={
        "category_id": CAT_ID,
        "amount": 50.00,
        "currency": "CAD",
        "description": "Groceries",
        "date": "2025-05-01"
    })
    assert response.status_code == 201
    assert response.json()["currency"] == "CAD"


def test_delete_expense(client, mock_supabase):
    select_response = MagicMock()
    select_response.data = [MOCK_EXPENSE]
    mock_supabase["expenses"].table.return_value.select.return_value \
        .eq.return_value.eq.return_value.execute.return_value = select_response

    delete_response = MagicMock()
    delete_response.data = []
    mock_supabase["expenses"].table.return_value.delete.return_value \
        .eq.return_value.execute.return_value = delete_response

    response = client.delete(f"/expenses/{EXP_ID}")
    assert response.status_code == 204
