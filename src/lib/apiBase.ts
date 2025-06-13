export const API_BASE_URL = "/api";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown = null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Generic fetch wrapper
export default async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<unknown> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Get the current auth token
  const token = localStorage.getItem("auth_token");
  const expirationTime = localStorage.getItem("token_expiration");
  const currentTime = new Date().getTime();

  // Log token status
  if (token && expirationTime) {
    const expirationDate = new Date(parseInt(expirationTime));
    const isExpired = currentTime >= parseInt(expirationTime);
    console.log("[Token Debug] Pre-request token check:", {
      endpoint,
      hasToken: !!token,
      currentTimeUTC: new Date(currentTime).toISOString(),
      currentTimeLocal: new Date(currentTime).toString(),
      expirationUTC: expirationDate.toISOString(),
      expirationLocal: expirationDate.toString(),
      isExpired,
      timezoneOffset: new Date().getTimezoneOffset(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  }

  // Add auth header if token exists and it's not a login/refresh request
  const isAuthRequest =
    endpoint.includes("/auth/login") ||
    endpoint.includes("/auth/refresh-token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && !isAuthRequest ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      headers,
      credentials: "include",
      ...options,
    });

    // Handle token expiration
    if (response.status === 401 && !isAuthRequest) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // Try to refresh the token
          const refreshToken = localStorage.getItem("refresh_token");
          if (!refreshToken) {
            throw new Error("No refresh token available");
          }

          const refreshResponse = await fetch(
            `${API_BASE_URL}/auth/refresh-token`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken }),
            }
          );

          if (!refreshResponse.ok) {
            throw new Error("Token refresh failed");
          }

          const refreshData = await refreshResponse.json();

          if (refreshData.success && refreshData.data?.tokens) {
            // Update tokens in localStorage
            localStorage.setItem(
              "auth_token",
              refreshData.data.tokens.accessToken
            );
            localStorage.setItem(
              "refresh_token",
              refreshData.data.tokens.refreshToken
            );

            // Process queued requests
            processQueue(null, refreshData.data.tokens.accessToken);

            // Retry the original request with new token
            return apiFetch(endpoint, {
              ...options,
              headers: {
                ...headers,
                Authorization: `Bearer ${refreshData.data.tokens.accessToken}`,
              },
            });
          } else {
            throw new Error("Invalid refresh token response");
          }
        } catch (error) {
          processQueue(error, null);
          // Clear auth data and redirect to login
          localStorage.removeItem("auth_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user_id");
          localStorage.removeItem("user_info");

          window.location.href = "/auth/login";
          throw error;
        } finally {
          isRefreshing = false;
        }
      } else {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            return apiFetch(endpoint, {
              ...options,
              headers: {
                ...headers,
                Authorization: `Bearer ${token}`,
              },
            });
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }
    }

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${response.status} ${error}`);
    }

    // Try to parse JSON, fallback to text
    try {
      return await response.json();
    } catch {
      return await response.text();
    }
  } catch (error) {
    throw error;
  }
}
