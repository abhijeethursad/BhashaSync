"use client";

import { useState, useEffect } from 'react';

export default function RecentActivity({ courses = [] }) {
  // To be ultra-safe with Next.js hydration, we wait until the component mounts
  // to render dynamic data that might differ between server and client.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const generateActivities = () => {
    let events = [];
    let eventId = 1;

    courses.forEach(course => {
      if (course.students >= 1000) {
        events.push({
          id: eventId++,
          type: 'milestone',
          title: 'Massive Milestone Reached!',
          desc: `"${course.title}" surpassed ${course.students.toLocaleString()} enrolled students!`,
          time: 'Recently',
          icon: '🚀',
          color: 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400'
        });
      }

      if (course.reviewCount > 0) {
        events.push({
          id: eventId++,
          type: 'review',
          title: 'New Student Rating',
          desc: `"${course.title}" is maintaining a strong ${course.rating} star average.`,
          time: 'Active',
          icon: '⭐',
          color: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
        });
      }

      if (course.students > 0 && course.price > 0) {
        events.push({
          id: eventId++,
          type: 'sale',
          title: 'Consistent Sales',
          desc: `"${course.title}" continues to generate revenue.`,
          time: 'Ongoing',
          icon: '💸',
          color: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
        });
      }
    });

    // FIX: Predictable sorting. We reverse the array so newest is top, no Math.random()!
    return events.reverse().slice(0, 5);
  };

  const activities = generateActivities();

  // Show a blank/loading state until the client has hydrated to prevent DOM mismatches
  if (!mounted) {
    return (
      <div className="bg-white dark:bg-[#161a23] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-sm h-full min-h-[300px]">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="space-y-4 mt-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full shrink-0"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#161a23] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-gray-900 dark:text-white">Live Activity Feed</h3>
        <span className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
            Live Updates
        </span>
      </div>
      
      {activities.length > 0 ? (
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 dark:hover:bg-white/[0.02] rounded-2xl transition-colors">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 ${activity.color} shadow-sm border border-current opacity-80`}>
                {activity.icon}
              </div>
              <div className="flex-grow pt-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">{activity.title}</h4>
                  <span className="text-[10px] uppercase font-bold text-gray-400 whitespace-nowrap ml-4 tracking-wider">{activity.time}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{activity.desc}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
          <p className="text-gray-500 dark:text-gray-400 font-medium">No activity yet. Share your course to generate stats!</p>
        </div>
      )}
    </div>
  );
}