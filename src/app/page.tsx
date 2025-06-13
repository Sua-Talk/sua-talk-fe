'use client';

import React, { useEffect } from 'react';
import SuaTalk from './suaTalk';
import SideBar from '../components/sideBar';
import apiAuth  from '../lib/apiAuth';

export default function Home() {
  { /* One time check for API health */}
  useEffect(() => {
    apiAuth.health()
      .then((result) => console.log('API Health:', result))
      .catch((err) => console.error('API Health Error:', err));
  }, []);

  return (
    <>
      {/* Debug overlay - only visible on larger screens */}
      <div className="hidden sm:block fixed inset-0 bg-gray-100 z-0">
        <div className="flex justify-center h-full">
          <div className="w-full max-w-sm border-4 border-red-500 relative">
          </div>
        </div>
      </div>

      {/* Main content - full width on mobile, constrained on desktop */}
      <div className="min-h-screen bg-white sm:bg-transparent sm:flex sm:justify-center relative z-10">
        <div className="w-full sm:w-full sm:max-w-sm sm:bg-white min-h-screen">
          <SuaTalk />
        </div>
      </div>
    </>
  );
}
