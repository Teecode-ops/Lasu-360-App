import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Navigation as NavIcon, Phone, Clock, ChevronRight, Filter } from 'lucide-react';
import { CampusLocation } from '../types';

interface CampusMapProps {
  locations: CampusLocation[];
}

export const CampusMap: React.FC<CampusMapProps> = ({ locations }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['Admin', 'Academic', 'Recreation', 'Hostel', 'Gate'];

  const filteredLocations = locations.filter(loc => {
    const matchesSearch = loc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         loc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? loc.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in duration-500">
      {/* Search Header */}
      <div className="p-6 pb-4 bg-white sticky top-0 z-20">
        <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase">Interactive Explorer</span>
        <h2 className="text-3xl font-black text-gray-900 tracking-tighter leading-tight mt-1 mb-6">Campus Directory</h2>
        
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search for buildings, halls, offices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none"
          />
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide -mx-6 px-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              selectedCategory === null 
                ? 'bg-blue-900 text-white shadow-lg shadow-blue-900/20' 
                : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
            }`}
          >
            All Areas
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                selectedCategory === cat 
                  ? 'bg-blue-900 text-white shadow-lg shadow-blue-900/20' 
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 px-6 pb-10 space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredLocations.map((loc, idx) => (
            <motion.div
              layout
              key={loc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className="p-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm flex items-start gap-4 hover:shadow-md transition-all active:scale-[0.98]"
            >
              <div className={`p-4 rounded-2xl shrink-0 ${
                loc.category === 'Admin' ? 'bg-blue-50 text-blue-600' :
                loc.category === 'Academic' ? 'bg-green-50 text-green-600' :
                loc.category === 'Hostel' ? 'bg-orange-50 text-orange-600' :
                'bg-purple-50 text-purple-600'
              }`}>
                <MapPin size={22} />
              </div>
              
              <div className="flex-1">
                 <div className="flex justify-between items-start mb-1">
                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">{loc.category}</span>
                    <div className="flex items-center gap-1 text-[8px] font-bold text-gray-300 uppercase">
                       <Clock size={8} /> Opens 8AM
                    </div>
                 </div>
                 <h4 className="text-base font-black text-gray-900 tracking-tight leading-none mb-1">{loc.name}</h4>
                 <p className="text-[10px] text-gray-500 font-medium leading-relaxed mb-4">{loc.description}</p>
                 
                 <div className="flex items-center gap-2">
                    <button className="flex-1 bg-blue-100/50 hover:bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-widest py-2 rounded-xl transition-colors flex items-center justify-center gap-2">
                       <NavIcon size={12} /> Get Directions
                    </button>
                    <button className="p-2 border border-gray-100 rounded-xl text-gray-300 hover:text-blue-600 hover:border-blue-100 transition-all">
                       <ChevronRight size={14} />
                    </button>
                 </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredLocations.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <Search size={24} className="text-gray-200" />
            </div>
            <p className="text-sm font-black text-gray-900 tracking-tight uppercase">No Locations Found</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Try a different building name or category.</p>
          </div>
        )}
      </div>

      {/* Quick Stats Overlay */}
      <div className="fixed bottom-24 right-6 pointer-events-none">
          <div className="bg-gray-900 text-white p-4 rounded-3xl shadow-2xl flex items-center gap-3 animate-bounce">
             <div className="w-2 h-2 bg-green-500 rounded-full"></div>
             <span className="text-[10px] font-black uppercase tracking-widest">Campus Open</span>
          </div>
      </div>
    </div>
  );
};
