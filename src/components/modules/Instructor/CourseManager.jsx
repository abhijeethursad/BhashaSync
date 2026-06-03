"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Helper to grab the logged-in user's ID
const getUserId = () => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )bhasha_session=([^;]+)'));
  return match ? match[2] : null;
};

export default function CourseManager({ courses = [] }) {
  const router = useRouter();
  
  // --- DELETE MODAL STATE ---
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, courseId: null, courseTitle: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  // --- THE DESTRUCTIVE ACTION ENGINE ---
  const executeDelete = async () => {
    setIsDeleting(true);
    const toastId = toast.loading("Deleting course and all modules...");

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';
      const userId = getUserId();

      // 1. Delete the course entirely from the Global Courses database
      await axios.delete(`${baseUrl}/courses/${deleteModal.courseId}`);

      // 2. Remove the course ID from the Teacher's ownedCourses array
      if (userId) {
        const userRes = await axios.get(`${baseUrl}/users/${userId}`);
        const currentOwned = userRes.data.ownedCourses || [];
        
        const updatedOwned = currentOwned.filter(id => String(id) !== String(deleteModal.courseId));
        
        await axios.patch(`${baseUrl}/users/${userId}`, {
          ownedCourses: updatedOwned
        });
      }

      toast.success(`"${deleteModal.courseTitle}" has been deleted.`, { id: toastId });
      
      // Close modal and refresh the Server Component to update the UI instantly
      setDeleteModal({ isOpen: false, courseId: null, courseTitle: '' });
      router.refresh();

    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete the course.", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  if (courses.length === 0) {
    return (
      <div className="bg-white dark:bg-[#161a23] rounded-[2.5rem] p-16 text-center border border-gray-100 dark:border-white/5 shadow-sm">
        <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🚀</span>
        </div>
        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">No courses published yet</h3>
        <p className="text-gray-500 dark:text-gray-400 font-medium max-w-md mx-auto">
          You haven't created any courses. Click the "Create New Course" button above to share your knowledge with the world!
        </p>
      </div>
    );
  }

  return (
    <>
      {/* --- PREMIUM DANGER ZONE MODAL --- */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => !isDeleting && setDeleteModal({ isOpen: false, courseId: null, courseTitle: '' })}
          ></div>
          
          <div className="relative bg-white dark:bg-[#161a23] w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl dark:shadow-red-900/20 transform transition-all border border-gray-100 dark:border-white/10 animate-fade-in">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-black text-center text-gray-900 dark:text-white mb-2">Delete Course?</h3>
            <p className="text-center text-gray-500 dark:text-gray-400 font-medium mb-8 leading-relaxed">
              Are you sure you want to permanently delete <span className="font-bold text-gray-900 dark:text-white">"{deleteModal.courseTitle}"</span>? This action cannot be undone and all student progress will be lost.
            </p>
            
            <div className="flex gap-4">
              <button 
                disabled={isDeleting}
                onClick={() => setDeleteModal({ isOpen: false, courseId: null, courseTitle: '' })}
                className="flex-1 py-3.5 px-4 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white rounded-2xl font-bold transition-colors duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                disabled={isDeleting}
                onClick={executeDelete}
                className="flex-1 py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black shadow-lg shadow-red-600/30 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Deleting...
                  </>
                ) : (
                  'Yes, Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DASH CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {courses.map((course) => {
          const rating = course.rating || 0;
          const students = course.students || 0;
          const revenue = (course.price || 0) * students;
          
          const formattedRevenue = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
          }).format(revenue);

          return (
            <div 
              key={course.id} 
              className="bg-white dark:bg-[#161a23] rounded-[2.5rem] p-6 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl dark:hover:shadow-blue-900/10 transition-all duration-500 flex flex-col group relative overflow-hidden"
            >
              <div className="absolute -inset-24 bg-gradient-to-br from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 dark:group-hover:from-blue-500/10 dark:group-hover:to-indigo-500/10 rounded-full blur-3xl transition-all duration-700 pointer-events-none" />

              {/* Cinematic Thumbnail */}
              <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-6 z-10">
                <img 
                  src={course.thumbnail||'https://images.pexels.com/photos/14814047/pexels-photo-14814047.jpeg?auto=compress&cs=tinysrgb&w=400&lazy=load'}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt={course.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                
                <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white shadow-sm">
                  {course.language}
                </div>
                <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-xl text-xs font-black shadow-lg backdrop-blur-md ${course.price > 0 ? 'bg-blue-600/90 text-white' : 'bg-emerald-500/90 text-white'}`}>
                  {course.price > 0 ? `₹${course.price}` : 'FREE'}
                </div>
              </div>

              {/* Course Meta */}
              <div className="flex justify-between items-start gap-4 mb-2 z-10">
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white leading-tight line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {course.title}
                </h3>
              </div>
              
              <div className="flex items-center justify-between mb-6 z-10">
                <span className="text-sm text-gray-500 dark:text-gray-400 font-bold">
                  {course.modules?.length || 0} Lessons Published
                </span>
                <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-500/10 px-2.5 py-1 rounded-lg border border-yellow-100 dark:border-yellow-500/20">
                  <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  <span className="font-black text-yellow-600 dark:text-yellow-500 text-sm">
                    {rating > 0 ? rating.toFixed(1) : '0.0'}
                  </span>
                </div>
              </div>

              {/* Analytics Block */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/5 mb-6 mt-auto z-10">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-1">Active Students</p>
                  <p className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    {students.toLocaleString()}
                    {students > 0 && <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                  </p>
                </div>
                <div className="pl-3 border-l border-gray-200 dark:border-white/10">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-1">Total Revenue</p>
                  <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    {formattedRevenue}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 z-10">
                <Link 
                  href={`/instructor/courses/edit/${course.id}`}
                  className="flex-1 flex justify-center items-center gap-2 py-3 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-bold text-sm shadow-md transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  Edit
                </Link>
                <button 
                  onClick={() => setDeleteModal({ isOpen: true, courseId: course.id, courseTitle: course.title })}
                  className="flex items-center justify-center p-3 bg-gray-100 hover:bg-red-50 dark:bg-white/5 dark:hover:bg-red-500/10 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-xl font-bold transition-all hover:-translate-y-0.5 active:scale-95 group/del"
                  title="Delete Course"
                >
                  <svg className="w-5 h-5 group-hover/del:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </>
  );
}