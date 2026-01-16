export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body>
        <style>{`
          :root {
            --bg: #f6f8fb;
            --card: #ffffff;
            --border: #e3e7ee;
            --text: #0f172a;
            --muted: #64748b;
            --accent: #1d4ed8;
            --accent-soft: #e8efff;
            --success: #16a34a;
            --danger: #dc2626;
            --warning: #f59e0b;
            --shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: "Inter", system-ui, -apple-system, Segoe UI, sans-serif;
            color: var(--text);
            background: var(--bg);
          }
          a { color: var(--accent); text-decoration: none; }
          a:hover { text-decoration: underline; }
          .topbar {
            position: sticky;
            top: 0;
            z-index: 10;
            background: #fff;
            border-bottom: 1px solid var(--border);
            padding: 14px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .brand {
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 700;
            letter-spacing: 0.2px;
          }
          .brand-badge {
            width: 28px;
            height: 28px;
            border-radius: 8px;
            display: grid;
            place-items: center;
            background: var(--accent-soft);
            color: var(--accent);
            font-weight: 800;
          }
          .nav { display: flex; gap: 14px; font-weight: 600; }
          .container { max-width: 1200px; margin: 0 auto; padding: 24px 20px 40px; }
          .page-title { margin: 0 0 6px; font-size: 28px; }
          .subtitle { color: var(--muted); margin: 0 0 18px; }
          .kpi-grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
          .kpi-card {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 16px;
            box-shadow: var(--shadow);
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .kpi-title { font-size: 12px; color: var(--muted); letter-spacing: 0.3px; text-transform: uppercase; }
          .kpi-value { font-size: 30px; font-weight: 700; }
          .kpi-meta { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--muted); }
          .delta-good { color: var(--success); font-weight: 600; }
          .delta-bad { color: var(--danger); font-weight: 600; }
          .sparkline { display: flex; gap: 4px; align-items: flex-end; height: 24px; }
          .spark { width: 6px; border-radius: 999px; background: #dbe4ff; }
          .section {
            margin-top: 20px;
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 16px;
            box-shadow: var(--shadow);
          }
          .section-header { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
          .table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          .th { text-align: left; border-bottom: 1px solid var(--border); padding: 10px 8px; font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.3px; }
          .td { border-bottom: 1px solid #f1f5f9; padding: 10px 8px; }
          .row:hover { background: #f8fafc; }
          .badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 8px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 600;
          }
          .badge-low { background: #ecfdf3; color: #15803d; }
          .badge-med { background: #fff7ed; color: #b45309; }
          .badge-high { background: #fef2f2; color: #b91c1c; }
          .pill { padding: 4px 10px; border-radius: 999px; font-size: 12px; background: var(--accent-soft); color: var(--accent); font-weight: 600; }
          .btn {
            padding: 8px 12px;
            border-radius: 10px;
            border: 1px solid var(--accent);
            background: var(--accent);
            color: white;
            font-weight: 600;
          }
          .btn-outline {
            background: #fff;
            color: var(--accent);
          }
          .card-grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
          .integration-card {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 16px;
            box-shadow: var(--shadow);
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .integration-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
          .integration-meta { display: flex; align-items: center; gap: 10px; }
          .logo {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            display: grid;
            place-items: center;
            color: white;
            font-weight: 700;
          }
          .status-good { color: var(--success); font-weight: 600; }
          .status-bad { color: var(--danger); font-weight: 600; }
        `}</style>
        <div className="topbar">
          <div className="brand">
            <div className="brand-badge">N</div>
            Network Risk & Compliance Assessment
          </div>
          <div className="nav">
            <a href="/">Dashboard</a>
            <a href="/integrations">Integrations</a>
          </div>
        </div>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}

