import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, Wallet, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { Payment, User } from '../types';

interface PaymentsProps {
  payments: Payment[];
  user: User;
}

export const Payments: React.FC<PaymentsProps> = ({ payments, user }) => {
  return (
    <div className="p-6 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase">Financial Services</span>
        <h2 className="text-3xl font-black text-gray-900 tracking-tighter leading-tight mt-1">Payment History</h2>
      </header>

      {/* Main Balance Card */}
      <section className="bg-neutral-900 rounded-[2.5rem] p-7 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">Total Fees Due</h4>
            <div className="flex items-baseline gap-2 mt-2">
               <span className="text-5xl font-black tracking-tighter">₦{user.feesDue.toLocaleString()}</span>
               <span className="text-gray-600 font-bold uppercase text-xs">NGN</span>
            </div>
            
            <div className="mt-8 flex gap-3">
               <button className="flex-1 bg-white text-gray-900 px-5 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                  <CreditCard size={16} /> Pay Online
               </button>
               <button className="p-4 bg-neutral-800 text-white rounded-2xl hover:bg-neutral-700 transition-colors">
                  <Plus size={20} />
               </button>
            </div>
          </div>
          
          <Wallet size={120} className="absolute -right-4 -bottom-4 text-white/5 rotate-12" />
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full blur-[80px] -ml-16 -mt-16 opacity-20"></div>
      </section>

      {/* Transaction List */}
      <section className="space-y-4 pb-10">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Recent Activity</h3>
        <div className="flex flex-col gap-3">
          {payments.map((payment, idx) => (
             <motion.div
               key={payment.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               className="p-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm flex items-center justify-between group"
             >
                <div className="flex items-center gap-4">
                   <div className={`p-3 rounded-2xl ${
                     payment.status === 'completed' ? 'bg-green-50 text-green-600' :
                     payment.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                     'bg-red-50 text-red-600'
                   }`}>
                     {payment.status === 'completed' ? <CheckCircle2 size={20} /> : 
                      payment.status === 'pending' ? <Clock size={20} /> : <AlertCircle size={20} />}
                   </div>
                   <div>
                     <h4 className="text-sm font-black text-gray-900 tracking-tight">{payment.description}</h4>
                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mt-0.5">{payment.date} • {payment.reference}</p>
                   </div>
                </div>
                
                <div className="text-right">
                   <p className="text-sm font-black text-gray-900 tracking-tight">₦{payment.amount.toLocaleString()}</p>
                   <span className={`text-[8px] font-black uppercase tracking-widest ${
                     payment.status === 'completed' ? 'text-green-600' : 'text-orange-600'
                   }`}>
                     {payment.status}
                   </span>
                </div>
             </motion.div>
          ))}
          {payments.length === 0 && (
            <div className="py-20 text-center text-gray-300">
               <p className="text-xs italic uppercase font-bold tracking-widest leading-relaxed">No transactions recorded yet</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
