"use client";

export default function InstructorStats({ stats }) {
  // Format the revenue to look like real money (e.g., ₹2,450,000)
  const formattedRevenue = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(stats.totalRevenue);

  const statCards = [
    {
      id: 1,
      name: 'Total Revenue',
      value: formattedRevenue,
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 2,
      name: 'Global Students',
      value: stats.totalStudents.toLocaleString(),
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'from-purple-500 to-indigo-600',
    },
    {
      id: 3,
      name: 'Average Course Rating',
      value: stats.averageRating,
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
      color: 'from-yellow-400 to-orange-500',
    },
    {
      id: 4,
      name: 'Active Courses',
      value: stats.courseCount,
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'from-blue-500 to-cyan-500',
    }
  ];



  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {statCards.map((stat) => (
        <div 
          key={stat.id} 
          className="relative overflow-hidden bg-white dark:bg-[#161a23] rounded-[2.5rem] p-7 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl dark:hover:shadow-black/50 transition-all duration-500 transform hover:-translate-y-1.5 group"
        >
          {/* Expanding Background Hover Effect */}
          <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br ${stat.color} opacity-10 dark:opacity-[0.07] group-hover:scale-[3.5] transition-transform duration-700 ease-out z-0`} />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                {stat.icon}
              </div>
            </div>
            
            <div className="flex flex-col">
              <p className="text-gray-500 dark:text-gray-400 font-bold text-sm tracking-wide mb-1 uppercase">
                {stat.name}
              </p>
              <p className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 dark:group-hover:from-white dark:group-hover:to-gray-300 transition-all duration-300">
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}