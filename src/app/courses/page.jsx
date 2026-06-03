import axios from 'axios';
import CourseCatalog from '../../components/modules/Courses/CourseCatalog';

// Ensures fresh data
export const dynamic = 'force-dynamic';

async function fetchAllCourses() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';
    const response = await axios.get(`${baseUrl}/courses`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch courses:", error.message);
    return []; // Return empty array on failure so page doesn't crash
  }
}

export default async function CoursesPage() {
  const courses = await fetchAllCourses();

  return (
    // UPGRADED TO WIDESCREEN PADDING
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] pt-28 pb-24 md:pb-12 px-6 md:px-12 xl:px-16 transition-colors duration-500">
      {/* UPGRADED TO 1600px WIDTH */}
      <div className="max-w-[1600px] mx-auto">
        
        {/* Page Header */}
        <div className="mb-10 md:mb-16 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">Global Languages</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
            Discover our expertly crafted curriculum. From beginner basics to advanced fluency, find the perfect path for your linguistic journey.
          </p>
        </div>

        {/* The Interactive Catalog Component */}
        <CourseCatalog initialCourses={courses} />
        
      </div>
    </div>
  );
}