import React from 'react';
import { TrendingUp, Calendar, Newspaper, Wallet, MapPin, ChevronRight, Bell, Users, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { User, NewsItem, TimetableEntry, Tab } from '../types';
import { motion } from 'motion/react';

interface DashboardProps {
  user: User;
  news: NewsItem[];
  timetable: TimetableEntry[];
  onNavigate: (tab: Tab) => void;
}

const containerVars = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVars = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 100 } }
};

export function Dashboard({ user, news, timetable, onNavigate }: DashboardProps) {
  const [isFeesPrivate, setIsFeesPrivate] = React.useState(true);
  const [isSchedulePrivate, setIsSchedulePrivate] = React.useState(true);
  
  const [confidentialData, setConfidentialData] = React.useState<any>(null);
  
  React.useEffect(() => {
    if (user?.matricNumber) {
      fetch(`/api/university/confidential/${user.matricNumber}`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          const contentType = res.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("No JSON found at specific endpoint");
          }
          return res.json();
        })
        .then(data => {
          if (data && !data.error) setConfidentialData(data);
        })
        .catch(err => console.warn("Backend API offline or invalid response", err.message));
    }
  }, [user?.matricNumber]);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const classesToday = timetable.filter(entry => entry.day === today);
  const unreadNews = news.length;

  return (
    <motion.div 
      variants={containerVars}
      initial="hidden"
      animate="show"
      className="p-5 space-y-6"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVars} className="flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-gray-900 leading-tight">Welcome, {user.surname}</h2>
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{user.department} • {user.level}</p>
            <div className={`p-1.5 rounded-lg flex items-center justify-center transition-all bg-blue-50 text-blue-600`}>
              <ShieldCheck size={12} />
            </div>
          </div>
        </div>
        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white shadow-lg">
           <img src={`https://ui-avatars.com/api/?name=${user.name}&background=1e40af&color=fff`} alt="Profile" />
        </div>
      </motion.div>

      {/* GPA STATS - Fetched from University Central REST API */}
      {user.role !== 'hod' && (
        <motion.div variants={itemVars} 
          onClick={() => confidentialData ? onNavigate('results') : null}
          className={`${confidentialData ? 'bg-indigo-900 border-none' : 'bg-white border border-gray-100'} p-6 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden cursor-pointer group`}
        >
          {confidentialData ? (
            <>
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
              <div className="relative z-10 flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Central DB: Current CGPA</p>
                  <h3 className="text-4xl font-black tracking-tighter text-white">
                    {confidentialData.cgpa.toFixed(2)}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-[9px] font-bold text-indigo-200 uppercase">Synchronized with Central DB</span>
                  </div>
                </div>
                <TrendingUp size={32} className="text-indigo-400 opacity-50" />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 space-y-3">
               <ShieldCheck className="text-indigo-200" size={32} />
               <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 text-center">
                 {user.matricNumber === 'LASU/2020/001' ? 'Connect to Internet to sync GPA' : 'Confidential Data: Online Only'}
               </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Fees Stats - Confidential Financial Data */}
      {user.role !== 'hod' && (
        <motion.div variants={itemVars} className="grid grid-cols-1 gap-4 text-left">
          <motion.div 
            whileHover={{ y: -5, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100 cursor-pointer relative group flex justify-between items-center"
          >
             <div className="flex-1" onClick={() => onNavigate('payments')}>
                <Wallet className="mb-2 text-orange-500" size={24} />
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Fees Outstanding</p>
                <h3 className="text-3xl font-black text-gray-900 transition-all duration-300">
                  {isFeesPrivate ? '₦ ***' : `₦${(confidentialData?.debts || user.feesDue) / 1000}k`}
                </h3>
             </div>
             
             <div className="flex flex-col gap-2 items-end">
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsFeesPrivate(!isFeesPrivate); }}
                  className={`p-2 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isFeesPrivate ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-400 hover:text-gray-600'}`}
                >
                  {isFeesPrivate ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <div onClick={() => onNavigate('payments')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 bg-blue-50 px-4 py-2 rounded-xl">
                  Details <ChevronRight size={14} />
                </div>
             </div>
          </motion.div>
        </motion.div>
      )}

      {/* Classes Today - Confidential Schedule */}
      {user.role !== 'hod' && (
        <motion.div variants={itemVars} className="bg-white rounded-[2rem] p-6 shadow-xl shadow-gray-100 border border-gray-50 overflow-hidden relative">
          <div className="flex justify-between items-center mb-5">
             <div className="flex items-center gap-2">
               <Calendar className="text-blue-600" size={20} />
               <h3 className="text-sm font-black uppercase tracking-widest">Schedule</h3>
             </div>
             <button 
              onClick={() => setIsSchedulePrivate(!isSchedulePrivate)} 
              className={`p-2 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isSchedulePrivate ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400 hover:text-gray-600'}`}
             >
                {isSchedulePrivate ? <Eye size={18} /> : <EyeOff size={18} />}
             </button>
          </div>

          <div className={`space-y-3 transition-all duration-500 ${isSchedulePrivate ? 'blur-md select-none grayscale' : ''}`}>
            {classesToday.length > 0 ? classesToday.map((item, idx) => (
               <motion.div 
                key={item.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className={`p-4 rounded-2xl flex justify-between items-center ${item.isCancelled ? 'bg-red-50 opacity-60' : item.isPostponed ? 'bg-amber-50 border border-amber-100' : 'bg-neutral-50'}`}
               >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-black ${item.isCancelled ? 'line-through text-red-700' : 'text-gray-800'}`}>{item.courseCode}</h4>
                      {item.isPostponed && !item.isCancelled && (
                        <span className="bg-amber-100 text-amber-700 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase">Postponed</span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
                      <MapPin size={10} /> {item.venue}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-blue-600">{item.time.split('-')[0]}</p>
                    {item.isCancelled && <span className="text-[8px] font-black text-red-600 uppercase">Cancelled</span>}
                  </div>
               </motion.div>
            )) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center bg-green-50 rounded-2xl border-2 border-dashed border-green-200"
              >
                 <p className="text-xs font-black text-green-700 uppercase">No classes scheduled today! 🎉</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}


      {/* Latest News */}
      <motion.div variants={itemVars} className="space-y-4">
        <div className="flex justify-between items-center px-1">
           <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
             <Newspaper className="text-orange-500" size={18} /> Announcements
           </h3>
           <div className="relative">
             <Bell className="text-gray-400" size={20} />
             {unreadNews > 0 && (
               <motion.span 
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[8px] flex items-center justify-center font-bold text-white leading-none"
               >
                 {unreadNews}
               </motion.span>
             )}
           </div>
        </div>

        <div className="space-y-4">
           {news.map((item, idx) => (
             <motion.div 
               key={item.id} 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 + idx * 0.1 }}
               whileHover={{ x: 5 }}
               className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-50 space-y-3 cursor-pointer group"
             >
                <div className="flex justify-between items-center">
                  <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full ${
                    item.category === 'Academic' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                  }`}>
                    {item.category}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{item.date}</span>
                </div>
                <div>
                  <h4 className="font-black text-gray-800 leading-snug mb-1 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.content}</p>
                </div>
             </motion.div>
           ))}
        </div>
      </motion.div>

      {/* Map Preview */}
      <motion.div 
        variants={itemVars}
        whileHover={{ scale: 0.98 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onNavigate('map')} 
        className="bg-neutral-900 rounded-[2rem] h-40 relative overflow-hidden group cursor-pointer shadow-xl shadow-neutral-200"
      >
         <img 
            src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800" 
            className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-[2s]" 
            alt="Campus Map"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
            <h4 className="text-white font-black text-lg flex items-center gap-2">
               Campus Navigator <MapPin className="text-blue-400" size={20} />
            </h4>
            <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest">Find classrooms, halls and routes</p>
         </div>
      </motion.div>
    </motion.div>
  );
}
