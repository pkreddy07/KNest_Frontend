const API_BASE = "https://knest-backend.onrender.com/";

export async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // If body is JSON and not FormData, set Content-Type
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const isJson = response.headers.get("content-type")?.includes("application/json");
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Handle unauthorized globally
        localStorage.removeItem("token");
        window.location.hash = "#login";
      }
      
      const errorMsg = data.message || data || `HTTP ${response.status} Error`;
      console.error(`[API ERROR] ${options.method || 'GET'} ${endpoint} failed with ${response.status}`, data);
      
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.error(`[NETWORK EXCEPTION] Call to ${endpoint} completely crashed:`, error);
    throw error;
  }
}
