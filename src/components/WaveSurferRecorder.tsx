"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useRef, useEffect } from "react";
import { apiAudio } from "@/lib/apiAudio";
import { localStorageUtils, LocalRecording } from "@/lib/localStorage";
import { v4 as uuidv4 } from "uuid";

// Simple icons
const MicIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 1a4 4 0 0 0-4 4v7a4 4 0 0 0 8 0V5a4 4 0 0 0-4-4z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const SquareIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
  </svg>
);

const PlayIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polygon points="5,3 19,12 5,21" />
  </svg>
);

const PauseIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);

const DownloadIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7,10 12,15 17,10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="3,6 5,6 21,6" />
    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
  </svg>
);

const AnalyzeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M9 11H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-4" />
    <polyline points="9,11 12,14 15,11" />
    <line x1="12" y1="14" x2="12" y2="3" />
  </svg>
);

interface WaveSurferRecorderProps {
  onRecordingUploaded?: () => void;
  onLocalSave?: () => void;
}

const WaveSurferRecorder: React.FC<WaveSurferRecorderProps> = ({
  onRecordingUploaded,
  onLocalSave,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [wavesurfer, setWavesurfer] = useState<any>(null);
  const [recordPlugin, setRecordPlugin] = useState<any>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedDuration, setRecordedDuration] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const waveformRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const generateRecordingName = (): string => {
    const now = new Date();
    return `Recording ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  };

  useEffect(() => {
    // Initialize WaveSurfer when component mounts
    const initWaveSurfer = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const WaveSurfer = (await import("wavesurfer.js")).default;
        const RecordPlugin = (
          await import("wavesurfer.js/dist/plugins/record.js")
        ).default;

        if (!waveformRef.current) return;

        // Create record plugin
        const record = RecordPlugin.create({
          scrollingWaveform: true,
          renderRecordedAudio: false,
        });

        // Create WaveSurfer instance
        const ws = WaveSurfer.create({
          container: waveformRef.current,
          waveColor: "#3b82f6",
          progressColor: "#1d4ed8",
          height: 80,
          barWidth: 2,
          barGap: 1,
          plugins: [record],
        });

        // Set up event listeners
        record.on("record-start", () => {
          console.log("Recording started");
          setIsRecording(true);
          setIsPaused(false);
          setRecordingTime(0);
        });

        record.on("record-end", (blob: Blob) => {
          console.log("Recording ended", blob);

          // Clean up previous audio URL to prevent memory leaks
          if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
          }

          // Store the new audio
          const url = URL.createObjectURL(blob);
          setAudioBlob(blob);
          setAudioUrl(url);
          setRecordedDuration(recordingTime);

          // Load the recorded audio into wavesurfer for playback
          ws.load(url);
        });

        record.on("record-pause", () => {
          console.log("Recording paused");
          setIsPaused(true);
        });

        record.on("record-resume", () => {
          console.log("Recording resumed");
          setIsPaused(false);
        });

        // Set up playback event listeners
        ws.on("play", () => {
          setIsPlaying(true);
        });

        ws.on("pause", () => {
          setIsPlaying(false);
        });

        ws.on("finish", () => {
          setIsPlaying(false);
        });

        setWavesurfer(ws);
        setRecordPlugin(record);
      } catch (error) {
        console.error("Error initializing WaveSurfer:", error);
      }
    };

    initWaveSurfer();

    // Cleanup function
    return () => {
      if (wavesurfer) {
        wavesurfer.destroy();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, []);

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, isPaused]);

  const startRecording = async () => {
    if (!recordPlugin) {
      alert("Audio recorder belum siap. Harap tunggu sebentar dan coba lagi.");
      return;
    }

    try {
      // Clear previous recording
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
        setAudioBlob(null);
        setRecordedDuration(0);
        setIsPlaying(false);
      }

      await recordPlugin.startRecording();
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Error memulai rekaman. Pastikan izin mikrofon sudah diberikan.");
    }
  };

  const stopRecording = () => {
    if (recordPlugin && isRecording) {
      recordPlugin.stopRecording();
      setIsRecording(false);
      setIsPaused(false);
      setRecordingTime(0);
    }
  };

  const togglePause = () => {
    if (!recordPlugin) return;

    if (isPaused) {
      recordPlugin.resumeRecording();
    } else {
      recordPlugin.pauseRecording();
    }
  };

  const togglePlayback = () => {
    if (!wavesurfer || !audioUrl) return;

    if (isPlaying) {
      wavesurfer.pause();
    } else {
      wavesurfer.play();
    }
  };

  const downloadAudio = () => {
    if (!audioBlob || !audioUrl) return;

    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `${generateRecordingName()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const deleteAudio = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setRecordedDuration(0);
    setIsPlaying(false);

    // Clear the waveform
    if (wavesurfer) {
      wavesurfer.empty();
    }
  };

  const analyzeAudio = async () => {
    if (!audioBlob) return;

    setIsAnalyzing(true);

    try {
      const babyId = localStorage.getItem("selectedBabyId");
      if (!babyId) {
        throw new Error("No baby selected");
      }

      const file = new File([audioBlob], "recording.wav", {
        type: "audio/wav",
      });
      await apiAudio.uploadAudio({
        babyId,
        title: generateRecordingName(),
        recordingDate: new Date().toISOString(),
        audioFile: file,
      });

      // Call the callback to refresh recordings
      onRecordingUploaded?.();

      alert("Upload berhasil!");
    } catch (error) {
      console.error("Error uploading audio:", error);
      alert("Terjadi kesalahan saat mengupload audio");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveLocally = () => {
    if (!audioBlob || !audioUrl) return;

    const localRecording: LocalRecording = {
      id: uuidv4(),
      title: generateRecordingName(),
      fileUrl: audioUrl,
      fileSize: audioBlob.size,
      duration: recordedDuration,
      format: "wav",
      recordingDate: new Date().toISOString(),
      source: "recorder",
    };

    localStorageUtils.saveRecording(localRecording);
    onLocalSave?.();
    alert("Rekaman berhasil disimpan secara lokal!");
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Perekam Suara
          </h3>
          <p className="text-xs text-gray-500">Powered by WaveSurfer.js</p>
        </div>

        {/* Waveform Container */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div ref={waveformRef} className="w-full min-h-[80px]" />
        </div>

        {/* Recording Controls */}
        <div className="flex items-center justify-center space-x-2 mb-3">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
            >
              <MicIcon />
              <span>Mulai Rekam</span>
            </button>
          ) : (
            <>
              <button
                onClick={togglePause}
                className="flex items-center space-x-1 px-3 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors duration-200 text-sm"
              >
                {isPaused ? <PlayIcon /> : <PauseIcon />}
                <span>{isPaused ? "Lanjut" : "Jeda"}</span>
              </button>
              <button
                onClick={stopRecording}
                className="flex items-center space-x-1 px-3 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 text-sm"
              >
                <SquareIcon />
                <span>Stop</span>
              </button>
            </>
          )}
        </div>

        {/* Playback & Analysis Controls - Only show when audio is available */}
        {audioUrl && !isRecording && (
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={togglePlayback}
                className="flex items-center space-x-1 px-3 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 text-sm"
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
                <span>{isPlaying ? "Jeda" : "Putar"}</span>
              </button>
              <button
                onClick={downloadAudio}
                className="flex items-center space-x-1 px-3 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200 text-sm"
              >
                <DownloadIcon />
                <span>Unduh</span>
              </button>
              <button
                onClick={deleteAudio}
                className="flex items-center space-x-1 px-2 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 text-sm"
              >
                <TrashIcon />
              </button>
            </div>

            {/* Analysis and Local Save Buttons */}
            <div className="flex justify-center space-x-2">
              <button
                onClick={analyzeAudio}
                disabled={isAnalyzing}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <AnalyzeIcon />
                <span>{isAnalyzing ? "Mengupload..." : "Upload Tangisan"}</span>
              </button>
              <button
                onClick={saveLocally}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200 text-sm font-medium"
              >
                <DownloadIcon />
                <span>Simpan Lokal</span>
              </button>
            </div>
          </div>
        )}

        {/* Recording Status */}
        <div className="text-center">
          {isRecording && (
            <div className="flex items-center justify-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isPaused ? "bg-yellow-500" : "bg-red-500 animate-pulse"
                }`}
              ></div>
              <span className="text-lg font-mono font-bold text-gray-800">
                {formatTime(recordingTime)}
              </span>
              <span className="text-xs text-gray-600">
                {isPaused ? "Dijeda" : "Merekam"}
              </span>
            </div>
          )}
          {!isRecording && recordingTime === 0 && !audioUrl && (
            <p className="text-sm text-gray-500">Siap untuk merekam</p>
          )}
          {!isRecording && audioUrl && (
            <div className="flex items-center justify-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isPlaying ? "bg-blue-500 animate-pulse" : "bg-gray-400"
                }`}
              ></div>
              <span className="text-sm text-gray-600">
                Rekaman siap • {formatTime(recordedDuration)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaveSurferRecorder;
