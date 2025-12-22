import { fetchJSON } from "../../lib/api";

export default async function Integrations({ searchParams }: { searchParams: { mode?: string } }) {
  const mode = searchParams?.mode || "stub";
  const rows = await fetchJSON(`/api/integrations/status?mode=${mode}`);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Integrations</h1>
      <p style={{ marginTop: 4 }}>
        Demo shows connector framework with <b>STUB</b>/<b>LIVE</b> modes. Stub uses realistic sample payloads; live requires credentials.
      </p>

      <div style={{ marginBottom: 12 }}>
        <a href="/integrations?mode=stub">Stub Mode</a> <span>|</span>{" "}
        <a href="/integrations?mode=live">Live Mode</a>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}>Integration</th>
            <th style={th}>Mode</th>
            <th style={th}>Connected</th>
            <th style={th}>Detail</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r: any) => (
            <tr key={r.name}>
              <td style={td}>{r.name}</td>
              <td style={td}>{r.mode}</td>
              <td style={td}>{r.connected ? "✅" : "❌"}</td>
              <td style={td}>{r.detail || ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th: React.CSSProperties = { textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 };
const td: React.CSSProperties = { borderBottom: "1px solid #f0f0f0", padding: 8 };

