"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import CourseSidebar from '../../../components/modules/Learning/CourseSidebar';
import VideoContainer from '../../../components/modules/Learning/VideoContainer';

const getUserId = () => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )bhasha_session=([^;]+)'));
  return match ? match[2] : null;
};

export default function LearningEnvironment() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id;

  const [course, setCourse] = useState(null);
  const [activeModule, setActiveModule] = useState(0);
  const [localProgress, setLocalProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const [confirmModal, setConfirmModal] = useState({ isOpen: false, pendingRating: null });

  useEffect(() => {
    document.body.classList.add('hide-nav-footer');

    const fetchCourseAndUser = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';
        const userId = getUserId();

        if (!userId) {
          router.push('/login');
          return;
        }

        const [courseRes, userRes] = await Promise.all([
          axios.get(`${baseUrl}/courses/${courseId}`),
          axios.get(`${baseUrl}/users/${userId}`)
        ]);
        
        const fetchedCourse = courseRes.data;
        const fetchedUser = userRes.data;

        setCourse(fetchedCourse);
        
        const userProgressMap = fetchedUser.courseProgress || {};
        const savedProgress = userProgressMap[courseId] || 0;
        
        const userRatingsMap = fetchedUser.courseRatings || {};
        setUserRating(userRatingsMap[courseId] || 0);

        setLocalProgress(savedProgress);
        
        const totalModules = fetchedCourse.modules?.length || 1;
        setActiveModule(savedProgress >= totalModules ? totalModules - 1 : savedProgress);
      } catch (error) {
        console.error("Failed to load course data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndUser();
    return () => document.body.classList.remove('hide-nav-footer');
  }, [courseId, router]);

  const handleModuleComplete = async () => {
    const totalModules = course.modules?.length || 1;
    let newProgress = localProgress;
    
    if (activeModule === localProgress) {
      newProgress = localProgress + 1;
      setLocalProgress(newProgress);
      
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';
        const userId = getUserId();

        const userRes = await axios.get(`${baseUrl}/users/${userId}`);
        const currentUser = userRes.data;

        const updatedCourseProgress = {
          ...(currentUser.courseProgress || {}),
          [courseId]: newProgress
        };

        await axios.patch(`${baseUrl}/users/${userId}`, { 
          courseProgress: updatedCourseProgress 
        });

      } catch (error) {
        console.error("Failed to save progress to personal database!", error);
      }
    }
    
    if (activeModule < totalModules - 1) {
      setActiveModule(prev => prev + 1);
      
      if (!document.fullscreenElement) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
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
      const userId = getUserId();
      
      const [courseRes, userRes] = await Promise.all([
        axios.get(`${baseUrl}/courses/${courseId}`),
        axios.get(`${baseUrl}/users/${userId}`)
      ]);
      
      const freshCourse = courseRes.data;
      const currentUser = userRes.data;

      const currentRating = freshCourse.rating || 0;
      // SELF HEAL
      const currentReviewCount = currentRating === 0 ? 0 : (freshCourse.reviewCount || 0);

      let newReviewCount = currentReviewCount;
      let newAverageRating = currentRating;

      if (userRating === 0) {
        newReviewCount = currentReviewCount + 1;
        newAverageRating = currentReviewCount === 0 
          ? selectedStars 
          : ((currentRating * currentReviewCount) + selectedStars) / newReviewCount;
      } else {
        if (currentReviewCount <= 1) {
          newAverageRating = selectedStars;
          newReviewCount = 1;
        } else {
          newAverageRating = ((currentRating * currentReviewCount) - userRating + selectedStars) / currentReviewCount;
        }
      }

      await axios.patch(`${baseUrl}/courses/${courseId}`, {
        rating: parseFloat(newAverageRating.toFixed(1)),
        reviewCount: newReviewCount
      });

      const updatedRatings = {
        ...(currentUser.courseRatings || {}),
        [courseId]: selectedStars
      };

      await axios.patch(`${baseUrl}/users/${userId}`, {
        courseRatings: updatedRatings
      });

      setUserRating(selectedStars);
      toast.success(`Review successfully set to ${selectedStars} stars!`, { id: toastId });

    } catch (error) {
      console.error("Rating Error:", error);
      toast.error("Failed to submit review.", { id: toastId });
    } finally {
      setIsSubmittingRating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0f1219] flex flex-col items-center justify-center transition-colors duration-500">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>
        <p className="text-gray-500 dark:text-blue-400 font-bold text-xs uppercase tracking-widest">Preparing Lessons...</p>
      </div>
    );
  }

  if (!course) return <div className="min-h-screen bg-white dark:bg-[#0f1219] text-gray-900 dark:text-white flex justify-center items-center font-bold text-xl">Course not found.</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0f1219] text-gray-900 dark:text-[#f1f1f1] pt-[70px] md:pt-[90px] pb-7 px-4 sm:px-6 lg:px-8 custom-scrollbar transition-colors duration-500 relative">
      
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

      <div className="fixed top-0 left-0 w-full h-[73px] bg-white/70 dark:bg-[#0f1219]/70 backdrop-blur-2xl z-50 flex items-center justify-between px-4 md:px-8 transition-colors duration-500">
        <div className="flex items-center gap-3 md:gap-6">
          <button 
            onClick={() => router.push('/dashboard')} 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/15 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-all duration-300 group shadow-sm"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          <div className="hidden md:block w-px h-6 bg-gray-200 dark:bg-white/10"></div>
          
          <div className="flex items-center gap-4">
            <span className="hidden lg:inline-flex items-center font-black text-lg tracking-tight text-gray-900 dark:text-white">
              Bhasha<span className="text-blue-600 dark:text-blue-500">Sync</span>
            </span>
            <span className="hidden lg:block text-gray-300 dark:text-white/20">•</span>
            
            <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-inner">
               <span className="relative flex h-2.5 w-2.5">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
               </span>
               <h2 className="text-gray-800 dark:text-white/90 font-bold text-sm tracking-wide truncate max-w-[200px] sm:max-w-[300px] xl:max-w-md">
                 {course.title}
               </h2>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:flex items-center gap-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 pl-2 pr-5 py-1.5 rounded-full backdrop-blur-xl shadow-sm">
            <div className="w-8 h-8 rounded-full bg-blue-600/10 dark:bg-gradient-to-br dark:from-blue-500/20 dark:to-indigo-500/20 border border-blue-500/20 flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.66 11.2c-.23-.3-.51-.56-.77-.82-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-.95.23-1.78.75-2.49 1.32-2.59 2.08-3.61 5.75-2.39 8.9.04.1.08.2.08.33 0 .22-.15.42-.35.5-.22.1-.46.04-.64-.12a7.3 7.3 0 0 1-1.38-1.66l-.11-.17c-.12-.21-.3-.33-.51-.33-.25 0-.46.19-.5.44-.06.4-.04.8.04 1.22.42 2.37 1.83 4.41 3.86 5.51C11.5 20.06 13.84 21 16.25 21c4.27 0 7.75-3.48 7.75-7.75 0-2.43-1.12-4.69-2.95-6.14-.3-.24-.62-.47-.95-.69-.26-.17-.55-.12-.76.08-.22.21-.29.54-.15.82.47.97.74 2.05.74 3.18 0 1.93-1.07 3.61-2.65 4.45-.26.14-.58.05-.72-.21-.14-.26-.05-.58.21-.72 1.13-.6 1.86-1.79 1.86-3.1 0-1.48-.94-2.8-2.34-3.35z"/>
              </svg>
            </div>
            <div className="flex flex-col justify-center mt-0.5">
              <div className="flex items-center justify-between w-[110px] mb-1">
                <span className="text-[9px] text-gray-500 dark:text-white/50 font-black uppercase tracking-widest leading-none">Mastery</span>
                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 leading-none">{Math.round((localProgress / (course.modules?.length || 1)) * 100)}%</span>
              </div>
              <div className="w-[110px] h-1.5 bg-gray-200 dark:bg-black/60 rounded-full overflow-hidden shadow-inner border border-gray-300/30 dark:border-white/5 relative">
                <div 
                  className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(59,130,246,0.4)] relative"
                  style={{ width: `${(localProgress / (course.modules?.length || 1)) * 100}%` }}
                >
                  <div className="absolute top-0 left-0 w-full h-[30%] bg-white/30 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative group cursor-pointer ml-2">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-20 dark:opacity-40 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative w-10 h-10 rounded-full bg-white dark:bg-[#0f1219] border border-gray-200 dark:border-white/20 flex items-center justify-center text-gray-900 dark:text-white font-bold text-sm shadow-md overflow-hidden transition-all">
               AH
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8 relative">
        <div className="xl:col-span-3 flex flex-col gap-4">
          
          <VideoContainer 
            course={course} 
            activeModuleIndex={activeModule} 
            localProgress={localProgress}
            onComplete={handleModuleComplete} 
          />

          <div className="mt-2 bg-white dark:bg-[#161a23] rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-white/5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-colors duration-300">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-1">Enjoying the lessons?</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {userRating > 0 ? "You can click the stars to update your feedback!" : "Your rating helps other students discover this course."}
              </p>
            </div>
            
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-black/20 px-6 py-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-inner">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  disabled={isSubmittingRating} 
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => handleStarClick(star)}
                  className={`focus:outline-none transition-transform duration-200 hover:scale-125 hover:-translate-y-1`}
                  title={`Rate ${star} Stars`}
                >
                  <svg
                    className={`w-8 h-8 md:w-10 md:h-10 transition-colors duration-200 ${
                      (hoveredStar || userRating) >= star
                        ? 'text-yellow-400 fill-current drop-shadow-lg'
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

        <div className="xl:col-span-1 relative">
          <CourseSidebar 
            course={course} 
            activeModule={activeModule} 
            setActiveModule={setActiveModule}
            localProgress={localProgress}
          />
        </div>
      </div>
    </div>
  );
}