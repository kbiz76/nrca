export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui", margin: 0 }}>
        <div style={{ padding: 16, borderBottom: "1px solid #ddd", display: "flex", gap: 16 }}>
          <a href="/" style={{ textDecoration: "none" }}>NRCA Dashboard</a>
          <a href="/integrations" style={{ textDecoration: "none" }}>Integrations</a>
        </div>
        <div style={{ padding: 16 }}>{children}</div>
      </body>
    </html>
  );
}

