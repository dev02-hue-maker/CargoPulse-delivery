/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Business/BusinessSolutionsSection.tsx
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiGlobe, 
  FiShield, 
  FiDatabase,
  FiBarChart,
  FiUsers,
  FiShoppingCart,
  FiCloud,
  FiCheck,
  FiPlay,
  FiCpu,
  FiLayers
} from 'react-icons/fi';

export default function BusinessSolutionsSection() {
  const [activeSolution, setActiveSolution] = useState('ecommerce');
  const [videoPlaying, setVideoPlaying] = useState(false);

  const solutions = [
    {
      id: 'ecommerce',
      icon: FiShoppingCart,
      title: 'Global E-Commerce',
      description: 'Enterprise scaling for digital storefronts',
      color: 'from-teal-500 to-emerald-600',
      features: [
        'Neural order routing',
        'Direct-to-consumer fulfillment',
        'Cross-border tax automation',
        'Circular returns logic'
      ]
    },
    {
      id: 'supplychain',
      icon: FiLayers,
      title: 'Neural Supply Chain',
      description: 'End-to-end predictive logistics',
      color: 'from-blue-600 to-indigo-700',
      features: [
        'AI inventory placement',
        'Autonomous warehouse sync',
        'Demand-responsive scaling',
        'Resilience analytics'
      ]
    },
    {
      id: 'international',
      icon: FiGlobe,
      title: 'Global Compliance',
      description: 'Frictionless international trade',
      color: 'from-rose-500 to-pink-600',
      features: [
        'Algorithmic customs clearing',
        'Digital twin tracking',
        'HTS code automation',
        'Trade corridor optimization'
      ]
    },
    {
      id: 'enterprise',
      icon: FiCpu,
      title: 'API & Infrastructure',
      description: 'Deep-stack logistics integration',
      color: 'from-slate-600 to-slate-800',
      features: [
        'Dedicated cluster hosting',
        'High-throughput webhooks',
        'Raw telemetry access',
        'Custom protocol support'
      ]
    }
  ];

  const caseStudies = [
    {
      company: 'OmniTech Systems',
      industry: 'Hardware SaaS',
      challenge: 'Global distribution of high-value hardware with 0% margin for error',
      solution: 'Deployed CargoPulse Neural Supply Chain with biometrically secured transport',
      results: [
        { metric: '22%', label: 'OpEx reduction' },
        { metric: '0.01%', label: 'Loss rate' },
        { metric: '60ms', label: 'API Latency' }
      ]
    },
    {
      company: 'BioFlow Research',
      industry: 'Life Sciences',
      challenge: 'Cryogenic asset relocation across strict regulatory borders',
      solution: 'Active-Pulse monitoring with real-time regulatory handshakes',
      results: [
        { metric: '100%', label: 'Audit compliance' },
        { metric: '-196°C', label: 'Stable Temp' },
        { metric: '24/7', label: 'Escort Monitoring' }
      ]
    }
  ];

  const currentSolution = solutions.find(s => s.id === activeSolution);

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Structural Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-teal-500/20 to-transparent" />
        <div className="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent" />
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-teal-500/20 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="max-w-3xl mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center space-x-2 text-teal-400 font-bold tracking-[0.3em] uppercase text-xs mb-6">
            <FiShield className="animate-pulse" />
            <span>Industrial Grade Solutions</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
            Architecting <span className="text-slate-600 italic">Tomorrow&apos;s</span> Flow.
          </h2>
          <p className="text-xl text-slate-400 leading-relaxed">
            From hyper-growth startups to Fortune 100 entities, CargoPulse provides the 
            infrastructure to move atoms at the speed of bits.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            {solutions.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSolution(s.id)}
                className={`w-full group relative p-6 rounded-2xl border transition-all text-left overflow-hidden ${
                  activeSolution === s.id 
                  ? 'bg-slate-900 border-teal-500/50 shadow-[0_0_30px_rgba(20,184,166,0.1)]' 
                  : 'bg-transparent border-slate-800 hover:border-slate-700'
                }`}
              >
                {activeSolution === s.id && (
                  <motion.div 
                    layoutId="activeGlow" 
                    className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-transparent pointer-events-none" 
                  />
                )}
                <div className="flex items-center space-x-4 relative z-10">
                  <div className={`p-3 rounded-xl transition-colors ${
                    activeSolution === s.id ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                  }`}>
                    <s.icon size={24} />
                  </div>
                  <div>
                    <h4 className={`font-bold transition-colors ${activeSolution === s.id ? 'text-white' : 'text-slate-400'}`}>
                      {s.title}
                    </h4>
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mt-1">{s.description}</p>
                  </div>
                </div>
              </button>
            ))}

            <div className="mt-8 p-8 rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white">
              <h5 className="text-lg font-black mb-2">Enterprise Inquiry</h5>
              <p className="text-indigo-100 text-xs mb-6 leading-relaxed">Connect with our solutions architecture team for custom volume pricing.</p>
              <button className="w-full py-4 bg-white text-indigo-600 rounded-xl font-black text-sm hover:shadow-xl transition-all">
                Request Briefing
              </button>
            </div>
          </div>

          {/* Main Display Area */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSolution}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${currentSolution?.color}`} />
                <div className="p-10">
                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-3xl font-black text-white mb-4">{currentSolution?.title}</h3>
                        <p className="text-slate-400 leading-relaxed">{currentSolution?.description}</p>
                      </div>
                      <div className="space-y-3">
                        {currentSolution?.features.map((f, i) => (
                          <div key={i} className="flex items-center space-x-3 text-sm font-bold text-slate-300">
                            <FiCheck className="text-teal-400" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-950 rounded-3xl p-8 border border-slate-800 flex flex-col justify-center text-center">
                       <div className="w-20 h-20 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                          <FiPlay className="text-teal-400 translate-x-1" size={32} />
                       </div>
                       <h5 className="text-white font-bold mb-2">System Demo</h5>
                       <p className="text-slate-500 text-xs mb-6 px-4">See how our control tower visualizes {currentSolution?.title} workflows in real-time.</p>
                       <button className="mx-auto px-6 py-3 border border-slate-700 rounded-xl text-slate-300 text-xs font-black hover:bg-slate-800 transition-colors">
                         Launch Viewer
                       </button>
                    </div>
                  </div>

                  {/* Impact Stats */}
                  <div className="mt-12 pt-10 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { l: 'Efficiency', v: '+42%' },
                      { l: 'Carbon Footprint', v: '-18%' },
                      { l: 'Accuracy', v: '99.9%' },
                      { l: 'Latency', v: '<200ms' }
                    ].map((stat, i) => (
                      <div key={i} className="text-center md:text-left">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.l}</p>
                        <p className="text-xl font-mono font-bold text-white">{stat.v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Case Study Section */}
        <div className="mt-32">
          <h3 className="text-2xl font-black text-white mb-12 flex items-center space-x-3">
            <FiTrendingUp className="text-rose-500" />
            <span>Industrial Success Stories</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {caseStudies.map((cs, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-slate-900 border border-slate-800 p-10 rounded-[2rem] group transition-all hover:border-slate-600"
              >
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-rose-500 font-black text-[10px] uppercase tracking-widest mb-1">{cs.industry}</p>
                    <h4 className="text-2xl font-black text-white">{cs.company}</h4>
                  </div>
                  <FiBarChart className="text-slate-700 group-hover:text-teal-400 transition-colors" size={32} />
                </div>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed italic border-l-2 border-slate-800 pl-4">
                  &quot;{cs.challenge}&quot;
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {cs.results.map((r, idx) => (
                    <div key={idx}>
                      <p className="text-xl font-mono font-bold text-white">{r.metric}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">{r.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}