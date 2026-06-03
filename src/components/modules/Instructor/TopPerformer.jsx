"use client";

export default function TopPerformer({ topCourse }) {
  if (!topCourse) {
    return (
      <div className="bg-white dark:bg-[#161a23] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-sm">
        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">👑 Crown Jewel</h3>
        <p className="text-gray-500 text-sm font-medium">Publish your first course to see your top performer here.</p>
      </div>
    );
  }

  const revenue = (topCourse.price || 0) * (topCourse.students || 0);

  return (
    <div className="bg-white dark:bg-[#161a23] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
      
      <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <span className="text-2xl">👑</span> Crown Jewel
      </h3>

      <div className="relative z-10">
        <div className="w-full h-40 rounded-2xl overflow-hidden mb-6 relative">
          <img 
            src={topCourse.thumbnail||'https://images.pexels.com/photos/14814047/pexels-photo-14814047.jpeg?auto=compress&cs=tinysrgb&w=400&lazy=load'}
            alt="Top Course" 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white right-4">
            <span className="text-xs font-black uppercase tracking-widest text-blue-400 mb-1 block">
              {topCourse.language}
            </span>
            <p className="font-bold text-lg leading-tight line-clamp-2">{topCourse.title}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center bg-gray-50 dark:bg-black/20 p-4 rounded-xl border border-gray-100 dark:border-white/5">
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Top Revenue</p>
              <p className="font-black text-emerald-600 dark:text-emerald-400 text-lg">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(revenue)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Students</p>
              <p className="font-black text-gray-900 dark:text-white text-lg">
                {topCourse.students?.toLocaleString() || 0}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Course Rating</span>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              <span className="font-black text-gray-900 dark:text-white text-sm">
                {(topCourse.rating || 0).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}