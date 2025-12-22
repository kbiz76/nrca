from pydantic import BaseModel
from datetime import datetime

class Site(BaseModel):
    site_id: str
    name: str
    region: str | None = None

class Asset(BaseModel):
    asset_id: str
    hostname: str
    ip: str | None = None
    site_id: str
    discovered: bool = True
    cmdb_present: bool = True
    last_seen: datetime | None = None

class Ticket(BaseModel):
    ticket_id: str
    source: str  # e.g., "servicenow"
    site_id: str
    category: str  # incident/request/change
    priority: str | None = None
    state: str | None = None
    opened_at: datetime
    updated_at: datetime | None = None

class Alert(BaseModel):
    alert_id: str
    source: str  # splunk/solarwinds
    site_id: str
    severity: str  # info/low/med/high/critical
    created_at: datetime
    message: str

class ComplianceFinding(BaseModel):
    finding_id: str
    site_id: str
    type: str  # patch/vuln/config/inventory
    age_days: int
    severity: str

