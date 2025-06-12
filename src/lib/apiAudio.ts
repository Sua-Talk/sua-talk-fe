import apiFetch from './apiBase';

// TODO belum terimplemen sepenuhnya
interface AudioRecording {
  id: string;
  babyId: string;
  url: string;
  duration: number;
  createdAt: string;
  type: 'cry' | 'laugh' | 'babbling' | 'other';
}

export const apiAudio = {
  // Get all audio recordings for a baby
  getRecordings: (babyId: string) => apiFetch(`/audio/${babyId}`),

  // Get a specific recording
  getRecording: (id: string) => apiFetch(`/audio/recording/${id}`),

  // Upload a new audio recording
  uploadRecording: (babyId: string, file: File, type: AudioRecording['type']) => {
    const formData = new FormData();
    formData.append('audio', file);
    formData.append('type', type);
    return apiFetch(`/audio/${babyId}`, {
      method: 'POST',
      body: formData,
    });
  },

  // Delete a recording
  deleteRecording: (id: string) =>
    apiFetch(`/audio/recording/${id}`, {
      method: 'DELETE',
    }),

  // Analyze audio recording
  analyzeRecording: (id: string) =>
    apiFetch(`/audio/analyze/${id}`, {
      method: 'POST',
    }),
};

export default apiAudio; 