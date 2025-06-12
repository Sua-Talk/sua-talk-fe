'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const SideBar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Button Container */}
      <div className="fixed right-4 top-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
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

      {/* Sidebar */}
      <div
        className={`fixed right-4 top-16 w-48 bg-white shadow-lg rounded-lg transform transition-all duration-300 ease-in-out z-40
          ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
      >
        <div className="p-4">
          <h1 className="text-xl font-bold text-blue-700 mb-4">SuaTalk</h1>
          
          <nav className="space-y-3">
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Get Started
            </button>
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-opacity-20 z-30 transition-opacity duration-300 ease-in-out
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      />
    </>
  );
};

export default SideBar;
