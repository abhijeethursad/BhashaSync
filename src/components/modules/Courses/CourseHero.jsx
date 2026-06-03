export default function CourseHero({ course }) {
  // --- BILLION-DOLLAR DYNAMIC DATA ---
  const rating = course.rating || 0;
  const reviewCount = course.reviewCount || 0;

  return (
    <div className="relative w-full bg-gray-900 dark:bg-[#0f172a] py-16 md:py-24 overflow-hidden">
      {/* Ambient background image */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src={`https://picsum.photos/seed/${course.id}/1200/400`} 
          className="w-full h-full object-cover blur-sm scale-110" 
          alt="background"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
            <span>Courses</span>
            <span>/</span>
            <span>{course.language}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            {course.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-white/80">
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {/* DYNAMIC STARS: Lights up based on the real mathematical rating */}
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg 
                    key={star} 
                    className={`w-5 h-5 ${star <= Math.round(rating) ? 'fill-current' : 'text-gray-600 fill-current'}`} 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              {/* DYNAMIC RATING NUMBERS */}
              <span className="font-bold text-white">{rating > 0 ? rating.toFixed(1) : '0.0'}</span>
              <span className="text-sm text-gray-300">({reviewCount.toLocaleString()} ratings)</span>
            </div>
            
            <div className="h-4 w-px bg-white/20"></div>
            
            <div className="text-sm font-medium">
              Created by <span className="text-blue-400 font-bold underline">Bhasha Academy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}