const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export async function api(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `HTTP error! status: ${res.status}`);
  }

  return res.json();
}

