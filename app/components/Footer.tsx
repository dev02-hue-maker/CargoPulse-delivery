/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Footer/Footer.tsx
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMail, FiPhone, FiMapPin, FiChevronDown, FiChevronUp, 
  FiGlobe, FiArrowUp, FiTerminal, FiCpu, FiShield, FiLink2,
  FiLinkedin, FiGithub, FiTwitter
} from 'react-icons/fi';

export default function Footer() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const footerSections = [
    {
      title: 'Infrastructure',
      links: [
        { name: 'Neural Routing', url: '#' },
        { name: 'Edge Node Status', url: '#' },
        { name: 'API Documentation', url: '#' },
        { name: 'Freight Protocol', url: '#' },
        { name: 'Global Corridors', url: '#' }
      ]
    },
    {
      title: 'Solutions',
      links: [
        { name: 'Pharma Cold-Chain', url: '#' },
        { name: 'Hardware Logistics', url: '#' },
        { name: 'Enterprise API', url: '#' },
        { name: 'Last-Mile Automation', url: '#' }
      ]
    },
    {
      title: 'Governance',
      links: [
        { name: 'Privacy Protocol', url: '#' },
        { name: 'Compliance Cloud', url: '#' },
        { name: 'Trade Security', url: '#' },
        { name: 'Sustainability Node', url: '#' }
      ]
    }
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 relative border-t border-slate-900 pt-20 pb-10">
      {/* Back to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-10 right-10 z-50 w-12 h-12 bg-teal-500 text-slate-950 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
          >
            <FiArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center space-x-3 text-white">
              <div className="p-2 bg-teal-500/10 border border-teal-500/50 rounded-lg">
                <FiCpu className="text-teal-400 text-xl" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase">Cargo<span className="text-teal-400 italic">Pulse</span></span>
            </div>
            
            <p className="text-sm leading-relaxed max-w-sm">
              The world’s first neural-driven logistics operating system. Architecting the future of high-throughput global distribution.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 group cursor-pointer">
                <FiPhone className="text-teal-500" />
                <span className="text-sm font-mono group-hover:text-white transition-colors">+1.800.PULSE.SYS</span>
              </div>
              <div className="flex items-center space-x-3 group cursor-pointer">
                <FiMail className="text-teal-500" />
                <span className="text-sm font-mono group-hover:text-white transition-colors">ops@cargopulse.sh</span>
              </div>
            </div>

            <div className="flex space-x-4">
              {[FiLinkedin, FiGithub, FiTwitter].map((Icon, i) => (
                <a key={i} href="#" className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-teal-500 hover:text-white transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav Links */}
          <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-8">
            {footerSections.map((section) => (
              <div key={section.title} className="hidden md:block">
                <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-6">{section.title}</h3>
                <ul className="space-y-4">
                  {section.links.map(link => (
                    <li key={link.name}>
                      <a href={link.url} className="text-sm hover:text-teal-400 transition-colors">{link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            
            {/* Mobile Accordion */}
            <div className="col-span-2 md:hidden space-y-2">
              {footerSections.map(section => (
                <div key={section.title} className="border-b border-slate-900">
                  <button 
                    onClick={() => toggleSection(section.title)}
                    className="w-full py-4 flex justify-between text-xs font-black tracking-widest uppercase text-white"
                  >
                    {section.title}
                    {openSections[section.title] ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  <AnimatePresence>
                    {openSections[section.title] && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pb-4 space-y-2"
                      >
                        {section.links.map(link => (
                          <a key={link.name} href="#" className="block text-sm py-1">{link.name}</a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* System Status/Newsletter */}
          <div className="lg:col-span-3">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
              <div className="flex items-center space-x-2 text-teal-400 text-xs font-black uppercase mb-4">
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
                <span>Global System Status: Operational</span>
              </div>
              <h4 className="text-white font-bold mb-4">Subscribe to Dev Briefs</h4>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="admin@enterprise.com" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:ring-1 focus:ring-teal-500 outline-none mb-3"
                />
                <button className="w-full bg-teal-500 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-widest hover:bg-teal-400 transition-colors">
                  Authorize Access
                </button>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800/50">
              <div className="flex items-center space-x-2">
                <FiGlobe className="text-slate-500" />
                <span className="text-xs">System Region</span>
              </div>
              <select className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer">
                <option>NA-EAST-1</option>
                <option>EU-WEST-2</option>
                <option>AP-SOUTH-1</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-mono uppercase tracking-[0.1em] text-slate-600">
            © 2026 CargoPulse OS. All Rights Reserved. Build: v4.2.0-stable
          </div>
          
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest">
              <FiShield className="text-teal-500" />
              <span>AES-256 Encrypted</span>
            </div>
            <div className="flex space-x-4 text-[10px] font-bold">
              <a href="#" className="hover:text-white">Security</a>
              <a href="#" className="hover:text-white">Legal</a>
              <a href="#" className="hover:text-white">SLA</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}