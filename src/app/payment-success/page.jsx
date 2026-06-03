"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function PaymentSuccess() {
  const [status, setStatus] = useState("verifying");
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Use a ref to ensure the API call only runs once in React Strict Mode
  const hasUpdated = useRef(false);

  useEffect(() => {
    const userId = searchParams.get("userId");
    const courseId = searchParams.get("courseId");

    const assignCourse = async () => {
      if (!userId || !courseId || hasUpdated.current) return;
      hasUpdated.current = true;

      try {
        const mockServerUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';

        // 1. Update Personal User Profile
        const userRes = await axios.get(`${mockServerUrl}/users/${userId}`);
        const currentUser = userRes.data;
        
        // Ensure we don't add duplicates
        const currentCourses = currentUser.enrolledCourses || [];
        if (!currentCourses.includes(Number(courseId))) {
            const updatedCourses = [...currentCourses, Number(courseId)];
            await axios.patch(`${mockServerUrl}/users/${userId}`, {
                enrolledCourses: updatedCourses
            });

            // 2. Increment the Course Student Count
            const freshCourseRes = await axios.get(`${mockServerUrl}/courses/${courseId}`);
            const currentStudents = freshCourseRes.data.students || 0;
            
            await axios.patch(`${mockServerUrl}/courses/${courseId}`, {
                students: currentStudents + 1
            });
        }

        setStatus("success");
        
      } catch (error) {
        console.error("Failed to assign course to user:", error);
        setStatus("error");
      }
    };

    assignCourse();

  }, [searchParams]);

  if (status === "verifying") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] flex items-center justify-center">
        <p className="text-gray-500 animate-pulse font-bold text-lg">Finalizing your enrollment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1e293b] p-8 md:p-12 rounded-[2.5rem] shadow-2xl max-w-lg w-full text-center border border-gray-100 dark:border-white/5 animate-fade-in">
        
        <div className="w-24 h-24 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-12 h-12 text-green-500 animate-[bounce_1s_ease-in-out]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 font-medium mb-8">
          Your transaction was secured by the Aegis Engine. The course has been added to your dashboard.
        </p>

        <div className="space-y-4">
          <Link href="/dashboard" className="block w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-1 active:scale-95">
            Go to My Courses
          </Link>
          <Link href="/courses" className="block w-full py-4 px-6 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white rounded-2xl font-bold transition-colors">
            Browse More Courses
          </Link>
        </div>
        
      </div>
    </div>
  );
}