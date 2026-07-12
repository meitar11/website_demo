"""Smoke tests for the FastAPI endpoints via the test client."""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_ok():
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


def test_recommendations_for_known_product():
    resp = client.get("/recommendations/p1")
    assert resp.status_code == 200
    body = resp.json()
    assert body["product_id"] == "p1"
    assert len(body["recommendations"]) == 3


def test_recommendations_unknown_product_404():
    resp = client.get("/recommendations/does-not-exist")
    assert resp.status_code == 404
