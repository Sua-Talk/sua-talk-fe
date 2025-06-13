import apiFetch from './apiBase';
import { redirect } from 'next/navigation';

interface Baby {
  id: string;
  name: string;
  birthDate: string;
  gender: string;
  weight: {
    birth: number;
    current: number;
  };
  height: {
    birth: number;
    current: number;
  };
  notes?: string;
  parentId: string;
}

const getAuthHeaders = (): Record<string, string> => {
  const accessToken = localStorage.getItem('auth_token');
  console.log('accessToken', accessToken);
  if (!accessToken) {
    return {};
  }
  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

export const apiBabies = {
  // Get all babies for the current user
  getBabies: () => apiFetch('/babies', {
    headers: getAuthHeaders(),
  }),

  // Get a specific baby by ID
  getBaby: (id: string) => apiFetch(`/babies/${id}`, {
    headers: getAuthHeaders(),
  }),

  // Create a new baby
  createBaby: (baby: Omit<Baby, 'id' | 'parentId'>) =>
    apiFetch('/babies', {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(baby),
    }),

  // Update a baby's information
  updateBaby: (id: string, baby: Partial<Baby>) =>
    apiFetch(`/babies/${id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(baby),
    }),

  // Delete a baby
  deleteBaby: (id: string) =>
    apiFetch(`/babies/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }),
};

export default apiBabies; 