"use client";

import { useState } from 'react';
import CourseCard from './CourseCard';

export default function CourseCatalog({ initialCourses }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Derive unique levels from the data for our filter buttons
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Advanced Filtering Logic
  const filteredCourses = initialCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.language.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || course.level?.toLowerCase() === activeFilter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full">
      {/* Search & Filter Header */}
      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 md:p-8 mb-10 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
          
          {/* Search Bar */}
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search languages or courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all sm:text-sm font-medium placeholder-gray-400"
            />
          </div>

          {/* Level Filters */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {levels.map(level => (
              <button
                key={level}
                onClick={() => setActiveFilter(level)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeFilter === level
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Results */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-300 dark:border-white/10">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No courses found</h3>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}