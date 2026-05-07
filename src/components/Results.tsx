import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Award, TrendingUp, Download, Search, Info } from 'lucide-react';
import { Result, User } from '../types';

interface ResultsProps {
  results: Result[];
  user: User;
}

export const Results: React.FC<ResultsProps> = ({ results, user }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isPrivacyOn, setIsPrivacyOn] = React.useState(false);
  
  const filteredResults = results.filter(r => 
    r.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase">Performance Portal</span>
              <button 
                onClick={() => setIsPrivacyOn(!isPrivacyOn)}
                className="text-[8px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-black uppercase tracking-widest"
              >
                {isPrivacyOn ? 'Privacy: On' : 'Privacy: Off'}
              </button>
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter leading-tight mt-1">Examination Results</h2>
          </div>
          <div className="p-3 bg-blue-900 text-white rounded-2xl shadow-lg shadow-blue-900/20">
             <Download size={20} />
          </div>
        </div>
      </header>

      {/* GPA Breakdown Card */}
      <section className="bg-blue-900 rounded-[2.5rem] p-7 text-white relative overflow-hidden shadow-2xl shadow-blue-900/30">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
               <div className="p-3 bg-blue-800 rounded-2xl">
                 <GraduationCap size={24} className="text-blue-200" />
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Standing</p>
                  <p className="text-xs font-bold uppercase tracking-tight">1st Class Hons.</p>
               </div>
            </div>

            <div className="flex items-center gap-4">
               <div>
                  <h4 className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Cumulative GPA</h4>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-5xl font-black tracking-tighter">
                      {isPrivacyOn ? '•.••' : user.cgpa.toFixed(2)}
                    </span>
                    <span className="text-blue-400 font-bold">/ 5.00</span>
                  </div>
               </div>
               <div className="h-10 w-px bg-white/10 mx-2" />
               <div>
                  <h4 className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Completed Units</h4>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black tracking-tighter">142</span>
                    <span className="text-blue-400 font-bold uppercase text-[10px]">TCE</span>
                  </div>
               </div>
            </div>

            <div className="mt-8 flex gap-3">
               <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <TrendingUp size={14} className="text-green-400" />
                    <span className="text-[10px] font-bold text-green-400">+0.12</span>
                  </div>
                  <p className="text-[8px] font-black text-blue-200 uppercase tracking-wider">Prev Semester</p>
                  <p className="text-sm font-black">4.32</p>
               </div>
               <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <TrendingUp size={14} className="text-blue-400" />
                    <span className="text-[10px] font-bold">8 Courses</span>
                  </div>
                  <p className="text-[8px] font-black text-blue-200 uppercase tracking-wider">Current Load</p>
                  <p className="text-sm font-black">Registering</p>
               </div>
            </div>
          </div>

          {/* Decorative elements */}
          <Award size={180} className="absolute -right-8 -bottom-8 text-white/5 -rotate-12" />
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 rounded-full blur-3xl -mr-20 -mt-20 opacity-20"></div>
      </section>

      {/* Result Listing */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
           <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Harmattan 2023 Results</h3>
           <div className="flex items-center gap-2">
             <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                  type="text" 
                  placeholder="Filter..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-gray-50 border-none rounded-full text-[10px] font-bold outline-none focus:ring-1 focus:ring-blue-100 w-32"
                />
             </div>
           </div>
        </div>

        <div className="flex flex-col gap-3">
          {filteredResults.map((result, idx) => (
             <motion.div
               key={result.id}
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: idx * 0.1 }}
               className="p-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm flex items-center justify-between group active:scale-[0.98] transition-transform"
             >
                <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl tracking-tighter ${
                     isPrivacyOn ? 'bg-gray-100 text-gray-300' :
                     result.grade === 'A' ? 'bg-green-50 text-green-600' :
                     result.grade === 'B' ? 'bg-blue-50 text-blue-600' : 
                     result.grade === 'C' ? 'bg-orange-50 text-orange-600' :
                     'bg-gray-50 text-gray-400'
                   }`}>
                     {isPrivacyOn ? '•' : result.grade}
                   </div>
                   <div>
                     <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Course Code</h4>
                     <p className="text-lg font-black text-gray-900 tracking-tighter mt-0.5">{result.courseCode}</p>
                   </div>
                </div>
                
                <div className="text-right">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Score</h4>
                   <p className="text-lg font-black text-gray-900 tracking-tighter mt-0.5">
                     {isPrivacyOn ? '••' : result.score}
                   </p>
                   <p className="text-[8px] text-gray-300 font-bold uppercase">{result.units} Units</p>
                </div>
             </motion.div>
          ))}
          {filteredResults.length === 0 && (
            <div className="py-20 text-center">
               <p className="text-xs text-gray-400 italic">No results found for your search query.</p>
            </div>
          )}
        </div>
      </section>

      <div className="p-4 bg-gray-900 rounded-3xl flex items-center gap-3 text-white/50 text-[10px] font-bold uppercase tracking-widest">
         <Info size={16} className="text-blue-400" />
         Results are provisional until the senate approval.
      </div>
    </div>
  );
};
