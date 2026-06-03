import axios from 'axios';
import { cookies } from 'next/headers';
import CourseHero from '../../../components/modules/Courses/CourseHero';
import CourseSyllabus from '../../../components/modules/Courses/CourseSyllabus';
import EnrollmentCard from '../../../components/modules/Courses/EnrollmentCard';

export const dynamic = 'force-dynamic';

async function fetchCourseDetails(id) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';
    const res = await axios.get(`${baseUrl}/courses/${id}`);
    return res.data;
  } catch (error) {
    console.error("Fetch Error:", error.message);
    return null;
  }
}

// Function to check if the logged-in user owns this course
async function fetchUserContext(courseId) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('bhasha_session')?.value;

    if (!userId) return { isEnrolled: false, userId: null, initialUserRating: 0 };

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';
    const userRes = await axios.get(`${baseUrl}/users/${userId}`);
    const user = userRes.data;

    const isEnrolled = (user.enrolledCourses || []).map(id => String(id)).includes(String(courseId));
    const initialUserRating = user.courseRatings?.[courseId] || 0;

    return { isEnrolled, userId, initialUserRating };
  } catch (error) {
    return { isEnrolled: false, userId: null, initialUserRating: 0 }; 
  }
}

export default async function CourseDetailPage({ params }) {
  const resolvedParams = await params; 
  const id = resolvedParams.id;

  const [course, userContext] = await Promise.all([
    fetchCourseDetails(id),
    fetchUserContext(id)
  ]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0B1120] text-gray-900 dark:text-white transition-colors duration-500">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold">Course not found.</h2>
          <p className="text-gray-500 mt-2">The course you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] pt-20 pb-20 transition-colors duration-500">
      
      <CourseHero course={course} />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Course Syllabus</h2>
              <CourseSyllabus modules={course.modules} />
            </div>
            
            <div className="bg-white dark:bg-[#161a23] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">About this course</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg font-medium">
                {/* DYNAMIC: Now it only shows the real description from db.json */}
                {course.description || "No description available for this course."}
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <EnrollmentCard 
              course={course} 
              isEnrolled={userContext.isEnrolled} 
              userId={userContext.userId} 
              initialUserRating={userContext.initialUserRating} 
            />
          </div>

        </div>
      </div>
    </div>
  );
}