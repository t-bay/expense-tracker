from unittest.mock import MagicMock

USER_ID     = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
CAT_ID      = "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22"
CUSTOM_ID   = "c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33"

MOCK_CATEGORY = {
    "id": CAT_ID,
    "name": "Food",
    "icon": "🍽️",
    "is_default": True,
    "user_id": None,
    "created_at": "2025-01-01T00:00:00+00:00"
}

MOCK_CUSTOM_CATEGORY = {
    "id": CUSTOM_ID,
    "name": "Gym",
    "icon": "💪",
    "is_default": False,
    "user_id": USER_ID,
    "created_at": "2025-01-01T00:00:00+00:00"
}


def test_get_categories(client, mock_supabase):
    mock_response = MagicMock()
    mock_response.data = [MOCK_CATEGORY, MOCK_CUSTOM_CATEGORY]
    mock_supabase["categories"].table.return_value.select.return_value \
        .or_.return_value.order.return_value.execute.return_value = mock_response

    response = client.get("/categories")
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_create_category(client, mock_supabase):
    mock_response = MagicMock()
    mock_response.data = [MOCK_CUSTOM_CATEGORY]
    mock_supabase["categories"].table.return_value.insert.return_value \
        .execute.return_value = mock_response

    response = client.post("/categories", json={"name": "Gym", "icon": "💪"})
    assert response.status_code == 201
    assert response.json()["name"] == "Gym"


def test_update_category(client, mock_supabase):
    select_response = MagicMock()
    select_response.data = [MOCK_CUSTOM_CATEGORY]
    mock_supabase["categories"].table.return_value.select.return_value \
        .eq.return_value.eq.return_value.execute.return_value = select_response

    update_response = MagicMock()
    update_response.data = [{**MOCK_CUSTOM_CATEGORY, "name": "Gym Updated"}]
    mock_supabase["categories"].table.return_value.update.return_value \
        .eq.return_value.execute.return_value = update_response

    response = client.put(f"/categories/{CUSTOM_ID}", json={"name": "Gym Updated"})
    assert response.status_code == 200
    assert response.json()["name"] == "Gym Updated"


def test_update_category_not_found(client, mock_supabase):
    mock_response = MagicMock()
    mock_response.data = []
    mock_supabase["categories"].table.return_value.select.return_value \
        .eq.return_value.eq.return_value.execute.return_value = mock_response

    response = client.put(
        "/categories/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a99",
        json={"name": "Ghost"}
    )
    assert response.status_code == 404


def test_delete_category(client, mock_supabase):
    select_response = MagicMock()
    select_response.data = [MOCK_CUSTOM_CATEGORY]
    mock_supabase["categories"].table.return_value.select.return_value \
        .eq.return_value.eq.return_value.execute.return_value = select_response

    delete_response = MagicMock()
    delete_response.data = []
    mock_supabase["categories"].table.return_value.delete.return_value \
        .eq.return_value.execute.return_value = delete_response

    response = client.delete(f"/categories/{CUSTOM_ID}")
    assert response.status_code == 204
