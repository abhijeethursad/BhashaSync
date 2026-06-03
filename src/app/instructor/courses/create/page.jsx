import CourseBuilder from '../../../../components/modules/Instructor/CourseBuilder';

export const dynamic = 'force-dynamic';

export default function CreateCoursePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] pt-28 pb-24 md:pb-12 px-6 md:px-12 xl:px-16 transition-colors duration-500">
      <div className="max-w-[1200px] mx-auto">
        
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Create a New Course
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            Upload your curriculum, set your pricing, and share your knowledge with the world.
          </p>
        </div>

        {/* The massive interactive builder component */}
        <CourseBuilder />

      </div>
    </div>
  );
}