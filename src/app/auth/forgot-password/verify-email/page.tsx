'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import apiAuth from '@/lib/apiAuth';
import { useAuth } from '@/context/AuthContext';

const VerifyEmailPage = () => {
  const router = useRouter();
  const { register } = useAuth();
  const searchParams = useSearchParams();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const email = searchParams.get('email') || '';
  const password = searchParams.get('password') || '';
  const firstName = searchParams.get('firstName') || '';
  const lastName = searchParams.get('lastName') || '';

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    try {
      // First verify the email with OTP
      const verifyResponse = await apiAuth.confirmEmail(email, code) as { success: boolean; message?: string };
      if (!verifyResponse.success) {
        throw new Error('Email verification failed');
      }

      // Then complete the registration using AuthContext
      await register(email, password, firstName, lastName);
      router.push('/sound');    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : 'Verification or registration failed');
    }
  };

  const handleResendVerification = async () => {
    try {
      const response = await apiAuth.resendVerification(email) as { success: boolean; message?: string };
      if (!response.success) {
        throw new Error('Resend verification failed');
      }
      alert('Verification email resent');    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : 'Resend failed');
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We&apos;ve sent a verification code to your email
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (              <input
                key={index}
                ref={el => { inputRefs.current[index] = el; }}
                type="text"
                maxLength={1}
                placeholder="0"
                value={digit}
                onChange={e => handleChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ))}
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Verify Email
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <button
            onClick={handleResendVerification}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Didn&apos;t receive the code? Resend verification
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage; 