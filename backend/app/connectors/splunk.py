import json
from pathlib import Path
from typing import Any, Dict, List
from datetime import datetime, timezone
import httpx

from .base import Connector
from app.config import settings

STUB_PATH = Path(__file__).resolve().parents[1] / "stubs" / "splunk_alerts.json"

class SplunkConnector(Connector):
    name = "Splunk"

    async def test_connection(self) -> Dict[str, Any]:
        if self.mode == "stub":
            return {"ok": True, "mode": "stub", "detail": "Using stub payload"}
        if not (settings.SPLUNK_BASE_URL and settings.SPLUNK_TOKEN):
            return {"ok": False, "mode": "live", "detail": "Missing Splunk env vars"}
        try:
            async with httpx.AsyncClient(timeout=10, verify=False) as client:
                # Basic "ping" against auth endpoint or server info (varies by org)
                url = f"{settings.SPLUNK_BASE_URL}/services/server/info?output_mode=json"
                r = await client.get(url, headers={"Authorization": f"Bearer {settings.SPLUNK_TOKEN}"})
                return {"ok": r.status_code == 200, "mode": "live", "detail": f"HTTP {r.status_code}"}
        except Exception as e:
            return {"ok": False, "mode": "live", "detail": str(e)}

    async def pull(self) -> List[Dict[str, Any]]:
        self.last_pull = datetime.now(timezone.utc)
        if self.mode == "stub":
            return json.loads(STUB_PATH.read_text())
        # Live demo placeholder (search job creation differs per org; keep thin)
        # You can replace with your org's approved saved search/job flow.
        return []

