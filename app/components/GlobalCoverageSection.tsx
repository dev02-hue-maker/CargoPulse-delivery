/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Global/GlobalCoverageSection.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiGlobe, 
  FiMapPin, 
  FiUsers, 
  FiTruck,
  FiSearch,
  FiPlay,
  FiPause,
  FiActivity,
  FiCompass,
  FiServer
} from 'react-icons/fi';

interface Region {
  id: string;
  name: string;
  nodes: number;
  capacity: string;
  color: string;
  icon: string;
}

interface Country {
  name: string;
  cities: number;
  hubs: number;
  delivery: string;
  flag: string;
}

export default function GlobalCoverageSection() {
  const [activeRegion, setActiveRegion] = useState('americas');
  const [selectedCountry, setSelectedCountry] = useState<string | null>('United States');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const regions: Region[] = [
    { id: 'americas', name: 'Americas', nodes: 1250, capacity: '450k/day', color: 'from-slate-800 to-indigo-900', icon: '🌎' },
    { id: 'europe', name: 'Europe', nodes: 890, capacity: '380k/day', color: 'from-slate-800 to-teal-900', icon: '🏛️' },
    { id: 'asia', name: 'Asia Pacific', nodes: 1100, capacity: '520k/day', color: 'from-slate-800 to-rose-900', icon: '🗼' },
    { id: 'middleeast', name: 'Middle East', nodes: 720, capacity: '210k/day', color: 'from-slate-800 to-slate-900', icon: '🏜️' }
  ];

  const countries: Record<string, Country[]> = {
    americas: [
      { name: 'United States', cities: 350, hubs: 12, delivery: 'Next-Day Pulse', flag: '🇺🇸' },
      { name: 'Canada', cities: 85, hubs: 8, delivery: '24-48h', flag: '🇨🇦' },
      { name: 'Brazil', cities: 45, hubs: 6, delivery: 'Express Pulse', flag: '🇧🇷' },
    ],
    europe: [
      { name: 'Germany', cities: 92, hubs: 11, delivery: 'Intra-Euro Pulse', flag: '🇩🇪' },
      { name: 'United Kingdom', cities: 78, hubs: 9, delivery: 'Next-Day', flag: '🇬🇧' },
      { name: 'France', cities: 67, hubs: 8, delivery: 'Priority', flag: '🇫🇷' },
    ],
    asia: [
      { name: 'China', cities: 185, hubs: 15, delivery: 'Global Pulse', flag: '🇨🇳' },
      { name: 'Japan', cities: 78, hubs: 9, delivery: 'Priority', flag: '🇯🇵' },
      { name: 'Singapore', cities: 15, hubs: 3, delivery: 'Same-Day Hub', flag: '🇸🇬' },
    ],
    middleeast: [
      { name: 'UAE', cities: 12, hubs: 3, delivery: 'Priority Pulse', flag: '🇦🇪' },
      { name: 'Saudi Arabia', cities: 18, hubs: 4, delivery: 'Express', flag: '🇸🇦' },
      { name: 'Turkey', cities: 32, hubs: 6, delivery: 'Global Connect', flag: '🇹🇷' },
    ]
  };

  const globalStats = [
    { icon: FiGlobe, value: '220+', label: 'Global Corridors' },
    { icon: FiServer, value: '4,500+', label: 'Edge Pulse Nodes' },
    { icon: FiTruck, value: '680+', label: 'Asset Fleet' },
    { icon: FiActivity, value: '99.9%', label: 'Route Uptime' }
  ];

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = setInterval(() => {
        setActiveRegion(current => {
          const list = ['americas', 'europe', 'asia', 'middleeast'];
          return list[(list.indexOf(current) + 1) % list.length];
        });
      }, 3000);
    } else if (animationRef.current) clearInterval(animationRef.current);
    return () => { if (animationRef.current) clearInterval(animationRef.current); };
  }, [isPlaying]);

  const currentRegion = regions.find(r => r.id === activeRegion);
  const filteredCountries = (countries[activeRegion] || []).filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e293b,transparent)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="max-w-3xl mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center space-x-2 text-teal-400 font-bold tracking-[0.3em] uppercase text-xs mb-6">
            <FiCompass className="animate-spin-slow" />
            <span>Operational Network</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Global <span className="text-slate-500 italic">Distribution</span> Nodes.
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            Interconnected logistics architecture providing high-throughput delivery across 
            every primary trade corridor on the planet.
          </p>
        </motion.div>

        {/* Telemetry Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {globalStats.map((stat, i) => (
            <motion.div 
              key={i}
              className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-teal-500/50 transition-colors"
              whileHover={{ y: -5 }}
            >
              <stat.icon className="text-teal-400 mb-4" size={24} />
              <div className="text-3xl font-mono font-bold">{stat.value}</div>
              <div className="text-slate-500 text-xs font-black uppercase tracking-widest mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-black uppercase text-xs tracking-[0.2em] text-slate-500">Region Selection</h3>
                <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-slate-800 rounded-lg hover:text-teal-400 transition-colors">
                  {isPlaying ? <FiPause /> : <FiPlay />}
                </button>
              </div>
              <div className="space-y-2">
                {regions.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setActiveRegion(r.id)}
                    className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                      activeRegion === r.id ? 'bg-teal-500 border-teal-500 text-white font-bold' : 'bg-slate-800/50 border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span>{r.icon}</span>
                      <span className="text-sm">{r.name}</span>
                    </div>
                    <span className="text-[10px] opacity-60 font-mono">{r.capacity}</span>
                  </button>
                ))}
              </div>
              <div className="mt-6 relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Filter nodes..." 
                  className="w-full bg-slate-950 border-none rounded-xl p-4 pl-12 text-sm focus:ring-1 focus:ring-teal-500"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Map & Detail Area */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${currentRegion?.color}`} />
              <div className="p-10">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <h3 className="text-3xl font-black">{currentRegion?.name} Network</h3>
                    <p className="text-slate-500 text-sm mt-1">{currentRegion?.nodes} Active Pulse Nodes</p>
                  </div>
                  <div className="text-4xl grayscale opacity-50">{currentRegion?.icon}</div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <AnimatePresence mode="popLayout">
                    {filteredCountries.map((c, i) => (
                      <motion.button
                        key={c.name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => setSelectedCountry(c.name)}
                        className={`p-6 rounded-2xl border text-left transition-all ${
                          selectedCountry === c.name ? 'bg-slate-800 border-teal-500' : 'bg-slate-950 border-slate-800'
                        }`}
                      >
                        <div className="flex justify-between mb-4">
                          <span className="text-2xl">{c.flag}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-teal-400">{c.delivery}</span>
                        </div>
                        <div className="font-bold text-lg mb-1">{c.name}</div>
                        <div className="text-xs text-slate-500">{c.hubs} Main Distribution Hubs</div>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

           
          </div>
        </div>
      </div>
    </section>
  );
}