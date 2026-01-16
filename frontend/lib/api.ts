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

const normalizePath = (path: string) => (path.startsWith("/") ? path : `/${path}`);

export async function fetchJSON(path: string, init?: RequestInit) {
  const base = getApiBase();
  const r = await fetch(`${base}${normalizePath(path)}`, {
    cache: "no-store",
    ...init,
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

export function downloadUrl(path: string) {
  // Client-side URLs should use localhost (browser context)
  const base = typeof window !== 'undefined' 
    ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000")
    : getApiBase();
  return `${base}${normalizePath(path)}`;
}

