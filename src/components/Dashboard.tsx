import React from 'react';
import { motion } from 'motion/react';
import { 
  CreditCard, 
  BookOpen, 
  Map as MapIcon, 
  Library, 
  ChevronRight, 
  GraduationCap,
  Calendar,
  Clock,
  ExternalLink,
  Wallet,
  Bell
} from 'lucide-react';
import { User, NewsItem, TimetableEntry } from '../types';

interface DashboardProps {
  user: User;
  news: NewsItem[];
  timetable: TimetableEntry[];
  onNavigate: (tab: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, news, timetable, onNavigate }) => {
  const [isPrivacyMode, setIsPrivacyMode] = React.useState(false); // Default to OFF for better first impression
  const [confidentialData, setConfidentialData] = React.useState<any>(null);
  const [apiError, setApiError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user.matricNumber) {
      setApiError(null);
      // Brief delay to simulate university server firewall check
      const timer = setTimeout(() => {
        fetch(`/api/university/confidential/${user.matricNumber}`)
          .then(async res => {
            if (!res.ok) {
              const err = await res.json();
              throw new Error(err.error || `HTTP ${res.status}`);
            }
            return res.json();
          })
          .then(data => {
              if (data) setConfidentialData(data);
          })
          .catch((err) => {
            console.warn("Central API error:", err.message);
            setApiError(err.message);
          });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user.matricNumber]);

  return (
    <div className="flex flex-col gap-8 p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <section>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase">Student Hub</span>
          <button 
            onClick={() => setIsPrivacyMode(!isPrivacyMode)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-200 transition-colors"
          >
            {isPrivacyMode ? 'Privacy On' : 'Privacy Off'}
          </button>
        </div>
        <div className="flex justify-between items-end mt-2">
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter leading-tight">
            Hi, {user.name} <span className="text-blue-200">👋</span>
          </h2>
          <div className="h-10 w-10 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
             <img src={`https://ui-avatars.com/api/?name=${user.name}+${user.surname}&background=1e3a8a&color=fff`} alt="Profile" />
          </div>
        </div>
      </section>

      {/* GPA STATS - Fetched from University Central REST API */}
      <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => confidentialData ? onNavigate('results') : null}
          className={`${confidentialData ? 'bg-indigo-900 border-none' : 'bg-white border border-gray-100'} p-6 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden cursor-pointer group min-h-[160px] flex flex-col justify-center`}
      >
          {confidentialData ? (
            <>
                <div className="relative z-10 w-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-indigo-800 rounded-xl">
                      <GraduationCap size={20} className="text-indigo-200" />
                    </div>
                    <span className="px-3 py-1 bg-indigo-800/50 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-700/50">Official CGPA</span>
                  </div>
                  
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black tracking-tighter">
                      {isPrivacyMode ? '•.••' : confidentialData.cgpa.toFixed(2)}
                    </span>
                    <span className="text-indigo-300 font-bold">/ 5.00</span>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-indigo-300 text-xs font-bold uppercase tracking-wider">{user.level || confidentialData.status} • Fall 2023</p>
                      <p className="text-[10px] text-white/50 mt-0.5">Academic Standing: {confidentialData.cgpa >= 4.5 ? 'First Class' : 'Good Standing'}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white text-white group-hover:text-indigo-900 transition-all">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
                {/* Decorative backgrounds */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-800 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500 rounded-full blur-2xl -ml-12 -mb-12 opacity-20"></div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 text-gray-400 w-full">
               {apiError ? (
                 <>
                   <span className="text-red-400 text-[10px] font-black uppercase tracking-widest mb-1">Central DB Offline</span>
                   <span className="text-[8px] opacity-70 text-center px-4 leading-tight">{apiError}</span>
                   <button 
                     onClick={(e) => { e.stopPropagation(); window.location.reload(); }}
                     className="mt-3 px-4 py-1.5 bg-gray-50 rounded-full text-[8px] font-black uppercase text-gray-900 border border-gray-100"
                   >
                     Retry Connection
                   </button>
                 </>
               ) : (
                 <>
                    <div className="animate-pulse flex items-center gap-2">
                       <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                       <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                       <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    </div>
                    <span className="text-[10px] font-black mt-4 uppercase tracking-widest text-blue-900">Connecting to LASU Main DB...</span>
                 </>
               )}
            </div>
          )}
      </motion.section>

      {/* Quick Actions (2x2 Grid) */}
      <section className="grid grid-cols-4 gap-3">
        {[
          { label: 'Register', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50', tab: 'courses' },
          { label: 'Pay Fees', icon: CreditCard, color: 'text-orange-600', bg: 'bg-orange-50', tab: 'payments' },
          { label: 'Map', icon: MapIcon, color: 'text-green-600', bg: 'bg-green-50', tab: 'map' },
          { label: 'Library', icon: Library, color: 'text-purple-600', bg: 'bg-purple-50', tab: 'home' },
        ].map((action, i) => (
          <button 
            key={i} 
            onClick={() => onNavigate(action.tab)}
            className="flex flex-col items-center gap-2"
          >
            <div className={`p-4 ${action.bg} ${action.color} rounded-2xl shadow-sm hover:scale-105 active:scale-95 transition-all`}>
              <action.icon size={22} />
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{action.label}</span>
          </button>
        ))}
      </section>

      {/* Fees Stats - Confidential Financial Data */}
      <section className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
              <div className="p-3 bg-neutral-100 rounded-2xl text-neutral-600">
                <Wallet size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">Wallet Balance</h4>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-black tracking-tight text-gray-900">
                    {isPrivacyMode ? '₦ ***' : `₦${((confidentialData?.debts ?? user.feesDue) / 1000).toLocaleString()}k`}
                  </span>
                  <button 
                    onClick={() => setIsPrivacyMode(!isPrivacyMode)}
                    className="text-[10px] text-blue-600 font-bold uppercase"
                  >
                    {isPrivacyMode ? 'Show' : 'Hide'}
                  </button>
                </div>
              </div>
          </div>
          <button 
            onClick={() => onNavigate('payments')}
            className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/30 active:scale-90 transition-all font-black"
          >
            <CreditCard size={20} />
          </button>
      </section>

      {/* Classes Today - Confidential Schedule */}
      <section className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
            <Calendar size={16} className="text-blue-600" />
            Today's Schedule
          </h3>
          <button onClick={() => onNavigate('timetable')} className="text-[10px] font-black text-blue-600 uppercase hover:underline">View Full</button>
        </div>
        
        <div className="space-y-3">
          {timetable.filter(t => t.day === 'Monday').slice(0, 2).map((item, idx) => (
            <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="flex items-center p-4 bg-white rounded-[1.5rem] border border-gray-100 shadow-sm gap-4"
            >
              <div className={`w-1 font-black h-12 ${item.color.replace('bg-', 'bg-').split(' ')[0]} rounded-full`} />
              <div className="flex-1">
                <h4 className="text-sm font-extrabold text-gray-900 tracking-tight">{item.courseCode}</h4>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wide mt-0.5">
                   <Clock size={10} /> {item.time.split(' - ')[0]}
                   <span className="w-1 h-1 bg-gray-200 rounded-full" />
                   <MapIcon size={10} /> {item.venue}
                </div>
              </div>
              <div className="text-[10px] font-black bg-gray-50 text-gray-400 px-3 py-1 rounded-full uppercase">Upcoming</div>
            </motion.div>
          ))}
          {timetable.length === 0 && <p className="text-xs text-gray-400 text-center py-4 italic">No courses scheduled for today</p>}
        </div>
      </section>

      {/* Latest News */}
      <section className="space-y-4">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 px-1">
          <Bell size={16} className="text-orange-500" />
          Campus Feed
        </h3>
        <div className="flex flex-col gap-3">
          {news.map((item, idx) => (
             <motion.div 
               key={item.id}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.3 + idx * 0.1 }}
               className="p-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm relative overflow-hidden group"
             >
               <div className="flex justify-between items-start mb-2">
                 <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${
                   item.category === 'Academic' ? 'bg-blue-50 text-blue-600' :
                   item.category === 'Important' ? 'bg-red-50 text-red-600' :
                   'bg-gray-50 text-gray-500'
                 }`}>
                   {item.category}
                 </span>
                 <span className="text-[8px] text-gray-300 font-bold uppercase">{item.date}</span>
               </div>
               <h4 className="text-sm font-bold text-gray-900 tracking-tight line-clamp-1 mb-1">{item.title}</h4>
               <p className="text-[10px] text-gray-500 font-medium leading-relaxed line-clamp-2">{item.content}</p>
               <div className="mt-3 flex justify-end">
                 <button className="p-2 border border-gray-100 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-all">
                    <ChevronRight size={14} />
                 </button>
               </div>
             </motion.div>
          ))}
        </div>
      </section>

      {/* Map Preview */}
      <section className="bg-blue-900 rounded-[2.5rem] p-6 text-white relative overflow-hidden mb-4">
          <div className="relative z-10">
            <h3 className="text-xl font-black tracking-tighter">Navigate Campus</h3>
            <p className="text-xs text-blue-200 mt-1 font-medium opacity-80">Find departments, halls, and centers with ease.</p>
            <button 
              onClick={() => onNavigate('map')}
              className="mt-4 flex items-center gap-2 bg-white text-blue-900 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-black/20"
            >
              <MapIcon size={16} /> Open Directory
            </button>
          </div>
          <MapIcon size={120} className="absolute -right-4 -bottom-4 text-white/5 rotate-12" />
          <ExternalLink size={100} className="absolute -left-10 -top-10 text-blue-800/20 -rotate-12" />
      </section>
    </div>
  );
};
