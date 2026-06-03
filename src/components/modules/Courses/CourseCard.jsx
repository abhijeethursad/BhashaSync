import Link from 'next/link';

export default function CourseCard({ course }) {
  // Premium Badge Styling Logic
  const getLevelColor = (level) => {
    switch(level?.toLowerCase()) {
      case 'beginner': return 'bg-green-500/90 text-white shadow-green-500/30';
      case 'intermediate': return 'bg-yellow-500/90 text-white shadow-yellow-500/30';
      case 'advanced': return 'bg-red-500/90 text-white shadow-red-500/30';
      default: return 'bg-blue-600/90 text-white shadow-blue-500/30';
    }
  };

  // --- BILLION-DOLLAR DYNAMIC DATA ---
  const rating = course.rating || 0;
  const reviewCount = course.reviewCount || 0;
  const totalModules = course.modules?.length || 0;

  return (
    <Link href={`/courses/${course.id}`} className="group block h-full outline-none">
      <div className="bg-white dark:bg-[#161a23] rounded-[2rem] border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-2xl dark:hover:shadow-blue-900/20 transition-all duration-500 flex flex-col h-full relative overflow-hidden transform group-hover:-translate-y-1.5 group-focus-visible:ring-4 ring-blue-500">
        
        {/* 1. Cinematic Thumbnail Section */}
        <div className="relative h-52 w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
          <img 
            src={course.thumbnail||'https://images.pexels.com/photos/14814047/pexels-photo-14814047.jpeg?auto=compress&cs=tinysrgb&w=400&lazy=load'}
            alt={course.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>

          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-xl text-xs font-black uppercase tracking-widest border border-white/30 shadow-lg">
              {course.language}
            </span>
            <span className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg backdrop-blur-sm ${getLevelColor(course.level)}`}>
              {course.level || 'All Levels'}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
              <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </div>
            {/* DYNAMIC LESSON COUNT */}
            <span className="text-white font-bold text-sm drop-shadow-md">
              {totalModules} Lessons
            </span>
          </div>
        </div>
        
        {/* 2. Content Details Section */}
        <div className="p-6 flex flex-col flex-grow relative">
          
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

          <div className="flex justify-between items-start gap-4 mb-3">
            <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
              {course.title}
            </h3>
          </div>
          
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed flex-grow line-clamp-2">
            {course.description}
          </p>

          {/* 3. Footer Stats & Action */}
          <div className="pt-5 border-t border-gray-100 dark:border-white/10 flex items-center justify-between mt-auto">
            
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 mb-1">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                {/* DYNAMIC RATING NUMBERS */}
                <span className="font-bold text-gray-900 dark:text-white text-sm">
                  {rating > 0 ? rating.toFixed(1) : '0.0'}
                </span>
                <span className="text-gray-400 text-xs">({reviewCount.toLocaleString()})</span>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bhasha Academy</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                Explore
              </span>
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-900 dark:text-white group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Link>
  );
}