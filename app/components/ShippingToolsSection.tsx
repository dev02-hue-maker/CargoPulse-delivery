 // components/Tools/ShippingToolsSection.tsx
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMapPin, 
   FiDollarSign,
  FiPackage,
   FiClock,
  FiSearch,
 
  FiCheck,
  FiBox,
  FiBarChart2
} from 'react-icons/fi';
import React from 'react';
 
export default function ShippingToolsSection() {
  const [activeTool, setActiveTool] = useState('rate');
  const [copiedTool, setCopiedTool] = useState<string | null>(null);

  // Rate Calculator State
  const [rateData, setRateData] = useState({
    from: '',
    to: '',
    weight: '',
    dimensions: { length: '', width: '', height: '' },
    service: 'pulse_priority'
  });

 

  // Time-in-Transit State
  const [transitData, setTransitData] = useState({
    from: '',
    to: '',
    shipDate: new Date().toISOString().split('T')[0],
    service: 'pulse_priority'
  });

  const tools = [
    {
      id: 'rate',
      icon: FiDollarSign,
      title: 'Quote Engine',
      description: 'Instant commercial rate estimation',
      color: 'from-teal-600 to-slate-900'
    },
    {
      id: 'location',
      icon: FiMapPin,
      title: 'Pulse Hub Finder',
      description: 'Locate nearest drop-off points',
      color: 'from-slate-700 to-slate-900'
    },
    {
      id: 'transit',
      icon: FiClock,
      title: 'Transit Predictor',
      description: 'Route duration & telemetry data',
      color: 'from-rose-500 to-rose-700'
    },
    {
      id: 'tools',
      icon: FiBox,
      title: 'Supply Chain Labs',
      description: 'Advanced logistics utilities',
      color: 'from-indigo-600 to-indigo-800'
    }
  ];

  const services = [
    { id: 'pulse_priority', name: 'Pulse Priority', delivery: 'Next-Day Delivery' },
    { id: 'pulse_ground', name: 'Pulse Ground', delivery: '2-4 Business Days' },
    { id: 'global_pulse', name: 'Global Pulse', delivery: '3-6 Business Days' },
    { id: 'pulse_freight', name: 'Pulse Freight', delivery: '5-9 Business Days' }
  ];

 

  const calculateRate = () => {
    const baseRates = { pulse_priority: 500.00, pulse_ground: 1000.99, global_pulse: 850.50, pulse_freight: 1200.00 };
    const weightMultiplier = parseFloat(rateData.weight) || 1;
    const serviceRate = baseRates[rateData.service as keyof typeof baseRates] || 0;
    return (serviceRate * weightMultiplier).toFixed(2);
  };
 

  

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center space-x-2 text-teal-600 font-bold tracking-widest uppercase text-xs mb-4">
            <FiBarChart2 />
            <span>Operational Excellence</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            Logistics <span className="text-slate-400">Toolkit.</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
            Proprietary algorithms designed to optimize your supply chain. Access real-time 
            pricing, route mapping, and distribution telemetry.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Navigation */}
          <div className="lg:col-span-4 space-y-4">
            {tools.map((tool) => (
              <motion.button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`w-full flex items-center justify-between p-6 rounded-[1.5rem] border transition-all text-left ${
                  activeTool === tool.id
                    ? 'bg-slate-900 border-slate-900 text-white shadow-2xl shadow-slate-200'
                    : 'bg-white border-slate-100 text-slate-600 hover:border-teal-200'
                }`}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${activeTool === tool.id ? 'bg-teal-500' : 'bg-slate-50'}`}>
                    <tool.icon className={activeTool === tool.id ? 'text-white' : 'text-slate-400'} />
                  </div>
                  <div>
                    <p className="font-bold text-sm leading-none mb-1">{tool.title}</p>
                    <p className={`text-[11px] ${activeTool === tool.id ? 'text-teal-200' : 'text-slate-400'}`}>{tool.description}</p>
                  </div>
                </div>
                {activeTool === tool.id && <FiCheck className="text-teal-400" />}
              </motion.button>
            ))}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-8">
            <motion.div
              layout
              className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 min-h-[500px]"
            >
              <AnimatePresence mode="wait">
                {activeTool === 'rate' && (
                  <motion.div
                    key="rate"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="grid md:grid-cols-2 gap-12"
                  >
                    <div className="space-y-6">
                      <h4 className="text-2xl font-black text-slate-900">Rate Calculator</h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Origin ZIP</label>
                            <input type="text" placeholder="10001" className="w-full p-4 bg-white rounded-xl border-none focus:ring-2 focus:ring-teal-500 font-bold" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Dest ZIP</label>
                            <input type="text" placeholder="90210" className="w-full p-4 bg-white rounded-xl border-none focus:ring-2 focus:ring-teal-500 font-bold" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Service Tier</label>
                          <select 
                            value={rateData.service}
                            onChange={(e) => setRateData({...rateData, service: e.target.value})}
                            className="w-full p-4 bg-white rounded-xl border-none focus:ring-2 focus:ring-teal-500 font-bold appearance-none"
                          >
                            {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Weight (KG)</label>
                          <input 
                            type="number" 
                            onChange={(e) => setRateData({...rateData, weight: e.target.value})}
                            placeholder="5.0" 
                            className="w-full p-4 bg-white rounded-xl border-none focus:ring-2 focus:ring-teal-500 font-bold" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900 rounded-4xl p-8 text-white flex flex-col justify-between">
                      <div>
                        <p className="text-teal-400 text-xs font-black uppercase tracking-widest mb-6">Est. Commercial Quote</p>
                        <h5 className="text-5xl font-mono font-bold mb-2">${calculateRate()}</h5>
                        <p className="text-slate-400 text-xs font-medium">Includes standard Pulse insurance and fuel surcharge.</p>
                      </div>
                      <div className="space-y-3 mt-8">
                        <button className="w-full py-4 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-400 transition-colors">Book Shipment</button>
                        <button className="w-full py-4 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-colors">Save for Later</button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTool === 'location' && (
                  <motion.div
                    key="location"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                  >
                    <div className="flex justify-between items-end">
                      <div className="space-y-2">
                        <h4 className="text-2xl font-black text-slate-900">Network Map</h4>
                        <p className="text-slate-500 text-sm">Find the closest Pulse-validated intake point.</p>
                      </div>
                      <div className="flex space-x-2">
                        <input type="text" placeholder="ZIP or City" className="p-4 bg-white rounded-xl border-none shadow-sm font-bold text-sm w-48" />
                        <button className="p-4 bg-slate-900 text-white rounded-xl hover:bg-teal-500 transition-all"><FiSearch /></button>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="p-6 bg-white rounded-2xl border border-slate-100 flex items-start space-x-4 hover:border-teal-300 transition-colors cursor-pointer">
                          <div className="p-3 bg-slate-50 rounded-lg text-teal-600"><FiMapPin /></div>
                          <div>
                            <p className="font-bold text-slate-900">CargoPulse Hub NYC-{i}0{i}</p>
                            <p className="text-xs text-slate-400 mt-1">42nd St Manhattan • 0.8 mi</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Simplified Transit & Additional Tools follow same structural pattern */}
                {(activeTool === 'transit' || activeTool === 'tools') && (
                   <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                        <FiPackage size={40} />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900">Module Initializing</h4>
                      <p className="text-slate-400 max-w-xs">Accessing global transit telemetry database. Please ensure your enterprise credentials are active.</p>
                   </div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}