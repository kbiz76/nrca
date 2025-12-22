// Server-side: use service name in Docker, localhost in dev
// Client-side: always use localhost (browser makes the request)
const getApiBase = () => {
  // Server-side (Node.js environment)
  if (typeof window === 'undefined') {
    return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  }
  // Client-side (browser)
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
};

const API_BASE = getApiBase();

export async function fetchJSON(path: string) {
  const r = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

export function downloadUrl(path: string) {
  // Client-side URLs should use localhost (browser context)
  const base = typeof window !== 'undefined' 
    ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000")
    : API_BASE;
  return `${base}${path}`;
}

