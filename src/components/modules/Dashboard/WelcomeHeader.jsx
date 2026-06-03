import Link from 'next/link';

export default function WelcomeHeader({ user }) {
  // Extract just the first name for a friendly greeting
  const firstName = user?.name ? user.name.split(' ')[0] : 'Student';

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-4 transition-colors duration-300">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">{firstName}</span> 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium text-sm md:text-base">
          Logged in as 
          <span className="px-2 py-1 bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-gray-300 rounded-md text-[10px] font-black uppercase ml-2 border border-transparent dark:border-white/5 tracking-wider">
            {user?.role || 'User'}
          </span>
        </p>
      </div>
      
      <Link 
        href="/courses" 
        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl text-white dark:text-gray-900 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-100 hover:from-black dark:hover:from-blue-400 dark:hover:to-blue-500 dark:hover:text-white shadow-lg transition-all hover:-translate-y-0.5"
      >
        Browse New Courses
      </Link>
    </div>
  );
}