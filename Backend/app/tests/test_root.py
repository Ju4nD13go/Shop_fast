from typing import Any


def test_root_ok(client) -> None:
    resp = client.get("/")
    assert resp.status_code == 200
    data: dict[str, Any] = resp.json()
    assert data.get("status") == "online"
    assert data.get("message")
    assert data.get("version")


def test_openapi_docs_available(client) -> None:
    # Swagger UI
    docs = client.get("/docs")
    assert docs.status_code == 200

    # OpenAPI schema
    openapi = client.get("/openapi.json")
    assert openapi.status_code == 200
    schema = openapi.json()
    assert "openapi" in schema
    assert "paths" in schema
