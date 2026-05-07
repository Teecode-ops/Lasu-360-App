import React from 'react';
import { Home, BookOpen, Clock, Map as MapIcon, GraduationCap, ShieldCheck, Calendar } from 'lucide-react';
import { Tab, UserRole } from '../types';

interface NavigationProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
  userRole?: UserRole;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange, userRole }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'courses', icon: BookOpen, label: 'Reg' },
    { id: 'timetable', icon: Clock, label: 'Schedule' },
    { id: 'results', icon: GraduationCap, label: 'Results' },
    { id: 'map', icon: MapIcon, label: 'Map' },
  ];

  // Define role-specific tabs
  if (userRole === 'hod') {
    tabs.push({ id: 'approvals', icon: ShieldCheck, label: 'Approvals' });
  } else if (userRole === 'hoc') {
    tabs.push({ id: 'schedule_manager', icon: Calendar, label: 'Class Rep' });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center z-40 max-w-md mx-auto shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as Tab)}
            className={`flex flex-col items-center gap-1.5 transition-all relative ${
              isActive ? 'text-blue-900' : 'text-gray-300'
            }`}
          >
            <div className={`p-1 transition-all ${isActive ? 'scale-110' : 'scale-100'}`}>
              <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-40'}`}>
              {tab.label}
            </span>
            {isActive && (
              <div className="absolute -top-4 w-6 h-1 bg-blue-900 rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
