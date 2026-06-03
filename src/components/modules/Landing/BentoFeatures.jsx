export default function BentoFeatures() {
  return (
    <section className="bg-white dark:bg-[#0B1120] py-2 md:pt-8 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
          <h2 className="text-blue-600 dark:text-blue-400 font-bold tracking-wide uppercase text-xs md:text-sm mb-3">The Bhasha Ecosystem</h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4 md:mb-6">Everything you need to succeed.</h3>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 px-4 sm:px-0">A unified, enterprise-grade learning environment designed exclusively for Bhasha Academy students and faculty.</p>
        </div>

        {/* The Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
          
          {/* Item 1: Faculty - High Contrast Card */}
          <div className="md:col-span-2 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-white/5 dark:to-white/[0.02] rounded-[2.5rem] p-8 md:p-12 border border-gray-200 dark:border-white/10 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="bg-indigo-100 dark:bg-indigo-500/20 w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl md:text-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform">👩‍🏫</div>
              <h4 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">Expert Faculty Tools</h4>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-md">
                Bhasha Academy instructors can seamlessly upload multimedia modules, distribute study materials, and monitor individual student progress.
              </p>
            </div>
            {/* Subtle Watermark */}
            <div className="absolute right-0 bottom-0 opacity-5 dark:opacity-10 transform translate-x-1/4 translate-y-1/4 text-[8rem] md:text-[12rem] pointer-events-none">📊</div>
          </div>

          {/* Item 2: Feedback - Dark Feature Card */}
          <div className="md:col-span-1 bg-gray-800 dark:bg-slate-800 text-white dark:text-white rounded-[2.5rem] p-8 md:p-12 border border-gray-800 dark:border-white/10 shadow-xl relative overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
            <div className="bg-gray-700 dark:bg-white/10 w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl md:text-3xl mb-6">⚡</div>
            <h4 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Instant Feedback</h4>
            <p className="text-sm md:text-base text-gray-400 dark:text-gray-400">
              Automated grading logic processes grammar and vocabulary assessments the second you hit submit.
            </p>
          </div>

          {/* Item 3: Certification - Clean White/Dark Card */}
          <div className="md:col-span-1 bg-slate-100 dark:bg-gray-800 rounded-[2.5rem] p-8 md:p-12 border border-gray-200 dark:border-white/10 hover:shadow-lg transition-all duration-300">
            <div className="bg-blue-50 dark:bg-blue-500/20 w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl md:text-3xl mb-6 text-blue-600 dark:text-blue-400 font-bold shadow-sm">🏆</div>
            <h4 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">Academy Certification</h4>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              Track your syllabus completion and earn official Bhasha Academy certificates upon mastering a language level.
            </p>
          </div>

          {/* Item 4: Student Dashboard - Gradient Card */}
          <div className="md:col-span-2 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-700 text-white rounded-[2.5rem] p-8 md:p-12 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
            {/* Animated Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="bg-blue-500/30 backdrop-blur-sm w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl md:text-3xl mb-6 border border-white/20">👨‍🎓</div>
              <h4 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Immersive Student Dashboard</h4>
              <p className="text-base md:text-lg text-blue-50 max-w-lg leading-relaxed">
                Your personalized digital classroom. Watch high-definition lectures, practice with interactive quizzes, and master foreign languages on your own schedule.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}