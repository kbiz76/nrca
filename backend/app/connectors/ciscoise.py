import json
from pathlib import Path
from typing import Any, Dict, List
from datetime import datetime, timezone
import httpx

from .base import Connector
from app.config import settings

STUB_PATH = Path(__file__).resolve().parents[1] / "stubs" / "ciscoise_endpoints.json"

class CiscoISEConnector(Connector):
    name = "Cisco ISE"

    async def test_connection(self) -> Dict[str, Any]:
        if self.mode == "stub":
            return {"ok": True, "mode": "stub", "detail": "Using stub payload"}
        if not (settings.ISE_BASE_URL and settings.ISE_USER and settings.ISE_PASS):
            return {"ok": False, "mode": "live", "detail": "Missing Cisco ISE env vars"}
        try:
            async with httpx.AsyncClient(timeout=10, verify=False) as client:
                # Endpoint varies by ISE version/features; keep as placeholder.
                url = f"{settings.ISE_BASE_URL}/ers/config/endpoint?size=1"
                r = await client.get(url, auth=(settings.ISE_USER, settings.ISE_PASS),
                                     headers={"Accept": "application/json"})
                return {"ok": r.status_code in (200, 401, 403), "mode": "live", "detail": f"HTTP {r.status_code}"}
        except Exception as e:
            return {"ok": False, "mode": "live", "detail": str(e)}

    async def pull(self) -> List[Dict[str, Any]]:
        self.last_pull = datetime.now(timezone.utc)
        if self.mode == "stub":
            return json.loads(STUB_PATH.read_text())
        return []

