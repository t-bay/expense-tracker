from unittest.mock import MagicMock

USER_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
CAT_ID  = "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22"
REC_ID  = "f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66"

MOCK_RECURRING = {
    "id": REC_ID,
    "user_id": USER_ID,
    "category_id": CAT_ID,
    "amount": 1500.00,
    "currency": "CAD",
    "description": "Mortgage payment",
    "frequency": "monthly",
    "start_date": "2025-01-01",
    "end_date": None,
    "next_due": "2025-06-01",
    "is_active": True,
    "created_at": "2025-01-01T00:00:00+00:00",
    "updated_at": "2025-01-01T00:00:00+00:00"
}


def test_get_recurring(client, mock_supabase):
    mock_response = MagicMock()
    mock_response.data = [MOCK_RECURRING]
    mock_supabase["recurring"].table.return_value.select.return_value \
        .eq.return_value.order.return_value.execute.return_value = mock_response

    response = client.get("/recurring")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["frequency"] == "monthly"


def test_create_recurring(client, mock_supabase):
    mock_response = MagicMock()
    mock_response.data = [MOCK_RECURRING]
    mock_supabase["recurring"].table.return_value.insert.return_value \
        .execute.return_value = mock_response

    response = client.post("/recurring", json={
        "category_id": CAT_ID,
        "amount": 1500.00,
        "currency": "CAD",
        "description": "Mortgage payment",
        "start_date": "2025-01-01"
    })
    assert response.status_code == 201
    assert response.json()["is_active"] is True


def test_deactivate_recurring(client, mock_supabase):
    select_response = MagicMock()
    select_response.data = [MOCK_RECURRING]
    mock_supabase["recurring"].table.return_value.select.return_value \
        .eq.return_value.eq.return_value.execute.return_value = select_response

    update_response = MagicMock()
    update_response.data = [{**MOCK_RECURRING, "is_active": False}]
    mock_supabase["recurring"].table.return_value.update.return_value \
        .eq.return_value.execute.return_value = update_response

    response = client.put(f"/recurring/{REC_ID}", json={"is_active": False})
    assert response.status_code == 200
    assert response.json()["is_active"] is False
