import axios from 'axios';
import { cookies } from 'next/headers';
import WelcomeHeader from '../../components/modules/Dashboard/WelcomeHeader';
import StatsGrid from '../../components/modules/Dashboard/StatsGrid';
import ActiveCourses from '../../components/modules/Dashboard/ActiveCourses';

export const dynamic = 'force-dynamic';

async function fetchDashboardData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';
    
    const cookieStore = await cookies(); 
    const userId = cookieStore.get('bhasha_session')?.value;

    if (!userId) throw new Error("No active session cookie found.");

    const [userResponse, coursesResponse] = await Promise.all([
      axios.get(`${baseUrl}/users/${userId}`),
      axios.get(`${baseUrl}/courses`)
    ]);

    const user = userResponse.data;
    const allCourses = coursesResponse.data;

    // Grab the user's personal progress map
    const courseProgressMap = user.courseProgress || {};

    // Map personal progress into the enrolled courses
    const enrolledCourses = allCourses
      .filter(course => (user.enrolledCourses || []).map(id => String(id)).includes(String(course.id)))
      .map(course => {
        return {
          ...course,
          // Inject personal progress! Defaults to 0 if they haven't started.
          userProgress: courseProgressMap[course.id] || 0 
        };
      });

    // Calculate total completed modules from personal progress
    const realModulesCompleted = Object.values(courseProgressMap).reduce((total, progress) => {
      return total + (typeof progress === 'number' ? progress : 0);
    }, 0);

    const liveUser = {
      ...user,
      stats: { ...user.stats, modulesCompleted: realModulesCompleted }
    };

    return { user: liveUser, enrolledCourses };
  } catch (error) {
    console.error("Dashboard Fetch Error:", error.message);
    return { user: null, enrolledCourses: [] };
  }
}

export default async function DashboardPage() {
  const { user, enrolledCourses } = await fetchDashboardData();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0B1120] transition-colors duration-500">
        <div className="text-center p-10 bg-white dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] shadow-xl dark:shadow-red-900/10 max-w-md border border-gray-100 dark:border-white/10 mx-4">
          <div className="text-red-500 text-6xl mb-6 animate-pulse">⚠️</div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">Connection Error</h2>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
            Ensure your json-server is running on port 4000.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] pt-28 pb-24 md:pb-12 px-6 md:px-12 xl:px-16 transition-colors duration-500">
      <div className="max-w-[1600px] mx-auto">
        <WelcomeHeader user={user} />
        <StatsGrid user={user} />
        <ActiveCourses courses={enrolledCourses} />
      </div>
    </div>
  );
}