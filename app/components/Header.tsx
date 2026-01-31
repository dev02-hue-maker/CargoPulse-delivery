// components/Header/Header.tsx
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiMenu } from 'react-icons/fi';
import { FaBox, FaShippingFast, FaGlobeAmericas, FaBusinessTime } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Ship', icon: FaShippingFast, href: '/ship' },
    { name: 'Track', icon: FaBox, href: '/tracking' },
    { name: 'Services', icon: FaGlobeAmericas, href: '/services' },
    { name: 'Business', icon: FaBusinessTime, href: '/business' },
    { name: 'Support', href: '/support' },
  ];

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      router.push(`/tracking?trackingNumber=${encodeURIComponent(trackingNumber)}`);
    } else {
      router.push('/tracking');
    }
  };

  const navigateTo = (href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-slate-900 text-white text-sm py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></span>
            <span>CargoPulse Priority: Save 30% on global routes</span>
          </motion.div>
          <motion.button
            onClick={() => navigateTo('/offers')}
            className="font-medium hover:text-teal-400 transition-colors underline"
            whileHover={{ scale: 1.05 }}
          >
            View Offers
          </motion.button>
        </div>
      </div>

      {/* Main Navigation */}
      <motion.header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100' 
            : 'bg-white border-b border-gray-100'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            
            {/* Logo - Rebranded to CargoPulse */}
            <motion.div 
              className="flex items-center cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
              onClick={() => navigateTo('/')}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-teal-600 rounded-xl shadow-inner">
                  <span className="text-white font-black text-lg">CP</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-slate-900 tracking-tight leading-5">CargoPulse</span>
                  <span className="text-xs text-teal-600 font-bold tracking-widest uppercase">Delivery</span>
                </div>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <motion.button
                  key={item.name}
                  onClick={() => navigateTo(item.href)}
                  className="flex items-center space-x-2 px-4 py-3 rounded-lg font-semibold text-sm text-slate-600 hover:text-teal-600 hover:bg-teal-50/50 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.name}</span>
                </motion.button>
              ))}
            </nav>

            {/* Search and Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              <form onSubmit={handleTrack} className="relative">
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking ID..."
                  className="w-72 pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm bg-gray-50/50 transition-all"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              </form>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center space-x-2">
              <motion.button
                className="p-2 rounded-lg text-slate-600 hover:bg-gray-100"
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="lg:hidden bg-white border-t border-gray-100 shadow-2xl h-screen"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="px-4 py-6 space-y-2">
                <form onSubmit={handleTrack} className="relative mb-6">
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Track your delivery..."
                    className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
                  />
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </form>

                {navItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => navigateTo(item.href)}
                    className="flex items-center space-x-4 py-4 px-4 text-slate-700 hover:bg-teal-50 hover:text-teal-700 rounded-xl transition-all font-bold w-full text-left"
                  >
                    {item.icon && <item.icon className="w-5 h-5" />}
                    <span className="text-lg">{item.name}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}