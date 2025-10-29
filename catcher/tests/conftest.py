import pytest
from fastapi.testclient import TestClient

from main import app


@pytest.fixture
def client():
    """Create a TestClient for testing API endpoints."""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def sample_user_data():
    """Sample user data for tests."""
    return {
        "username": "testuser",
        "password": "testpassword123",
        "avatar_url": "https://example.com/avatar.jpg",
    }


@pytest.fixture
def sample_track_url():
    """Sample track URL for tests."""
    return "https://soundcloud.com/example/track"
