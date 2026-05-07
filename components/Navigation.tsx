import React from 'react';
import { Home, Calendar, GraduationCap, Map, CreditCard, ShieldCheck, BookOpen, Contact, CheckSquare } from 'lucide-react';
import { Tab, UserRole } from '../types';
import { motion } from 'motion/react';

interface NavigationProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
  userRole?: UserRole;
}

export function Navigation({ currentTab, onTabChange, userRole }: NavigationProps) {
  const tabs: { id: Tab; icon: React.ReactNode; label: string; roles?: UserRole[] }[] = [
    { id: 'home', icon: <Home size={20} />, label: 'Home' },
    { id: 'approvals', icon: <CheckSquare size={20} />, label: 'Approvals', roles: ['hod', 'admin'] },
    { id: 'courses', icon: <BookOpen size={20} />, label: 'Registration', roles: ['student', 'hoc', 'admin'] },
    { id: 'timetable', icon: <Calendar size={20} />, label: 'Schedule', roles: ['student', 'hoc', 'admin'] },
    { id: 'map', icon: <Map size={20} />, label: 'Campus' },
    { id: 'admin', icon: <ShieldCheck size={20} />, label: 'Admin', roles: ['hoc', 'admin'] },
  ];

  const visibleTabs = tabs.filter(tab => !tab.roles || (userRole && tab.roles.includes(userRole)));

  return (
    <nav className="fixed bottom-0 w-full max-w-md bg-white/80 backdrop-blur-xl border-t border-gray-100/50 px-2 py-2 flex justify-around items-center z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      {visibleTabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center justify-center py-2 px-3 relative group"
          >
            {isActive && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 bg-blue-50/80 rounded-2xl z-0"
                transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
              />
            )}
            
            <motion.div
              animate={{ 
                scale: isActive ? 1.1 : 1,
                y: isActive ? -2 : 0
              }}
              className={`relative z-10 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}
            >
              {tab.icon}
            </motion.div>
            
            <span className={`text-[9px] font-black mt-1 uppercase tracking-tighter relative z-10 transition-colors ${
              isActive ? 'text-blue-700' : 'text-gray-400'
            }`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
