# NRCA Demo - FastAPI + Next.js

Enterprise demo package for Network Risk and Compliance Assessment (NRCA) with **zero real data** while showing **credible hooks** to ServiceNow/Splunk/SolarWinds/Cisco ISE.

## Architecture

- **FastAPI Backend**: Normalized data model, connector framework with STUB/LIVE toggle, aggregation endpoints, MPR export
- **Next.js Frontend**: Dashboard + integrations page with live/stub toggle, charts/tiles using API endpoints

## Quick Start

### Prerequisites

- Python 3.10+ with `venv`
- Node.js 18+ with npm

### Ready to Run

**Step 1: Start the Backend**

```bash
cd backend
python -m venv .venv

# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The backend will be available at `http://localhost:8000`

**Step 2: Start the Frontend** (in a new terminal)

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

**Step 3: Open in Browser**

- Dashboard: `http://localhost:3000/?mode=stub`
- Integrations: `http://localhost:3000/integrations?mode=stub`

That's it! The demo runs in **stub mode** by default (no credentials needed).

## Usage

### Stub Mode (Default)

- **Dashboard**: `http://localhost:3000/?mode=stub`
- **Integrations**: `http://localhost:3000/integrations?mode=stub`

Stub mode uses realistic sample payloads from JSON files - no credentials needed.

### Live Mode

To use live connectors, create a `.env` file in the `backend` directory:

```env
NRCA_MODE=live

# ServiceNow
SN_INSTANCE=https://yourinstance.service-now.com
SN_USER=your_username
SN_PASS=your_password

# Splunk
SPLUNK_BASE_URL=https://splunk.company.mil:8089
SPLUNK_TOKEN=your_token

# SolarWinds
SW_BASE_URL=https://solarwinds.company.mil
SW_USER=your_username
SW_PASS=your_password

# Cisco ISE
ISE_BASE_URL=https://ise.company.mil
ISE_USER=your_username
ISE_PASS=your_password
```

Then access:
- **Dashboard**: `http://localhost:3000/?mode=live`
- **Integrations**: `http://localhost:3000/integrations?mode=live`

## API Endpoints

- `GET /health` - Health check
- `GET /api/dashboard/summary?mode=stub` - Dashboard metrics
- `GET /api/integrations/status?mode=stub` - Integration status
- `GET /api/mpr/export.csv?mode=stub` - MPR export (CSV)

## Project Structure

```
nrca-demo/
  backend/
    app/
      main.py              # FastAPI app
      config.py            # Settings (env vars)
      models.py            # Normalized data models
      schemas.py           # API response schemas
      services/
        aggregator.py      # Risk scoring + metrics
      connectors/
        base.py            # Connector interface
        servicenow.py      # ServiceNow connector
        splunk.py          # Splunk connector
        solarwinds.py      # SolarWinds connector
        ciscoise.py        # Cisco ISE connector
      stubs/
        *.json             # Stub data payloads
    requirements.txt
  frontend/
    app/
      layout.tsx           # Root layout
      page.tsx             # Dashboard
      integrations/
        page.tsx           # Integrations page
    lib/
      api.ts               # API client
    package.json
    next.config.js
  README.md
```

## Key Features

1. **Integration Contract**: Connector framework with `test_connection()` and `pull()` methods
2. **STUB/LIVE Toggle**: Switch between demo data and live connectors via query param or env var
3. **Normalization + Rules**: Risk scoring algorithm combining inventory gaps, alert aging, and open incidents
4. **MPR Export**: CSV export for Monthly Progress Reports

## Demo Value Proposition

When presenting to primes, highlight:

- ✅ **Integration contract exists** (connectors folder + test_connection)
- ✅ **Stub/live toggle** proves you can flip when credentials + approvals exist
- ✅ **Normalization + rules** are the real IP (aggregator risk scoring + metrics)
- ✅ **MPR export** is immediate operational value (admin burden reduction)

## Next Steps (Optional Enhancements)

- Transition Risk Heat Map page
- Aging buckets table for vulnerabilities/incidents
- Data lineage view (what fields came from which tool)
- "No PHI/PII handling" banner + configuration guardrails
- Docker Compose setup
- PDF MPR pack export (instead of CSV)
- PRS mapping panel (labels each widget with PRS # alignment)

## License

Internal demo use only.

