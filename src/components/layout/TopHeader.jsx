"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function TopHeader() {
  const [authStatus, setAuthStatus] = useState('loading');
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      if (typeof document === 'undefined') return;
      
      const match = document.cookie.match(new RegExp('(^| )bhasha_session=([^;]+)'));
      
      if (!match) {
        setAuthStatus('guest');
        return;
      }
      
      const userId = match[2];
      
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';
        const res = await axios.get(`${baseUrl}/users/${userId}`);
        
        setAuthStatus(res.data.role); 
      } catch (error) {
        console.error("Failed to fetch user role for navbar", error);
        setAuthStatus('guest'); 
      }
    };

    checkSession();
  }, []);

  const handleLogout = () => {
    document.cookie = 'bhasha_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setAuthStatus('guest');
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="fixed top-0 z-40 w-full bg-white/80 dark:bg-[#0f1219]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 xl:px-16">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Logo Area */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-br from-blue-700 to-indigo-800 dark:from-blue-600 dark:to-indigo-700 text-white p-1.5 md:p-2 rounded-lg md:rounded-xl shadow-sm group-hover:shadow-md transition-all">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight transition-colors duration-300">
                Bhasha<span className="text-blue-700 dark:text-blue-500">Sync</span><span className="text-blue-700 dark:text-blue-500 text-2xl md:text-3xl leading-none">.</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {authStatus === 'loading' ? (
              <div className="flex space-x-8 opacity-50">
                <div className="w-24 h-4 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
                <div className="w-24 h-4 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
                <div className="w-24 h-4 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
              </div>
            ) : authStatus === 'teacher' ? (
              <>
                <Link href="/instructor/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 font-semibold text-sm transition-colors duration-200">Overview</Link>
                <Link href="/instructor/courses" className="text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 font-semibold text-sm transition-colors duration-200">Manage Courses</Link>
                <Link href="/instructor/analytics" className="text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 font-semibold text-sm transition-colors duration-200">Revenue Analytics</Link>
              </>
            ) : (
              <>
                <Link href="/courses" className="text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 font-semibold text-sm transition-colors duration-200">Explore Courses</Link>
                <Link href="/features" className="text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 font-semibold text-sm transition-colors duration-200">Platform Features</Link>
                <Link href="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 font-semibold text-sm transition-colors duration-200">Pricing & Plans</Link>              </>
            )}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            {authStatus === 'loading' ? (
              <div className="w-32 h-10 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
            ) : authStatus === 'guest' ? (
              <>
                <Link href="/login" className="text-gray-800 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 font-bold text-sm transition-colors duration-200">Log in</Link>
                <Link href="/signup" className="bg-blue-700 dark:bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-blue-800 dark:hover:bg-blue-500 hover:shadow-lg dark:hover:shadow-blue-900/40 hover:-translate-y-0.5 transition-all duration-300">
                  Sign Up
                </Link>
              </>
            ) : authStatus === 'teacher' ? (
              <>
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 font-bold text-sm transition-colors duration-200">Log out</button>
                {/* UPGRADED CTA: Now routes directly to the Course Creator! */}
                <Link href="/instructor/courses/create" className="bg-emerald-600 dark:bg-emerald-500 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-emerald-700 dark:hover:bg-emerald-600 hover:shadow-lg dark:hover:shadow-emerald-900/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                  Create Course
                </Link>
              </>
            ) : (
              <>
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 font-bold text-sm transition-colors duration-200">Log out</button>
                <Link href="/dashboard" className="bg-blue-700 dark:bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-blue-800 dark:hover:bg-blue-500 hover:shadow-lg dark:hover:shadow-blue-900/40 hover:-translate-y-0.5 transition-all duration-300">
                  My Dashboard
                </Link>
              </>
            )}
          </div>

          {/* Mobile Action Buttons */}
          <div className="md:hidden flex items-center gap-4">
            {authStatus === 'loading' ? (
               <div className="w-24 h-8 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
            ) : (
              <>
                {authStatus !== 'guest' && (
                  <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200" aria-label="Log out">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                )}

                {/* Mobile logic updated to match desktop CTA */}
                <Link 
                  href={authStatus === 'guest' ? '/dashboard' : authStatus === 'teacher' ? '/instructor/courses/create' : '/dashboard'} 
                  className={`text-white px-4 py-1.5 rounded-full font-bold text-xs shadow-sm transition-all duration-200 ${
                    authStatus === 'teacher' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-700 hover:bg-blue-800'
                  }`}
                >
                  {authStatus === 'guest' ? 'Get Started' : authStatus === 'teacher' ? 'Create Course' : 'Dashboard'}
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}