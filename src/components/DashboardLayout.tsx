'use client';

import React from 'react';
import SideBar from './sideBar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100">
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

      {/* Main content container */}
      <div className="relative z-10 min-h-screen bg-white sm:bg-transparent sm:flex sm:justify-center">
        <div className="w-full sm:w-full sm:max-w-sm sm:bg-white min-h-screen">
          <SideBar />
          <main className="p-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout; 