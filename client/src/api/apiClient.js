// Change the API address in one place with VITE_API_BASE_URL.
const browserHost = window.location.hostname;
const isLocalAddress = browserHost === "localhost" || browserHost === "127.0.0.1" || browserHost.startsWith("10.") || browserHost.startsWith("192.168.");

// When the frontend is opened from this computer or the same Wi-Fi network,
// use the backend running on this computer. Otherwise use the deployed backend.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  (isLocalAddress ? `http://${browserHost}:3001` : "https://agenticsearch-node-1.onrender.com");

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}
