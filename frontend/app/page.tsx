import { fetchJSON, downloadUrl } from "../lib/api";

export default async function Page({ searchParams }: { searchParams: { mode?: string } }) {
  const mode = searchParams?.mode || "stub";
  const data = await fetchJSON(`/api/dashboard/summary?mode=${mode}`);
  const kpis: Kpi[] = [
    {
      title: "Inventory Accuracy",
      value: `${data.inventory_accuracy_pct}%`,
      raw: Number(data.inventory_accuracy_pct),
      target: 95,
      type: "pct",
      lowerIsBetter: false,
    },
    {
      title: "Patch Compliance",
      value: `${data.patch_compliance_pct}%`,
      raw: Number(data.patch_compliance_pct),
      target: 95,
      type: "pct",
      lowerIsBetter: false,
    },
    {
      title: "Open Incidents",
      value: `${data.open_incidents}`,
      raw: Number(data.open_incidents),
      target: 0,
      type: "count",
      lowerIsBetter: true,
    },
    {
      title: "High/Critical Alerts (24h)",
      value: `${data.high_sev_alerts_24h}`,
      raw: Number(data.high_sev_alerts_24h),
      target: 0,
      type: "count",
      lowerIsBetter: true,
    },
  ];

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="page-title">NRCA Executive Dashboard</h1>
          <p className="subtitle">Operational risk posture, summarized across DHA sites.</p>
        </div>
        <span className="pill">{mode.toUpperCase()} MODE</span>
      </div>

      <div className="kpi-grid">
        {kpis.map((kpi) => (
          <Tile key={kpi.title} kpi={kpi} />
        ))}
      </div>

      <div className="section">
        <div className="section-header">
          <h2 style={{ margin: 0 }}>Top Sites at Risk</h2>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <ModeLinks />
            <a href={downloadUrl(`/api/mpr/export.csv?mode=${mode}`)} className="btn">
              Download MPR (CSV)
            </a>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th className="th">Site</th>
              <th className="th">Risk</th>
              <th className="th">Inventory Gaps</th>
              <th className="th">Old Hi/Crit Alerts</th>
              <th className="th">Open Incidents</th>
            </tr>
          </thead>
          <tbody>
            {data.sites_at_risk.map((s: any) => (
              <tr key={s.site} className="row">
                <td className="td">{s.site}</td>
                <td className="td">
                  <RiskBadge score={s.risk_score} />
                </td>
                <td className="td">{s.inv_gap}</td>
                <td className="td">{s.old_alerts}</td>
                <td className="td">{s.open_incidents}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type Kpi = {
  title: string;
  value: string;
  raw: number;
  target: number;
  type: "pct" | "count";
  lowerIsBetter: boolean;
};

function Tile({ kpi }: { kpi: Kpi }) {
  const delta = kpi.raw - kpi.target;
  const deltaIsGood = kpi.lowerIsBetter ? delta <= 0 : delta >= 0;
  const deltaText =
    kpi.type === "pct"
      ? `${delta >= 0 ? "+" : ""}${delta.toFixed(0)}% vs target`
      : `${delta >= 0 ? "+" : ""}${delta} vs target`;
  const trend = buildSparkValues(kpi.raw, kpi.type);
  return (
    <div className="kpi-card">
      <div className="kpi-title">{kpi.title}</div>
      <div className="kpi-value">{kpi.value}</div>
      <div className="kpi-meta">
        <span className={deltaIsGood ? "delta-good" : "delta-bad"}>{deltaText}</span>
        <SparkBars values={trend} />
      </div>
    </div>
  );
}

function ModeLinks() {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <a className="btn btn-outline" href="/?mode=stub">Stub Mode</a>
      <a className="btn btn-outline" href="/?mode=live">Live Mode</a>
      <span style={{ opacity: 0.6, fontSize: 12 }}>(live requires env vars)</span>
    </div>
  );
}

function RiskBadge({ score }: { score: number }) {
  const tier = score >= 70 ? "high" : score >= 40 ? "med" : "low";
  const label = tier === "high" ? "High" : tier === "med" ? "Medium" : "Low";
  return <span className={`badge badge-${tier}`}>{label} · {score}</span>;
}

function SparkBars({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="sparkline">
      {values.map((v, i) => (
        <span key={`${v}-${i}`} className="spark" style={{ height: 8 + (v / max) * 16 }} />
      ))}
    </div>
  );
}

function buildSparkValues(raw: number, type: "pct" | "count") {
  if (type === "pct") {
    return [raw - 12, raw - 6, raw - 3, raw, raw + 4].map((v) => Math.max(0, Math.min(100, v)));
  }
  const base = Math.max(0, raw);
  return [base + 2, base + 1, base, base + 1, base + 2];
}

