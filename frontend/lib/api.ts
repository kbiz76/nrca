const API_BASE = "http://localhost:8000";

export async function fetchJSON(path: string) {
  const r = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

export function downloadUrl(path: string) {
  return `${API_BASE}${path}`;
}

