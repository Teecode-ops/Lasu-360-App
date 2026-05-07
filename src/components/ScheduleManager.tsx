import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Trash2, 
  X, 
  AlertCircle,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { TimetableEntry, User } from '../types';
import { addTimetableEntry, updateTimetableEntry } from '../services/firebaseService';
import { toast } from 'sonner';

interface ScheduleManagerProps {
  timetable: TimetableEntry[];
  user: User;
}

export const ScheduleManager: React.FC<ScheduleManagerProps> = ({ timetable, user }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<TimetableEntry>>({
    courseCode: '',
    time: '08:00 AM - 10:00 AM',
    venue: '',
    day: 'Monday',
    color: 'bg-blue-100',
    isCancelled: false
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const colors = [
    { name: 'Blue', value: 'bg-blue-100' },
    { name: 'Green', value: 'bg-green-100' },
    { name: 'Orange', value: 'bg-orange-100' },
    { name: 'Purple', value: 'bg-purple-100' },
    { name: 'Red', value: 'bg-red-100' },
  ];

  const handleAddEntry = async () => {
    if (!newEntry.courseCode || !newEntry.venue) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      await addTimetableEntry(newEntry as Omit<TimetableEntry, 'id'>);
      toast.success('Class scheduled successfully');
      setIsAdding(false);
      setNewEntry({
        courseCode: '',
        time: '08:00 AM - 10:00 AM',
        venue: '',
        day: 'Monday',
        color: 'bg-blue-100',
        isCancelled: false
      });
    } catch (error) {
      toast.error('Failed to schedule class');
    }
  };

  const handleToggleCancel = async (id: string, currentlyCancelled: boolean) => {
    try {
      await updateTimetableEntry(id, { isCancelled: !currentlyCancelled });
      toast.info(!currentlyCancelled ? 'Class cancelled' : 'Class restored');
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 animate-in fade-in duration-500">
      <header>
        <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase">HOC Tools</span>
        <h2 className="text-3xl font-black text-gray-900 tracking-tighter leading-tight mt-1">Schedule Manager</h2>
        <p className="text-xs text-gray-500 font-medium mt-1">Manage your department's {user.level} lecture schedule.</p>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-900 p-5 rounded-[2rem] text-white">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300">Active Classes</p>
          <p className="text-3xl font-black mt-1">{timetable.filter(t => !t.isCancelled).length}</p>
        </div>
        <div className="bg-red-50 p-5 rounded-[2rem] border border-red-100">
          <p className="text-[10px] font-bold uppercase tracking-widest text-red-400">Cancelled</p>
          <p className="text-3xl font-black mt-1 text-red-600">{timetable.filter(t => t.isCancelled).length}</p>
        </div>
      </div>

      {/* Add New Class Toggle */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsAdding(!isAdding)}
        className={`w-full py-4 rounded-3xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
          isAdding ? 'bg-gray-100 text-gray-500' : 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'
        }`}
      >
        {isAdding ? <X size={16} /> : <Plus size={16} />}
        {isAdding ? 'Close Editor' : 'Schedule New Class'}
      </motion.button>

      {/* Add Form */}
      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white border border-gray-100 p-6 rounded-[2.5rem] shadow-xl overflow-hidden"
        >
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Course Code</label>
              <input 
                type="text" 
                placeholder="e.g. CSC 401"
                className="w-full mt-1 px-5 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                value={newEntry.courseCode}
                onChange={e => setNewEntry({...newEntry, courseCode: e.target.value})}
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Venue</label>
              <input 
                type="text" 
                placeholder="e.g. 3-in-1 Hall A"
                className="w-full mt-1 px-5 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                value={newEntry.venue}
                onChange={e => setNewEntry({...newEntry, venue: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Day</label>
                <select 
                  className="w-full mt-1 px-4 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-blue-600"
                  value={newEntry.day}
                  onChange={e => setNewEntry({...newEntry, day: e.target.value as any})}
                >
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Theme</label>
                <select 
                  className="w-full mt-1 px-4 py-4 bg-gray-50 rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-blue-600"
                  value={newEntry.color}
                  onChange={e => setNewEntry({...newEntry, color: e.target.value})}
                >
                  {colors.map(c => <option key={c.value} value={c.value}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <button 
              onClick={handleAddEntry}
              className="w-full py-5 bg-gray-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all mt-2"
            >
              Add to Official Schedule
            </button>
          </div>
        </motion.div>
      )}

      {/* Current Schedule List */}
      <div className="space-y-4 pb-24">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest ml-1">Recent Classes</h3>
        {timetable.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
             <AlertTriangle className="mx-auto text-gray-200 mb-2" size={32} />
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No classes synced yet</p>
          </div>
        ) : (
          timetable.map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-5 rounded-[2rem] border flex items-center justify-between ${
                item.isCancelled ? 'bg-red-50/50 border-red-100 opacity-60' : 'bg-white border-gray-100 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color} ${item.isCancelled ? 'grayscale' : ''}`}>
                   <Calendar size={20} className="text-gray-900" />
                </div>
                <div>
                   <div className="flex items-center gap-2">
                     <h4 className="text-sm font-black text-gray-900">{item.courseCode}</h4>
                     {item.isCancelled && <span className="text-[8px] bg-red-600 text-white px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">Cancelled</span>}
                   </div>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                     {item.day} • {item.venue}
                   </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                 <button 
                  onClick={() => handleToggleCancel(item.id, !!item.isCancelled)}
                  className={`p-3 rounded-2xl transition-all ${
                    item.isCancelled ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}
                 >
                    {item.isCancelled ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                 </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
