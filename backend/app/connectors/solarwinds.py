import json
from pathlib import Path
from typing import Any, Dict, List
from datetime import datetime, timezone
import httpx

from .base import Connector
from app.config import settings

STUB_PATH = Path(__file__).resolve().parents[1] / "stubs" / "solarwinds_nodes.json"

class SolarWindsConnector(Connector):
    name = "SolarWinds"

    async def test_connection(self) -> Dict[str, Any]:
        if self.mode == "stub":
            return {"ok": True, "mode": "stub", "detail": "Using stub payload"}
        if not (settings.SW_BASE_URL and settings.SW_USER and settings.SW_PASS):
            return {"ok": False, "mode": "live", "detail": "Missing SolarWinds env vars"}
        try:
            async with httpx.AsyncClient(timeout=10, verify=False) as client:
                url = f"{settings.SW_BASE_URL}/SolarWinds/InformationService/v3/Json/Query"
                # Many SolarWinds deployments use SWIS; auth varies.
                r = await client.post(url, json={"query": "SELECT TOP 1 NodeID FROM Orion.Nodes"},
                                      auth=(settings.SW_USER, settings.SW_PASS))
                return {"ok": r.status_code in (200, 401, 403), "mode": "live", "detail": f"HTTP {r.status_code}"}
        except Exception as e:
            return {"ok": False, "mode": "live", "detail": str(e)}

    async def pull(self) -> List[Dict[str, Any]]:
        self.last_pull = datetime.now(timezone.utc)
        if self.mode == "stub":
            return json.loads(STUB_PATH.read_text())
        return []

