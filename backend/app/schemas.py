from pydantic import BaseModel
from typing import List, Dict, Any

class IntegrationStatus(BaseModel):
    name: str
    mode: str  # stub/live
    connected: bool
    last_pull_utc: str | None = None
    detail: str | None = None

class DashboardSummary(BaseModel):
    inventory_accuracy_pct: float
    patch_compliance_pct: float
    open_incidents: int
    high_sev_alerts_24h: int
    sites_at_risk: List[Dict[str, Any]]  # simplified

class MPRRow(BaseModel):
    metric: str
    value: str
    notes: str | None = None

