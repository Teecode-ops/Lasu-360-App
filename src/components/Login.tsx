import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { User } from '../types';
import { MOCK_USER, MOCK_STAFF, MOCK_HOC } from '../constants';
import { seedDatabase } from '../services/seedService';

interface LoginProps {
  onLogin: (user: User) => void;
  isOffline: boolean;
}

export const Login: React.FC<LoginProps> = ({ onLogin, isOffline }) => {
  const [matric, setMatric] = useState('LASU/2020/001');
  const [surname, setSurname] = useState('Adekoya');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate network delay if online
    if (!isOffline) {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    try {
      // Trigger seed for demo purposes if needed
      await seedDatabase();

      // Simple mock authentication
      const allMockUsers = [MOCK_USER, MOCK_STAFF, MOCK_HOC];
      const foundUser = allMockUsers.find(
        u => u.matricNumber.toLowerCase() === matric.toLowerCase() && 
             u.surname.toLowerCase() === surname.toLowerCase()
      );

      if (foundUser) {
        onLogin(foundUser);
      } else {
        setError('Invalid Matric Number or Surname. Use demo credentials in README.');
      }
    } catch (err) {
      setError('Connection error. Please check your internet or Firebase config.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Background Image with Institutional Overlay */}
      <div className="h-[35vh] relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800" 
          alt="LASU Campus" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-900/80 flex flex-col items-center justify-center text-white p-6">
          <div className="w-20 h-20 bg-white rounded-3xl mb-4 flex items-center justify-center shadow-2xl">
            <div className="text-blue-900 font-black text-2xl tracking-tighter">LASU</div>
          </div>
          <h1 className="text-2xl font-black tracking-tight uppercase text-center">Student Life 360</h1>
          <p className="text-sm text-blue-100 font-medium opacity-80 mt-1">Unified Digital Hub</p>
        </div>
      </div>

      <div className="flex-1 px-8 pt-10 pb-12 rounded-t-[3rem] -mt-10 bg-white shadow-2xl relative z-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Identity Login</h2>
          <p className="text-gray-500 text-sm mt-1">Access your campus services securely.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
           {error && (
             <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-medium animate-pulse">
               {error}
             </div>
           )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Matric Number</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                <UserIcon size={18} />
              </div>
              <input
                type="text"
                value={matric}
                onChange={(e) => setMatric(e.target.value)}
                placeholder="LASU/2020/001"
                className="block w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Surname</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="Password (Surname)"
                className="block w-full pl-11 pr-12 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
              <span className="text-sm text-gray-500 font-medium">Remember me</span>
            </label>
            <button type="button" className="text-sm font-bold text-blue-600 hover:text-blue-700">Help?</button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-5 rounded-2xl shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center relative overflow-hidden"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              'SIGN IN TO PORTAL'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 font-medium">
              By logging in, you agree to the <span className="text-blue-600 underline">LASU IT Privacy Policy</span>
            </p>
        </div>
      </div>
    </div>
  );
};
