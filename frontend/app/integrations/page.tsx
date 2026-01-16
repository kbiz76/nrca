import { fetchJSON } from "../../lib/api";

export default async function Integrations({ searchParams }: { searchParams: { mode?: string } }) {
  const mode = searchParams?.mode || "stub";
  const rows = await fetchJSON(`/api/integrations/status?mode=${mode}`);

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="page-title">Integrations</h1>
          <p className="subtitle">
            Connector framework supports <b>STUB</b>/<b>LIVE</b> modes. Stub uses realistic sample payloads; live requires credentials.
          </p>
        </div>
        <span className="pill">{mode.toUpperCase()} MODE</span>
      </div>

      <div style={{ marginBottom: 16, display: "flex", gap: 10, alignItems: "center" }}>
        <a className="btn btn-outline" href="/integrations?mode=stub">Stub Mode</a>
        <a className="btn btn-outline" href="/integrations?mode=live">Live Mode</a>
      </div>

      <div className="card-grid">
        {rows.map((r: any) => {
          const meta = META[r.name] || { color: "#64748b", initials: r.name.slice(0, 2).toUpperCase() };
          return (
            <div key={r.name} className="integration-card">
              <div className="integration-head">
                <div className="integration-meta">
                  <div className="logo" style={{ background: meta.color }}>{meta.initials}</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>Mode: {r.mode}</div>
                  </div>
                </div>
                <span className={r.connected ? "status-good" : "status-bad"}>
                  {r.connected ? "Connected" : "Disconnected"}
                </span>
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>{r.detail || "No detail provided"}</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>
                Last pull: {formatDate(r.last_pull_utc)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const META: Record<string, { color: string; initials: string }> = {
  ServiceNow: { color: "#1d4ed8", initials: "SN" },
  Splunk: { color: "#0f172a", initials: "SP" },
  SolarWinds: { color: "#f97316", initials: "SW" },
  "Cisco ISE": { color: "#0891b2", initials: "CI" },
};

function formatDate(value?: string | null) {
  if (!value) return "Not pulled yet";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

