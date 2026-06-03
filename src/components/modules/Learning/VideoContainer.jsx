import { useRef, useEffect } from 'react';

export default function VideoContainer({ course, activeModuleIndex, localProgress, onComplete }) {
  const videoRef = useRef(null);
  const totalModules = course?.modules?.length || 1;
  const isFullyCompleted = localProgress >= totalModules;
  const isLastModule = activeModuleIndex === totalModules - 1;
  const currentModule = course?.modules?.[activeModuleIndex];

  useEffect(() => {
    if (videoRef.current && currentModule?.videoUrl) {
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => console.log("Auto-play paused by browser.", error));
      }
    }
  }, [activeModuleIndex, currentModule]);

  if (isFullyCompleted && activeModuleIndex === totalModules - 1) {
    return (
      <div className="w-full aspect-video bg-gradient-to-br from-gray-900 to-black dark:from-[#161a23] dark:to-[#0f1219] rounded-2xl flex flex-col items-center justify-center p-6 text-center border border-white/10 shadow-2xl relative overflow-hidden transition-colors duration-500">
        <div className="absolute inset-0 bg-green-500/5 backdrop-blur-3xl pointer-events-none"></div>
        <div className="text-8xl mb-6 animate-bounce">🎉</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">Course Mastered!</h1>
        <p className="text-white/70 text-lg mb-8 max-w-lg relative z-10">You've successfully completed all modules for <span className="font-bold text-white">{course?.title}</span>.</p>
        <button className="bg-green-500 text-black px-8 py-3 rounded-full font-extrabold hover:bg-green-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)] relative z-10">
          Download Official Certificate
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full transition-colors duration-300">
      
      {/* 1. Video Player Section - Always Dark for Cinema Feel */}
      <div className="relative w-full rounded-xl md:rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.3)] dark:shadow-[0_0_40px_rgba(0,0,0,0.8)]">
        <div className="absolute -inset-1 bg-gradient-to-b from-blue-500/20 to-purple-600/10 rounded-2xl blur-lg pointer-events-none"></div>
        
        <div className="w-full aspect-video bg-black rounded-xl md:rounded-2xl overflow-hidden relative group border border-gray-200 dark:border-white/10 z-10">
          {currentModule?.videoUrl ? (
            <video 
              ref={videoRef} 
              className="w-full h-full object-contain"
              controls
              autoPlay
              controlsList="nodownload"
              onEnded={onComplete}
            >
              <source src={currentModule.videoUrl} type="video/mp4" />
            </video>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/30 bg-[#0f1219]">
              <svg className="w-12 h-12 mb-2 opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" /></svg>
              Video Feed Unavailable
            </div>
          )}
        </div>
      </div>

      {/* 2. Title & Action Row - System Responsive */}
      <div className="mt-6 px-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight transition-colors">
          {currentModule?.title || "Loading..."}
        </h1>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-gray-200 dark:border-white/10 pb-6 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg border-2 border-white/10">
              BA
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-gray-900 dark:text-white font-bold text-base md:text-lg leading-none transition-colors">Bhasha Academy</h3>
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.4-1.4 3.6 3.6 7.6-7.6L19 8l-9 9z" /></svg>
              </div>
              <p className="text-gray-500 dark:text-white/50 text-xs mt-1.5 font-semibold tracking-wide uppercase">Official Instructor</p>
            </div>
            {/* <button className="ml-4 bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-2 rounded-full text-sm font-bold hover:scale-105 transition-all">
              Subscribe
            </button> */}
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {/* <button className="flex shrink-0 items-center gap-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/15 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Resources
            </button> */}
            <button 
              onClick={onComplete}
              disabled={activeModuleIndex < localProgress && !isLastModule}
              className={`flex shrink-0 items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeModuleIndex < localProgress && !isLastModule
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/30 cursor-default'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:-translate-y-0.5'
              }`}
            >
              {activeModuleIndex < localProgress && !isLastModule ? '✓ Completed' : isLastModule ? 'Finish Course 🏆' : 'Next Module →'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Description Box - System Responsive Glassmorphism */}
      <div className="mt-6 mx-1 bg-gray-100 dark:bg-white/5 backdrop-blur-md hover:bg-gray-200 dark:hover:bg-white/10 transition-colors rounded-2xl p-5 cursor-pointer border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-lg">
        <p className="text-gray-900 dark:text-white font-bold text-sm mb-2 flex items-center gap-2 transition-colors">
          <span className="text-blue-600 dark:text-blue-400">{course?.language} Course</span>
          <span className="text-gray-300 dark:text-white/30">•</span>
          <span>Module {activeModuleIndex + 1} of {totalModules}</span>
        </p>
        <p className="text-gray-600 dark:text-white/80 text-sm md:text-base leading-relaxed font-medium transition-colors">
          {currentModule?.description || "No description provided for this lesson."}
        </p>
      </div>

    </div>
  );
}