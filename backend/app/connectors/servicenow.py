import json
from pathlib import Path
from typing import Any, Dict, List
from datetime import datetime, timezone
import httpx

from .base import Connector
from app.config import settings

STUB_PATH = Path(__file__).resolve().parents[1] / "stubs" / "servicenow_incidents.json"

class ServiceNowConnector(Connector):
    name = "ServiceNow"

    async def test_connection(self) -> Dict[str, Any]:
        if self.mode == "stub":
            return {"ok": True, "mode": "stub", "detail": "Using stub payload"}
        # Live: basic auth GET
        if not (settings.SN_INSTANCE and settings.SN_USER and settings.SN_PASS):
            return {"ok": False, "mode": "live", "detail": "Missing ServiceNow env vars"}
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                url = f"{settings.SN_INSTANCE}/api/now/table/incident?sysparm_limit=1"
                r = await client.get(url, auth=(settings.SN_USER, settings.SN_PASS))
                return {"ok": r.status_code == 200, "mode": "live", "detail": f"HTTP {r.status_code}"}
        except Exception as e:
            return {"ok": False, "mode": "live", "detail": str(e)}

    async def pull(self) -> List[Dict[str, Any]]:
        self.last_pull = datetime.now(timezone.utc)
        if self.mode == "stub":
            return json.loads(STUB_PATH.read_text())
        # Live pull
        async with httpx.AsyncClient(timeout=20) as client:
            url = f"{settings.SN_INSTANCE}/api/now/table/incident?sysparm_limit=200"
            r = await client.get(url, auth=(settings.SN_USER, settings.SN_PASS))
            r.raise_for_status()
            data = r.json().get("result", [])
            # Normalize to demo-friendly shape
            out = []
            for row in data:
                out.append({
                    "ticket_id": row.get("number", row.get("sys_id")),
                    "site": row.get("location", "UNKNOWN"),
                    "priority": row.get("priority"),
                    "state": row.get("state"),
                    "opened_at": row.get("opened_at") or row.get("sys_created_on"),
                    "updated_at": row.get("sys_updated_on"),
                })
            return out

