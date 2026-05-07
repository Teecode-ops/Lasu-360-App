import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, UserCheck, UserX, Clock, ClipboardList, CheckCircle2, AlertCircle } from 'lucide-react';
import { RegistrationRequest } from '../types';

interface HODApprovalProps {
  requests: RegistrationRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const HODApproval: React.FC<HODApprovalProps> = ({ requests, onApprove, onReject }) => {
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const historyRequests = requests.filter(r => r.status !== 'pending');

  return (
    <div className="p-6 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase">Departmental Queue</span>
        <h2 className="text-3xl font-black text-gray-900 tracking-tighter leading-tight mt-1">HOD Approvals</h2>
      </header>

      {/* Summary Cards */}
      <section className="grid grid-cols-2 gap-4">
          <div className="p-5 bg-blue-900 text-white rounded-[2rem] shadow-lg shadow-blue-900/20">
             <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-800 rounded-lg">
                   <Clock size={18} className="text-blue-200" />
                </div>
                <span className="text-[8px] font-black text-blue-300 uppercase">Queue</span>
             </div>
             <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest leading-none">Pending Requests</p>
             <p className="text-3xl font-black tracking-tighter mt-1">{pendingRequests.length}</p>
          </div>
          <div className="p-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
             <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                   <CheckCircle2 size={18} />
                </div>
                <span className="text-[8px] font-black text-green-600 uppercase">Session</span>
             </div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Total Processed</p>
             <p className="text-3xl font-black text-gray-900 tracking-tighter mt-1">{historyRequests.length}</p>
          </div>
      </section>

      {/* Pending Approval List */}
      <section className="space-y-4">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Requires Processing</h3>
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {pendingRequests.map((req) => (
              <motion.div
                layout
                key={req.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: 100 }}
                className="p-5 bg-white border-2 border-blue-50 rounded-[2.5rem] shadow-sm overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                   <div>
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{req.level} • {req.matricNumber}</span>
                      <h4 className="text-lg font-black text-gray-900 tracking-tighter leading-none mt-1">{req.studentName}</h4>
                   </div>
                   <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                      <ClipboardList size={22} />
                   </div>
                </div>

                <div className="space-y-2 mb-6">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Requested Courses ({req.totalUnits} Units)</p>
                   <div className="flex flex-wrap gap-2">
                     {req.courses.map(course => (
                       <span key={course} className="px-2 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold text-gray-600 uppercase">
                         {course}
                       </span>
                     ))}
                   </div>
                </div>

                <div className="flex gap-3">
                   <button 
                     onClick={() => onApprove(req.id)}
                     className="flex-1 bg-blue-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-blue-900/20"
                   >
                     <UserCheck size={16} /> Approve
                   </button>
                   <button 
                     onClick={() => onReject(req.id)}
                     className="flex-1 bg-white text-red-600 border border-red-100 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
                   >
                     <UserX size={16} /> Reject
                   </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {pendingRequests.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center gap-4">
               <div className="p-6 bg-gray-50 rounded-full text-gray-200">
                  <ShieldCheck size={48} />
               </div>
               <div className="space-y-1">
                 <p className="text-sm font-black text-gray-900 uppercase">All Cleared</p>
                 <p className="text-[10px] text-gray-400 font-bold uppercase">No pending registrations in your queue.</p>
               </div>
            </div>
          )}
        </div>
      </section>

      {/* Recent History */}
      <section className="space-y-4 pb-10 opacity-60">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Session History</h3>
        <div className="flex flex-col gap-3">
           {historyRequests.slice(0, 5).map(req => (
             <div key={req.id} className="p-4 bg-white border border-gray-100 rounded-[1.5rem] flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-xl ${req.status === 'approved' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {req.status === 'approved' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                   </div>
                   <div>
                      <h5 className="text-[10px] font-black text-gray-900 uppercase tracking-tighter">{req.studentName}</h5>
                      <p className="text-[8px] text-gray-400 font-bold uppercase">{req.matricNumber}</p>
                   </div>
                </div>
                <span className={`text-[8px] font-black uppercase tracking-widest ${req.status === 'approved' ? 'text-green-600' : 'text-red-600'}`}>
                   {req.status}
                </span>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
};
