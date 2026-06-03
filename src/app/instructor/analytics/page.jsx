import axios from 'axios';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AnalyticsDashboard from '../../../components/modules/Instructor/AnalyticsDashboard';

export const dynamic = 'force-dynamic';

async function fetchAnalyticsData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';
    const cookieStore = await cookies(); 
    const userId = cookieStore.get('bhasha_session')?.value;

    if (!userId) return null;

    const [userRes, coursesRes] = await Promise.all([
      axios.get(`${baseUrl}/users/${userId}`),
      axios.get(`${baseUrl}/courses`)
    ]);

    const user = userRes.data;
    const allCourses = coursesRes.data;

    // Filter to ONLY courses this specific teacher owns
    const myCourses = allCourses.filter(course => 
      (user.ownedCourses || []).map(String).includes(String(course.id))
    );

    return { user, myCourses };
  } catch (error) {
    console.error("Analytics Fetch Error:", error.message);
    return null;
  }
}

export default async function InstructorAnalyticsPage() {
  const data = await fetchAnalyticsData();

  if (!data) return redirect('/login');

  const { myCourses } = data;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] pt-28 pb-24 md:pb-12 px-6 md:px-12 xl:px-16 transition-colors duration-500">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Revenue Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            Track your financial performance, student growth, and best-selling curriculum.
          </p>
        </div>

        {/* The Analytics UI */}
        <AnalyticsDashboard courses={myCourses} />

      </div>
    </div>
  );
}