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

## Docker Compose (Containerized Deployment)

### Prerequisites

- **Docker Desktop** (or Docker Engine + Docker Compose)
  - Download: https://www.docker.com/products/docker-desktop
  - Or install via winget: `winget install Docker.DockerDesktop`
  - Ensure Docker Desktop is running before proceeding
- Docker Compose v2.0+ (included with Docker Desktop)

### Quick Start with Docker

**Step 1: Build and Start Containers**

```bash
docker compose up --build -d
```

**Note:** Use `docker compose` (with space) for Docker Compose v2, or `docker-compose` (with hyphen) for v1.

This will:
- Build the backend and frontend Docker images
- Start both services
- Set up networking between containers
- Expose ports 8000 (backend) and 3000 (frontend)

**Step 2: Access the Application**

- **Dashboard**: http://localhost:3000/?mode=stub
- **Integrations**: http://localhost:3000/integrations?mode=stub
- **API Docs**: http://localhost:8000/docs

**Step 3: Verify Everything is Working**

Open your browser and verify:
- Dashboard: http://localhost:3000/?mode=stub
- Integrations: http://localhost:3000/integrations?mode=stub
- API Docs: http://localhost:8000/docs

**Step 4: Stop the Containers**

```bash
docker compose down
```

### Docker Compose with Environment Variables

To use live connectors in Docker, create a `.env` file in the project root:

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

Then start with:

```bash
docker compose up --build -d
```

**Note:** The `.env` file should be in the project root (same directory as `docker-compose.yml`).

### Docker Commands

```bash
# Start in background (detached mode)
docker compose up -d

# View logs (all services)
docker compose logs -f

# View logs for specific service
docker compose logs -f backend
docker compose logs -f frontend

# Check container status
docker compose ps

# Restart services
docker compose restart

# Rebuild and restart
docker compose up --build -d

# Stop and remove containers
docker compose down

# Stop and remove containers, volumes, and images
docker compose down --volumes --rmi all

# View container health
docker inspect nrca-backend --format='{{.State.Health.Status}}'
```

### Docker Architecture

- **Backend Container**: FastAPI app running on port 8000
- **Frontend Container**: Next.js app running on port 3000
- **Networking**: Containers communicate via Docker network
- **Volumes**: Stub data files are mounted as read-only volumes
- **Health Checks**: Backend includes health check for service dependencies

### Testing Docker Setup

We've included automated test scripts to validate the Docker setup:

**Windows (PowerShell):**
```powershell
.\test-docker.ps1
```

**Linux/macOS (Bash):**
```bash
chmod +x test-docker.sh
./test-docker.sh
```

**Manual Testing:**

```bash
# Build and start containers
docker compose up --build -d

# Check container status
docker compose ps

# Test backend health
curl http://localhost:8000/health
# Expected: {"ok":true,"mode":"stub"}

# Test dashboard API
curl http://localhost:8000/api/dashboard/summary?mode=stub
# Expected: JSON with inventory_accuracy_pct, patch_compliance_pct, etc.

# Test integrations API
curl http://localhost:8000/api/integrations/status?mode=stub
# Expected: Array of 4 connectors (ServiceNow, Splunk, SolarWinds, Cisco ISE)

# Test MPR export
curl http://localhost:8000/api/mpr/export.csv?mode=stub
# Expected: CSV file download

# Test frontend
curl http://localhost:3000
# Expected: HTML page with "NRCA" content

# View logs
docker compose logs -f

# Stop containers
docker compose down
```

**Expected Test Results:**
- ✅ Backend health: HTTP 200 with `{"ok":true,"mode":"stub"}`
- ✅ Dashboard API: Returns metrics (inventory accuracy, patch compliance, incidents, alerts, sites at risk)
- ✅ Integrations API: All 4 connectors showing as connected in stub mode
- ✅ MPR Export: CSV file with 5 metrics
- ✅ Frontend: HTTP 200, page loads with dashboard content
- ✅ Container health: Backend shows "healthy", Frontend shows "Up"

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
    Dockerfile             # Backend container definition
    requirements.txt
  frontend/
    app/
      layout.tsx           # Root layout
      page.tsx             # Dashboard
      integrations/
        page.tsx           # Integrations page
    lib/
      api.ts               # API client
    Dockerfile             # Frontend container definition
    package.json
    next.config.js
  docker-compose.yml       # Docker Compose configuration
  test-docker.ps1          # PowerShell test script (Windows)
  test-docker.sh           # Bash test script (Linux/macOS)
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
- PDF MPR pack export (instead of CSV)
- PRS mapping panel (labels each widget with PRS # alignment)

## License

Internal demo use only.

