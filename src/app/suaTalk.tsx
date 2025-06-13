import React, { useRef, useState } from 'react';
import WaveSurferRecorder from '../components/WaveSurferRecorder';
import AudioUploader from '../components/AudioUploader';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

const SuaTalk = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/home');
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <div className="min-h-screen bg-white sm:bg-transparent sm:flex sm:justify-center relative z-10">
      <div className="w-full sm:w-full sm:max-w-sm sm:bg-white min-h-screen">

        {/* Header */}
        <header className="flex justify-between items-center px-6 py-5 bg-white shadow-sm">
          <div className="text-xl font-bold text-blue-700">SuaTalk</div>
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
  );
};

export default SuaTalk;
