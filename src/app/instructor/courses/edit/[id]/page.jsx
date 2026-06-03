import axios from 'axios';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import CourseBuilder from '../../../../../components/modules/Instructor/CourseBuilder';

export const dynamic = 'force-dynamic';

export default async function EditCoursePage({ params }) {
  const resolvedParams = await params;
  const courseId = resolvedParams.id;
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';
  const cookieStore = await cookies();
  const userId = cookieStore.get('bhasha_session')?.value;

  if (!userId) redirect('/login');

  try {
    // Fetch both the user and the course to verify ownership
    const [userRes, courseRes] = await Promise.all([
      axios.get(`${baseUrl}/users/${userId}`),
      axios.get(`${baseUrl}/courses/${courseId}`)
    ]);

    const user = userRes.data;
    const course = courseRes.data;

    // 🔒 SECURITY BARRICADE: If this teacher doesn't own this course, kick them out!
    const ownsCourse = (user.ownedCourses || []).map(String).includes(String(courseId));
    if (!ownsCourse) {
      redirect('/instructor/courses');
    }

    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] pt-28 pb-24 md:pb-12 px-6 md:px-12 xl:px-16 transition-colors duration-500">
        <div className="max-w-[1200px] mx-auto">
          
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Edit Course: {course.title}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
              Update your curriculum, modify pricing, or add new lessons.
            </p>
          </div>

          {/* Pass the course data directly into our Universal Engine */}
          <CourseBuilder initialData={course} />

        </div>
      </div>
    );
  } catch (error) {
    console.error("Edit Course Error:", error.message);
    redirect('/instructor/courses');
  }
}