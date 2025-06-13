'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import WaveSurferRecorder from '../../components/WaveSurferRecorder';
import AudioUploader from '../../components/AudioUploader';
import { useAuth} from '../../context/AuthContext';
import { apiAudio } from '@/lib/apiAudio';
import { localStorageUtils, LocalRecording } from '@/lib/localStorage';

interface AudioRecording {
  id: string;
  title: string;
  babyId: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  duration: number;
  format: string;
  sampleRate: number;
  bitRate: number;
  channels: number;
  notes: string;
  recordingDate: string;
  uploadedAt: string;
  analysisStatus: 'pending' | 'processing' | 'completed' | 'failed';
  analysisStartedAt: string;
  analysisCompletedAt: string;
  isDeleted: boolean;
}

interface ApiResponse {
  success: boolean;
  data: AudioRecording[];
  pagination: string;
  filters: {
    babyId: string;
    status: string;
  };
}

const SoundPage = () => {
  const { isAuthenticated, getUserInfo, logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [recordings, setRecordings] = useState<AudioRecording[]>([]);
  const [localRecordings, setLocalRecordings] = useState<LocalRecording[]>([]);
  const [isLoadingRecordings, setIsLoadingRecordings] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else {
      setIsLoading(false);
      fetchRecordings();
      fetchLocalRecordings();
    }
  }, [isAuthenticated, router]);

  const fetchRecordings = async () => {
    try {
      setIsLoadingRecordings(true);
      const babyId = localStorage.getItem('selectedBabyId');
      if (!babyId) {
        console.warn('No baby selected');
        setRecordings([]);
        return;
      }

      const response = await apiAudio.getRecordings();
      console.log('API Response:', response); // Debug log

      // Handle different response formats
      if (response && typeof response === 'object') {
        if (response.success && Array.isArray(response.data)) {
          setRecordings(response.data);
        } else if (Array.isArray(response)) {
          // Handle case where response is directly an array
          setRecordings(response);
        } else if (response.data && Array.isArray(response.data)) {
          // Handle case where data is nested but no success flag
          setRecordings(response.data);
        } else {
          console.error('Unexpected response format:', response);
          setRecordings([]);
        }
      } else {
        console.error('Invalid response format from API:', {
          response,
          type: typeof response,
          isArray: Array.isArray(response)
        });
        setRecordings([]);
      }
    } catch (error) {
      console.error('Error fetching recordings:', error);
      setRecordings([]);
    } finally {
      setIsLoadingRecordings(false);
    }
  };

  const fetchLocalRecordings = () => {
    const recordings = localStorageUtils.getRecordings();
    setLocalRecordings(recordings);
  };

  const handleLocalSave = () => {
    fetchLocalRecordings();
  };

  const deleteLocalRecording = (id: string) => {
    localStorageUtils.deleteRecording(id);
    fetchLocalRecordings();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const userInfo = getUserInfo();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-sm bg-white min-h-screen relative">
        {/* Header */}
        <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 sm:relative">
          <div className="px-4 sm:px-6">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-blue-700">SuaTalk</h1>
              </div>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isSidebarOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Sidebar */}
        <div
          className={`absolute right-0 top-16 w-48 bg-white shadow-lg rounded-lg transform transition-all duration-300 ease-in-out z-40
            ${isSidebarOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
        >
          <div className="p-4">
            <h1 className="text-xl font-bold text-blue-700 mb-4">SuaTalk</h1>

            <nav className="space-y-3">
              <button
                onClick={() => router.push('/home')}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => router.push('/babies')}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                Babies
              </button>
              <button
                onClick={() => router.push('/sound')}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                Sound Analysis
              </button>
              <button
                onClick={logout}
                className="w-full bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="pt-8">
          <div className="px-4 py-8">
            {/* Welcome Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {userInfo?.firstName || 'User'}!
              </h1>
              <p className="mt-2 text-gray-600">
                Record and analyze your baby's sounds.
              </p>
            </header>

            {/* Voice Recorder Section */}
            <section id="recorder-section" className="mb-8">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Rekam Audio Langsung</h2>
                <p className="text-sm text-gray-600">Rekam tangisan bayi secara langsung untuk dianalisis</p>
              </div>
              <WaveSurferRecorder
                onRecordingUploaded={fetchRecordings}
                onLocalSave={handleLocalSave}
              />
            </section>

            {/* Divider */}
            <div className="mb-8">
              <div className="flex items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="px-4 text-sm text-gray-500">atau</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>
            </div>

            {/* Audio Upload Section */}
            <section id="upload-section" className="mb-8">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Unggah Audio</h2>
                <p className="text-sm text-gray-600">Pilih file audio untuk menganalisis jenis tangisan bayi</p>
              </div>
              <AudioUploader
                onUploadComplete={fetchRecordings}
                onLocalSave={handleLocalSave}
              />
            </section>

            {/* Recordings List Section */}
            <section>
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Rekaman Tersimpan</h2>
                <p className="text-sm text-gray-600">Daftar rekaman audio yang telah diunggah</p>
              </div>

              {isLoadingRecordings ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : recordings.length === 0 && localRecordings.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="max-w-md mx-auto">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Rekaman</h3>
                    <p className="text-gray-600 mb-4">
                      Anda belum memiliki rekaman audio. Mulai rekam audio bayi Anda menggunakan perekam suara di atas atau unggah file audio yang sudah ada.
                    </p>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => document.querySelector('#recorder-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                      >
                        Rekam Audio
                      </button>
                      <button
                        onClick={() => document.querySelector('#upload-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors"
                      >
                        Unggah Audio
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Server Recordings */}
                  {recordings.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Rekaman Server</h3>
                      <div className="space-y-4">
                        {recordings.map((recording) => (
                          <div key={recording.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex flex-col space-y-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium text-gray-800">{recording.title}</h3>
                                  <p className="text-sm text-gray-600">
                                    {new Date(recording.recordingDate).toLocaleDateString('id-ID', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    recording.analysisStatus === 'completed' ? 'bg-green-100 text-green-800' :
                                    recording.analysisStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                    recording.analysisStatus === 'failed' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {recording.analysisStatus === 'completed' ? 'Selesai' :
                                     recording.analysisStatus === 'processing' ? 'Diproses' :
                                     recording.analysisStatus === 'failed' ? 'Gagal' :
                                     'Menunggu'}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>Durasi: {formatDuration(recording.duration)}</span>
                                <span>Ukuran: {formatFileSize(recording.fileSize)}</span>
                                <span>Format: {recording.format.toUpperCase()}</span>
                              </div>

                              {recording.notes && (
                                <p className="text-sm text-gray-600 italic">"{recording.notes}"</p>
                              )}

                              <div className="flex items-center space-x-2">
                                <audio
                                  src={recording.fileUrl}
                                  controls
                                  className="w-full"
                                />
                                <button
                                  onClick={() => apiAudio.analyzeRecording(recording.id)}
                                  disabled={recording.analysisStatus === 'processing'}
                                  className="px-3 py-1.5 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {recording.analysisStatus === 'processing' ? 'Menganalisis...' : 'Analisis'}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Local Recordings */}
                  {localRecordings.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Rekaman Lokal</h3>
                      <div className="space-y-4">
                        {localRecordings.map((recording) => (
                          <div key={recording.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex flex-col space-y-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium text-gray-800">{recording.title}</h3>
                                  <p className="text-sm text-gray-600">
                                    {new Date(recording.recordingDate).toLocaleDateString('id-ID', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {recording.source === 'upload' ? 'Unggahan' : 'Rekaman'}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>Durasi: {formatDuration(recording.duration)}</span>
                                <span>Ukuran: {formatFileSize(recording.fileSize)}</span>
                                <span>Format: {recording.format.toUpperCase()}</span>
                              </div>

                              <div className="flex items-center space-x-2">
                                <audio
                                  src={recording.fileUrl}
                                  controls
                                  className="w-full"
                                />
                                <button
                                  onClick={() => router.push(`/analyse?id=${recording.id}`)}
                                  className="px-3 py-1.5 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 transition-colors"
                                >
                                  Analisis
                                </button>
                                <button
                                  onClick={() => deleteLocalRecording(recording.id)}
                                  className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                                >
                                  Hapus
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SoundPage;
