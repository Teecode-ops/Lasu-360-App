import React, { useState } from 'react';
import { Send, Newspaper, LayoutDashboard, TrendingUp, Users, RefreshCcw, Plus, Calendar, Trash2 } from 'lucide-react';
import { User, NewsItem, TimetableEntry } from '../types';
import { postNews, addTimetableEntry, deleteTimetableEntry } from '../services/firebaseService';

interface AdminPanelProps {
  user: User;
}

export function AdminPanel({ user }: AdminPanelProps) {
  // News State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<any>('General');
  
  // Timetable State
  const [courseCode, setCourseCode] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [day, setDay] = useState('Monday');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePostNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await postNews({
        title,
        content,
        category,
        authorId: user.id,
        date: new Date().toLocaleDateString(),
      });
      setTitle('');
      setContent('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert('Error posting news');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addTimetableEntry({
        courseCode,
        time,
        venue,
        day,
        color: 'bg-blue-50',
      });
      setCourseCode('');
      setTime('');
      setVenue('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert('Error adding class');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 space-y-6 animate-in slide-in-from-top duration-500 pb-20">
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-2xl font-black text-gray-900 leading-none">Management</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">{user.role} Control Panel</p>
        </div>
        <div className="bg-neutral-900 text-white p-3 rounded-2xl">
           <LayoutDashboard size={20} />
        </div>
      </div>


      {/* Timetable Management Section (HoC/Admin) */}
      {(user.role === 'hoc' || user.role === 'admin') && (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-neutral-100 border border-gray-50 space-y-6">
          <div className="flex items-center gap-3">
             <Calendar className="text-blue-600" size={24} />
             <h3 className="text-sm font-black uppercase tracking-widest text-gray-800">Add New Class</h3>
          </div>

          <form onSubmit={handleAddClass} className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Course Code</label>
                  <input 
                     type="text" 
                     value={courseCode}
                     onChange={e => setCourseCode(e.target.value.toUpperCase())}
                     placeholder="CSC 401"
                     className="w-full bg-neutral-50 border-none rounded-2xl py-3 px-4 text-xs font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                     required
                  />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Day</label>
                  <select 
                     value={day}
                     onChange={e => setDay(e.target.value)}
                     className="w-full bg-neutral-50 border-none rounded-2xl py-3 px-4 text-xs font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                     {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => (
                       <option key={d} value={d}>{d}</option>
                     ))}
                  </select>
               </div>
             </div>

             <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Time (e.g. 08:00 AM - 10:00 AM)</label>
                <input 
                   type="text" 
                   value={time}
                   onChange={e => setTime(e.target.value)}
                   placeholder="10:00 AM - 12:00 PM"
                   className="w-full bg-neutral-50 border-none rounded-2xl py-3 px-4 text-xs font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                   required
                />
             </div>

             <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Venue</label>
                <input 
                   type="text" 
                   value={venue}
                   onChange={e => setVenue(e.target.value)}
                   placeholder="Science Lab 2"
                   className="w-full bg-neutral-50 border-none rounded-2xl py-3 px-4 text-xs font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                   required
                />
             </div>

             <button 
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 text-xs uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-blue-200"
             >
                {loading ? <RefreshCcw className="animate-spin" /> : <><Plus size={18} /> Schedule Session</>}
             </button>
          </form>
        </div>
      )}

      {/* Post News Section (HoC/Admin) */}
      {(user.role === 'hoc' || user.role === 'admin') && (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-neutral-100 border border-gray-50 space-y-6">
          <div className="flex items-center gap-3">
             <Newspaper className="text-orange-500" size={24} />
             <h3 className="text-sm font-black uppercase tracking-widest text-gray-800">Post Announcement</h3>
          </div>

          <form onSubmit={handlePostNews} className="space-y-4">
             <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Headline</label>
                <input 
                   type="text" 
                   value={title}
                   onChange={e => setTitle(e.target.value)}
                   placeholder="Enter catchy headline..."
                   className="w-full bg-neutral-50 border-none rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-300"
                   required
                />
             </div>

             <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Category</label>
                <select 
                   value={category}
                   onChange={e => setCategory(e.target.value)}
                   className="w-full bg-neutral-50 border-none rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                >
                   <option value="General">General</option>
                   <option value="Academic">Academic</option>
                   <option value="Sports">Sports</option>
                   <option value="Important">Important</option>
                </select>
             </div>

             <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Details</label>
                <textarea 
                   value={content}
                   onChange={e => setContent(e.target.value)}
                   placeholder="Full announcement content here..."
                   rows={4}
                   className="w-full bg-neutral-50 border-none rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-300 resize-none"
                   required
                ></textarea>
             </div>

             <button 
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 text-sm uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-orange-200"
             >
                {loading ? <RefreshCcw className="animate-spin" /> : <><Send size={18} /> Broadcast News</>}
             </button>

             {success && (
               <p className="text-center text-[10px] font-black text-green-600 uppercase animate-bounce">Operation Successful! 🎉</p>
             )}
          </form>
        </div>
      )}
    </div>
  );
}
