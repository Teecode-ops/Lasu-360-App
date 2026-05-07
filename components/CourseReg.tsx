import React, { useState, useMemo } from 'react';
import { Course } from '../types';
import { Check, CheckCircle2, AlertCircle, Search, Filter, BookOpen, Music, Users, GraduationCap, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CourseRegProps {
  courses?: Course[];
  isLoading: boolean;
  studentDepartment?: string;
  onSubmit: (courses: string[], totalUnits: number) => void;
}

const MOCK_COURSES: Course[] = [
  // Computer Science (Standard)
  { id: '1', code: 'CSC 401', title: 'Artificial Intelligence', units: 3, type: 'Core', department: 'Computer Science' },
  { id: '2', code: 'CSC 403', title: 'Software Engineering II', units: 3, type: 'Core', department: 'Computer Science' },
  { id: '3', code: 'CSC 405', title: 'Computer Graphics', units: 2, type: 'Elective', department: 'Computer Science' },
  { id: '4', code: 'CSC 407', title: 'Cyber Security', units: 3, type: 'Elective', department: 'Computer Science' },
  
  // Borrowable Electives
  { id: 'mus1', code: 'MUS 401', title: 'Music Composition & Theory', units: 2, type: 'Elective', department: 'Music' },
  { id: 'mus2', code: 'MUS 312', title: 'African Traditional Music', units: 2, type: 'Elective', department: 'Music' },
  { id: 'th1', code: 'THA 205', title: 'Introduction to Acting', units: 2, type: 'Elective', department: 'Theatre Arts' },
  { id: 'ent1', code: 'ENT 301', title: 'Entrepreneurship Studies', units: 2, type: 'Elective', department: 'Entrepreneurship' },
  { id: 'mkt1', code: 'MKT 201', title: 'Principles of Marketing', units: 3, type: 'Elective', department: 'Business Admin' },
];

export const CourseReg: React.FC<CourseRegProps> = ({ courses: initialCourses = [], isLoading, studentDepartment = 'Computer Science', onSubmit }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'Mine' | 'All' | 'Music' | 'Arts' | 'Business'>('Mine');

  const allCourses = useMemo(() => {
    return initialCourses.length > 0 ? initialCourses : MOCK_COURSES;
  }, [initialCourses]);

  const filteredCourses = useMemo(() => {
    return allCourses.filter(course => {
      const matchesSearch = 
        course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      const isMine = course.department === studentDepartment;
      
      if (activeFilter === 'Mine') return matchesSearch && isMine;
      if (activeFilter === 'Music') return matchesSearch && course.department === 'Music';
      if (activeFilter === 'Arts') return matchesSearch && course.department === 'Theatre Arts';
      if (activeFilter === 'Business') return matchesSearch && (course.department === 'Business Admin' || course.department === 'Entrepreneurship');
      
      return matchesSearch;
    });
  }, [allCourses, searchQuery, activeFilter, studentDepartment]);

  const selectedCourses = allCourses.filter(c => selectedIds.has(c.id));
  const totalUnits = selectedCourses.reduce((acc, curr) => acc + curr.units, 0);

  const toggleCourse = (id: string) => {
    if (submitted) return;
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleSubmit = async () => {
    if (selectedIds.size === 0 || totalUnits > 24) return;
    setIsSubmitting(true);
    try {
      const courseCodes = selectedCourses.map(c => c.code);
      await onSubmit(courseCodes, totalUnits);
      setSubmitted(true);
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-10 bg-gray-200 rounded-xl w-1/2 mb-8"></div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-24 bg-gray-200 rounded-3xl"></div>
        ))}
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-500 rounded-[2.5rem] flex items-center justify-center text-white mb-8 shadow-2xl shadow-green-200">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Registration Filed!</h2>
        <p className="text-gray-400 font-bold text-sm mb-10 max-w-[250px] uppercase">Your {selectedIds.size} courses totaling {totalUnits} units have been submitted for HOD approval.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="bg-neutral-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
        >
          Modify Registration
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-neutral-50">
      {/* Header Info */}
      <div className="px-6 py-6 space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Course Registration</h2>
            <div className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                Semester 1
            </div>
        </div>

        <div className="bg-white border border-gray-100 p-5 rounded-[2.5rem] shadow-xl shadow-neutral-100 flex gap-4 items-center">
            <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                <GraduationCap size={20} />
            </div>
            <div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-0.5">Credit Capacity</p>
                <div className="flex items-end gap-2">
                    <span className={`text-2xl font-black leading-none ${totalUnits > 24 ? 'text-red-600' : 'text-gray-900'}`}>
                        {totalUnits}
                    </span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-0.5">/ 24 Units</span>
                </div>
            </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="px-6 pb-4 space-y-4">
        <div className="bg-white rounded-2xl flex items-center px-4 py-1 border border-gray-100 shadow-sm">
            <Search className="text-gray-400" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search course code or name..." 
              className="w-full bg-transparent border-none text-[12px] font-bold py-3 focus:ring-0 placeholder:text-gray-400 pl-3"
            />
            {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-gray-300">
                    <X size={16} />
                </button>
            )}
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {(['Mine', 'All', 'Music', 'Arts', 'Business'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                activeFilter === cat ? 'bg-neutral-900 text-white shadow-lg' : 'bg-white text-gray-400 border border-transparent'
              }`}
            >
              {cat === 'Mine' ? 'My Dept' : cat === 'All' ? 'All Courses' : `Borrow: ${cat}`}
            </button>
          ))}
        </div>
      </div>

      {/* Course List */}
      <div className="flex-1 overflow-y-auto px-6 pb-40 space-y-4 no-scrollbar">
        {filteredCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Search size={40} className="mb-4 opacity-20" />
                <p className="text-[10px] font-black uppercase tracking-widest">No courses found matching "{searchQuery}"</p>
            </div>
        ) : (
            filteredCourses.map(course => {
                const isSelected = selectedIds.has(course.id);
                return (
                    <motion.div
                        key={course.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => toggleCourse(course.id)}
                        className={`p-5 rounded-[2.5rem] border transition-all cursor-pointer flex justify-between items-center group relative overflow-hidden
                            ${isSelected
                                ? 'bg-blue-600 border-transparent shadow-2xl shadow-blue-200'
                                : 'bg-white border-gray-50 shadow-xl shadow-neutral-100 hover:border-blue-200'
                            }`}
                    >
                        {/* Background subtle indicator for department */}
                        <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-[0.03] flex items-center justify-center ${isSelected ? 'text-white' : 'text-blue-900'}`}>
                            {course.department === 'Music' ? <Music size={60} /> : <BookOpen size={60} />}
                        </div>

                        <div className="flex-1 pr-4 relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`font-black text-sm tracking-tight ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                                    {course.code}
                                </span>
                                <div className={`px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-widest ${
                                    isSelected 
                                        ? 'bg-white/20 text-white' 
                                        : course.type === 'Core' ? 'bg-red-50 text-red-600' : 'bg-neutral-100 text-gray-400'
                                }`}>
                                    {course.type}
                                </div>
                                {course.department !== studentDepartment && (
                                    <div className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-widest flex items-center gap-1">
                                        <Users size={8} /> Borrowed
                                    </div>
                                )}
                            </div>
                            <h4 className={`text-[13px] font-bold leading-tight mb-2 ${isSelected ? 'text-blue-50' : 'text-gray-600'}`}>
                                {course.title}
                            </h4>
                            <div className="flex items-center gap-3">
                                <span className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? 'text-blue-200' : 'text-gray-400'}`}>
                                    {course.units} Units
                                </span>
                                <span className={`text-[9px] font-black uppercase tracking-widest opacity-60 ${isSelected ? 'text-blue-200' : 'text-gray-300'}`}>
                                    • {course.department}
                                </span>
                            </div>
                        </div>

                        <div className={`shrink-0 w-12 h-12 rounded-[1.25rem] flex items-center justify-center transition-all relative z-10
                            ${isSelected ? 'bg-white text-blue-600' : 'bg-neutral-50 text-gray-300 group-hover:text-blue-400'}`}>
                            <AnimatePresence mode="wait">
                                {isSelected ? (
                                    <motion.div key="check" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                                        <Check size={24} strokeWidth={4} />
                                    </motion.div>
                                ) : (
                                    <motion.div key="add" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                                        <ChevronRight size={18} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                );
            })
        )}
      </div>

      {/* Footer Summary Container */}
      <div className="fixed bottom-16 inset-x-0 p-6 z-40 max-w-md mx-auto pointer-events-none">
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 p-6 rounded-[3rem] shadow-2xl flex flex-col gap-4 pointer-events-auto">
            <div className="flex justify-between items-center px-2">
                <div className="flex flex-col">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Selected Courses</span>
                    <span className="text-sm font-black text-gray-900">{selectedIds.size} Selected</span>
                </div>
                <div className="text-right">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Total Load</span>
                    <p className={`text-sm font-black ${totalUnits > 24 ? 'text-red-500' : 'text-blue-600'}`}>
                        {totalUnits} / 24 Units
                    </p>
                </div>
            </div>
            
            <button
                onClick={handleSubmit}
                disabled={totalUnits === 0 || totalUnits > 24 || isSubmitting}
                className={`w-full py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl
                    ${totalUnits === 0 || totalUnits > 24 || isSubmitting
                        ? 'bg-neutral-100 text-gray-400 shadow-none' 
                        : 'bg-blue-600 text-white shadow-blue-200 active:scale-95'}`}
            >
                {isSubmitting ? 'Processing...' : totalUnits > 24 ? 'Credit Overload' : totalUnits === 0 ? 'Select Courses' : 'Confirm Registration'}
            </button>
        </div>
      </div>
    </div>
  );
};
