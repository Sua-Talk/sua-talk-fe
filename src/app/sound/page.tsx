'use client';

import React from 'react';
import WaveSurferRecorder from '../../components/WaveSurferRecorder';
import AudioUploader from '../../components/AudioUploader';

const SoundPage = () => {
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

      {/* Main content */}
      <div className="min-h-screen bg-white sm:bg-transparent sm:flex sm:justify-center relative z-10">
        <div className="w-full sm:w-full sm:max-w-sm sm:bg-white min-h-screen">
          
          {/* Header */}
          <header className="flex justify-between items-center px-6 py-5 bg-white shadow-sm">
            <div className="text-xl font-bold text-blue-700">SuaTalk</div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
              Analisis
            </button>
          </header>

          {/* Voice Recorder Section */}
          <section className="px-6 py-8 bg-gray-50">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Rekam Audio Langsung</h2>
              <p className="text-sm text-gray-600">Rekam tangisan bayi secara langsung untuk dianalisis</p>
            </div>
            <WaveSurferRecorder />
          </section>

          {/* Divider */}
          <div className="px-6">
            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="px-4 text-sm text-gray-500">atau</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
          </div>

          {/* Audio Upload Section */}
          <section className="px-6 py-8 bg-white">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Unggah Audio</h2>
              <p className="text-sm text-gray-600">Pilih file audio untuk menganalisis jenis tangisan bayi</p>
            </div>
            <AudioUploader />
          </section>

          {/* Bottom spacing */}
          <div className="h-8"></div>
        </div>
      </div>
    </>
  );
};

export default SoundPage;