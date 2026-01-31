/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Hero/HeroSection.tsx
'use client';
import { useState, useCallback } from 'react';
 import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiMapPin, 
  FiClock, 
  FiShield, 
  FiArrowRight, 
  FiCheck, 
  FiTruck, 
  FiPackage,
  FiGlobe,
  FiTrendingUp,
  FiUsers
} from 'react-icons/fi';
import { FaShippingFast } from 'react-icons/fa';
import { getTrackingDetails } from '@/lib/tracking';

// Types
interface DotPosition {
  left: number;
  top: number;
  duration: number;
  delay: number;
  key: number;
}

interface StatItem {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  color: string;
}

interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  location: string;
  timestamp: string;
  completed: boolean;
}

interface TrackingData {
  status: string;
  trackingNumber: string;
  service: string;
  estimatedDelivery: string;
  recipient: string;
  destination: string;
  sender: string;
  senderAddress: string;
  weight: string;
  dimensions: string;
  timeline: TrackingEvent[];
}

// Moving dots component with CargoPulse Colors (Teal/Slate)
const MovingDots: React.FC = () => {
  const dots: DotPosition[] = Array.from({ length: 40 }, (_, i) => {
    const left = (i * 7) % 100;
    const top = (i * 11) % 100;
    const duration = 3 + (i % 3);
    const delay = (i % 5) * 0.5;
    
    return { left, top, duration, delay, key: i };
  });

  return (
    <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
      {dots.map((dot) => (
        <motion.div
          key={dot.key}
          className="absolute w-1.5 h-1.5 bg-teal-500/30 rounded-full"
          style={{
            left: `${dot.left}%`,
            top: `${dot.top}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: dot.duration,
            repeat: Infinity,
            delay: dot.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Animated Background Grid
const AnimatedGrid: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-position-[4rem_4rem] opacity-10" />
    <motion.div
      className="absolute inset-0 bg-linear-to-r from-transparent via-teal-500/5 to-transparent"
      animate={{
        x: ['-100%', '100%'],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  </div>
);

// Feature Card Component
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}> = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="group relative p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 hover:border-teal-500/30 transition-all duration-300 hover:shadow-xl"
  >
    <div className="absolute inset-0 bg-linear-to-br from-teal-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative">
      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-slate-900 to-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <div className="text-white text-xl">{icon}</div>
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

// Stat Card Component
const StatCard: React.FC<StatItem> = ({ icon: Icon, value, label, color }) => (
  <motion.div
    className="text-center"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center mx-auto mb-3`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
    <div className="text-slate-600 text-sm">{label}</div>
  </motion.div>
);

// Tracking Results Component
const TrackingResults: React.FC<{ 
  trackingData: TrackingData; 
  onClose: () => void;
  onTrackAnother: () => void;
}> = ({ trackingData, onClose, onTrackAnother }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'out_for_delivery': return 'text-amber-600 bg-amber-100';
      case 'in_transit': return 'text-teal-600 bg-teal-100';
      case 'picked_up': return 'text-slate-600 bg-slate-100';
      case 'exception': return 'text-rose-600 bg-rose-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return FiCheck;
      case 'out_for_delivery': return FiTruck;
      case 'in_transit': return FiTruck;
      case 'picked_up': return FiPackage;
      case 'exception': return FiShield;
      default: return FiClock;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
      });
    } catch { return 'Processing...'; }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-w-4xl mx-auto"
    >
      <div className="bg-linear-to-r from-slate-900 to-teal-700 p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20">
              <FiTruck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">CargoPulse Tracking</h3>
              <p className="text-teal-100 font-mono text-sm bg-white/10 px-3 py-1 rounded-lg mt-1 inline-block">
                {trackingData.trackingNumber}
              </p>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(trackingData.status)}`}>
            {trackingData.status.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <FiPackage className="w-5 h-5 text-teal-600" />
              <h4 className="text-lg font-bold text-slate-900">Shipment Details</h4>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Service Level', value: trackingData.service },
                { label: 'Destination', value: trackingData.destination },
                { label: 'ETA', value: formatDate(trackingData.estimatedDelivery) },
              ].map((item) => (
                <div key={item.label} className="flex justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 text-sm">{item.label}</span>
                  <span className="font-semibold text-slate-900 text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <FiClock className="w-5 h-5 text-teal-600" />
              <h4 className="text-lg font-bold text-slate-900">Latest Updates</h4>
            </div>
            <div className="space-y-4">
              {trackingData.timeline.slice(0, 3).map((event) => {
                const StatusIcon = getStatusIcon(event.status);
                return (
                  <div key={event.id} className="flex items-start space-x-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(event.status)} shrink-0`}>
                      <StatusIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{event.description}</p>
                      <p className="text-xs text-slate-500">{event.location} • {formatDate(event.timestamp)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-8 border-t border-slate-100">
          <button onClick={onTrackAnother} className="flex-1 px-6 py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all flex items-center justify-center space-x-2">
            <FiSearch /> <span>Track Another</span>
          </button>
          <button onClick={onClose} className="px-6 py-4 border-2 border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50">
            Close
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function HeroSection(): React.ReactNode {
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [error, setError] = useState<string>('');
 
  const features = [
    { icon: <FiGlobe />, title: 'Global Network', description: 'Reaching 220+ territories via sea, air, and land.' },
    { icon: <FaShippingFast />, title: 'Express Logistics', description: 'Next-day priority delivery for critical cargo.' },
    { icon: <FiShield />, title: 'Cargo Protection', description: 'Real-time monitoring and full insurance coverage.' },
    { icon: <FiTrendingUp />, title: 'Smart Routes', description: 'AI-driven logistics for maximum efficiency.' }
  ];

  const stats: StatItem[] = [
    { icon: FiMapPin, value: '220+', label: 'Countries', color: 'bg-slate-900' },
    { icon: FiClock, value: '99.9%', label: 'On-Time', color: 'bg-teal-600' },
    { icon: FiUsers, value: '5M+', label: 'Clients', color: 'bg-rose-500' }
  ];

  const transformTrackingData = useCallback((trackingDetails: any): TrackingData => {
    const { package: pkg, events } = trackingDetails;
    return {
      status: pkg.status,
      trackingNumber: pkg.tracking_number,
      service: pkg.service_type,
      estimatedDelivery: pkg.estimated_delivery,
      recipient: pkg.recipient_name,
      destination: pkg.recipient_address,
      sender: pkg.sender_name,
      senderAddress: pkg.sender_address,
      weight: pkg.weight,
      dimensions: pkg.dimensions,
      timeline: events.map((event: any) => ({
        id: event.id,
        status: event.status,
        description: event.description,
        location: event.location,
        timestamp: event.event_timestamp,
        completed: new Date(event.event_timestamp) < new Date()
      })).sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    };
  }, []);

  const handleTrack = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!trackingNumber.trim()) { setError('Enter a valid tracking ID'); return; }
    setIsTracking(true); setError(''); setTrackingData(null);
    try {
      const result = await getTrackingDetails(trackingNumber);
      if (result.error) setError(result.error);
      else if (result.trackingDetails) setTrackingData(transformTrackingData(result.trackingDetails));
    } catch (err)
    
    { setError('System busy. Please try again.'); }
    finally { setIsTracking(false); }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50">
      <AnimatedGrid />
      <MovingDots />
      
      {/* Visual Accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-900/10 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
        <AnimatePresence mode="wait">
          {trackingData ? (
            <TrackingResults trackingData={trackingData} onClose={() => setTrackingData(null)} onTrackAnother={() => setTrackingNumber('')} />
          ) : (
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-200 mb-8">
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">CargoPulse Global</span>
                </div>

                <h1 className="text-5xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight">
                  Move World <br />
                  <span className="text-teal-600 italic">Faster.</span>
                </h1>

                <p className="text-xl text-slate-600 mb-8 max-w-xl">
                  The pulse of global commerce. We provide intelligent logistics solutions 
                  that keep your business moving across borders and time zones.
                </p>

                <div className="bg-white p-2 rounded-2xl shadow-2xl border border-slate-100 max-w-2xl mb-8">
                  <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 relative">
                      <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Enter CargoPulse ID..."
                        className="w-full pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-slate-50/50"
                      />
                    </div>
                    <button disabled={isTracking} className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-800 transition-all">
                      {isTracking ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Track</span> <FiArrowRight /></>}
                    </button>
                  </form>
                  {error && <p className="text-rose-600 text-xs mt-3 px-2 font-medium">! {error}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {features.slice(0, 2).map((f, i) => (
                    <FeatureCard key={f.title} {...f} delay={0.4 + i * 0.1} />
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {stats.map((s) => <StatCard key={s.label} {...s} />)}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative">
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
                  <div className="aspect-4/5 relative">
                    <Image
                      src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000"
                      alt="CargoPulse Logistics"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 p-8 text-white">
                      <h3 className="text-3xl font-bold mb-2">Total Visibility</h3>
                      <p className="text-slate-200 mb-6">From departure to doorstep, track every pulse of your shipment.</p>
                      <button className="px-6 py-3 bg-teal-500 rounded-xl font-bold hover:bg-teal-400 transition-colors">Start Shipping</button>
                    </div>
                  </div>
                </div>

                {/* Floating UI Elements */}
                <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl hidden md:flex items-center space-x-3 border border-slate-100">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600"><FiShield /></div>
                  <div><p className="text-xs font-bold text-slate-900">CargoInsure</p><p className="text-[10px] text-slate-500">Fully Protected</p></div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}