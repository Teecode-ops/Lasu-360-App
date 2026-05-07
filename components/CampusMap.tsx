import React from 'react';
import { MapPin, Navigation as NavIcon, Search, Info, School, Building2, Coffee, Home as HomeIcon, ChevronRight, ChevronUp, ChevronDown, List } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CampusLocation } from '../types';

interface CampusMapProps {
  locations: CampusLocation[];
}

export function CampusMap({ locations }: CampusMapProps) {
  const [selected, setSelected] = React.useState<CampusLocation | null>(null);
  const [filter, setFilter] = React.useState<string>('All');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isListOpen, setIsListOpen] = React.useState(false);

  const categories = ['All', 'Academic', 'Admin', 'Recreation', 'Hostel'];
  const filteredLocations = locations
    .filter(l => filter === 'All' || l.category === filter)
    .filter(l => searchQuery === '' || l.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const getIcon = (cat: string) => {
    switch (cat) {
      case 'Academic': return <School size={16} />;
      case 'Admin': return <Building2 size={16} />;
      case 'Recreation': return <Coffee size={16} />;
      case 'Hostel': return <HomeIcon size={16} />;
      default: return <MapPin size={16} />;
    }
  };

  // Google Maps Embed URL for LASU Ojo
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15858.918!2d3.1850!3d6.4674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b879a83a00b6d%3A0x7d0a28f804595e1c!2sLagos%20State%20University!5e0!3m2!1sen!2sng!4v1714846567890!5m2!1sen!2sng`;

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-700 relative overflow-hidden bg-neutral-100">
      {/* Background Map View */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <iframe 
          src={mapUrl}
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          className="grayscale-[0.2] contrast-[1.1]"
        ></iframe>
      </div>

      {/* Control Buttons */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-3">
         <a 
           href="https://maps.app.goo.gl/hs66Y5G4KH2ExA5M7" 
           target="_blank" 
           rel="noopener noreferrer"
           className="bg-blue-600 text-white p-4 rounded-2xl shadow-2xl active:scale-95 transition-all block"
         >
            <NavIcon size={24} />
         </a>
         <button 
           onClick={() => setIsListOpen(prev => !prev)}
           className="bg-white text-gray-900 p-4 rounded-2xl shadow-2xl active:scale-95 transition-all border border-gray-100"
         >
            {isListOpen ? <ChevronDown size={24} /> : <List size={24} />}
         </button>
      </div>

      {/* Floating Panel (Bottom Sheet) */}
      <motion.div 
        initial={false}
        animate={{ 
          y: isListOpen ? 0 : 'calc(100% - 90px)',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute inset-x-0 bottom-0 z-30 bg-white/95 backdrop-blur-xl shadow-[0_-20px_50px_rgba(0,0,0,0.1)] rounded-t-[3rem] flex flex-col border-t border-white/50 h-[80vh]"
      >
        {/* Handle / Header */}
        <div 
          onClick={() => setIsListOpen(prev => !prev)}
          className="flex flex-col items-center pt-4 pb-6 cursor-pointer group"
        >
          <div className="w-12 h-1.5 bg-gray-200/50 rounded-full mb-6"></div>
          <div className="flex items-center px-8 w-full justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-800">Campus Venues</h3>
            <div className="bg-neutral-100 p-2 rounded-full text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
              {isListOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </div>
          </div>
        </div>

        {/* Content - Hidden when collapsed */}
        <div className={`flex-1 overflow-y-auto no-scrollbar px-6 pb-20 space-y-6 transition-all duration-500 ${isListOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
          {/* Search Bar */}
          <div>
            <div className="bg-neutral-100/50 rounded-2xl flex items-center px-4 py-1 border border-neutral-200/50">
              <Search className="text-gray-400" size={16} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find a building or venue..." 
                className="w-full bg-transparent border-none text-[12px] font-bold py-3 focus:ring-0 placeholder:text-gray-400 pl-3"
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  filter === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-neutral-100 text-gray-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-3">
             {filteredLocations.map((loc) => (
               <div 
                 key={loc.id} 
                 onClick={() => {
                   setSelected(loc);
                   // Optionally stay open or close depending on UI preference
                 }}
                 className={`p-5 rounded-[2rem] flex justify-between items-center transition-all cursor-pointer ${
                   selected?.id === loc.id ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-neutral-50 text-gray-800'
                 } shadow-xl border border-transparent`}
               >
                 <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${
                      selected?.id === loc.id ? 'bg-white/10' : 'bg-white text-blue-600 shadow-sm'
                    }`}>
                      {getIcon(loc.category)}
                    </div>
                    <div>
                      <h4 className="font-black tracking-tight leading-none mb-1">{loc.name}</h4>
                      <p className={`text-[10px] font-bold uppercase ${
                        selected?.id === loc.id ? 'text-blue-100' : 'text-gray-400'
                      }`}>{loc.category} • Ojo Campus</p>
                    </div>
                 </div>
                 <ChevronRight className={selected?.id === loc.id ? 'text-white' : 'text-gray-300'} size={20} />
               </div>
             ))}
          </div>

          {selected && (
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-neutral-900 p-8 rounded-[2.5rem] mt-6 text-white"
            >
               <div className="flex justify-between items-start mb-4">
                 <div>
                    <h4 className="text-2xl font-black">{selected.name}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">{selected.category}</p>
                 </div>
                 <button onClick={() => setSelected(null)} className="bg-white/10 p-2 rounded-full text-white">
                    <Info size={16} />
                 </button>
               </div>
               <p className="text-sm text-gray-400 leading-relaxed mb-6">{selected.description}</p>
               <a 
                 href={`https://www.google.com/maps/search/LASU+${encodeURIComponent(selected.name)}`}
                 target="_blank"
                 className="w-full bg-blue-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all"
               >
                  <NavIcon size={16} /> Navigate
               </a>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
