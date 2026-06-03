"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }

    setIsLoading(true);
    const toastId = toast.loading('Creating your account...', {
      style: { pointerEvents: 'none' } 
    });

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';
      const checkRes = await axios.get(`${baseUrl}/users?email=${email}`);
      
      if (checkRes.data.length > 0) {
        toast.error("An account with this email already exists.", { id: toastId });
        setIsLoading(false);
        return; 
      }

      const newUser = {
        id: String(Date.now()),
        name: name,
        email: email,
        password: password,
        role: 'student',
        purchasedCourses: []
      };

      const createRes = await axios.post(`${baseUrl}/users`, newUser);
      const createdUser = createRes.data;

      document.cookie = `bhasha_session=${createdUser.id}; path=/; max-age=86400;`;
      
      toast.success(`Welcome to BhashaSync, ${createdUser.name.split(' ')[0]}! 🚀`, { 
        id: toastId,
      });
      
      router.push('/dashboard');
      router.refresh();
      
    } catch (err) {
      console.error("Signup Error:", err);
      toast.error("Server disconnected. Please try again later.", { id: toastId });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#0f1219]">
      
      {/* LEFT SIDE: The Brand Billboard (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-gray-900 opacity-90"></div>
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/30 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/30 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-black text-white tracking-tight mb-6 leading-tight">
            Master a language.<br/>At your own pace.
          </h1>
          <p className="text-xl text-teal-100 font-medium leading-relaxed mb-10">
            Join the fastest-growing learning platform. Get access to premium video courses, track your learning streaks, and achieve fluency on your schedule.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl border border-white/20">🎥</div>
              <div>
                <h4 className="text-white font-bold">Expert-Led Courses</h4>
                <p className="text-teal-200 text-sm">Learn from highly structured video modules.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl border border-white/20">📈</div>
              <div>
                <h4 className="text-white font-bold">Progress Tracking</h4>
                <p className="text-teal-200 text-sm">Build your daily streak and watch your fluency grow.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl border border-white/20">⏱️</div>
              <div>
                <h4 className="text-white font-bold">Self-Paced Learning</h4>
                <p className="text-teal-200 text-sm">Lifetime access to courses. Learn whenever, wherever.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: The Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 mt-16 lg:mt-0">
        <div className="w-full max-w-md animate-fade-in">
          
          <div className="mb-10 text-center lg:text-left">
            <Link href="/" className="lg:hidden inline-flex items-center gap-2 mb-8 group">
              <div className="bg-emerald-600 text-white p-1.5 rounded-lg shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Bhasha<span className="text-emerald-600">Sync.</span>
              </span>
            </Link>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">Create Account</h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400 font-medium">
              Start your journey today for free.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSignup}>
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 ml-1">Full Name</label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-5 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-600 dark:focus:ring-emerald-500 focus:border-transparent transition-all sm:text-sm font-medium"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 ml-1">Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-5 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-600 dark:focus:ring-emerald-500 focus:border-transparent transition-all sm:text-sm font-medium"
                placeholder="youremail@gmail.com"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 ml-1">Password</label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-5 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-600 dark:focus:ring-emerald-500 focus:border-transparent transition-all sm:text-sm font-medium"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 ml-1">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full px-5 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-600 dark:focus:ring-emerald-500 focus:border-transparent transition-all sm:text-sm font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-lg text-base font-black text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all mt-6 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1 active:scale-95 shadow-emerald-600/30'
              }`}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 font-medium pt-6 border-t border-gray-100 dark:border-white/10">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold transition-all">
              Sign In
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}