import apiFetch from './apiBase';

interface UserProfile {
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  location: string;
  timeZone: string;
}

interface DeleteAccountRequest {
  password: string;
  confirmation: string;
  reason: string;
}

export const apiUsers = {
  // Example placeholder for future user endpoints
  // getUser: (id: string) => apiFetch(`/users/${id}`),

  getProfile: () => apiFetch('/users/profile'),

  updateProfile: (profile: UserProfile) => 
    apiFetch('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    }),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiFetch('/users/upload/avatar', {
      method: 'POST',
      body: formData,
    });
  },

  deleteAccount: (data: DeleteAccountRequest) =>
    apiFetch('/users/account', {
      method: 'DELETE',
      body: JSON.stringify(data),
    }),
};

export default apiUsers; 