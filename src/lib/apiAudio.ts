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

interface UploadAudioParams {
  babyId: string;
  title: string;
  recordingDate: string;
  audioFile: File;
}

const getAuthHeader = (isGetRequest = false) => {
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${token}`,
  };
  
  if (isGetRequest) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
};

export const apiAudio = {
  // Get all audio recordings for a baby
  getRecordings: () => {
    const babyId = localStorage.getItem('selectedBabyId');
    return apiFetch(`/audio/recordings?babyId=${babyId}`, {
      headers: getAuthHeader(true),
    });
  },

  // Get a specific recording by ID
  getRecordingById: (id: string) => {
    return apiFetch(`/audio/recordings/${id}`, {
      headers: getAuthHeader(true),
    });
  },

  // Get all audio recordings for a baby (legacy endpoint)
  getRecordingsLegacy: (babyId: string) => 
    apiFetch(`/audio/${babyId}`, {
      headers: getAuthHeader(true),
    }),

  // Get a specific recording (legacy endpoint)
  getRecording: (id: string) => 
    apiFetch(`/audio/recording/${id}`, {
      headers: getAuthHeader(true),
    }),

  // Upload a new audio recording
  uploadRecording: (babyId: string, file: File, type: AudioRecording['type']) => {
    const formData = new FormData();
    formData.append('audio', file);
    formData.append('type', type);
    return apiFetch(`/audio/${babyId}`, {
      method: 'POST',
      body: formData,
      headers: getAuthHeader(),
    });
  },

  // Upload audio with detailed information
  uploadAudio: ({ babyId, title, recordingDate, audioFile }: UploadAudioParams) => {
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('babyId', babyId);
    formData.append('title', title);
    formData.append('recordingDate', recordingDate);
    
    const headers = { ...getAuthHeader() };
    // Remove Content-Type to let browser set it with boundary for multipart/form-data
    delete headers['Content-Type'];
    
    return apiFetch('/audio/upload', {
      method: 'POST',
      body: formData,
      headers,
    });
  },

  // Delete a recording
  deleteRecording: (id: string) =>
    apiFetch(`/audio/recording/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    }),

  // Analyze audio recording
  analyzeRecording: (id: string) =>
    apiFetch(`/audio/analyze/${id}`, {
      method: 'POST',
      headers: getAuthHeader(),
    }),
};

export default apiAudio; 