// Change the API address in one place with VITE_API_BASE_URL.
const browserHost = window.location.hostname;
const isLocalhost = browserHost === "localhost" || browserHost === "127.0.0.1";
const isPrivateNetwork = /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(browserHost);

// Use the same computer's backend during local development and Wi-Fi testing.
// A deployed website continues to use the deployed backend below.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  (isLocalhost || isPrivateNetwork
    ? `http://${browserHost}:3001`
    : "https://agenticsearch-node-1.onrender.com");

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
