import { fetchJSON, downloadUrl } from "../lib/api";

export default async function Page({ searchParams }: { searchParams: { mode?: string } }) {
  const mode = searchParams?.mode || "stub";
  const data = await fetchJSON(`/api/dashboard/summary?mode=${mode}`);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>NRCA Executive Dashboard</h1>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Tile title="Inventory Accuracy" value={`${data.inventory_accuracy_pct}%`} />
        <Tile title="Patch Compliance" value={`${data.patch_compliance_pct}%`} />
        <Tile title="Open Incidents" value={`${data.open_incidents}`} />
        <Tile title="High/Critical Alerts (24h)" value={`${data.high_sev_alerts_24h}`} />
      </div>

      <div style={{ marginTop: 16, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
        <h2 style={{ marginTop: 0 }}>Top Sites at Risk</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>Site</th>
              <th style={th}>Risk Score</th>
              <th style={th}>Inventory Gaps</th>
              <th style={th}>Old Hi/Crit Alerts</th>
              <th style={th}>Open Incidents</th>
            </tr>
          </thead>
          <tbody>
            {data.sites_at_risk.map((s: any) => (
              <tr key={s.site}>
                <td style={td}>{s.site}</td>
                <td style={td}>{s.risk_score}</td>
                <td style={td}>{s.inv_gap}</td>
                <td style={td}>{s.old_alerts}</td>
                <td style={td}>{s.open_incidents}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 12, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <ModeLinks />
          <a
            href={downloadUrl(`/api/mpr/export.csv?mode=${mode}`)}
            style={{ padding: "8px 12px", border: "1px solid #333", borderRadius: 8, textDecoration: "none" }}
          >
            Download MPR (CSV)
          </a>
        </div>
      </div>
    </div>
  );
}

function Tile({ title, value }: { title: string; value: string }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, minWidth: 220 }}>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function ModeLinks() {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <a href="/?mode=stub">Stub Mode</a>
      <span>|</span>
      <a href="/?mode=live">Live Mode</a>
      <span style={{ opacity: 0.6 }}>(live requires env vars)</span>
    </div>
  );
}

const th: React.CSSProperties = { textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 };
const td: React.CSSProperties = { borderBottom: "1px solid #f0f0f0", padding: 8 };

