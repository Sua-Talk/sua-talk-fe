import React, { useRef } from 'react';
import WaveSurferRecorder from '../components/WaveSurferRecorder';
import AudioUploader from '../components/AudioUploader';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

const SuaTalk = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/sound');
    } else {
      router.push('/auth/login');
    }
  };

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
          
          {/* Header */}
          <header className="flex justify-between items-center px-6 py-5 bg-white shadow-sm">
            <div className="text-xl font-bold text-blue-700">SuaTalk</div>
            <nav className="hidden">
              <a href="#" className="mx-2 text-sm text-gray-700">Beranda</a>
              <a href="#" className="mx-2 text-sm text-gray-700">Deteksi Tangisan</a>
              <a href="#" className="mx-2 text-sm text-gray-700">Edukasi Orang Tua</a>
            </nav>
            <button 
              onClick={handleGetStarted}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Mulai Deteksi
            </button>
          </header>

          {/* Hero Section */}
          <section className="px-6 py-8 bg-blue-50">
            <div className="text-center">
              <div className="mb-6">
                <img
                  src="/mother-baby.png"
                  alt="Mother holding crying baby"
                  className="w-64 h-64 mx-auto object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4 leading-tight">
                Deteksi Tangisan Bayi & Edukasi Orang Tua dalam Satu Platform
              </h1>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Deteksi tangisan bayi menggunakan AI untuk membantu orang tua secara lebih akurat.
              </p>
              <div className="space-y-3">
                <button 
                  onClick={handleGetStarted}
                  className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Mulai Deteksi
                </button>
                <button 
                  onClick={scrollToFeatures}
                  className="w-full bg-white text-blue-500 border-2 border-blue-500 py-3 px-6 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  Pelajari Lebih Lanjut
                </button>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section ref={featuresRef} className="px-6 py-8 bg-white">
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">🤖</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Deteksi Tangisan Berbasis AI</h3>
                <p className="text-sm text-gray-600">Deteksi tangisan menggunakan AI dengan akurasi tinggi.</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">🔔</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Notifikasi Real-time</h3>
                <p className="text-sm text-gray-600">Dapatkan notifikasi secara real-time saat bayi menangis.</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">📚</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Artikel Parenting Terpercaya</h3>
                <p className="text-sm text-gray-600">Artikel parenting terpercaya untuk mendukung tumbuh kembang anak.</p>
              </div>
            </div>
          </section>

          {/* Bottom spacing */}
          <div className="h-8"></div>
        </div>
      </div>
    </>
  );
};

export default SuaTalk;