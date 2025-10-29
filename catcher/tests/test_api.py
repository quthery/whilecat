import pytest
from fastapi.testclient import TestClient


def test_root_endpoint(client: TestClient):
    """Test the root endpoint returns welcome message."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello from catcher!"}


def test_docs_available(client: TestClient):
    """Test that API documentation is available."""
    response = client.get("/docs")
    assert response.status_code == 200


# ============= USER ROUTES TESTS =============


def test_create_user(client: TestClient, sample_user_data):
    """Test creating a new user."""
    response = client.post("/users/", json=sample_user_data)
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == sample_user_data["username"]
    assert "id" in data


def test_create_user_duplicate_username(client: TestClient, sample_user_data):
    """Test that duplicate usernames are rejected."""
    # Create first user
    client.post("/users/", json=sample_user_data)

    # Try to create second user with same username
    response = client.post("/users/", json=sample_user_data)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"].lower()


def test_get_user_by_id(client: TestClient, sample_user_data):
    """Test getting a user by ID."""
    # Create user
    create_response = client.post("/users/", json=sample_user_data)
    user_id = create_response.json()["id"]

    # Get user
    response = client.get(f"/users/{user_id}")
    assert response.status_code == 200
    assert response.json()["username"] == sample_user_data["username"]


def test_get_user_not_found(client: TestClient):
    """Test getting non-existent user returns 404."""
    response = client.get("/users/99999")
    assert response.status_code == 404


def test_get_user_by_username(client: TestClient, sample_user_data):
    """Test getting a user by username."""
    # Create user
    client.post("/users/", json=sample_user_data)

    # Get by username
    response = client.get(f"/users/username/{sample_user_data['username']}")
    assert response.status_code == 200
    assert response.json()["username"] == sample_user_data["username"]


def test_get_users_list(client: TestClient, sample_user_data):
    """Test getting list of users."""
    # Create a few users
    for i in range(3):
        user_data = sample_user_data.copy()
        user_data["username"] = f"user{i}"
        client.post("/users/", json=user_data)

    # Get users list
    response = client.get("/users/")
    assert response.status_code == 200
    users = response.json()
    assert isinstance(users, list)
    assert len(users) >= 3


def test_get_users_pagination(client: TestClient, sample_user_data):
    """Test users list with pagination parameters."""
    # Create users
    for i in range(5):
        user_data = sample_user_data.copy()
        user_data["username"] = f"paguser{i}"
        client.post("/users/", json=user_data)

    # Get with pagination
    response = client.get("/users/?skip=0&limit=2")
    assert response.status_code == 200
    assert len(response.json()) <= 2


def test_update_user(client: TestClient, sample_user_data):
    """Test updating a user."""
    # Create user
    create_response = client.post("/users/", json=sample_user_data)
    user_id = create_response.json()["id"]

    # Update user
    update_data = {
        "id": user_id,
        "username": sample_user_data["username"],
        "avatar_url": "https://example.com/new-avatar.jpg",
    }
    response = client.put(f"/users/{user_id}", json=update_data)
    assert response.status_code == 200
    assert response.json()["avatar_url"] == "https://example.com/new-avatar.jpg"


def test_update_user_not_found(client: TestClient, sample_user_data):
    """Test updating non-existent user returns 404."""
    update_data = {
        "id": 99999,
        "username": "nonexistent",
    }
    response = client.put("/users/99999", json=update_data)
    assert response.status_code == 404


def test_delete_user(client: TestClient, sample_user_data):
    """Test deleting a user."""
    # Create user
    create_response = client.post("/users/", json=sample_user_data)
    user_id = create_response.json()["id"]

    # Delete user
    response = client.delete(f"/users/{user_id}")
    assert response.status_code == 200

    # Verify deletion
    get_response = client.get(f"/users/{user_id}")
    assert get_response.status_code == 404


def test_delete_user_not_found(client: TestClient):
    """Test deleting non-existent user returns 404."""
    response = client.delete("/users/99999")
    assert response.status_code == 404


def test_create_user_missing_fields(client: TestClient):
    """Test that missing required fields are validated."""
    # Missing password
    response = client.post("/users/", json={"username": "testuser"})
    assert response.status_code == 422

    # Missing username
    response = client.post("/users/", json={"password": "test123"})
    assert response.status_code == 422


def test_create_user_without_avatar(client: TestClient):
    """Test creating user without optional avatar field."""
    user_data = {"username": "noavatar", "password": "password123"}
    response = client.post("/users/", json=user_data)
    assert response.status_code == 200
    assert response.json()["avatar_url"] is None


# ============= TRACK ROUTES TESTS =============


def test_catch_track_missing_url(client: TestClient):
    """Test that catch endpoint requires URL."""
    response = client.post("/tracks/catch", json={})
    assert response.status_code == 400


# Note: Real track catching tests would require mocking yt-dlp
# or using actual URLs, which is not recommended for unit tests
# The test below is commented out because it calls real yt-dlp

# def test_catch_track_with_invalid_url(client: TestClient):
#     """Test catch endpoint with invalid URL."""
#     response = client.post(
#         "/tracks/catch",
#         json={"url": "https://invalid-url.com/track"},
#     )
#     assert response.status_code in [400, 500]


# ============= INTEGRATION TESTS =============


def test_user_lifecycle(client: TestClient, sample_user_data):
    """Test complete user lifecycle: create, read, update, delete."""
    # Create
    create_response = client.post("/users/", json=sample_user_data)
    assert create_response.status_code == 200
    user_id = create_response.json()["id"]

    # Read
    read_response = client.get(f"/users/{user_id}")
    assert read_response.status_code == 200

    # Update
    update_data = {
        "id": user_id,
        "username": sample_user_data["username"],
        "avatar_url": "https://example.com/updated.jpg",
    }
    update_response = client.put(f"/users/{user_id}", json=update_data)
    assert update_response.status_code == 200

    # Delete
    delete_response = client.delete(f"/users/{user_id}")
    assert delete_response.status_code == 200

    # Verify deletion
    final_response = client.get(f"/users/{user_id}")
    assert final_response.status_code == 404


def test_multiple_users_no_conflict(client: TestClient, sample_user_data):
    """Test creating multiple users with different usernames."""
    users = []
    for i in range(3):
        user_data = sample_user_data.copy()
        user_data["username"] = f"multiuser{i}"
        response = client.post("/users/", json=user_data)
        assert response.status_code == 200
        users.append(response.json())

    # Verify all have different IDs
    user_ids = [u["id"] for u in users]
    assert len(user_ids) == len(set(user_ids))


def test_cors_headers(client: TestClient):
    """Test that CORS headers are present."""
    response = client.options(
        "/",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert response.status_code == 200
    assert "access-control-allow-origin" in response.headers


def test_like_track(client: TestClient):
    """Test liking a track."""
    # Create a track
    track_data = {
        "url": "https://soundcloud.com/snyal/krov-pervyjkorol",
        "social": "soundcloud",
    }
    create_response = client.post("/tracks/catch", json=track_data)
    assert create_response.status_code == 200
    track_id = create_response.json()["id"]

    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpassword",
    }

    # Register the user
    register_response = client.post("/users/", json=user_data)
    assert register_response.status_code == 200
    user_id = register_response.json()["id"]

    like_response = client.post(f"/users/{user_id}/like/{track_id}")
    assert like_response.status_code == 200

    read_response = client.get(f"/users/user/{user_id}/likes")
    assert read_response.status_code == 200
    assert read_response.json()["likes"] == 1
