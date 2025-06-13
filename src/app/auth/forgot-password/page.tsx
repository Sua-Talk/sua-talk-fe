'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiAuth from '@/lib/apiAuth';
import SideBar from '@/components/sideBar';
import Link from 'next/link';

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    try {
      const response = await apiAuth.forgotPassword(email);
      if (response.success) {
        setSuccess(true);
        // Redirect to change password page after 2 seconds
        setTimeout(() => {
          router.push(`/auth/forgot-password/verify-email?email=${encodeURIComponent(email)}`);
        }, 2000);
      } else {
        setError(response.message || 'Failed to send reset email');
      }
    } catch (error: any) {
      setError(error?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SideBar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Forgot your password?</h2>
            <p className="mt-2 text-center text-sm text-gray-600">Enter your email to receive a reset link.</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button 
              type="submit" 
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" 
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">Reset link sent! Redirecting to change password...</p>
                </div>
              </div>
            </div>
          )}
          <div className="text-center mt-4">
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 text-sm">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
