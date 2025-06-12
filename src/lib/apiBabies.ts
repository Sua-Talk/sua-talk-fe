import apiFetch from './apiBase';

interface Baby {
  id: string;
  name: string;
  dateOfBirth: string;
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

export const apiBabies = {
  // Get all babies for the current user
  getBabies: () => apiFetch('/babies'),

  // Get a specific baby by ID
  getBaby: (id: string) => apiFetch(`/babies/${id}`),

  // Create a new baby
  createBaby: (baby: Omit<Baby, 'id' | 'parentId'>) =>
    apiFetch('/babies', {
      method: 'POST',
      body: JSON.stringify(baby),
    }),

  // Update a baby's information
  updateBaby: (id: string, baby: Partial<Baby>) =>
    apiFetch(`/babies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(baby),
    }),

  // Delete a baby
  deleteBaby: (id: string) =>
    apiFetch(`/babies/${id}`, {
      method: 'DELETE',
    }),
};

export default apiBabies; 