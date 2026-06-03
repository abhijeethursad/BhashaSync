"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const getUserId = () => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )bhasha_session=([^;]+)'));
  return match ? match[2] : null;
};

// 1. ADD `initialData` PROP
export default function CourseBuilder({ initialData = null }) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);

  // 2. PRE-FILL STATE IF EDITING
  const [courseData, setCourseData] = useState({
    title: initialData?.title || '',
    language: initialData?.language || 'English',
    level: initialData?.level || 'Beginner',
    price: initialData?.price || 0,
    description: initialData?.description || '',
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(initialData?.thumbnail || null);

  const [modules, setModules] = useState(
    initialData?.modules?.length > 0 
      ? initialData.modules 
      : [{ id: Date.now(), title: '', duration: '', file: null, fileName: '', videoUrl: '' }]
  );

  const isEditing = !!initialData; // Are we updating or creating?

  const uploadToCloudinary = async (file, resourceType = 'image') => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      await new Promise(r => setTimeout(r, 1500)); 
      return resourceType === 'image' 
        ? `https://picsum.photos/seed/${Math.random()}/800/600` 
        : `https://www.w3schools.com/html/mov_bbb.mp4`;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, formData);
      return res.data.secure_url;
    } catch (error) {
      console.error("Cloudinary Error:", error);
      throw new Error("Failed to upload media to Cloudinary.");
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleAddModule = () => {
    setModules([...modules, { id: Date.now(), title: '', duration: '', file: null, fileName: '', videoUrl: '' }]);
  };

  const handleRemoveModule = (idToRemove) => {
    setModules(modules.filter(m => m.id !== idToRemove));
  };

  const handleModuleChange = (id, field, value) => {
    setModules(modules.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleVideoChange = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      setModules(modules.map(m => m.id === id ? { ...m, file: file, fileName: file.name } : m));
    }
  };

  // --- THE UNIVERSAL SAVE ENGINE ---
  const handlePublish = async () => {
    if (!courseData.title || !courseData.description) {
      return toast.error("Please fill in the basic course details.");
    }

    setIsPublishing(true);
    const toastId = toast.loading("Saving course data...");

    try {
      const userId = getUserId();
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';

      // Only upload new thumbnail if they actually selected a new one
      let finalThumbnailUrl = initialData?.thumbnail || `https://picsum.photos/seed/${Math.random()}/800/600`;
      if (thumbnailFile) {
        toast.loading("Uploading new thumbnail...", { id: toastId });
        finalThumbnailUrl = await uploadToCloudinary(thumbnailFile, 'image');
      }

      toast.loading("Processing videos...", { id: toastId });

      const finalModules = await Promise.all(modules.map(async (mod, index) => {
        // If it's a new file, upload it. If it's an existing module, keep the old URL!
        let finalVideoUrl = mod.videoUrl || `https://www.w3schools.com/html/mov_bbb.mp4`;
        if (mod.file) {
          finalVideoUrl = await uploadToCloudinary(mod.file, 'video');
        }
        
        return {
          id: mod.id, 
          title: mod.title || `Lesson ${index + 1}`,
          duration: mod.duration || "10:00",
          videoUrl: finalVideoUrl
        };
      }));

      // Construct Course Object
      const updatedCourse = {
        title: courseData.title,
        language: courseData.language,
        level: courseData.level,
        price: Number(courseData.price),
        description: courseData.description,
        thumbnail: finalThumbnailUrl,
        modules: finalModules
      };

      if (isEditing) {
        // 🛠 EDIT MODE: PATCH request
        await axios.patch(`${baseUrl}/courses/${initialData.id}`, updatedCourse);
        toast.success("Course Updated Successfully! ✏️", { id: toastId });
      } else {
        // 🚀 CREATE MODE: POST request
        const newCourse = {
          ...updatedCourse,
          id: String(Date.now()),
          rating: 0,
          students: 0,
          reviewCount: 0,
        };
        await axios.post(`${baseUrl}/courses`, newCourse);

        // Link new course to Teacher Profile
        const userRes = await axios.get(`${baseUrl}/users/${userId}`);
        const updatedOwnedCourses = [...(userRes.data.ownedCourses || []), newCourse.id];
        await axios.patch(`${baseUrl}/users/${userId}`, { ownedCourses: updatedOwnedCourses });
        
        toast.success("Course Published Successfully! 🎉", { id: toastId });
      }

      router.push('/instructor/courses');
      router.refresh();

    } catch (error) {
      console.error("Save Error:", error);
      toast.error(error.message || "Failed to save course.", { id: toastId });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      
      <div className="bg-white dark:bg-[#161a23] rounded-[2.5rem] p-8 md:p-10 border border-gray-100 dark:border-white/5 shadow-sm">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm">1</span>
          Course Basics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Course Title</label>
              <input 
                type="text" 
                value={courseData.title}
                onChange={(e) => setCourseData({...courseData, title: e.target.value})}
                placeholder="e.g. Master Conversational French"
                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Language</label>
                <select 
                  value={courseData.language}
                  onChange={(e) => setCourseData({...courseData, language: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none font-medium"
                >
                  <option>English</option><option>French</option><option>Spanish</option>
                  <option>German</option><option>Japanese</option><option>Italian</option>
                  <option>Mandarin</option><option>Russian</option><option>Arabic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Difficulty</label>
                <select 
                  value={courseData.level}
                  onChange={(e) => setCourseData({...courseData, level: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none font-medium"
                >
                  <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Price (INR)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                <input 
                  type="number" 
                  value={courseData.price}
                  onChange={(e) => setCourseData({...courseData, price: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl pl-8 pr-4 py-3.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Course Description</label>
              <textarea 
                rows="5"
                value={courseData.description}
                onChange={(e) => setCourseData({...courseData, description: e.target.value})}
                placeholder="What will students learn in this course?"
                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Course Thumbnail</label>
              <div className="relative w-full h-32 rounded-xl border-2 border-dashed border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex flex-col items-center justify-center overflow-hidden cursor-pointer">
                {thumbnailPreview ? (
                  <img src={thumbnailPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className="text-sm font-bold text-gray-500">Click to upload image</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleThumbnailChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#161a23] rounded-[2.5rem] p-8 md:p-10 border border-gray-100 dark:border-white/5 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm">2</span>
            Curriculum Builder
          </h2>
          <button onClick={handleAddModule} className="px-4 py-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white rounded-xl font-bold text-sm transition-colors">
            + Add Lesson
          </button>
        </div>

        <div className="space-y-4">
          {modules.map((module, index) => (
            <div key={module.id} className="p-6 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/5 rounded-2xl flex flex-col md:flex-row gap-4 items-start md:items-center">
              
              <div className="w-10 h-10 rounded-full bg-white dark:bg-[#161a23] shadow-sm flex items-center justify-center font-black text-gray-500 shrink-0">
                {index + 1}
              </div>

              <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-4 w-full">
                <div className="md:col-span-5">
                  <input type="text" placeholder="Lesson Title" value={module.title} onChange={(e) => handleModuleChange(module.id, 'title', e.target.value)} className="w-full bg-white dark:bg-[#161a23] border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white outline-none" />
                </div>
                <div className="md:col-span-3">
                  <input type="text" placeholder="Duration (e.g. 12:30)" value={module.duration} onChange={(e) => handleModuleChange(module.id, 'duration', e.target.value)} className="w-full bg-white dark:bg-[#161a23] border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white outline-none" />
                </div>
                <div className="md:col-span-4 relative">
                  <div className="w-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg px-4 py-2.5 text-sm font-bold text-blue-700 dark:text-blue-400 flex items-center justify-between cursor-pointer hover:bg-blue-100 transition-colors truncate">
                    <span className="truncate">{module.fileName ? module.fileName : module.videoUrl ? "Video Selected" : "Upload Video"}</span>
                    <svg className="w-4 h-4 shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  </div>
                  <input type="file" accept="video/*" onChange={(e) => handleVideoChange(module.id, e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
              </div>

              {modules.length > 1 && (
                <button onClick={() => handleRemoveModule(module.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handlePublish}
          disabled={isPublishing}
          className={`px-8 py-4 rounded-2xl font-black text-lg shadow-lg flex items-center gap-3 transition-all ${
            isPublishing ? 'bg-blue-400 text-white cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30 hover:-translate-y-1 active:scale-95'
          }`}
        >
          {isPublishing ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {isEditing ? 'Updating...' : 'Publishing...'}
            </>
          ) : (
            <>
              {isEditing ? 'Save Changes 💾' : 'Publish Course 🚀'}
            </>
          )}
        </button>
      </div>

    </div>
  );
}