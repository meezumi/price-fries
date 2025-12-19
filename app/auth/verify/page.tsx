'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Spinner } from '@/components/Loaders'

function VerifyContent() {

  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get('token');
      const email = searchParams.get('email');

      if (!token || !email) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify?token=${token}&email=${email}`);
        
        if (response.ok) {
          setStatus('success');
          setMessage('Email verified successfully! Redirecting to login...');
          setTimeout(() => {
            router.push('/auth/login?verified=true');
          }, 2000);
        } else {
          setStatus('error');
          setMessage('Verification failed. Link may be expired.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred during verification');
      }
    };

    verify();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold mb-2">
            Price<span className="text-teal-500">Fries</span>
          </h1>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Email Verification</h2>

          <div className="flex justify-center mb-6">
            {status === 'loading' && <Spinner size="large" />}
            {status === 'success' && (
              <div className="text-green-500 text-5xl">✓</div>
            )}
            {status === 'error' && (
              <div className="text-red-500 text-5xl">✕</div>
            )}
          </div>

          <p className={`text-lg font-medium ${
            status === 'success' ? 'text-green-600' : 
            status === 'error' ? 'text-red-600' : 
            'text-gray-600'
          }`}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner size="large" /></div>}>
      <VerifyContent />
    </Suspense>
  );
}
