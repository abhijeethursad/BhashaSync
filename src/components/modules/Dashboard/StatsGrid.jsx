export default function StatsGrid({ user }) {
  // 1. DYNAMIC DATA: Automatically pulls from your new db.json!
  const enrolledCount = user?.enrolledCourses?.length || 0;
  const modulesCompleted = user?.stats?.modulesCompleted || 0;
  const averageScore = user?.stats?.averageScore || 0;
  const hoursSpent = user?.stats?.hoursSpent || 0;

  const stats = [
    {
      id: 1,
      name: 'Active Courses',
      value: enrolledCount, // Will show 2 based on your JSON
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'from-blue-500 to-indigo-600',
      shadow: 'shadow-blue-500/30'
    },
    {
      id: 2,
      name: 'Lessons Completed',
      value: modulesCompleted, // Will show 14
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-green-500 to-emerald-600',
      shadow: 'shadow-green-500/30'
    },
    {
      id: 3,
      name: 'Average Score',
      value: `${averageScore}%`, // Will show 94%
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'from-yellow-400 to-orange-500',
      shadow: 'shadow-orange-500/30'
    },
    {
      id: 4,
      name: 'Hours Learning',
      value: `${hoursSpent}h`, // Will show 22.5h
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-600',
      shadow: 'shadow-purple-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat) => (
        <div 
          key={stat.id} 
          className="relative overflow-hidden bg-white dark:bg-[#161a23] rounded-[2.5rem] p-7 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl dark:hover:shadow-black/50 transition-all duration-500 transform hover:-translate-y-1.5 group"
        >
          {/* THE MAGIC BALL: Expanding Background Hover Effect */}
          <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br ${stat.color} opacity-10 dark:opacity-[0.07] group-hover:scale-[3.5] transition-transform duration-700 ease-out z-0`} />

          {/* Card Content (Must have relative z-10 so the ball stays behind the text) */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg ${stat.shadow} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                {stat.icon}
              </div>
            </div>
            
            <div className="flex flex-col">
              <p className="text-gray-500 dark:text-gray-400 font-bold text-sm tracking-wide mb-1 uppercase">
                {stat.name}
              </p>
              <p className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 dark:group-hover:from-white dark:group-hover:to-gray-300 transition-all duration-300">
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}