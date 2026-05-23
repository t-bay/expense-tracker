from unittest.mock import MagicMock

USER_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
CAT_ID  = "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22"
BUD_ID  = "e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55"

MOCK_BUDGET = {
    "id": BUD_ID,
    "user_id": USER_ID,
    "category_id": CAT_ID,
    "amount": 500.00,
    "currency": "CAD",
    "month": 5,
    "year": 2025,
    "created_at": "2025-05-01T00:00:00+00:00",
    "updated_at": "2025-05-01T00:00:00+00:00"
}


def test_get_budgets(client, mock_supabase):
    mock_response = MagicMock()
    mock_response.data = [MOCK_BUDGET]
    mock_supabase["budgets"].table.return_value.select.return_value \
        .eq.return_value.order.return_value.order.return_value \
        .execute.return_value = mock_response

    response = client.get("/budgets")
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_create_budget(client, mock_supabase):
    mock_response = MagicMock()
    mock_response.data = [MOCK_BUDGET]
    mock_supabase["budgets"].table.return_value.insert.return_value \
        .execute.return_value = mock_response

    response = client.post("/budgets", json={
        "category_id": CAT_ID,
        "amount": 500.00,
        "currency": "CAD",
        "month": 5,
        "year": 2025
    })
    assert response.status_code == 201
    assert response.json()["amount"] == 500.00


def test_delete_budget(client, mock_supabase):
    select_response = MagicMock()
    select_response.data = [MOCK_BUDGET]
    mock_supabase["budgets"].table.return_value.select.return_value \
        .eq.return_value.eq.return_value.execute.return_value = select_response

    delete_response = MagicMock()
    delete_response.data = []
    mock_supabase["budgets"].table.return_value.delete.return_value \
        .eq.return_value.execute.return_value = delete_response

    response = client.delete(f"/budgets/{BUD_ID}")
    assert response.status_code == 204
