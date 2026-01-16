NRCA Demo White Paper
======================

Executive Summary
-----------------
The NRCA Demo is a lightweight, non-production application presented as a **DHA option** for demonstrating how NE&S PWS requirements can be satisfied through integrated data collection, normalization, and reporting. It is intentionally built with stub data and a switch to live connectors to provide a credible, low-risk demonstration while protecting real data. The demo shows clear alignment to several PRS items and provides a practical foundation for expanding to full PWS compliance.

Problem Context (PWS Alignment)
-------------------------------
The NE&S PWS requires enterprise and local IT support with measurable service outcomes and recurring reporting. Key PRS items emphasize inventory accuracy, vulnerability management, incident response metrics, and monthly progress reporting. The NRCA Demo focuses on these measurable outcomes and demonstrates how data from required systems can be aggregated and transformed into decision-ready metrics.

Solution Overview (Optional DHA Capability)
-------------------------------------------
The NRCA Demo provides DHA with a low-risk, evaluative capability that can be adopted as an option. It consists of:
- **FastAPI backend** with connector framework and aggregation services.
- **Next.js frontend** that visualizes metrics and integration status.
- **Stub/live toggle** that supports safe demonstrations without credentials.
- **Monthly Progress Report (MPR) export** to show a repeatable reporting mechanism.

Architecture Summary
--------------------
- **Connectors**: ServiceNow, Splunk, SolarWinds, Cisco ISE.
- **Normalization and aggregation**: Metrics derived from incident, alert, and inventory data.
- **Reporting**: Dashboard tiles and CSV export for MPR use.
- **Deployment**: Local or containerized (Docker Compose).

PWS and PRS Mapping (Current Capability)
----------------------------------------
The table below shows where the demo aligns to PRS requirements today.

| PRS # | Requirement (abridged) | Current Support | Evidence in Demo |
|------:|-------------------------|----------------|------------------|
| 6 | Inventory accuracy (semi-annual) | Partial (metric demo) | Inventory accuracy % derived from CMDB vs discovered flags |
| 7 | Patch compliance rate | Partial (metric demo) | Patch compliance % derived from patch_compliant flag |
| 10 | MTTD for incidents | Gap (not computed) | Not implemented |
| 11 | MTTR to respond | Gap (not computed) | Not implemented |
| 12 | MTTR to resolve | Gap (not computed) | Not implemented |
| 13 | Incidents by severity | Partial (count by severity possible) | Incident severity fields available via ServiceNow connector |
| 8 | Vulnerability remediation time | Gap (not computed) | Not implemented |
| 9 | Unresolved high/critical vulnerabilities | Gap (not computed) | Not implemented |
| 14 | Access review compliance | Gap (not modeled) | Not implemented |
| 15 | Unauthorized access attempts | Gap (not modeled) | Not implemented |
| 16 | Audit remediation rate | Gap (not modeled) | Not implemented |
| 17 | Security policy assessment compliance | Gap (not modeled) | Not implemented |
| 18 | Ticket accuracy | Gap (not modeled) | Not implemented |

Notes:
- The demo is designed to show how metrics can be computed; it is not a full PWS delivery system.
- Stub payloads intentionally limit scope to enable fast, safe demonstration.

Why DHA Should Consider This as an Option
-----------------------------------------
1. **Low-risk evaluation**: Stub data enables DHA to evaluate alignment without exposing sensitive data.
2. **Accelerated readiness**: Connector framework and reporting logic shorten time-to-value.
3. **Composable fit**: The solution can be integrated incrementally alongside existing systems.
4. **Traceable alignment**: Metrics can be mapped directly to PRS items for auditability.

How the Demo Supports PWS Objectives
------------------------------------
1. **Integrated visibility**: By aggregating ServiceNow incidents, Splunk alerts, SolarWinds inventory, and Cisco ISE endpoints, the demo shows a single integrated view for DHA sites.
2. **Measurable outcomes**: The demo focuses on quantifiable metrics (inventory accuracy, patch compliance, incident and alert counts) that correspond to PRS reporting needs.
3. **Reporting readiness**: The MPR export demonstrates a repeatable reporting mechanism aligned to monthly reporting expectations.
4. **Scalable pattern**: The connector architecture is extensible for additional PRS metrics and data sources.

Compliance Gaps and Required Enhancements
-----------------------------------------
To fully align with the PWS, the following enhancements are required:
- Add **vulnerability remediation timing** and **unresolved vulnerability counts** (PRS #8–#9).
- Compute **MTTD/MTTR** metrics using incident timelines (PRS #10–#12).
- Add **access review**, **unauthorized access**, **audit remediation**, and **ticket accuracy** data models (PRS #14–#18).
- Add operational reporting workflows for **surveys**, **complaints**, and **report submission tracking** (PRS #1–#5).

Recommended Next Steps
----------------------
1. **Extend stub schemas** to include timestamps needed for MTTD/MTTR and remediation time.
2. **Implement PRS metrics** in the backend aggregator and add to the MPR export.
3. **Add a PRS mapping panel** in the UI to show which PRS items each widget satisfies.
4. **Introduce compliance thresholds** and alerts to reflect AQL targets in the PWS.

Conclusion
----------
The NRCA Demo is a credible, low-risk prototype that demonstrates how a production solution can satisfy the NE&S PWS. It already aligns with several PRS metrics and provides an extensible foundation for complete compliance. With targeted additions, it can be evolved into a full PWS-aligned reporting and operations platform.

