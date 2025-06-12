import apiFetch from './apiBase';


// Example endpoint helpers
export const apiAuth = {
  health: () => apiFetch('/health'),
  checkEmail: (email: string) =>
    apiFetch('/auth/check-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  confirmEmail: (email: string, code: string) =>
    apiFetch('/auth/confirm-email', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    }),
  login: (email: string, password: string) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  refreshToken: (refreshToken: string) =>
    apiFetch('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),
  logout: (refreshToken: string) =>
    apiFetch('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),
  forgotPassword: (email: string) =>
    apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  resetPassword: (token: string, newPassword: string) =>
    apiFetch('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }),
  changePassword: (currentPassword: string, newPassword: string) =>
    apiFetch('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
  googleAuth: () =>
    apiFetch('/auth/google', {
      method: 'GET',
    }),
  googleCallback: () =>
    apiFetch('/auth/google/callback', {
      method: 'GET',
    }),
  completeRegistration: (data: { email: string; code: string; password: string; firstName: string; lastName: string }) =>
    apiFetch('/auth/complete-registration', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  resendVerification: (email: string) =>
    apiFetch('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

export default apiAuth;