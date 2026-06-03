"use client";

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gray-50 dark:bg-[#0B1120] pt-2 pb-2 md:pt-32 md:pb-2 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 min-h-[80vh] md:min-h-[90vh] transition-colors duration-500">
      
      {/* Ambient Background Glows - Tuned for Light and Dark visibility */}
      <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 flex justify-center pointer-events-none">
        <div className="w-[400px] md:w-[800px] h-[300px] md:h-[400px] bg-gradient-to-tr from-blue-400/30 to-indigo-500/20 dark:from-blue-600/20 dark:to-indigo-500/10 blur-[80px] md:blur-[120px] rounded-full transform -translate-y-1/2 opacity-70"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        {/* Premium Bhasha Badge - Glassmorphism in Dark Mode */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-6 md:mb-8 hover:shadow-md dark:hover:border-white/20 transition-all mx-auto backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-500 animate-pulse"></span>
          Welcome to the Official Bhasha Academy Portal
        </div>

        {/* Headline - High contrast transitions */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6 md:mb-8 leading-[1.15] transition-colors duration-300">
          Master Languages <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 dark:from-blue-400 dark:via-indigo-400 dark:to-blue-200">
            Without Limits
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl md:max-w-3xl mx-auto mb-10 md:mb-12 leading-relaxed px-4 sm:px-0 transition-colors duration-300">
          Bhasha Academy's exclusive digital campus. Access premium multimedia courses, track your fluency in real-time, and connect with our expert instructors.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 sm:px-0 w-full sm:w-auto">
          {/* Primary CTA */}
          <Link href="/courses" className="w-full sm:w-auto bg-gray-900 dark:bg-white text-gray-100 dark:text-gray-900 px-8 py-4 rounded-full font-bold text-base md:text-lg hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            Explore Academy Courses
          </Link>
          
          {/* Secondary CTA - Outlined Glass effect */}
          <Link href="/login" className="w-full sm:w-auto bg-white dark:bg-white/5 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 px-8 py-4 rounded-full font-bold text-base md:text-lg hover:bg-gray-50 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 shadow-sm backdrop-blur-md">
            Student / Staff Login
          </Link>
        </div>
      </div>
    </section>
  );
}