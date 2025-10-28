from __future__ import annotations

import sys
from pathlib import Path
import pytest


# Ensure the Backend folder is on sys.path so `import app...` works
THIS_FILE = Path(__file__).resolve()
# tests -> app -> Backend
BACKEND_DIR = THIS_FILE.parents[2]  # .../Shop_fast/Backend
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))


# Skip tests that require httpx/TestClient if httpx isn't installed
pytest.importorskip("httpx")

from fastapi.testclient import TestClient  # type: ignore
from app.main import app as fastapi_app


@pytest.fixture(autouse=True)
def _disable_real_db_startup(monkeypatch):
    """Ensure tests don't hit the real database by no-oping init_db used in lifespan."""
    from app.service import database as db

    async def _noop():
        return None

    monkeypatch.setattr(db, "init_db", _noop)


@pytest.fixture(scope="session")
def app():
    # Avoid hitting real DB by removing startup/shutdown handlers
    fastapi_app.router.on_startup.clear()
    fastapi_app.router.on_shutdown.clear()
    return fastapi_app


@pytest.fixture()
def client(app) -> TestClient:
    return TestClient(app)
