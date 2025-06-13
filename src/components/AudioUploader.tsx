'use client';

import React, { useState, useRef } from 'react';
import { apiAudio } from '@/lib/apiAudio';
import { localStorageUtils, LocalRecording } from '@/lib/localStorage';
import { v4 as uuidv4 } from 'uuid';

// Icons
const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17,8 12,3 7,8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const AnalyzeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 11H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-4"/>
    <polyline points="9,11 12,14 15,11"/>
    <line x1="12" y1="14" x2="12" y2="3"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6"/>
    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7,10 12,15 17,10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

interface AudioUploaderProps {
  onUploadComplete?: () => void;
  onLocalSave?: () => void;
}

const AudioUploader: React.FC<AudioUploaderProps> = ({ onUploadComplete, onLocalSave }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);

    if (file) {
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        setError('File harus berupa audio (mp3, wav, dll)');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Ukuran file maksimal 10MB');
        return;
      }

      // Clean up previous audio URL
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      // Create new audio URL
      const url = URL.createObjectURL(file);
      setSelectedFile(file);
      setAudioUrl(url);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const file = event.dataTransfer.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        setError('File harus berupa audio (mp3, wav, dll)');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Ukuran file maksimal 10MB');
        return;
      }

      // Clean up previous audio URL
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      // Create new audio URL
      const url = URL.createObjectURL(file);
      setSelectedFile(file);
      setAudioUrl(url);
    }
  };

  const handleDelete = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setSelectedFile(null);
    setAudioUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const analyzeAudio = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const babyId = localStorage.getItem('selectedBabyId');
      if (!babyId) {
        throw new Error('No baby selected');
      }

      await apiAudio.uploadAudio({
        babyId,
        title: selectedFile.name,
        recordingDate: new Date().toISOString(),
        audioFile: selectedFile
      });
      
      // Call the callback to refresh recordings
      onUploadComplete?.();
      
      alert('Upload berhasil!');
    } catch (error) {
      console.error('Error uploading audio:', error);
      if (error instanceof Error) {
        setError(`Terjadi kesalahan saat mengupload audio: ${error}`);
      } else {
        setError('Terjadi kesalahan saat mengupload audio');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveLocally = () => {
    if (!selectedFile || !audioUrl) return;

    const localRecording: LocalRecording = {
      id: uuidv4(),
      title: selectedFile.name,
      fileUrl: audioUrl,
      fileSize: selectedFile.size,
      duration: 0, // You might want to get actual duration
      format: selectedFile.type.split('/')[1],
      recordingDate: new Date().toISOString(),
      source: 'upload'
    };

    localStorageUtils.saveRecording(localRecording);
    onLocalSave?.();
    alert('Audio berhasil disimpan secara lokal!');
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Unggah Audio</h3>
          <p className="text-xs text-gray-500">Unggah file audio untuk dianalisis</p>
        </div>

        {/* Upload Area */}
        <div
          className={`mb-4 p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
            ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          {!selectedFile ? (
            <div className="space-y-2">
              <UploadIcon />
              <p className="text-sm text-gray-600">
                Klik atau seret file audio ke sini
              </p>
              <p className="text-xs text-gray-500">
                Format yang didukung: MP3, WAV (Maks. 10MB)
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-800">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Controls */}
        {selectedFile && (
          <div className="space-y-2">
            {/* Audio Preview */}
            <div className="mb-3">
              <audio
                src={audioUrl || undefined}
                controls
                className="w-full"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={analyzeAudio}
                disabled={isAnalyzing}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <AnalyzeIcon />
                <span>{isAnalyzing ? 'Mengupload...' : 'Upload Tangisan'}</span>
              </button>
              <button
                onClick={saveLocally}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200 text-sm font-medium"
              >
                <DownloadIcon />
                <span>Simpan Lokal</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center space-x-1 px-3 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 text-sm"
              >
                <TrashIcon />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioUploader; 