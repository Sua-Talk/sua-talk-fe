'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { localStorageUtils } from '@/lib/localStorage';

const AnalysisPage = () => {
  const { isAuthenticated, getUserInfo } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<{
    category: string;
    confidence: number;
    description: string;
  } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else {
      const recordingId = searchParams.get('id');
      if (!recordingId) {
        router.push('/sound');
        return;
      }

      // Simulate loading between 3-5 seconds
      const loadingTime = Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000;
      
      setTimeout(() => {
        // Mock analysis result
        const categories = ['lapar', 'kembung', 'tidak nyaman', 'lelah', 'sakit perut'];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const confidence = Math.random() * 0.3 + 0.7; // Random confidence between 0.7 and 1.0
        
        const descriptions = {
          lapar: 'Bayi menunjukkan tanda-tanda kelaparan. Segera berikan ASI atau susu formula.',
          sakit: 'Bayi menunjukkan tanda-tanda ketidaknyamanan fisik. Periksa suhu tubuh dan kondisi fisik bayi.',
          'tidak nyaman': 'Bayi merasa tidak nyaman. Periksa popok, pakaian, atau suhu ruangan.'
        };

        setAnalysisResult({
          category: randomCategory,
          confidence: confidence,
          description: descriptions[randomCategory as keyof typeof descriptions]
        });
        setIsLoading(false);
      }, loadingTime);
    }
  }, [isAuthenticated, router, searchParams]);

  const userInfo = getUserInfo();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Menganalisis tangisan bayi...</p>
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
            </div>
          </div>
        </header>

        <main className="pt-8">
          <div className="px-4 py-8">
            {/* Welcome Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Hasil Analisis Tangisan
              </h1>
              <p className="mt-2 text-gray-600">
                Analisis tangisan bayi menggunakan teknologi AI
              </p>
            </header>

            {/* Analysis Result */}
            {analysisResult && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Kategori Tangisan</h2>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        {analysisResult.category}
                      </span>
                      <span className="text-sm text-gray-600">
                        (Akurasi: {(analysisResult.confidence * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Deskripsi</h2>
                    <p className="text-gray-600">{analysisResult.description}</p>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => router.push('/sound')}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Kembali ke Rekaman
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalysisPage;
