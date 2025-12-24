/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Hero/HeroSection.tsx
'use client';
import { useState,  useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
import { FaShippingFast, FaRegCheckCircle } from 'react-icons/fa';
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

// Moving dots component with optimized performance
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
          className="absolute w-1.5 h-1.5 bg-fedex-purple/30 rounded-full"
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
    <div className="absolute inset-0 bg-[linear-linear(to_right,#f0f0f0_1px,transparent_1px),linear-linear(to_bottom,#f0f0f0_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-5" />
    <motion.div
      className="absolute inset-0 bg-linear-linear(45deg,transparent_30%,rgba(120,119,198,0.03)_50%,transparent_70%)"
      animate={{
        x: ['0%', '100%'],
      }}
      transition={{
        duration: 20,
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
    className="group relative p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 hover:border-fedex-purple/30 transition-all duration-300 hover:shadow-xl"
  >
    <div className="absolute inset-0 bg-linear-to-br from-fedex-purple/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative">
      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-fedex-purple to-fedex-blue flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <div className="text-white text-xl">{icon}</div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
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
    <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
    <div className="text-gray-600 text-sm">{label}</div>
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
      case 'out_for_delivery': return 'text-orange-600 bg-orange-100';
      case 'in_transit': return 'text-blue-600 bg-blue-100';
      case 'picked_up': return 'text-purple-600 bg-purple-100';
      case 'exception': return 'text-red-600 bg-red-100';
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
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    } catch {
      return 'Date not available';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="bg-linear-to-r from-fedex-purple to-fedex-blue p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <FiTruck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Package Tracking</h3>
              <p className="text-white/90 font-mono text-sm bg-white/10 px-3 py-1 rounded-lg mt-1 inline-block">
                {trackingData.trackingNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(trackingData.status)}`}>
              {trackingData.status.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Package Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <FiPackage className="w-5 h-5 text-fedex-purple" />
              <h4 className="text-lg font-bold text-gray-900">Package Details</h4>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Service', value: trackingData.service },
                { label: 'Recipient', value: trackingData.recipient },
                { label: 'Destination', value: trackingData.destination },
                { label: 'Estimated Delivery', value: formatDate(trackingData.estimatedDelivery) },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-semibold text-gray-900 text-right">{item.value}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <FiClock className="w-5 h-5 text-fedex-purple" />
              <h4 className="text-lg font-bold text-gray-900">Recent Activity</h4>
            </div>
            <div className="space-y-4">
              {trackingData.timeline.slice(0, 3).map((event, index) => {
                const StatusIcon = getStatusIcon(event.status);
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-fedex-purple/30 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(event.status)} shrink-0`}>
                      <StatusIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{event.description}</p>
                      <p className="text-xs text-gray-600 mt-1">{event.location}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(event.timestamp)}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-8 border-t border-gray-200">
          <motion.button
            onClick={onTrackAnother}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-6 py-4 bg-linear-to-r from-fedex-purple to-fedex-blue text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-3"
          >
            <FiSearch className="w-5 h-5" />
            <span>Track Another Package</span>
          </motion.button>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            Close Results
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Main Hero Section Component
export default function HeroSection(): React.ReactNode {
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const features = [
    {
      icon: <FiGlobe />,
      title: 'Global Network',
      description: 'Ship to 220+ countries with our extensive global network'
    },
    {
      icon: <FaShippingFast />,
      title: 'Express Delivery',
      description: 'Next-day delivery for time-sensitive shipments'
    },
    {
      icon: <FiShield />,
      title: 'Secure Shipping',
      description: 'Advanced tracking and security for every package'
    },
    {
      icon: <FiTrendingUp />,
      title: 'Reliable Service',
      description: '99% on-time delivery with real-time updates'
    }
  ];

  const stats: StatItem[] = [
    { 
      icon: FiMapPin, 
      value: '220+', 
      label: 'Countries Served',
      color: 'bg-fedex-purple' 
    },
    { 
      icon: FiClock, 
      value: '99%', 
      label: 'On-Time Delivery',
      color: 'bg-fedex-blue' 
    },
    { 
      icon: FiUsers, 
      value: '10M+', 
      label: 'Happy Customers',
      color: 'bg-fedex-orange' 
    }
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
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setIsTracking(true);
    setError('');
    setTrackingData(null);

    try {
      const result = await getTrackingDetails(trackingNumber);
      
      if (result.error) {
        setError(result.error);
      } else if (result.trackingDetails) {
        const transformedData = transformTrackingData(result.trackingDetails);
        setTrackingData(transformedData);
      }
    } catch (err) {
      setError('Failed to fetch tracking information');
      console.error('Tracking error:', err);
    } finally {
      setIsTracking(false);
    }
  };

  const navigateToTracking = (): void => {
    router.push('/tracking');
  };

  const handleCloseResults = (): void => {
    setTrackingData(null);
    setTrackingNumber('');
  };

  const handleTrackAnother = (): void => {
    setTrackingData(null);
    setTrackingNumber('');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-white via-gray-50 to-blue-50">
      {/* Background Elements */}
      <AnimatedGrid />
      <MovingDots />
      
      {/* linear Orbs */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-linear-to-r from-fedex-purple/10 to-fedex-blue/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-linear-to-r from-fedex-orange/10 to-fedex-purple/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.2, 0.4],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-20">
        <AnimatePresence mode="wait">
          {trackingData ? (
            <TrackingResults 
              trackingData={trackingData} 
              onClose={handleCloseResults}
              onTrackAnother={handleTrackAnother}
            />
          ) : (
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-fedex-purple/20 mb-8"
                >
                  <div className="w-2 h-2 bg-fedex-orange rounded-full animate-pulse" />
                  <span className="text-sm font-semibold text-fedex-purple">
                    Trusted Worldwide Since 1971
                  </span>
                  <FaRegCheckCircle className="w-4 h-4 text-fedex-blue" />
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
                >
                  Ship Smart,
                  <br />
                  <span className="bg-linear-to-r from-fedex-purple via-fedex-blue to-fedex-orange bg-clip-text text-transparent">
                    Deliver Fast
                  </span>
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl"
                >
                  Experience world-class shipping solutions with real-time tracking, 
                  secure delivery, and unparalleled customer service. Your journey begins here.
                </motion.p>

                {/* Tracking Form */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8"
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-2 border border-gray-200 max-w-2xl">
                    <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-2">
                      <div className="flex-1 relative">
                        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="Enter your tracking number"
                          className="w-full pl-12 pr-4 py-4 text-base border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-fedex-purple/30 bg-white placeholder-gray-400"
                          aria-label="Tracking number"
                        />
                      </div>
                      <motion.button
                        type="submit"
                        disabled={isTracking}
                        className={`px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 min-w-[140px] ${
                          isTracking 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-linear-to-r from-fedex-purple to-fedex-blue hover:shadow-lg'
                        } text-white transition-all`}
                        whileHover={!isTracking ? { scale: 1.02 } : {}}
                        whileTap={!isTracking ? { scale: 0.98 } : {}}
                      >
                        {isTracking ? (
                          <>
                            <div className="w-5 h-5 border-2 bg-purple-900 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Tracking...</span>
                          </>
                        ) : (
                          <>
                            <span>Track Now</span>
                            <FiArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </motion.button>
                    </form>

                    {/* Error Message */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
                        >
                          <FiShield className="w-4 h-4 text-red-500 shrink-0" />
                          <span className="text-red-700 text-sm">{error}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Alternative Option */}
                  <div className="mt-4 flex items-center space-x-3 text-sm text-gray-600">
                    <span>Don&apos;t have a tracking number?</span>
                    <button
                      onClick={navigateToTracking}
                      className="text-fedex-purple hover:text-fedex-blue font-semibold flex items-center space-x-1"
                    >
                      <span>View All Shipments</span>
                      <FiArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-2 gap-4 mb-8"
                >
                  {features.slice(0, 2).map((feature, index) => (
                    <FeatureCard
                      key={feature.title}
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                      delay={0.6 + index * 0.1}
                    />
                  ))}
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="grid grid-cols-3 gap-6"
                >
                  {stats.map((stat ) => (
                    <StatCard key={stat.label} {...stat} />
                  ))}
                </motion.div>
              </motion.div>

              {/* Right Content - Hero Image */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                {/* Main Image Container */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <div className="aspect-4/5 lg:aspect-square relative">
                    <Image
                      src="/fedex.jpeg"
                      alt="FedEx Global Delivery Network"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      priority
                    />
                    {/* linear Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="max-w-md"
                      >
                        <h3 className="text-3xl font-bold mb-3">
                          Your Global Logistics Partner
                        </h3>
                        <p className="text-white/90 mb-6">
                          Connecting businesses and people across continents with 
                          reliable shipping solutions.
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-fedex-purple rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                          <span>Explore Services</span>
                          <FiArrowRight className="w-5 h-5" />
                        </motion.button>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl border border-gray-200 z-10 max-w-56"
                  initial={{ opacity: 0, y: 20, x: -20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ delay: 0.9 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <FiClock className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Express Delivery</p>
                      <p className="text-sm text-gray-600">Next day available</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-2xl border border-gray-200 z-10 max-w-56"
                  initial={{ opacity: 0, y: 20, x: 20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ delay: 1 }}
                  whileHover={{ y: 5 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FiMapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Global Coverage</p>
                      <p className="text-sm text-gray-600">220+ countries</p>
                    </div>
                  </div>
                </motion.div>

                {/* Additional Feature Cards */}
                <motion.div
                  className="absolute top-1/4 -right-4 hidden lg:block"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <FiShield className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">Secure</p>
                        <p className="text-xs text-gray-600">Insured shipping</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll Indicator */}
      <AnimatePresence>
        {!trackingData && (
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.5 }}
          >
            <motion.div
              className="w-6 h-10 border-2 border-fedex-purple/30 rounded-full flex justify-center"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="w-1 h-3 bg-fedex-purple rounded-full mt-2"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}