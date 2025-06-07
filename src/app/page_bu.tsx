'use client';

import Image from "next/image";
import React, { useState, useRef, useEffect } from 'react';

// Simple icons
const MicIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 1a4 4 0 0 0-4 4v7a4 4 0 0 0 8 0V5a4 4 0 0 0-4-4z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
        <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
);

const SquareIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    </svg>
);

const PlayIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="5,3 19,12 5,21"/>
    </svg>
);

const PauseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="6" y="4" width="4" height="16"/>
        <rect x="14" y="4" width="4" height="16"/>
    </svg>
);

const DownloadIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7,10 12,15 17,10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
);

const TrashIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3,6 5,6 21,6"/>
        <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
    </svg>
);

const WaveSurferRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [wavesurfer, setWavesurfer] = useState<any>(null);
    const [recordPlugin, setRecordPlugin] = useState<any>(null);

    const waveformRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
                const WaveSurfer = (await import('wavesurfer.js')).default;
                const RecordPlugin = (await import('wavesurfer.js/dist/plugins/record.js')).default;

                if (!waveformRef.current) return;

                // Create record plugin
                const record = RecordPlugin.create({
                    scrollingWaveform: true,
                    renderRecordedAudio: false,
                });

                // Create WaveSurfer instance
                const ws = WaveSurfer.create({
                    container: waveformRef.current,
                    waveColor: '#dc2626',
                    progressColor: '#b91c1c',
                    height: 80,
                    barWidth: 2,
                    barGap: 1,
                    plugins: [record],
                });

                // Set up event listeners
                record.on('record-start', () => {
                    console.log('Recording started');
                    setIsRecording(true);
                    setIsPaused(false);
                    setRecordingTime(0);
                });

                record.on('record-end', (blob: Blob) => {
                    console.log('Recording ended', blob);
                    const url = URL.createObjectURL(blob);


                });

                record.on('record-pause', () => {
                    console.log('Recording paused');
                    setIsPaused(true);
                });

                record.on('record-resume', () => {
                    console.log('Recording resumed');
                    setIsPaused(false);
                });

                setWavesurfer(ws);
                setRecordPlugin(record);

            } catch (error) {
                console.error('Error initializing WaveSurfer:', error);
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
        };
    }, []);

    useEffect(() => {
        if (isRecording && !isPaused) {
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
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
            alert('Audio recorder not initialized yet. Please wait a moment and try again.');
            return;
        }

        try {
            await recordPlugin.startRecording();
        } catch (error) {
            console.error('Error starting recording:', error);
            alert('Error starting recording. Please ensure microphone permissions are granted.');
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

    return (
        <div className="w-full max-w-sm mx-auto p-4 bg-white rounded-lg shadow-lg">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-800 mb-1">Voice Recorder</h2>
                <p className="text-sm text-gray-600">Powered by WaveSurfer.js</p>
            </div>

            {/* Waveform Container */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div ref={waveformRef} className="w-full min-h-[80px]" />
            </div>

            {/* Recording Controls */}
            <div className="flex items-center justify-center space-x-3 mb-3">
                {!isRecording ? (
                    <button
                        onClick={startRecording}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200 text-sm"
                    >
                        <MicIcon />
                        <span>Record</span>
                    </button>
                ) : (
                    <>
                        <button
                            onClick={togglePause}
                            className="flex items-center space-x-1 px-3 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors duration-200 text-sm"
                        >
                            {isPaused ? <PlayIcon /> : <PauseIcon />}
                            <span>{isPaused ? 'Resume' : 'Pause'}</span>
                        </button>
                        <button
                            onClick={stopRecording}
                            className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200 text-sm"
                        >
                            <SquareIcon />
                            <span>Stop</span>
                        </button>
                    </>
                )}
            </div>

            {/* Recording Status */}
            <div className="text-center">
                {isRecording && (
                    <div className="flex items-center justify-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`}></div>
                        <span className="text-lg font-mono font-bold text-gray-800">
              {formatTime(recordingTime)}
            </span>
                        <span className="text-xs text-gray-600">
              {isPaused ? 'Paused' : 'Recording'}
            </span>
                    </div>
                )}
                {!isRecording && recordingTime === 0 && (
                    <p className="text-sm text-gray-500">Ready to record</p>
                )}
            </div>
        </div>
    );
};

export default function Home() {
    return (
        <>
            {/* Debug overlay - only visible on larger screens */}
            <div className="hidden sm:block fixed inset-0 bg-gray-100 z-0">
                <div className="flex justify-center h-full">
                    <div className="w-full max-w-sm border-4 border-red-500 relative">
                        <div className="absolute -left-20 top-4 text-red-500 text-xs font-mono rotate-90 origin-left">
                            Mobile Viewport
                        </div>
                        <div className="absolute -right-16 top-4 text-red-500 text-xs font-mono -rotate-90 origin-right">
                            375px max
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content - full width on mobile, constrained on desktop */}
            <div className="min-h-screen bg-white sm:bg-transparent sm:flex sm:justify-center relative z-10">
                <div className="w-full sm:w-full sm:max-w-sm sm:bg-white min-h-screen">
                    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 pb-16 gap-8 font-[family-name:var(--font-geist-sans)]">
                        <main className="flex flex-col gap-6 row-start-2 items-center w-full px-2">

                            {/* Audio Recorder Component */}
                            <WaveSurferRecorder />


                        </main>

                        <footer className="row-start-3 flex gap-4 flex-wrap items-center justify-center text-xs">
                            <a
                                className="flex items-center gap-1 hover:underline hover:underline-offset-4"
                                href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Image
                                    aria-hidden
                                    src="/file.svg"
                                    alt="File icon"
                                    width={12}
                                    height={12}
                                />
                                Learn
                            </a>
                            <a
                                className="flex items-center gap-1 hover:underline hover:underline-offset-4"
                                href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Image
                                    aria-hidden
                                    src="/window.svg"
                                    alt="Window icon"
                                    width={12}
                                    height={12}
                                />
                                Examples
                            </a>
                            <a
                                className="flex items-center gap-1 hover:underline hover:underline-offset-4"
                                href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Image
                                    aria-hidden
                                    src="/globe.svg"
                                    alt="Globe icon"
                                    width={12}
                                    height={12}
                                />
                                Go to nextjs.org →
                            </a>
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
