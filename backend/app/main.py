from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import io
import csv

from app.config import settings
from app.services.aggregator import build_dashboard, integration_status, build_mpr_rows

app = FastAPI(title="NRCA Demo API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"ok": True, "mode": settings.NRCA_MODE}

@app.get("/api/dashboard/summary")
async def dashboard_summary(mode: str = Query(default=None)):
    effective_mode = mode or settings.NRCA_MODE
    return await build_dashboard(effective_mode)

@app.get("/api/integrations/status")
async def integrations(mode: str = Query(default=None)):
    effective_mode = mode or settings.NRCA_MODE
    return await integration_status(effective_mode)

@app.get("/api/mpr/export.csv")
async def export_mpr(mode: str = Query(default=None)):
    effective_mode = mode or settings.NRCA_MODE
    dash = await build_dashboard(effective_mode)
    rows = build_mpr_rows(dash)

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=["metric", "value", "notes"])
    writer.writeheader()
    for r in rows:
        writer.writerow(r)

    mem = io.BytesIO(output.getvalue().encode("utf-8"))
    return StreamingResponse(mem, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=nrca_mpr.csv"})

