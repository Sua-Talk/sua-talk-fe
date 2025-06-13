export interface LocalRecording {
  id: string;
  title: string;
  fileUrl: string;
  fileSize: number;
  duration: number;
  format: string;
  recordingDate: string;
  source: 'upload' | 'recorder';
}

const LOCAL_RECORDINGS_KEY = 'sua_talk_local_recordings';

export const localStorageUtils = {
  saveRecording: (recording: LocalRecording) => {
    const recordings = localStorageUtils.getRecordings();
    recordings.push(recording);
    localStorage.setItem(LOCAL_RECORDINGS_KEY, JSON.stringify(recordings));
  },

  getRecordings: (): LocalRecording[] => {
    const recordings = localStorage.getItem(LOCAL_RECORDINGS_KEY);
    return recordings ? JSON.parse(recordings) : [];
  },

  deleteRecording: (id: string) => {
    const recordings = localStorageUtils.getRecordings();
    const updatedRecordings = recordings.filter(rec => rec.id !== id);
    localStorage.setItem(LOCAL_RECORDINGS_KEY, JSON.stringify(updatedRecordings));
  },

  clearRecordings: () => {
    localStorage.removeItem(LOCAL_RECORDINGS_KEY);
  }
}; 