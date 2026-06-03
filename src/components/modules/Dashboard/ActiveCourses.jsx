"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function DashboardCourses({ courses = [] }) {
  // Track which tab is currently active
  const [activeTab, setActiveTab] = useState('learning'); // 'learning' or 'completed'

  // Filter courses based on real progress
  const inProgressCourses = courses.filter(course => {
    const totalModules = course.modules?.length || 1;
    const userProgress = course.userProgress || 0;
    return userProgress < totalModules;
  });

  const completedCourses = courses.filter(course => {
    const totalModules = course.modules?.length || 1;
    const userProgress = course.userProgress || 0;
    return userProgress >= totalModules;
  });

  // Reusable function to render a premium course card
  const renderCourseCard = (course, isCompleted = false) => {
    const totalModules = course.modules?.length || 1;
    const completedModules = course.userProgress || 0;
    const progressPercentage = Math.min(Math.round((completedModules / totalModules) * 100), 100);

    // Dynamic gradient colors based on whether the course is completed or not
    const hoverGradient = isCompleted ? 'from-emerald-500 to-teal-600' : 'from-blue-500 to-indigo-600';

    return (
      <div 
        key={course.id} 
        className="bg-white dark:bg-[#161a23] rounded-[2rem] p-7 md:p-8 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl dark:hover:shadow-black/50 transition-all duration-500 transform hover:-translate-y-1.5 group flex flex-col sm:flex-row gap-6 lg:gap-8 relative overflow-hidden"
      >
        {/* --- THE MAGIC BALL: Expanding Background Hover Effect --- */}
        <div className={`absolute -right-16 -top-16 w-48 h-48 rounded-full bg-gradient-to-br ${hoverGradient} opacity-0 group-hover:opacity-[0.04] dark:group-hover:opacity-[0.08] group-hover:scale-[6] transition-all duration-700 ease-out z-0 pointer-events-none`} />

        {/* Course Thumbnail + Premium Overlays (Z-10 keeps it above the ball) */}
        <div className="w-full sm:w-44 h-36 flex-shrink-0 rounded-2xl overflow-hidden relative border border-gray-100 dark:border-white/10 z-10">
          <img 
            src={course.thumbnail||'https://images.pexels.com/photos/14814047/pexels-photo-14814047.jpeg?auto=compress&cs=tinysrgb&w=400&lazy=load'}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {isCompleted ? (
             <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent flex items-end p-3">
               <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/90 text-white rounded-lg text-xs font-black uppercase tracking-wider shadow-lg">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                 Achieved
               </span>
             </div>
          ) : (
             <div className="absolute top-2 left-2 bg-white/90 dark:bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white shadow-md">
               {course.language}
             </div>
          )}
        </div>

        {/* Course Info, Progress & Premium Buttons (Z-10 keeps it above the ball) */}
        <div className="flex flex-col flex-grow justify-between z-10 w-full relative">
          <div>
            <div className="flex justify-between items-start gap-4 mb-2">
               <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 dark:group-hover:from-white dark:group-hover:to-gray-300 transition-all duration-300 line-clamp-2">
                 {course.title}
               </h3>
               {isCompleted && (
                  <span className="text-4xl drop-shadow-md transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">🏆</span>
               )}
            </div>
            {!isCompleted && (
               <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                 {completedModules} of {totalModules} lessons completed
               </p>
            )}
          </div>

          <div className="mt-6 space-y-4">
            {!isCompleted && (
               <div className="space-y-1.5">
                 <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                   <span>Overall Mastery</span>
                   <span className="text-blue-600 dark:text-blue-400 font-black">{progressPercentage}%</span>
                 </div>
                 <div className="w-full h-3 bg-gray-100 dark:bg-black/40 rounded-full overflow-hidden shadow-inner border border-gray-200/50 dark:border-white/5 relative">
                   <div 
                     className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 h-full rounded-full transition-all duration-1000 ease-out relative shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                     style={{ width: `${progressPercentage}%` }}
                   >
                     <div className="absolute top-0 left-0 w-full h-[30%] bg-white/30 rounded-full"></div>
                   </div>
                 </div>
               </div>
            )}

            {isCompleted ? (
               <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <button className="flex-grow flex justify-center items-center gap-2 py-3.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white rounded-xl font-bold text-sm border border-gray-200 dark:border-white/10 transition-all duration-300 shadow-sm">
                     <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                     Download Certificate
                  </button>
                  <button className="flex-grow flex justify-center items-center gap-2 py-3.5 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl font-black text-sm transition-all duration-300 shadow-xl active:scale-95">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                     Review Course
                  </button>
               </div>
            ) : (
               <Link 
                 href={`/learning/${course.id}`} 
                 className="w-full flex justify-center items-center gap-2.5 py-4 bg-gray-950 hover:bg-blue-600 dark:bg-white dark:text-gray-950 dark:hover:bg-blue-500 text-white rounded-xl font-black text-base shadow-xl active:scale-95 transition-all duration-300 group/btn"
               >
                 Resume Learning
                 <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
               </Link>
            )}
          </div>
        </div>
      </div>
    );
  };

  // GLOBAL EMPTY STATE: If they own absolutely 0 courses
  if (courses.length === 0) {
    return (
      <div className="bg-white dark:bg-[#161a23] rounded-[2.5rem] p-10 md:p-16 border border-gray-100 dark:border-white/5 shadow-sm text-center transition-colors duration-300">
        <div className="w-24 h-24 bg-gray-50 dark:bg-black/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">📚</span>
        </div>
        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">Your learning journey awaits</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8 font-medium">
          You haven't enrolled in any courses yet. Explore our catalog to find the perfect language for your next adventure.
        </p>
        <Link 
          href="/courses"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-1 active:scale-95"
        >
          Explore Courses
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      
      {/* PREMIUM TAB BAR (Segmented Control) */}
      <div className="flex justify-center md:justify-start mb-8">
        <div className="inline-flex bg-gray-100/80 dark:bg-[#0f1219] p-1.5 rounded-2xl border border-gray-200/50 dark:border-white/5 shadow-inner">
          <button
            onClick={() => setActiveTab('learning')}
            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === 'learning'
                ? 'bg-white dark:bg-[#161a23] text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            My Learning
            <span className={`px-2.5 py-0.5 rounded-lg text-xs ${
              activeTab === 'learning' 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' 
                : 'bg-gray-200 dark:bg-white/10'
            }`}>
              {inProgressCourses.length}
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === 'completed'
                ? 'bg-white dark:bg-[#161a23] text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Completed
            <span className={`px-2.5 py-0.5 rounded-lg text-xs ${
              activeTab === 'completed' 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                : 'bg-gray-200 dark:bg-white/10'
            }`}>
              {completedCourses.length}
            </span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT RENDERER */}
      <div className="relative" key={activeTab}>
        
        {/* LEARNING TAB */}
        {activeTab === 'learning' && (
          <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-8">
            {inProgressCourses.length > 0 ? (
              inProgressCourses.map(course => renderCourseCard(course, false))
            ) : (
              <div className="col-span-full py-16 text-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2rem]">
                <div className="text-5xl mb-4 opacity-50">🚀</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">You're all caught up!</h3>
                <p className="text-gray-500 dark:text-gray-400">You don't have any courses currently in progress.</p>
              </div>
            )}
          </div>
        )}

        {/* COMPLETED TAB */}
        {activeTab === 'completed' && (
          <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-8">
            {completedCourses.length > 0 ? (
              completedCourses.map(course => renderCourseCard(course, true))
            ) : (
              <div className="col-span-full py-16 text-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2rem]">
                <div className="text-5xl mb-4 opacity-50">🌱</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No trophies yet</h3>
                <p className="text-gray-500 dark:text-gray-400">Keep up the great work! Your completed courses will appear here.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}