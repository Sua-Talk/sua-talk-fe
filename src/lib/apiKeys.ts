import apiFetch from "./apiBase";

export const apiKeys = {
  // Get all API keys for the current user
  getKeys: () => apiFetch("/api-keys"),
  // Get API key stats
  getKeyStats: () => apiFetch(`/api-keys/stats`),

  // Get a specific API key
  getKey: (id: string) => apiFetch(`/api-keys/${id}`),

  // Create a new API key
  createKey: (
    name: string,
    description: string,
    permissions: string[],
    expiresAt?: string
  ) =>
    apiFetch("/api-keys", {
      method: "POST",
      body: JSON.stringify({ name, description, permissions, expiresAt }),
    }),

  // Update an API key
  updateKey: (
    id: string,
    data: {
      name?: string;
      description?: string;
      permissions?: string[];
      expiresAt?: string;
    }
  ) =>
    apiFetch(`/api-keys/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete an API key
  deleteKey: (id: string) =>
    apiFetch(`/api-keys/${id}`, {
      method: "DELETE",
    }),

  // Regenerate an API key
  rotateKey: (id: string) =>
    apiFetch(`/api-keys/${id}/rotate`, {
      method: "POST",
    }),
  revokeKey: (id: string) =>
    apiFetch(`/api-keys/${id}/revoke`, {
      method: "POST",
    }),
};

export default apiKeys;
