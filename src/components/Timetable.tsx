import React from 'react';
import { motion } from 'motion/react';
import { Clock, MapPin, Calendar, FileText, ChevronRight } from 'lucide-react';
import { TimetableEntry, User } from '../types';

interface TimetableProps {
  timetable: TimetableEntry[];
  user: User;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const Timetable: React.FC<TimetableProps> = ({ timetable, user }) => {
  const [selectedDay, setSelectedDay] = React.useState('Monday');

  const dailySchedule = timetable.filter(entry => entry.day === selectedDay);

  return (
    <div className="p-6 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase">Class Schedule</span>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter leading-tight mt-1">Timetable</h2>
          </div>
          <div className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-center min-w-[70px]">
             <p className="text-[8px] font-bold text-gray-400 uppercase">Week 8</p>
             <p className="text-xl font-black text-blue-900 tracking-tighter leading-none mt-1">R-SEM</p>
          </div>
        </div>
      </header>

      {/* Day Selector */}
      <section className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              selectedDay === day 
                ? 'bg-blue-900 text-white shadow-xl shadow-blue-900/20 scale-105' 
                : 'bg-white text-gray-400 border border-gray-100 hover:border-blue-200'
            }`}
          >
            {day}
          </button>
        ))}
      </section>

      {/* Schedule List */}
      <section className="space-y-4">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Classes for {selectedDay}</h3>
        <div className="flex flex-col gap-4">
          {dailySchedule.length > 0 ? (
            dailySchedule.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group p-5 bg-white rounded-[2rem] border border-gray-100 shadow-sm flex gap-5 relative overflow-hidden active:scale-[0.98] transition-transform"
              >
                {/* Time Indicator */}
                <div className="flex flex-col items-center justify-center w-16 shrink-0 border-r border-gray-50 pr-4">
                   <span className="text-[10px] font-black text-blue-900 tracking-tight leading-none uppercase">
                     {item.time.split(' - ')[0].replace(':00', '')}
                   </span>
                   <div className={`w-0.5 h-6 my-1 ${item.color.replace('bg-', 'bg-').split(' ')[0]}`} />
                   <span className="text-[10px] font-bold text-gray-300 tracking-tight">
                     {item.time.split(' - ')[1].replace(':00', '')}
                   </span>
                </div>

                {/* Info */}
                <div className="flex-1 relative z-10">
                   <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${item.color} ${item.color.replace('bg-', 'text-').replace('-100', '-700')}`}>
                         Live Session
                      </span>
                   </div>
                   <h4 className="text-lg font-black text-gray-900 tracking-tighter leading-none">{item.courseCode}</h4>
                   <div className="mt-3 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                       <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase">
                         <MapPin size={10} className="text-blue-500" /> {item.venue}
                       </div>
                     </div>
                     <ChevronRight size={16} className="text-gray-200 group-hover:text-blue-600 transition-colors" />
                   </div>
                </div>

                {/* Decorative Pattern */}
                <div className={`absolute top-0 right-0 w-24 h-24 ${item.color} rounded-full blur-3xl -mr-12 -mt-12 opacity-30`} />
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
               <div className="p-6 bg-gray-50 rounded-full text-gray-200">
                  <Calendar size={48} />
               </div>
               <div>
                 <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Free Day!</p>
                 <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">No scheduled classes for this student.</p>
               </div>
            </div>
          )}
        </div>
      </section>

      {/* Quick Access Grid */}
      <section className="bg-blue-50/50 p-4 rounded-[2rem] grid grid-cols-2 gap-3 mt-4">
          <button className="flex flex-col gap-1 p-4 bg-white rounded-2xl border border-blue-100/50 text-left">
            <FileText size={18} className="text-blue-600" />
            <span className="text-[10px] font-black text-blue-900 uppercase mt-1 tracking-tighter">Attendance</span>
            <p className="text-[8px] text-gray-400 font-bold uppercase">85% Present</p>
          </button>
          <button className="flex flex-col gap-1 p-4 bg-white rounded-2xl border border-blue-100/50 text-left">
            <Clock size={18} className="text-blue-600" />
            <span className="text-[10px] font-black text-blue-900 uppercase mt-1 tracking-tighter">Reminders</span>
            <p className="text-[8px] text-gray-400 font-bold uppercase">2 Upcoming</p>
          </button>
      </section>
    </div>
  );
};
