import React from 'react';
import { motion } from 'motion/react';
import { Settings, Users, Database, ShieldAlert, ChevronRight, Activity, Server, Power } from 'lucide-react';
import { User } from '../types';

interface AdminPanelProps {
  user: User;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ user }) => {
  return (
    <div className="p-6 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <span className="text-[10px] font-black tracking-widest text-red-600 uppercase">System Administration</span>
        <h2 className="text-3xl font-black text-gray-900 tracking-tighter leading-tight mt-1">Management Console</h2>
      </header>

      {/* System Status Cards */}
      <section className="grid grid-cols-2 gap-4">
          <div className="p-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
             <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                   <Activity size={18} />
                </div>
                <span className="text-[8px] font-black text-green-600 uppercase">Healthy</span>
             </div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Server Uptime</p>
             <p className="text-lg font-black text-gray-900 tracking-tighter">99.9%</p>
          </div>
          <div className="p-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
             <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                   <Users size={18} />
                </div>
                <span className="text-[8px] font-black text-blue-600 uppercase">+12%</span>
             </div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Users</p>
             <p className="text-lg font-black text-gray-900 tracking-tighter">1,240</p>
          </div>
      </section>

      {/* Admin Operations */}
      <section className="space-y-3">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Admin Tools</h3>
        <div className="flex flex-col gap-3">
          {[
            { label: 'User Management', desc: 'Verify and manage student identities', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Database Maintenance', desc: 'Seed, clean, or backup Firestore clusters', icon: Database, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Audit Logs', desc: 'Track all administrative and HOD actions', icon: ShieldAlert, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'System Configuration', desc: 'Global settings for portals and APIs', icon: Settings, color: 'text-neutral-600', bg: 'bg-neutral-50' },
          ].map((item, idx) => (
             <motion.button
               key={idx}
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: idx * 0.1 }}
               className="p-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm flex items-center gap-4 text-left active:scale-[0.98] transition-transform group"
             >
                <div className={`p-4 rounded-2xl ${item.bg} ${item.color}`}>
                   <item.icon size={22} />
                </div>
                <div className="flex-1">
                   <h4 className="text-sm font-black text-gray-900 tracking-tight leading-none mb-1">{item.label}</h4>
                   <p className="text-[10px] text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                </div>
                <ChevronRight size={18} className="text-gray-200 group-hover:text-blue-600 transition-colors" />
             </motion.button>
          ))}
        </div>
      </section>

      {/* Danger Zone */}
      <section className="mt-4">
         <div className="p-6 bg-red-50 rounded-[2.5rem] border border-red-100">
            <h4 className="text-xs font-black text-red-600 uppercase tracking-widest mb-1">Advanced Controls</h4>
            <p className="text-[10px] text-red-800/60 font-medium mb-6">These actions affect the production environment across all devices.</p>
            
            <div className="grid grid-cols-2 gap-3">
               <button className="bg-red-600 text-white p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all">
                  <Power size={14} /> Global Restart
               </button>
               <button className="bg-white text-red-600 border border-red-200 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all">
                  <Server size={14} /> Clear Cache
               </button>
            </div>
         </div>
      </section>
    </div>
  );
};
