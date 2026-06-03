"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function EnrollmentCard({ course, isEnrolled, userId, initialUserRating }) {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [userRating, setUserRating] = useState(initialUserRating || 0); 

  const [confirmModal, setConfirmModal] = useState({ isOpen: false, pendingRating: null });
  
  const router = useRouter();

  // --- BILLION-DOLLAR ENROLLMENT LOGIC (STUDENTS + 1) ---
  const handleEnroll = async () => {
    if (!userId) {
      toast.error("Please log in to purchase or enroll in courses.");
      router.push('/login');
      return;
    }

    setIsProcessing(true);
    const isPaid = course.price && course.price > 0;
    const toastId = toast.loading(
      isPaid ? "Initializing secure payment gateway..." : "Processing your free enrollment..."
    );

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';

      if (isPaid) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        toast.success("Payment successful! Mock receipt generated.", { id: toastId });
      }

      // 1. Update Personal User Profile
      const userRes = await axios.get(`${baseUrl}/users/${userId}`);
      const currentUser = userRes.data;
      const updatedCourses = [...(currentUser.enrolledCourses || []), Number(course.id)];

      await axios.patch(`${baseUrl}/users/${userId}`, {
        enrolledCourses: updatedCourses
      });

      // 2. GLOBAL UPDATE: Increment the Student Count!
      // Fetch fresh course data to avoid race conditions
      const freshCourseRes = await axios.get(`${baseUrl}/courses/${course.id}`);
      const currentStudents = freshCourseRes.data.students || 0;
      
      await axios.patch(`${baseUrl}/courses/${course.id}`, {
        students: currentStudents + 1
      });

      if (!isPaid) {
        toast.success("Successfully enrolled! Welcome to the course.", { id: toastId });
      }
      
      router.refresh(); 

    } catch (error) {
      console.error("Enrollment Error:", error);
      toast.error("Failed to process request. Please try again.", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStarClick = (selectedStars) => {
    if (userRating === selectedStars) return; 

    if (userRating > 0) {
      setConfirmModal({ isOpen: true, pendingRating: selectedStars });
    } else {
      executeRating(selectedStars);
    }
  };

  // --- SELF-HEALING RATING MATH ---
  const executeRating = async (selectedStars) => {
    setConfirmModal({ isOpen: false, pendingRating: null });
    setIsSubmittingRating(true);
    const toastId = toast.loading(userRating > 0 ? "Updating your review..." : "Submitting your review...");

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';
      
      const [courseRes, userRes] = await Promise.all([
        axios.get(`${baseUrl}/courses/${course.id}`),
        axios.get(`${baseUrl}/users/${userId}`)
      ]);
      const freshCourse = courseRes.data;
      const freshUser = userRes.data;

      const currentRating = freshCourse.rating || 0;
      // SELF HEAL: If rating is 0, we must mathematically assume 0 reviews, even if mock data says 1240.
      const currentReviewCount = currentRating === 0 ? 0 : (freshCourse.reviewCount || 0);
      
      let newReviewCount = currentReviewCount;
      let newAverageRating = currentRating;

      if (userRating === 0) {
        // Brand new rating
        newReviewCount = currentReviewCount + 1;
        newAverageRating = currentReviewCount === 0 
          ? selectedStars 
          : ((currentRating * currentReviewCount) + selectedStars) / newReviewCount;
      } else {
        // Re-editing a rating (Subtract old, Add new)
        if (currentReviewCount <= 1) {
          // If they were the ONLY reviewer, the new average is just their new rating
          newAverageRating = selectedStars;
          newReviewCount = 1; 
        } else {
          newAverageRating = ((currentRating * currentReviewCount) - userRating + selectedStars) / currentReviewCount;
        }
      }

      // 1. Update Global Course
      await axios.patch(`${baseUrl}/courses/${course.id}`, {
        rating: parseFloat(newAverageRating.toFixed(1)),
        reviewCount: newReviewCount
      });

      // 2. Update Personal User Profile
      const updatedRatings = {
        ...(freshUser.courseRatings || {}),
        [course.id]: selectedStars
      };
      
      await axios.patch(`${baseUrl}/users/${userId}`, {
        courseRatings: updatedRatings
      });

      setUserRating(selectedStars);
      toast.success(`Review successfully set to ${selectedStars} stars!`, { id: toastId });
      
      router.refresh();

    } catch (error) {
      console.error("Rating Error:", error);
      toast.error("Failed to submit review.", { id: toastId });
    } finally {
      setIsSubmittingRating(false);
    }
  };

  return (
    <>
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setConfirmModal({ isOpen: false, pendingRating: null })}
          ></div>
          
          <div className="relative bg-white dark:bg-[#161a23] w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl dark:shadow-blue-900/20 transform transition-all border border-gray-100 dark:border-white/10 animate-fade-in">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-black text-center text-gray-900 dark:text-white mb-2">Update Review?</h3>
            <p className="text-center text-gray-500 dark:text-gray-400 font-medium mb-8">
              You previously rated this course <span className="font-bold text-gray-900 dark:text-white">{userRating} stars</span>. 
              Are you sure you want to change it to <span className="font-bold text-yellow-500">{confirmModal.pendingRating} stars</span>?
            </p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setConfirmModal({ isOpen: false, pendingRating: null })}
                className="flex-1 py-3.5 px-4 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white rounded-2xl font-bold transition-colors duration-200"
              >
                Cancel
              </button>
              <button 
                onClick={() => executeRating(confirmModal.pendingRating)}
                className="flex-1 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5 active:scale-95"
              >
                Update Rating
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="lg:sticky lg:top-28 bg-white dark:bg-[#161a23] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/10 shadow-2xl dark:shadow-blue-900/10 overflow-hidden relative transition-colors duration-300">
        
        <div className="w-full aspect-video rounded-2xl overflow-hidden mb-6 border border-gray-100 dark:border-white/5 relative group">
          <img src={`https://picsum.photos/seed/${course.id}x/600/400`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Preview" />
          {isEnrolled && (
            <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1.5 shadow-lg backdrop-blur-md">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {isEnrolled ? (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-black text-green-600 dark:text-green-400 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  Course Owned
                </span>
              </div>
              
              <Link href={`/learning/${course.id}`} className="flex justify-center items-center gap-2 w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black text-lg shadow-lg shadow-green-600/30 transition-all hover:-translate-y-1 active:scale-95">
                Start Learning Now
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>

              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/10">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 text-center mb-4 uppercase tracking-widest">
                  {userRating > 0 ? "Edit your review" : "Rate this course"}
                </p>
                
                <div className="flex justify-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      disabled={isSubmittingRating}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => handleStarClick(star)}
                      className="focus:outline-none transition-transform duration-200 hover:scale-125"
                    >
                      <svg
                        className={`w-8 h-8 transition-colors duration-200 ${
                          (hoveredStar || userRating) >= star
                            ? 'text-yellow-400 fill-current drop-shadow-md'
                            : 'text-gray-200 dark:text-gray-700 fill-current'
                        }`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-black text-gray-900 dark:text-white">
                  {course.price && course.price > 0 ? `₹${course.price}` : 'FREE'}
                </span>
                {(!course.price || course.price === 0) && <span className="text-gray-400 line-through text-lg font-medium">₹1,999</span>}
              </div>

              <button onClick={handleEnroll} disabled={isProcessing} className={`w-full py-4 rounded-2xl font-black text-lg shadow-lg transition-all flex justify-center items-center gap-2 ${isProcessing ? 'bg-blue-400 cursor-not-allowed text-white shadow-none' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30 hover:-translate-y-1 active:scale-95'}`}>
                {isProcessing ? "Processing..." : course.price && course.price > 0 ? `Buy Now for ₹${course.price}` : 'Enroll for Free'}
              </button>
            </div>
          )}

          <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest mt-6">7-Day Money Back Guarantee</p>
          <div className="pt-6 border-t border-gray-100 dark:border-white/10 space-y-4">
            <p className="text-gray-900 dark:text-white font-bold text-sm">This course includes:</p>
            <ul className="space-y-3">
               {[
                 { icon: '🎥', text: `${course.modules?.length || 0} High-quality videos` },
                 { icon: '📱', text: 'Access on mobile and TV' },
                 { icon: '🏆', text: 'Certificate of completion' },
                 { icon: '♾️', text: 'Full lifetime access' }
               ].map((item, i) => (
                 <li key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 font-medium">
                   <span>{item.icon}</span>{item.text}
                 </li>
               ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}