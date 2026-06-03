"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] pt-28 pb-24 transition-colors duration-500">
      
      {/* Header Section */}
      <div className="max-w-3xl mx-auto px-6 text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight mb-6">
          Invest in your fluency.
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 font-medium mb-10">
          Start learning for free, or upgrade to BhashaSync Pro to unlock native-speaker audio, AI conversations, and unlimited courses.
        </p>

        {/* Clean Monthly/Annual Toggle */}
        <div className="inline-flex items-center p-1.5 bg-gray-100 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
          <button 
            onClick={() => setIsAnnual(false)}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${!isAnnual ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setIsAnnual(true)}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${isAnnual ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
          >
            Annually <span className="text-[10px] uppercase bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* 1. Free Tier */}
        <div className="bg-white dark:bg-[#161a23] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-sm flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Basic</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6">For casual learners starting out.</p>
          <div className="mb-8">
            <span className="text-4xl font-black text-gray-900 dark:text-white">₹0</span>
            <span className="text-gray-500 dark:text-gray-400 font-medium">/forever</span>
          </div>
          <Link href="/login" className="w-full py-3.5 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white rounded-xl font-bold text-center transition-colors mb-8">
            Get Started
          </Link>
          <ul className="space-y-4 text-sm font-medium text-gray-600 dark:text-gray-300 mt-auto">
            <li className="flex items-center gap-3"><svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> Access to free courses</li>
            <li className="flex items-center gap-3"><svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> Basic vocabulary quizzes</li>
            <li className="flex items-center gap-3 text-gray-400 dark:text-gray-600"><svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg> No AI Conversations</li>
          </ul>
        </div>

        {/* 2. Pro Tier (Highlighted) */}
        <div className="bg-gray-900 dark:bg-white rounded-[2.5rem] p-8 shadow-xl relative flex flex-col transform md:-translate-y-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-black uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg">
            Most Popular
          </div>
          <h3 className="text-xl font-bold text-white dark:text-gray-900 mb-2">BhashaSync Pro</h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 font-medium mb-6">For serious learners achieving fluency.</p>
          <div className="mb-8 flex items-baseline gap-1">
            <span className="text-4xl font-black text-white dark:text-gray-900">{isAnnual ? '₹499' : '₹599'}</span>
            <span className="text-gray-400 dark:text-gray-500 font-medium">/month</span>
          </div>
          <button className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-center transition-all hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-blue-600/30 mb-8">
            Start 7-Day Free Trial
          </button>
          <ul className="space-y-4 text-sm font-medium text-gray-300 dark:text-gray-600 mt-auto">
            <li className="flex items-center gap-3 text-white dark:text-gray-900"><svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> Everything in Basic</li>
            <li className="flex items-center gap-3 text-white dark:text-gray-900"><svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> Unlimited Premium Courses</li>
            <li className="flex items-center gap-3 text-white dark:text-gray-900"><svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> Unlimited AI Voice Conversations</li>
            <li className="flex items-center gap-3 text-white dark:text-gray-900"><svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> Offline downloads</li>
          </ul>
        </div>

        {/* 3. Lifetime Tier */}
        <div className="bg-white dark:bg-[#161a23] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-sm flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Lifetime</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6">Pay once. Learn forever.</p>
          <div className="mb-8">
            <span className="text-4xl font-black text-gray-900 dark:text-white">₹14,999</span>
            <span className="text-gray-500 dark:text-gray-400 font-medium">/one-time</span>
          </div>
          <button className="w-full py-3.5 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white rounded-xl font-bold text-center transition-colors border border-gray-200 dark:border-white/10 mb-8">
            Buy Lifetime
          </button>
          <ul className="space-y-4 text-sm font-medium text-gray-600 dark:text-gray-300 mt-auto">
            <li className="flex items-center gap-3"><svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> All Pro features forever</li>
            <li className="flex items-center gap-3"><svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> Future language updates</li>
            <li className="flex items-center gap-3"><svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> Priority email support</li>
          </ul>
        </div>

      </div>
    </div>
  );
}