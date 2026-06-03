"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const toastId = toast.loading('Authenticating...', {
      style: { pointerEvents: 'none' } 
    });

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';
      const res = await axios.get(`${baseUrl}/users?email=${email}`);
      
      if (res.data.length === 0) {
        toast.error("Account not found. Please check your email.", { id: toastId });
        setIsLoading(false);
        return; 
      }

      const user = res.data[0];

      if (user.password !== password) {
        toast.error("Incorrect password. Please try again.", { id: toastId });
        setIsLoading(false);
        return; 
      }

      document.cookie = `bhasha_session=${user.id}; path=/; max-age=86400;`;
      
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`, { 
        id: toastId,
        icon: '👋',
      });
      
      router.push('/dashboard');
      router.refresh();
      
    } catch (err) {
      console.error("Login Error:", err);
      toast.error("Server disconnected. Please contact support.", { id: toastId });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#0f1219]">
      
      {/* LEFT SIDE: The Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 mt-16 lg:mt-0 relative z-10">
        <div className="w-full max-w-md animate-fade-in">
          
          <div className="mb-10 text-center lg:text-left">
            <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Bhasha<span className="text-blue-600">Sync.</span>
              </span>
            </Link>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">Welcome Back</h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400 font-medium">
              Pick up exactly where you left off.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm font-medium placeholder-gray-400"
                placeholder="youremail@gmail.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 ml-1">
                <label htmlFor="password" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Password</label>
                <a href="#" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline transition-all">Forgot password?</a>
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm font-medium placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-lg text-base font-black text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all mt-8 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1 active:scale-95 shadow-blue-600/30'
              }`}
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-600 dark:text-blue-400 hover:underline font-bold">
              Create one for free
            </Link>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Beautiful Static Brand Image (Hidden on Mobile) */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden bg-gray-900">
        
        {/* Color Overlays to match your theme and make text readable */}
        <div className="absolute inset-0 bg-blue-900/30 mix-blend-multiply z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#acacac77] dark:from-[#0f1219] via-[#0f1219]/60 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#ffffff] dark:from-[#0f1219] via-transparent to-transparent z-10 pointer-events-none"></div>
        
        {/* High Quality Unsplash Image */}
        <img 
          src="https://images.pexels.com/photos/5212329/pexels-photo-5212329.jpeg" 
          alt="Students collaborating and learning" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[20s] hover:scale-105"
        />

        {/* Clean, motivational text anchored to the bottom */}
        <div className="absolute bottom-16 left-16 right-16 z-20 animate-fade-in">
          <div className="w-12 h-1 bg-blue-600 mb-6 rounded-full"></div>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4 leading-tight">
            Continue your <br />
            path to fluency.
          </h2>
          <p className="text-slate-700 dark:text-blue-100/80 font-medium text-lg max-w-md">
            Log in to resume your premium video courses and reach your language goals.
          </p>
        </div>
      </div>

    </div>
  );
}