import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Check, Loader2, AlertCircle, Trash2, Send } from 'lucide-react';
import { MOCK_COURSES } from '../constants';
import { Course } from '../types';

interface CourseRegProps {
  isLoading: boolean;
  studentDepartment?: string;
  onSubmit: (courses: string[], totalUnits: number) => Promise<void>;
}

export const CourseReg: React.FC<CourseRegProps> = ({ isLoading, studentDepartment, onSubmit }) => {
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // For demo, we show all courses but highlight those in student's department if available
    setAvailableCourses(MOCK_COURSES);
  }, []);

  const toggleCourse = (course: Course) => {
    if (selectedCourses.some(c => c.id === course.id)) {
      setSelectedCourses(selectedCourses.filter(c => c.id !== course.id));
    } else {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  const totalUnits = selectedCourses.reduce((acc, curr) => acc + curr.units, 0);

  const handleSubmit = async () => {
    if (selectedCourses.length === 0) return;
    setSubmitting(true);
    try {
      await onSubmit(selectedCourses.map(c => c.code), totalUnits);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase">Interactive Form</span>
        <h2 className="text-3xl font-black text-gray-900 tracking-tighter leading-tight mt-1">Course Registration</h2>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">2023/2024 Session • Rain Semester</p>
      </header>

      {success && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-green-500 text-white rounded-2xl flex items-center gap-3 shadow-xl shadow-green-500/20"
        >
          <Check size={20} />
          <div>
            <p className="font-black text-sm uppercase tracking-tight">Registration Submitted</p>
            <p className="text-[10px] opacity-90 font-medium">Waiting for HOD Approval.</p>
          </div>
        </motion.div>
      )}

      {/* Course List */}
      <section className="space-y-3">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Available Courses</h3>
        <div className="flex flex-col gap-3">
          {availableCourses.map((course) => {
            const isSelected = selectedCourses.some(c => c.id === course.id);
            return (
              <motion.div
                key={course.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleCourse(course)}
                className={`p-5 rounded-[2rem] border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected 
                    ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-600 ring-offset-0' 
                    : 'bg-white border-gray-100 hover:border-blue-100'
                }`}
              >
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${
                        course.type === 'Core' ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {course.type}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">{course.units} Units</span>
                    </div>
                    <h4 className="text-base font-black text-gray-900 tracking-tight">{course.code}</h4>
                    <p className="text-xs text-gray-500 font-medium">{course.title}</p>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                    isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 border-gray-100 text-gray-300'
                  }`}>
                    {isSelected ? <Check size={16} /> : <BookOpen size={16} />}
                  </div>
                </div>
                {isSelected && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full blur-2xl -mr-12 -mt-12 opacity-30"></div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Stats Summary */}
      <section className="bg-gray-900 p-6 rounded-[2.5rem] text-white shadow-xl shadow-gray-900/10">
          <div className="flex justify-between items-center mb-6">
            <div>
               <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Courses</h4>
               <span className="text-2xl font-black tracking-tighter">{selectedCourses.length}</span>
            </div>
            <div className="text-right">
               <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Units</h4>
               <span className={`text-2xl font-black tracking-tighter ${totalUnits > 4 ? 'text-blue-400' : 'text-white'}`}>
                 {totalUnits} <span className="text-[10px] text-gray-500 tracking-normal ml-0.5">/ 24</span>
               </span>
            </div>
          </div>
          
          <button 
            onClick={handleSubmit}
            disabled={submitting || selectedCourses.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-600 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-600/20"
          >
            {submitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                SUBMIT FOR APPROVAL
              </>
            )}
          </button>
      </section>

      {/* Important Info */}
      <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex gap-3 text-orange-800">
        <AlertCircle size={20} className="shrink-0" />
        <p className="text-[10px] font-bold leading-relaxed uppercase tracking-tight">
          Double check your course selection. Once submitted, you cannot edit without HOD clearance. Ensure you meet the prerequisite for CSC 405.
        </p>
      </div>
    </div>
  );
};
