export const API_BASE_URL = '/api';

// Generic fetch wrapper
export default async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include',
    ...options,
  });
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
} 