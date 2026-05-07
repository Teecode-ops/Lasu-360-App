import React, { useState } from 'react';
import { LogIn, User as UserIcon, ShieldAlert, Loader2 } from 'lucide-react';
import { User } from '../types';
import { loginWithMatric } from '../services/firebaseService';

interface LoginProps {
  onLogin: (user: User) => void;
  isOffline: boolean;
}

export function Login({ onLogin, isOffline }: LoginProps) {
  const [matricNumber, setMatricNumber] = useState('LASU/2020/001');
  const [surname, setSurname] = useState('Adekoya');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOffline) {
      setError('You are offline. Please connect to login.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const user = await loginWithMatric(matricNumber, surname);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid credentials. Please contact support.');
      }
    } catch (err) {
      setError('An error occurred. Check your database connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-white font-sans relative overflow-hidden">
      {/* Background Image with Institutional Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1920" 
          alt="Students Studying" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-blue-900/85 backdrop-blur-[1px]"></div>
      </div>

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-10">
          <div className="w-32 h-32 flex items-center justify-center mx-auto mb-6 transition-transform hover:scale-110 duration-500">
             <img 
               src="https://upload.wikimedia.org/wikipedia/commons/c/c2/LASU_Logo.png" 
               alt="LASU Logo" 
               className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
               referrerPolicy="no-referrer"
             />
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-2 uppercase">LASU 360</h1>
          <p className="text-blue-200 text-sm font-bold uppercase tracking-widest leading-none">Complete Student Hub</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white/5 p-8 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl">
          {error && (
            <div className="bg-red-500/20 border border-red-500/40 text-red-200 p-4 rounded-xl flex items-center gap-3 animate-shake">
              <ShieldAlert size={20} />
              <span className="text-sm font-bold">{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-blue-300 uppercase tracking-widest pl-2">Matric Number</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
              <input
                type="text"
                value={matricNumber}
                onChange={(e) => setMatricNumber(e.target.value.toUpperCase())}
                className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold placeholder:text-white/20"
                placeholder="LASU/2020/001"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-blue-300 uppercase tracking-widest pl-2">Surname</label>
            <div className="relative">
              <LogIn className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold placeholder:text-white/20"
                placeholder="Your Surname"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || isOffline}
            className="w-full bg-white text-blue-900 font-black py-4 rounded-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-tight shadow-xl active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Log In'}
          </button>
        </form>

        <p className="mt-8 text-center text-blue-300 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
            Official University Management System
        </p>
      </div>
    </div>
  );
}
