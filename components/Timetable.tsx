import React, { useState } from 'react';
import { Clock, MapPin, XCircle, CheckCircle, Bell, Loader2, MoreVertical, Trash2, Ban, FastForward } from 'lucide-react';
import { TimetableEntry, User } from '../types';
import { updateTimetableStatus, updateTimetableEntry, deleteTimetableEntry } from '../services/firebaseService';

interface TimetableProps {
  timetable: TimetableEntry[];
  user: User;
}

export function Timetable({ timetable, user }: TimetableProps) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleAction = async (id: string, type: 'cancel' | 'postpone' | 'delete') => {
    if (user.role !== 'hoc' && user.role !== 'admin') return;
    
    setLoadingId(id);
    setActiveMenu(null);
    try {
      if (type === 'delete') {
        if (window.confirm('Are you sure you want to remove this class from the timetable?')) {
          await deleteTimetableEntry(id);
        }
      } else if (type === 'cancel') {
        const item = timetable.find(t => t.id === id);
        await updateTimetableStatus(id, !item?.isCancelled, user.id);
      } else if (type === 'postpone') {
        const item = timetable.find(t => t.id === id);
        await updateTimetableEntry(id, { isPostponed: !item?.isPostponed });
      }
    } catch (err) {
      alert('Operation failed');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-5 space-y-6 pb-24 animate-in fade-in slide-in-from-right duration-500">
      <div className="flex justify-between items-end px-2">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-gray-900 leading-none">Weekly Grid</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">{user.department} Schedule</p>
        </div>
        {user.role === 'hoc' && (
          <div className="bg-blue-600 text-white text-[8px] font-black uppercase px-3 py-1.5 rounded-full shadow-lg shadow-blue-200">
            CLASS REP ACCESS
          </div>
        )}
      </div>

      <div className="space-y-12">
        {days.map((day) => {
          const dayClasses = timetable.filter(t => t.day === day);
          if (dayClasses.length === 0) return null;

          return (
            <div key={day} className="relative pl-6">
              {/* Day Header with Sticky Background */}
              <div className="sticky top-0 z-20 bg-neutral-50/80 backdrop-blur-md py-2 mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-blue-600/30"></span>
                  {day}
                </h3>
              </div>

              {/* Vertical Timeline Line */}
              <div className="absolute left-[31px] top-12 bottom-0 w-[1px] bg-gradient-to-b from-blue-200 via-gray-100 to-transparent"></div>

              <div className="space-y-6">
                {dayClasses.map((item) => (
                  <div key={item.id} className="relative pl-8">
                    {/* Timeline Dot */}
                    <div className={`absolute left-[-5px] top-6 w-2.5 h-2.5 rounded-full border-2 border-white z-10 ${
                      item.isCancelled ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 
                      item.isPostponed ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 
                      'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]'
                    }`}></div>

                    <div className={`bg-white p-6 rounded-[2.5rem] shadow-xl shadow-gray-100/50 border transition-all duration-300 ${
                      item.isCancelled ? 'border-red-100 bg-red-50/30' : 
                      item.isPostponed ? 'border-amber-100 bg-amber-50/30' : 
                      'border-gray-50'
                    }`}>
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                             <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tight ${
                               item.isCancelled ? 'bg-red-100 text-red-700' :
                               item.isPostponed ? 'bg-amber-100 text-amber-700' :
                               'bg-blue-50 text-blue-600'
                             }`}>
                               {item.time}
                             </div>
                             {item.isPostponed && !item.isCancelled && (
                               <span className="bg-amber-500 text-white text-[7px] font-black uppercase px-2 py-0.5 rounded-full animate-pulse">Postponed</span>
                             )}
                             {item.isCancelled && (
                               <span className="bg-red-500 text-white text-[7px] font-black uppercase px-2 py-0.5 rounded-full">Cancelled</span>
                             )}
                          </div>

                          <div>
                            <h4 className={`text-xl font-black text-gray-900 leading-tight mb-1 ${item.isCancelled ? 'line-through text-gray-400' : ''}`}>
                              {item.courseCode}
                            </h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 opacity-80">
                              <MapPin size={10} className={item.isCancelled ? 'text-gray-300' : 'text-orange-500'} /> {item.venue}
                            </p>
                          </div>
                        </div>

                        {(user.role === 'hoc' || user.role === 'admin') && (
                          <div className="relative">
                            <button
                              onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)}
                              className="p-3 bg-neutral-50 hover:bg-neutral-100 rounded-2xl transition-all text-gray-400 active:scale-90"
                            >
                              {loadingId === item.id ? <Loader2 size={16} className="animate-spin text-blue-600" /> : <MoreVertical size={16} />}
                            </button>
                            
                            {activeMenu === item.id && (
                              <div className="absolute right-0 top-full mt-3 w-48 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                                 <button 
                                   onClick={() => handleAction(item.id, 'cancel')}
                                   className="w-full flex items-center gap-3 px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-700 hover:bg-neutral-50 transition-colors border-b border-gray-50"
                                 >
                                   <Ban size={14} className={item.isCancelled ? 'text-blue-500' : 'text-red-500'} />
                                   {item.isCancelled ? 'Restore Class' : 'Cancel Class'}
                                 </button>
                                 <button 
                                   onClick={() => handleAction(item.id, 'postpone')}
                                   className="w-full flex items-center gap-3 px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-700 hover:bg-neutral-50 transition-colors border-b border-gray-50"
                                 >
                                   <FastForward size={14} className="text-amber-500" />
                                   {item.isPostponed ? 'Mark Normal' : 'Postpone'}
                                 </button>
                                 <button 
                                   onClick={() => handleAction(item.id, 'delete')}
                                   className="w-full flex items-center gap-3 px-6 py-4 text-[9px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors"
                                 >
                                   <Trash2 size={14} />
                                   Remove All
                                 </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {item.isCancelled && (
                        <div className="mt-4 pt-4 border-t border-red-100 flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                           <p className="text-[8px] font-black text-red-400 uppercase tracking-widest">Modified by {user.role === 'hoc' ? 'HOC' : 'Admin'}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
