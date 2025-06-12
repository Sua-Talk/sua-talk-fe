'use client';
import { useEffect } from 'react';
import apiAuth from '@/lib/apiAuth';

const GoogleSigninPage = () => {
  useEffect(() => {
    // Redirect to Google auth endpoint
    const redirectUrl = encodeURIComponent('https://api.suatalk.site/auth/google?redirect=https%3A%2F%2Flocalhost%3A3000');
    window.location.href = `${redirectUrl}`;
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="loader mb-4" />
        <p>Redirecting to Google sign-in...</p>
      </div>
    </div>
  );
};

export default GoogleSigninPage;

// Add a simple CSS loader if needed 