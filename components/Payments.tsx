import React from 'react';
import { CreditCard, Wallet, ArrowUpRight, History, ShieldCheck, QrCode } from 'lucide-react';
import { Payment, User } from '../types';
import { QRCodeSVG } from 'qrcode.react';

interface PaymentsProps {
  payments: Payment[];
  user: User;
}

export function Payments({ payments, user }: PaymentsProps) {
  const [showQR, setShowQR] = React.useState(false);

  const totalPaid = payments.filter(p => p.status === 'completed').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="p-5 space-y-6 animate-in zoom-in duration-500">
      {/* Wallet Card */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="flex justify-between items-start mb-10">
          <Wallet size={32} className="text-blue-100" />
          <div className="flex -space-x-3">
             <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-500 shadow-xl overflow-hidden">
                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=1e40af&color=fff`} alt="U" />
             </div>
             <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-800 flex items-center justify-center text-[10px] font-black">2+</div>
          </div>
        </div>
        
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 mb-1">Total Outstanding Fees</p>
        <h2 className="text-4xl font-black mb-8 leading-none">₦{user.feesDue.toLocaleString()}</h2>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setShowQR(true)}
            className="flex-1 bg-white text-blue-800 font-black py-4 rounded-2xl flex items-center justify-center gap-2 text-xs uppercase tracking-tight shadow-xl shadow-blue-900/20 active:scale-95 transition-transform"
          >
            <QrCode size={16} /> QR Pay Now
          </button>
          <button className="p-4 bg-white/20 rounded-2xl border border-white/10 flex items-center justify-center">
            <ArrowUpRight size={20} />
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
           <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
             <History size={18} className="text-gray-400" /> History
           </h3>
           <span className="text-[10px] font-black text-blue-600 uppercase">₦{(totalPaid / 1000).toFixed(0)}k Cumulative</span>
        </div>

        <div className="space-y-3">
          {payments.length > 0 ? payments.map((p) => (
            <div key={p.id} className="bg-white p-5 rounded-3xl shadow-lg shadow-neutral-100 flex justify-between items-center border border-neutral-50 group hover:bg-neutral-50 transition-all">
               <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    p.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                  }`}>
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-800 tracking-tight text-sm line-clamp-1">{p.description}</h4>
                    <p className="text-[10px] font-bold text-gray-400 mt-1">{p.date}</p>
                  </div>
               </div>
               <div className="text-right">
                  <div className="text-sm font-black text-gray-900 leading-none mb-1">₦{p.amount.toLocaleString()}</div>
                  <div className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full inline-block ${
                    p.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {p.status}
                  </div>
               </div>
            </div>
          )) : (
            <div className="py-12 bg-neutral-50 rounded-3xl border-2 border-dashed border-neutral-100 flex flex-col items-center justify-center text-neutral-300">
               <CreditCard size={40} className="mb-3 opacity-20" />
               <p className="text-[10px] font-black uppercase tracking-widest">No transactions yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Security Tip */}
      <div className="bg-green-50 p-4 rounded-2xl flex gap-3 items-center border border-green-100">
         <ShieldCheck className="text-green-600 shrink-0" size={24} />
         <div>
           <p className="text-[9px] font-black text-green-800 uppercase tracking-tight">Secured via Interswitch</p>
           <p className="text-[8px] text-green-600 font-bold leading-tight">All payments are encrypted and verified by the university finance portal.</p>
         </div>
      </div>

      {/* QR Modal Overlay */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm bg-black/40">
           <div className="bg-white p-8 rounded-[3rem] w-full max-w-xs text-center space-y-6 shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="flex justify-between items-center mb-2">
                 <h3 className="text-sm font-black uppercase tracking-widest">Scan to Pay</h3>
                 <button onClick={() => setShowQR(false)} className="bg-neutral-100 p-2 rounded-full active:scale-90 transition-transform">
                   <ArrowUpRight size={16} className="rotate-180" />
                 </button>
              </div>
              <div className="p-6 bg-white border-4 border-blue-600 rounded-3xl inline-block mx-auto">
                 <QRCodeSVG value={`LASU-PAY-${user.id}-${Date.now()}`} size={160} />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-black text-gray-900 leading-none">₦{user.feesDue.toLocaleString()}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Fees Payment</p>
              </div>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-tighter">Valid at LASU Cashier or Bank</p>
           </div>
        </div>
      )}
    </div>
  );
}
