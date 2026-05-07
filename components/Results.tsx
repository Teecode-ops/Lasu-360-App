import React from 'react';
import { Download, FileText, ChevronRight, TrendingUp, Award } from 'lucide-react';
import { Result, User } from '../types';
import jsPDF from 'jspdf';

interface ResultsProps {
  results: Result[];
  user: User;
}

export function Results({ results, user }: ResultsProps) {
  const gpa = user.cgpa;

  const exportToPDF = () => {
    const doc = jsPDF();
    doc.setFontSize(20);
    doc.text('LASU Student Academic Statement', 20, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${user.name} ${user.surname}`, 20, 35);
    doc.text(`Matric No: ${user.matricNumber}`, 20, 42);
    doc.text(`Department: ${user.department}`, 20, 49);
    doc.text(`CGPA: ${gpa.toFixed(2)}`, 20, 56);
    
    doc.line(20, 65, 190, 65);
    doc.text('Course', 20, 75);
    doc.text('Units', 70, 75);
    doc.text('Grade', 100, 75);
    doc.text('Semester', 130, 75);

    results.forEach((res, i) => {
      const y = 85 + i * 10;
      doc.text(res.courseCode, 20, y);
      doc.text(res.units.toString(), 75, y);
      doc.text(res.grade, 105, y);
      doc.text(res.semester, 130, y);
    });

    doc.save(`LASU_Results_${user.matricNumber}.pdf`);
  };

  return (
    <div className="p-5 space-y-6 animate-in slide-in-from-bottom duration-500">
      {/* Header Stat */}
      <div className="bg-neutral-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="flex justify-between items-center mb-6">
           <Award className="text-yellow-400" size={32} />
           <button 
             onClick={exportToPDF}
             className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
           >
             <Download size={16} /> Export PDF
           </button>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300">Total Academic Progress</p>
        <div className="flex items-baseline gap-2">
          <h2 className="text-6xl font-black">{gpa.toFixed(2)}</h2>
          <span className="text-sm font-bold text-blue-400">/ 5.00</span>
        </div>
        <div className="mt-6 h-2 w-full bg-white/10 rounded-full overflow-hidden">
           <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(gpa / 5) * 100}%` }}></div>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">
           <span>Course Record</span>
           <span>Grade</span>
        </div>

        <div className="space-y-3">
          {results.map((res) => (
            <div key={res.id} className="bg-white p-5 rounded-3xl shadow-lg shadow-neutral-100 flex justify-between items-center group hover:bg-neutral-50 transition-colors border border-neutral-50">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center text-neutral-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                     <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-800 tracking-tight">{res.courseCode}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{res.semester} • {res.units} Units</p>
                  </div>
               </div>
               <div className="text-right">
                  <div className={`text-xl font-black ${
                    res.grade === 'A' ? 'text-green-500' : res.grade === 'B' ? 'text-blue-500' : 'text-orange-500'
                  }`}>
                    {res.grade}
                  </div>
                  <p className="text-[10px] font-black text-neutral-300 uppercase tracking-tighter">{res.score}/100</p>
               </div>
            </div>
          ))}

          {results.length === 0 && (
            <div className="py-20 text-center opacity-40">
               <TrendingUp size={48} className="mx-auto mb-4" />
               <p className="text-sm font-bold uppercase tracking-widest leading-none">No results uploaded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
