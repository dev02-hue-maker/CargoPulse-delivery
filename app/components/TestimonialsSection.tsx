/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Testimonials/TestimonialsSection.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  FiStar, 
  FiChevronLeft, 
  FiChevronRight,
  FiPlay,
  FiActivity,
  FiCheckCircle,
  FiZap
} from 'react-icons/fi';
import { BsFillChatQuoteFill } from 'react-icons/bs';

interface Testimonial {
  id: number;
  name: string;
  position: string;
  industry: string;
  image: string;
  rating: number;
  text: string;
  stats: Array<{ value: string; label: string }>;
}

export default function TestimonialsSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [filter, setFilter] = useState('All');

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sarah Chen',
      position: 'CEO, Nexus Electronics',
      industry: 'Hardware',
      image: '/lady.jpg',
      rating: 5,
      text: 'CargoPulse Neural Supply Chain didn’t just optimize our shipping; it predicted our Q4 demand spikes with 94% accuracy. Our logistical overhead dropped by nearly half within two quarters.',
      stats: [
        { value: '45%', label: 'OpEx Reduction' },
        { value: '94%', label: 'Forecast Accuracy' },
        { value: '3.5x', label: 'Throughput' }
      ]
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      position: 'Logistics Director, BioFlow',
      industry: 'Healthcare',
      image: '/christian-buehner-DItYlc26zVI-unsplash.jpg',
      rating: 5,
      text: 'The cryogenic monitoring API is unparalleled. Moving life-saving pharmaceuticals across borders used to be a regulatory nightmare. Now, it is a streamlined, automated protocol.',
      stats: [
        { value: '100%', label: 'Compliance' },
        { value: '-196°C', label: 'Stability' },
        { value: '50+', label: 'Trade Hubs' }
      ]
    },
    {
      id: 3,
      name: 'Emily Watson',
      position: 'Operations VP, Velo Retail',
      industry: 'E-commerce',
      image: '/download-1.jpeg',
      rating: 5,
      text: 'We scaled from 1k to 50k monthly orders without hiring a single additional logistics coordinator. The CargoPulse infrastructure acts as an invisible, intelligent backbone for our growth.',
      stats: [
        { value: '0', label: 'Headcount Gain' },
        { value: '50k+', label: 'Orders/Mo' },
        { value: '99.9%', label: 'Uptime' }
      ]
    }
  ];

  const categories = ['All', 'Healthcare', 'Hardware', 'E-commerce'];
  const filtered = filter === 'All' ? testimonials : testimonials.filter(t => t.industry === filter);

  return (
    <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-2 text-teal-400 font-bold tracking-[0.3em] uppercase text-xs mb-4">
              <FiActivity className="animate-pulse" />
              <span>Neural Validation</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter">
              Verified <span className="text-slate-600 italic">Impact.</span>
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setFilter(cat); setActiveIdx(0); }}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all border ${
                  filter === cat ? 'bg-teal-500 border-teal-500 text-slate-950' : 'border-slate-800 text-slate-400 hover:border-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Testimonial Card */}
        <div className="relative min-h-[500px]">
          <AnimatePresence mode="wait">
            {filtered.length > 0 && (
              <motion.div
                key={filtered[activeIdx].id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="grid lg:grid-cols-12 bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl"
              >
                {/* Visual Side */}
                <div className="lg:col-span-5 relative h-80 lg:h-auto bg-slate-800">
                  <Image 
                    src={filtered[activeIdx].image} 
                    alt={filtered[activeIdx].name}
                    fill 
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent lg:bg-gradient-to-r" />
                  <div className="absolute bottom-8 left-8 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                      <FiPlay className="text-slate-950 translate-x-0.5" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-white">Full Briefing</span>
                  </div>
                </div>

                {/* Content Side */}
                <div className="lg:col-span-7 p-8 lg:p-16 flex flex-col justify-center">
                  <BsFillChatQuoteFill className="text-teal-500/20 text-5xl mb-8" />
                  
                  <blockquote className="text-2xl lg:text-3xl font-medium leading-tight mb-10 text-slate-200">
                    &ldquo;{filtered[activeIdx].text}&rdquo;
                  </blockquote>

                  <div className="flex items-center space-x-4 mb-12">
                    <div className="h-px w-12 bg-teal-500" />
                    <div>
                      <p className="font-black text-white text-lg">{filtered[activeIdx].name}</p>
                      <p className="text-teal-400 text-xs font-bold uppercase tracking-widest">{filtered[activeIdx].position}</p>
                    </div>
                  </div>

                  {/* Impact Grid */}
                  <div className="grid grid-cols-3 gap-8 pt-10 border-t border-slate-800">
                    {filtered[activeIdx].stats.map((stat, i) => (
                      <div key={i}>
                        <p className="text-2xl font-mono font-bold text-white">{stat.value}</p>
                        <p className="text-[10px] font-black uppercase tracking-tighter text-slate-500 mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nav Buttons */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-4">
            <button 
              onClick={() => setActiveIdx(prev => (prev === 0 ? filtered.length - 1 : prev - 1))}
              className="w-14 h-14 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center hover:border-teal-500 transition-colors shadow-xl"
            >
              <FiChevronLeft size={24} />
            </button>
            <button 
              onClick={() => setActiveIdx(prev => (prev + 1) % filtered.length)}
              className="w-14 h-14 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center hover:border-teal-500 transition-colors shadow-xl"
            >
              <FiChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Global Verification Footer */}
        <div className="mt-32 pt-16 border-t border-slate-900 flex flex-wrap justify-center gap-12 opacity-40 grayscale">
          {['ISO-9001 Certified', 'Neural Verified', 'GDPR Compliant', 'Carbon Trust'].map(badge => (
            <div key={badge} className="flex items-center space-x-2">
              <FiCheckCircle className="text-teal-500" />
              <span className="text-xs font-black uppercase tracking-widest">{badge}</span>
            </div>
          ))}
        </div>

        {/* Closing CTA */}
        <motion.div 
          className="mt-32 bg-gradient-to-br from-indigo-600 to-blue-800 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden"
          whileHover={{ y: -5 }}
        >
          <FiZap className="absolute top-10 right-10 text-white/10 text-9xl rotate-12" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h3 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">Ready to Deploy?</h3>
            <p className="text-xl text-blue-100 mb-10">
              Join the 1,200+ global enterprises architecting their logistics on CargoPulse.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-10 py-5 bg-white text-blue-700 rounded-2xl font-black text-sm hover:shadow-2xl transition-all">
                Initialize System Briefing
              </button>
              <button className="px-10 py-5 border-2 border-white/30 text-white rounded-2xl font-black text-sm hover:bg-white/10 transition-all">
                Explore Case Studies
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}