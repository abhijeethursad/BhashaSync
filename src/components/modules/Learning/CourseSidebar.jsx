export default function CourseSidebar({ course, activeModule, setActiveModule, localProgress }) {
  const totalModules = course?.modules?.length || 1;

  const moduleDetails = course?.modules?.map((mod, index) => ({
    id: mod.id || index,
    title: mod.title || `Module ${index + 1}`,
    duration: mod.duration || "--:--",
    isCompleted: index < localProgress,
    isLocked: index > localProgress,
  })) || [];

  return (
    <div className="bg-white dark:bg-[#161a23] rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col h-[500px] xl:sticky xl:top-[90px] xl:h-[calc(100vh-120px)] shadow-xl dark:shadow-2xl overflow-hidden transition-colors duration-300">
      
      {/* Playlist Header */}
      <div className="p-5 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-[#1a1f2b] shrink-0">
        <h2 className="text-lg font-extrabold text-gray-900 dark:text-white mb-1.5 leading-tight">{course?.title || "Course Playlist"}</h2>
        <p className="text-gray-500 dark:text-white/50 text-xs font-medium tracking-wide mb-4">
          Bhasha Academy • {localProgress}/{totalModules} Completed
        </p>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(59,130,246,0.5)] dark:shadow-[0_0_8px_rgba(59,130,246,0.8)]" 
            style={{ width: `${(localProgress / totalModules) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Playlist Videos Queue */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1.5 bg-white dark:bg-[#0f1219]/30">
        {moduleDetails.map((mod, index) => {
          const isActive = activeModule === index;

          return (
            <button
              key={mod.id}
              onClick={() => !mod.isLocked && setActiveModule(index)}
              disabled={mod.isLocked}
              className={`w-full text-left p-2.5 rounded-xl flex gap-3.5 transition-all duration-300 group ${
                isActive 
                  ? 'bg-blue-50 dark:bg-white/10 shadow-sm dark:shadow-lg' 
                  : mod.isLocked 
                    ? 'opacity-40 cursor-not-allowed' 
                    : 'hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer'
              }`}
            >
              {/* Thumbnail Section */}
              <div className="shrink-0 w-[120px] h-[68px] bg-gray-200 dark:bg-black rounded-lg overflow-hidden relative flex items-center justify-center border border-gray-100 dark:border-white/5 group-hover:border-blue-300 dark:group-hover:border-white/20 transition-colors shadow-sm">
                
                <img 
                  src={`https://picsum.photos/seed/${course?.id}-${mod.id}/160/90`} 
                  alt={mod.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                    isActive ? 'opacity-30 scale-110' : 'opacity-80 dark:opacity-70 group-hover:opacity-100 group-hover:scale-105'
                  }`}
                />

                {/* Status Overlays */}
                {mod.isCompleted && !isActive ? (
                  <div className="absolute bottom-1 right-1 bg-green-600/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
                    DONE
                  </div>
                ) : mod.isLocked ? (
                  <div className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                    <svg className="w-6 h-6 text-white/60 dark:text-white/40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                ) : isActive ? (
                  <div className="absolute inset-0 bg-blue-600/30 dark:bg-blue-900/50 flex items-center justify-center backdrop-blur-[1px]">
                    <div className="flex gap-1 items-end h-4">
                      <div className="w-1 bg-blue-600 dark:bg-white h-full animate-pulse"></div>
                      <div className="w-1 bg-blue-600 dark:bg-white h-2/3 animate-pulse delay-75"></div>
                      <div className="w-1 bg-blue-600 dark:bg-white h-full animate-pulse delay-150"></div>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 dark:bg-black/30 backdrop-blur-[1px]">
                    <svg className="w-8 h-8 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                )}
                
                {!isActive && !mod.isCompleted && !mod.isLocked && (
                  <div className="absolute bottom-1 right-1 bg-black/70 dark:bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
                    {mod.duration}
                  </div>
                )}
              </div>

              {/* Text Information */}
              <div className="flex-1 py-0.5 flex flex-col justify-start">
                <h4 className={`text-sm font-semibold leading-snug line-clamp-2 pr-2 transition-colors ${
                  isActive 
                    ? 'text-blue-700 dark:text-white' 
                    : 'text-gray-700 dark:text-white/80 group-hover:text-gray-900 dark:group-hover:text-white'
                }`}>
                  {mod.title}
                </h4>
                <p className="text-[11px] text-gray-400 dark:text-white/40 mt-1 font-medium tracking-wide transition-colors">
                  Bhasha Academy
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}