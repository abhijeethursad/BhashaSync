import axios from 'axios';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import InstructorStats from '../../../components/modules/Instructor/InstructorStats';
import TopPerformer from '../../../components/modules/Instructor/TopPerformer';
import RecentActivity from '../../../components/modules/Instructor/RecentActivity';

export const dynamic = 'force-dynamic';

async function fetchInstructorData() {
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
    
    if (user.role !== 'teacher') {
      return { redirect: '/dashboard' };
    }

    const allCourses = coursesRes.data;

    // Filter to teacher's courses
    const myCourses = allCourses.filter(course => 
      (user.ownedCourses || []).map(String).includes(String(course.id))
    );

    let totalRevenue = 0;
    let totalStudents = 0;
    let totalRatingSum = 0;

    myCourses.forEach(course => {
      totalStudents += (course.students || 0);
      totalRevenue += ((course.students || 0) * (course.price || 0));
      totalRatingSum += (course.rating || 0);
    });

    const averageRating = myCourses.length > 0 ? (totalRatingSum / myCourses.length).toFixed(1) : 0;

    return { 
      user, 
      myCourses, 
      stats: { totalRevenue, totalStudents, averageRating, courseCount: myCourses.length } 
    };

  } catch (error) {
    console.error("Instructor Fetch Error:", error.message);
    return null;
  }
}

export default async function InstructorDashboard() {
  const data = await fetchInstructorData();

  if (!data) return redirect('/login');
  if (data.redirect) return redirect(data.redirect);

  const { user, stats, myCourses } = data;

  const topCourse = myCourses.length > 0 
    ? [...myCourses].sort((a, b) => ((b.price || 0) * (b.students || 0)) - ((a.price || 0) * (a.students || 0)))[0]
    : null;

  const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] pt-28 pb-24 md:pb-12 px-6 md:px-12 xl:px-16 transition-colors duration-500">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Instructor Overview
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
              Welcome back, {user.name}. Here is your business summary for <span className="font-bold text-gray-700 dark:text-gray-300">{currentDate}</span>.
            </p>
          </div>
        </div>

        {/* Modular Stat Cards */}
        <InstructorStats stats={stats} />

        {/* Lower Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-4">
          
          <div className="lg:col-span-2">
            {/* Modular Activity Feed dynamically powered by DB courses */}
            <RecentActivity courses={myCourses} />
          </div>

          <div className="lg:col-span-1">
            {/* Modular Top Performer Widget */}
            <TopPerformer topCourse={topCourse} />
          </div>

        </div>

      </div>
    </div>
  );
}