/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Services/ServicesSection.tsx
'use client';
import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  FiTruck, 
  FiClock, 
  FiGlobe, 
  FiPackage, 
  FiDollarSign, 
  FiShield,
  FiArrowRight,
  FiCheck,
  FiStar
} from 'react-icons/fi';

interface Service {
  id: number;
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  features: string[];
  price: string;
  deliveryTime: string;
  popular: boolean;
  color: string;
  rating?: number;
}

export default function ServicesSection() {
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<number | null>(null);

  const services: Service[] = [
    {
      id: 1,
      icon: FiClock,
      title: 'Pulse Priority',
      description: 'Our fastest delivery tier. Overnight and time-definite delivery for urgent packages with end-to-end priority handling.',
      features: ['Next Flight Out', 'Door-to-Door Delivery', 'Global Priority', 'Real-Time Pulse Tracking', 'Insurance Included'],
      price: 'From $500.00',
      deliveryTime: '1-2 Days',
      popular: true,
      color: 'from-teal-600 to-slate-900',
      rating: 4.9
    },
    {
      id: 2,
      icon: FiTruck,
      title: 'Pulse Ground',
      description: 'Reliable, cost-effective regional and nationwide delivery for everyday business and personal shipments.',
      features: ['Carbon-Neutral Path', 'Day-Definite Delivery', 'Nationwide Network', 'Pulse Dashboard Access', 'Flexible Drop-off'],
      price: 'From $1000.99',
      deliveryTime: '2-5 Days',
      popular: false,
      color: 'from-slate-700 to-slate-900',
      rating: 4.7
    },
    {
      id: 3,
      icon: FiGlobe,
      title: 'Global Pulse',
      description: 'Seamless international shipping with automated customs clearance and expert documentation support.',
      features: ['220+ Countries', 'Customs Pre-Clearance', 'Digital Documentation', 'Multi-Currency Billing', 'Landed Cost Calculator'],
      price: 'From $850.00',
      deliveryTime: '3-7 Days',
      popular: false,
      color: 'from-teal-500 to-teal-700',
      rating: 4.8
    },
    {
      id: 4,
      icon: FiPackage,
      title: 'Pulse Freight',
      description: 'Specialized heavyweight and palletized solutions for large-scale enterprise supply chain needs.',
      features: ['LTL & FTL Support', 'White-Glove Loading', 'Temperature Control', 'Dedicated Logistics Mgr', 'Liftgate Service'],
      price: 'Custom Quote',
      deliveryTime: '3-10 Days',
      popular: false,
      color: 'from-rose-500 to-rose-700',
      rating: 4.6
    },
    {
      id: 5,
      icon: FiDollarSign,
      title: 'Economy Pulse',
      description: 'Optimized for high-volume, non-urgent shipments where budget is the primary driver.',
      features: ['Lowest Market Rates', 'Standard Tracking', 'Weekly Pickups', 'Reliable Routing', 'Email Notifications'],
      price: 'From $1200.50',
      deliveryTime: '5-9 Days',
      popular: false,
      color: 'from-slate-400 to-slate-600',
      rating: 4.4
    },
    {
      id: 6,
      icon: FiShield,
      title: 'SecurePulse',
      description: 'Specialized handling for sensitive, high-value, or regulated items requiring extreme security.',
      features: ['Armored Transport', 'Biometric Chain of Custody', 'GPS Geo-fencing', 'Tamper-Proof Tech', 'Specialized Couriers'],
      price: 'Premium Rates',
      deliveryTime: 'Tailored',
      popular: false,
      color: 'from-amber-500 to-amber-700',
      rating: 5.0
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-10 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-96 h-96 bg-slate-900/5 rounded-full blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-6"
          >
            <span className="w-2 h-2 bg-teal-500 rounded-full mr-2 animate-pulse"></span>
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest">
              Global Logistics Engine
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            The <span className="text-teal-600">Pulse</span> of Modern Delivery
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            From overnight documents to heavy enterprise freight, CargoPulse offers 
            intelligent shipping solutions built for speed, transparency, and global reach.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              className={`relative bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 overflow-hidden group ${
                hoveredService && hoveredService !== service.id ? 'opacity-70 scale-[0.98]' : 'opacity-100'
              } ${selectedService === service.id ? 'ring-2 ring-teal-500' : ''}`}
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
              onClick={() => setSelectedService(service.id === selectedService ? null : service.id)}
            >
              {service.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 bg-rose-500 text-white text-[10px] font-black rounded-full shadow-lg flex items-center tracking-tighter uppercase">
                    <FiStar className="w-3 h-3 mr-1 fill-current" />
                    Market Choice
                  </span>
                </div>
              )}

              <div className={`relative h-36 bg-gradient-to-r ${service.color} p-8 flex flex-col justify-end`}>
                <div className="absolute top-6 left-6 w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-1">{service.title}</h3>
                  <div className="flex items-center space-x-2 text-white/80 text-xs font-medium uppercase tracking-wider">
                    <span>{service.price}</span>
                    <span className="opacity-40">•</span>
                    <span>{service.deliveryTime}</span>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <p className="text-slate-600 text-sm mb-8 leading-relaxed h-12 overflow-hidden">
                  {service.description}
                </p>

                <div className="space-y-4 mb-8">
                  {service.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-teal-50 rounded-full flex items-center justify-center shrink-0">
                        <FiCheck className="w-3 h-3 text-teal-600" />
                      </div>
                      <span className="text-xs text-slate-700 font-semibold">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-teal-600 transition-all flex items-center justify-center space-x-2">
                    <span>Select Tier</span>
                    <FiArrowRight />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}