export default function CourseSyllabus({ modules = [] }) {
  return (
    <div className="bg-white dark:bg-[#161a23] rounded-[2.5rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
      {modules.map((module, index) => (
        <div 
          key={module.id} 
          className={`flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b last:border-0 border-gray-100 dark:border-white/5`}
        >
          <div className="flex items-center gap-5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-sm">
              {index + 1}
            </div>
            <div>
              <h4 className="text-gray-900 dark:text-white font-bold text-lg leading-tight">
                {module.title}
              </h4>
              <p className="text-gray-400 text-xs font-medium mt-1">Lesson Video • {module.duration || '10:00'}</p>
            </div>
          </div>
          
          <div className="hidden sm:block">
            <svg className="w-6 h-6 text-gray-300 dark:text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}