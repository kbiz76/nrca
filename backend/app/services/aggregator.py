from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List
from app.connectors.servicenow import ServiceNowConnector
from app.connectors.splunk import SplunkConnector
from app.connectors.solarwinds import SolarWindsConnector
from app.connectors.ciscoise import CiscoISEConnector

def _risk_score(site: str, inv_gap: int, old_alerts: int, open_inc: int) -> int:
    score = 0
    score += min(inv_gap * 8, 40)
    score += min(old_alerts * 10, 30)
    score += min(open_inc * 5, 30)
    return min(score, 100)

async def build_dashboard(mode: str) -> Dict[str, Any]:
    sn = ServiceNowConnector(mode=mode)
    sp = SplunkConnector(mode=mode)
    sw = SolarWindsConnector(mode=mode)
    ise = CiscoISEConnector(mode=mode)

    incidents = await sn.pull()
    alerts = await sp.pull()
    nodes = await sw.pull()
    endpoints = await ise.pull()

    # Inventory accuracy: treat "cmdb_present" vs "discovered" as demo assumptions
    # Here we derive discrepancies from stub payload fields.
    total_assets = len(nodes) if nodes else 1
    inv_discrepancies = sum(1 for n in nodes if n.get("cmdb_present") is False or n.get("discovered") is False)
    inventory_accuracy_pct = max(0.0, 100.0 * (total_assets - inv_discrepancies) / total_assets)

    # Patch compliance: from stub nodes field patch_compliant boolean
    patch_total = total_assets
    patch_good = sum(1 for n in nodes if n.get("patch_compliant") is True)
    patch_compliance_pct = max(0.0, 100.0 * patch_good / patch_total)

    # Open incidents count
    open_incidents = sum(1 for i in incidents if str(i.get("state", "")).lower() not in ("closed", "resolved"))

    # High sev alerts in last 24h (stub contains created_at ISO)
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(hours=24)

    def _parse_dt(s: str | None) -> datetime:
        if not s:
            return now - timedelta(days=30)
        try:
            return datetime.fromisoformat(s.replace("Z", "+00:00"))
        except Exception:
            return now - timedelta(days=30)

    high_sev_alerts_24h = sum(
        1 for a in alerts
        if a.get("severity") in ("high", "critical") and _parse_dt(a.get("created_at")) >= cutoff
    )

    # Site risk table (group by site)
    sites = sorted(set([n.get("site", "UNKNOWN") for n in nodes] + [i.get("site", "UNKNOWN") for i in incidents]))
    at_risk: List[Dict[str, Any]] = []
    for s in sites:
        inv_gap = sum(1 for n in nodes if n.get("site") == s and (n.get("cmdb_present") is False or n.get("discovered") is False))
        old_alerts = sum(1 for a in alerts if a.get("site") == s and a.get("severity") in ("high", "critical") and _parse_dt(a.get("created_at")) < cutoff)
        open_inc = sum(1 for i in incidents if i.get("site") == s and str(i.get("state", "")).lower() not in ("closed", "resolved"))
        score = _risk_score(s, inv_gap, old_alerts, open_inc)
        at_risk.append({"site": s, "risk_score": score, "inv_gap": inv_gap, "old_alerts": old_alerts, "open_incidents": open_inc})

    at_risk.sort(key=lambda x: x["risk_score"], reverse=True)

    return {
        "inventory_accuracy_pct": round(inventory_accuracy_pct, 2),
        "patch_compliance_pct": round(patch_compliance_pct, 2),
        "open_incidents": open_incidents,
        "high_sev_alerts_24h": high_sev_alerts_24h,
        "sites_at_risk": at_risk[:10],
    }

async def integration_status(mode: str) -> List[Dict[str, Any]]:
    connectors = [
        ServiceNowConnector(mode=mode),
        SplunkConnector(mode=mode),
        SolarWindsConnector(mode=mode),
        CiscoISEConnector(mode=mode),
    ]
    out = []
    for c in connectors:
        test = await c.test_connection()
        out.append({
            "name": c.name,
            "mode": mode,
            "connected": bool(test.get("ok")),
            "detail": test.get("detail"),
            "last_pull_utc": c.last_pull.isoformat() if c.last_pull else None,
        })
    return out

def build_mpr_rows(dash: Dict[str, Any]) -> List[Dict[str, str]]:
    return [
        {"metric": "Inventory Accuracy", "value": f'{dash["inventory_accuracy_pct"]}%', "notes": "Derived from discovered vs CMDB flags (demo model)"},
        {"metric": "Patch Compliance", "value": f'{dash["patch_compliance_pct"]}%', "notes": "Derived from node patch_compliant flags (demo model)"},
        {"metric": "Open Incidents", "value": str(dash["open_incidents"]), "notes": "ServiceNow incident state filter"},
        {"metric": "High/Critical Alerts (24h)", "value": str(dash["high_sev_alerts_24h"]), "notes": "Splunk alert severity + timestamp window"},
        {"metric": "Top Sites at Risk", "value": ", ".join([x["site"] for x in dash["sites_at_risk"][:5]]), "notes": "Composite risk scoring (inventory, alerts aging, open incidents)"},
    ]

