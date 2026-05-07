import React, { useState } from 'react';
import { RegistrationRequest } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, User, Book, Hash, Clock, ShieldCheck, Filter, Search, ChevronDown, ChevronUp } from 'lucide-react';

interface HODApprovalProps {
  requests: RegistrationRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function HODApproval({ requests: initialRequests, onApprove, onReject }: HODApprovalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const pendingRequests = initialRequests.filter(r => 
    r.status === 'pending' && 
    (r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
     r.matricNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 max-w-md mx-auto min-h-screen pb-24">
      <header className="space-y-1">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Course Approvals</h2>
        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Department Management Portal</p>
      </header>

      {/* Search & Filter */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search students or matric no..."
          className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {pendingRequests.length > 0 ? (
          pendingRequests.map((request) => (
            <motion.div 
              key={request.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[1.8rem] border border-gray-100 shadow-sm overflow-hidden"
            >
              <div 
                className="p-5 flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedId(expandedId === request.id ? null : request.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-lg">
                    {request.studentName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-800 text-sm leading-tight">{request.studentName}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{request.matricNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right mr-2">
                    <p className="text-[10px] font-black text-blue-600">{request.totalUnits} Units</p>
                    <p className="text-[9px] font-bold text-gray-400">{request.level} Level</p>
                  </div>
                  {expandedId === request.id ? <ChevronUp size={20} className="text-gray-300" /> : <ChevronDown size={20} className="text-gray-300" />}
                </div>
              </div>

              <AnimatePresence>
                {expandedId === request.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-5 pb-5 space-y-4"
                  >
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                        <Book size={10} /> Selected Courses
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {request.courses.map(course => (
                          <span key={course} className="bg-white border border-gray-200 px-2.5 py-1 rounded-lg text-[10px] font-black text-gray-700">
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => onReject(request.id)}
                        className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <X size={14} /> Reject
                      </button>
                      <button 
                        onClick={() => onApprove(request.id)}
                        className="flex-[2] py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-shadow shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                      >
                        <Check size={14} /> Approve Registration
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        ) : (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
              <ShieldCheck size={40} />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No pending applications found</p>
          </div>
        )}
      </div>
    </div>
  );
}
