/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Tracking/TrackingSection.tsx
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiMapPin, 
  FiCopy,
  FiPackage,
  FiActivity,
  FiShield,
  FiCheck,
  FiClock,
  FiTruck,
  FiUser,
  FiCalendar,
  FiTag,
  FiAlertCircle,
  FiDroplet,
  FiX,
  FiGlobe,
  FiNavigation,
  FiHome,
  FiBriefcase,
  FiBox,
  FiFileText,
  FiImage,
  FiChevronRight,
  FiChevronDown,
  FiEye
} from 'react-icons/fi';
import { FaFireFlameCurved, FaWeightHanging, FaRulerCombined } from 'react-icons/fa6';
import { getTrackingDetails } from '@/lib/tracking';
import WorldMap from './WorldMap';

interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  location: string;
  location_country?: string;
  location_city?: string;
  event_timestamp: string;
  completed?: boolean;
}

interface PackageImage {
  id: string;
  image_url: string;
  image_type: string;
  is_primary: boolean;
}

interface TrackingPackage {
  tracking_number: string;
  status: string;
  service_type: string;
  service_category?: string;
  service_level?: string;
  recipient_name: string;
  recipient_address: string;
  recipient_city?: string;
  recipient_country?: string;
  sender_name: string;
  sender_address: string;
  sender_city?: string;
  sender_country?: string;
  origin_country?: string;
  origin_city?: string;
  origin_country_name?: string;
  origin_coordinates?: { lat: number; lng: number };
  current_country?: string;
  current_city?: string;
  current_country_name?: string;
  current_coordinates?: { lat: number; lng: number };
  destination_country?: string;
  destination_city?: string;
  destination_country_name?: string;
  destination_coordinates?: { lat: number; lng: number };
  package_type?: string;
  pieces?: number;
  weight?: string;
  dimensions?: string;
  special_handling?: string[];
  reference_numbers?: Record<string, string>;
  is_fragile?: boolean;
  is_perishable?: boolean;
  is_hazardous?: boolean;
  contents_description?: string;
  department?: string;
  project_code?: string;
  estimated_delivery?: string;
  actual_delivery?: string;
  created_at: string;
  updated_at: string;
  location_history?: any[];
  images?: PackageImage[];
  timeline?: TrackingEvent[];
}

export default function TrackingSection() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingPackage | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentTrackingSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError('Please enter a valid CargoPulse tracking number');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      console.log("[TrackingSection] 🔍 Fetching tracking details for:", trackingNumber);
      const result = await getTrackingDetails(trackingNumber);
      
      if (result.error) {
        console.error("[TrackingSection] ❌ Error:", result.error);
        setError(result.error);
      } else if (result.trackingDetails) {
        console.log("[TrackingSection] ✅ Data received:", {
          tracking: result.trackingDetails.package.tracking_number,
          events: result.trackingDetails.events.length,
          images: result.trackingDetails.images?.length,
          current: result.trackingDetails.package.current_country_name,
          destination: result.trackingDetails.package.destination_country_name
        });
        
        // Transform the data
        const transformed = transformTrackingData(result.trackingDetails);
        setTrackingData(transformed);
        
        // Save to recent searches
        const updated = [trackingNumber, ...recentSearches.filter(t => t !== trackingNumber)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recentTrackingSearches', JSON.stringify(updated));
      }
    } catch (err) {
      console.error("[TrackingSection] 💥 Unexpected error:", err);
      setError('Unable to retrieve tracking information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const transformTrackingData = (trackingDetails: any): TrackingPackage => {
    const { package: pkg, events, images } = trackingDetails;
    
    // Sort events chronologically
    const sortedEvents = [...events].sort((a, b) => 
      new Date(b.event_timestamp).getTime() - new Date(a.event_timestamp).getTime()
    );
    
    return {
      ...pkg,
      timeline: sortedEvents.map((event: any) => ({
        ...event,
        completed: new Date(event.event_timestamp) <= new Date()
      })),
      images: images || []
    };
  };

  const copyTrackingNumber = () => {
    if (trackingData?.tracking_number) {
      navigator.clipboard.writeText(trackingData.tracking_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusStyle = (status: string) => {
    const map: Record<string, { bg: string; text: string; border: string; icon: string }> = {
      delivered: { 
        bg: 'bg-emerald-50', 
        text: 'text-emerald-700', 
        border: 'border-emerald-200',
        icon: 'text-emerald-500'
      },
      out_for_delivery: { 
        bg: 'bg-amber-50', 
        text: 'text-amber-700', 
        border: 'border-amber-200',
        icon: 'text-amber-500'
      },
      in_transit: { 
        bg: 'bg-indigo-50', 
        text: 'text-indigo-700', 
        border: 'border-indigo-200',
        icon: 'text-indigo-500'
      },
      exception: { 
        bg: 'bg-rose-50', 
        text: 'text-rose-700', 
        border: 'border-rose-200',
        icon: 'text-rose-500'
      },
      picked_up: { 
        bg: 'bg-slate-50', 
        text: 'text-slate-700', 
        border: 'border-slate-200',
        icon: 'text-slate-500'
      },
      pending: { 
        bg: 'bg-gray-50', 
        text: 'text-gray-700', 
        border: 'border-gray-200',
        icon: 'text-gray-500'
      }
    };
    return map[status] || map.pending;
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'delivered': return FiCheck;
      case 'out_for_delivery': return FiTruck;
      case 'in_transit': return FiActivity;
      case 'exception': return FiAlertCircle;
      case 'picked_up': return FiPackage;
      default: return FiClock;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      let dateStr;
      if (diffDays === 0) {
        dateStr = 'Today';
      } else if (diffDays === 1) {
        dateStr = 'Yesterday';
      } else if (diffDays < 7) {
        dateStr = `${diffDays} days ago`;
      } else {
        dateStr = date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      }
      
      return {
        date: dateStr,
        time: date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };
    } catch {
      return { date: 'Unknown', time: '' };
    }
  };

  const calculateProgress = (status: string): number => {
    const progressMap: Record<string, number> = {
      'pending': 10,
      'picked_up': 30,
      'in_transit': 60,
      'out_for_delivery': 85,
      'delivered': 100,
      'exception': 100
    };
    return progressMap[status] || 0;
  };

  const getCountryFlag = (countryCode?: string): string => {
    if (!countryCode) return '🌍';
    // Simple mapping - in production you might want to use a proper flag library
    const flags: Record<string, string> = {
      'US': '🇺🇸', 'CA': '🇨🇦', 'GB': '🇬🇧', 'DE': '🇩🇪', 'FR': '🇫🇷',
      'JP': '🇯🇵', 'CN': '🇨🇳', 'IN': '🇮🇳', 'BR': '🇧🇷', 'AU': '🇦🇺',
      'MX': '🇲🇽', 'AE': '🇦🇪', 'SG': '🇸🇬', 'ZA': '🇿🇦', 'RU': '🇷🇺',
      'IT': '🇮🇹', 'ES': '🇪🇸', 'NL': '🇳🇱', 'BE': '🇧🇪', 'CH': '🇨🇭'
    };
    return flags[countryCode] || '🌍';
  };

  return (
    <section id="tracking" className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-50/50 via-transparent to-indigo-50/50 -z-10" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-full border border-purple-100 mb-6">
            <FiActivity className="w-4 h-4 text-purple-600 animate-pulse" />
            <span className="text-sm font-semibold text-purple-600">REAL-TIME TRACKING</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            Track Your{' '}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Shipment
            </span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Enter your CargoPulse tracking number below to get real-time updates on your package location, 
            estimated delivery, and complete shipment history.
          </p>
        </motion.div>

        {/* Search Interface */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl mx-auto mb-8"
        >
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-2 border border-slate-100">
            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row items-stretch gap-2">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                  placeholder="Enter tracking number (e.g., CGP123456789)"
                  className="w-full pl-12 pr-4 py-4 text-base text-slate-900 bg-transparent border-none focus:ring-0 placeholder:text-slate-400"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 hover:from-purple-700 hover:to-indigo-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-200"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Tracking...</span>
                  </>
                ) : (
                  <>
                    <span>Track Package</span>
                    <FiActivity />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && !trackingData && (
            <div className="mt-4 flex flex-wrap items-center gap-2 justify-center">
              <span className="text-sm text-slate-500">Recent:</span>
              {recentSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => setTrackingNumber(search)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono text-slate-600 hover:border-purple-300 hover:text-purple-600 transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-md mx-auto mt-6 p-4 bg-rose-50 border border-rose-200 rounded-xl"
            >
              <p className="text-rose-700 font-medium flex items-center space-x-2">
                <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence mode="wait">
          {trackingData && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 mt-12"
            >
              {/* World Map */}
              <WorldMap
                originCountry={trackingData.origin_country}
                originCoordinates={trackingData.origin_coordinates}
                currentCountry={trackingData.current_country}
                currentCoordinates={trackingData.current_coordinates}
                destinationCountry={trackingData.destination_country}
                destinationCoordinates={trackingData.destination_coordinates}
                locationHistory={trackingData.location_history}
                status={trackingData.status}
              />

              {/* Status Overview Cards - Mobile Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <FiHome className="w-5 h-5 text-purple-600" />
                    <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                      Origin
                    </span>
                  </div>
                  <p className="text-lg font-bold text-slate-900 truncate">
                    {trackingData.origin_country_name || trackingData.origin_country || 'Not specified'}
                  </p>
                  <p className="text-sm text-slate-500 truncate">
                    {getCountryFlag(trackingData.origin_country)} {trackingData.origin_city || ''}
                  </p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <FiNavigation className="w-5 h-5 text-blue-600" />
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      Current
                    </span>
                  </div>
                  <p className="text-lg font-bold text-slate-900 truncate">
                    {trackingData.current_country_name || trackingData.current_country || 'In Transit'}
                  </p>
                  <p className="text-sm text-slate-500 truncate">
                    {getCountryFlag(trackingData.current_country)} {trackingData.current_city || ''}
                  </p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <FiMapPin className="w-5 h-5 text-red-600" />
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                      Destination
                    </span>
                  </div>
                  <p className="text-lg font-bold text-slate-900 truncate">
                    {trackingData.destination_country_name || trackingData.destination_country || 'Not specified'}
                  </p>
                  <p className="text-sm text-slate-500 truncate">
                    {getCountryFlag(trackingData.destination_country)} {trackingData.destination_city || ''}
                  </p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <FiCalendar className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      Delivery
                    </span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">
                    {trackingData.estimated_delivery ? formatDate(trackingData.estimated_delivery) : 'TBA'}
                  </p>
                  <p className="text-sm text-slate-500">
                    Est. delivery date
                  </p>
                </motion.div>
              </div>

              {/* Main Content Grid */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Timeline */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Status Card */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-purple-400 text-xs font-semibold uppercase tracking-wider">
                            Tracking Number
                          </p>
                          <div className="flex items-center space-x-3">
                            <h2 className="text-2xl sm:text-3xl font-mono font-bold tracking-wider">
                              {trackingData.tracking_number}
                            </h2>
                            <button 
                              onClick={copyTrackingNumber} 
                              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors group"
                              title="Copy tracking number"
                            >
                              {copied ? (
                                <FiCheck className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <FiCopy className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className={`px-4 py-2 rounded-xl border ${getStatusStyle(trackingData.status).bg} ${getStatusStyle(trackingData.status).border} inline-flex items-center space-x-2 w-fit`}>
                          {(() => {
                            const Icon = getStatusIcon(trackingData.status);
                            return <Icon className={`w-4 h-4 ${getStatusStyle(trackingData.status).icon}`} />;
                          })()}
                          <span className={`font-semibold text-sm uppercase tracking-wider ${getStatusStyle(trackingData.status).text}`}>
                            {trackingData.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="p-6 border-b border-slate-100">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-slate-700">Shipment Progress</span>
                        <span className="text-purple-600 font-semibold">{calculateProgress(trackingData.status)}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${calculateProgress(trackingData.status)}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                        />
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-slate-400">
                        <span>Pending</span>
                        <span>Picked Up</span>
                        <span>In Transit</span>
                        <span>Out for Delivery</span>
                        <span>Delivered</span>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100">
                      <div className="p-4 text-center">
                        <p className="text-2xl font-bold text-slate-900">{trackingData.pieces || 1}</p>
                        <p className="text-xs text-slate-500">Pieces</p>
                      </div>
                      <div className="p-4 text-center">
                        <p className="text-2xl font-bold text-slate-900">{trackingData.weight || '—'}</p>
                        <p className="text-xs text-slate-500">Weight</p>
                      </div>
                      <div className="p-4 text-center">
                        <p className="text-2xl font-bold text-slate-900 capitalize">{trackingData.package_type || '—'}</p>
                        <p className="text-xs text-slate-500">Type</p>
                      </div>
                      <div className="p-4 text-center">
                        <p className="text-2xl font-bold text-slate-900">{trackingData.service_level || 'Standard'}</p>
                        <p className="text-xs text-slate-500">Service</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Timeline */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                  >
                    <div className="p-6 border-b border-slate-100">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                        <FiActivity className="w-5 h-5 text-purple-600" />
                        <span>Tracking Timeline</span>
                      </h3>
                    </div>
                    
                    <div className="p-6">
                      <div className="space-y-6">
                        {(showAllEvents ? trackingData.timeline : trackingData.timeline?.slice(0, 5))?.map((event, index, array) => {
                          const StatusIcon = getStatusIcon(event.status);
                          const isFirst = index === 0;
                          const isLast = index === array.length - 1;
                          const formatted = formatDateTime(event.event_timestamp);
                          
                          return (
                            <motion.div
                              key={event.id || index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="relative flex gap-4"
                            >
                              {/* Timeline Line */}
                              {!isLast && (
                                <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gradient-to-b from-purple-200 to-slate-100" />
                              )}
                              
                              {/* Icon */}
                              <div className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                isFirst 
                                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' 
                                  : 'bg-slate-100 text-slate-500'
                              }`}>
                                <StatusIcon className="w-5 h-5" />
                              </div>
                              
                              {/* Content */}
                              <div className="flex-1 pb-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                                  <h4 className={`font-semibold ${isFirst ? 'text-slate-900' : 'text-slate-700'}`}>
                                    {event.description}
                                  </h4>
                                  <div className="flex items-center space-x-2 text-sm">
                                    <span className="text-purple-600 font-medium">{formatted.date}</span>
                                    <span className="text-slate-400">·</span>
                                    <span className="text-slate-500">{formatted.time}</span>
                                  </div>
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                                  <FiMapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                  <span>{event.location}</span>
                                  {event.location_country && (
                                    <>
                                      <span className="text-slate-300">·</span>
                                      <span className="flex items-center space-x-1">
                                        <span>{getCountryFlag(event.location_country)}</span>
                                        <span>{event.location_country}</span>
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                      
                      {trackingData.timeline && trackingData.timeline.length > 5 && (
                        <button
                          onClick={() => setShowAllEvents(!showAllEvents)}
                          className="mt-4 w-full py-3 text-sm font-medium text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors flex items-center justify-center space-x-2"
                        >
                          <span>{showAllEvents ? 'Show less' : `Show all ${trackingData.timeline.length} events`}</span>
                          {showAllEvents ? <FiChevronDown className="w-4 h-4" /> : <FiChevronRight className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Right Column - Details & Images */}
                <div className="space-y-6">
                  {/* Package Images */}
                  {trackingData.images && trackingData.images.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                    >
                      <div className="p-6 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                            <FiImage className="w-5 h-5 text-purple-600" />
                            <span>Package Images</span>
                          </h3>
                          <span className="text-sm text-slate-500">{trackingData.images.length} photos</span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-4">
                          {trackingData.images.map((image, index) => (
                            <motion.div
                              key={image.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className="relative group cursor-pointer"
                              onClick={() => setSelectedImage(image.image_url)}
                            >
                              <div className="aspect-square rounded-xl overflow-hidden border-2 border-slate-100 group-hover:border-purple-300 transition-all">
                                <img
                                  src={image.image_url}
                                  alt={`Package ${index + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <FiEye className="w-8 h-8 text-white drop-shadow-lg" />
                                </div>
                              </div>
                              {image.is_primary && (
                                <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-lg">
                                  <FiCheck className="w-3 h-3" />
                                  <span>Primary</span>
                                </div>
                              )}
                              <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs capitalize">
                                {image.image_type.replace(/_/g, ' ')}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Shipment Details */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                  >
                    <div className="p-6 border-b border-slate-100">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                        <FiPackage className="w-5 h-5 text-purple-600" />
                        <span>Shipment Details</span>
                      </h3>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      {/* Package Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-slate-500 uppercase tracking-wider">Package Type</p>
                          <p className="font-semibold text-slate-900 capitalize flex items-center space-x-1">
                            <FiBox className="w-4 h-4 text-slate-400" />
                            <span>{trackingData.package_type || 'Not specified'}</span>
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-slate-500 uppercase tracking-wider">Pieces</p>
                          <p className="font-semibold text-slate-900">{trackingData.pieces || 1}</p>
                        </div>
                        {trackingData.weight && (
                          <div className="space-y-1">
                            <p className="text-xs text-slate-500 uppercase tracking-wider">Weight</p>
                            <p className="font-semibold text-slate-900 flex items-center space-x-1">
                              <FaWeightHanging className="w-3 h-3 text-slate-400" />
                              <span>{trackingData.weight}</span>
                            </p>
                          </div>
                        )}
                        {trackingData.dimensions && (
                          <div className="space-y-1">
                            <p className="text-xs text-slate-500 uppercase tracking-wider">Dimensions</p>
                            <p className="font-semibold text-slate-900 flex items-center space-x-1">
                              <FaRulerCombined className="w-3 h-3 text-slate-400" />
                              <span>{trackingData.dimensions}</span>
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Sender/Recipient */}
                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="space-y-2">
                          <p className="text-xs text-slate-500 uppercase tracking-wider flex items-center space-x-2">
                            <FiUser className="w-3 h-3" />
                            <span>Sender</span>
                          </p>
                          <p className="font-semibold text-slate-900">{trackingData.sender_name}</p>
                          <p className="text-sm text-slate-600">{trackingData.sender_address}</p>
                          {trackingData.sender_city && (
                            <p className="text-xs text-slate-500 flex items-center space-x-1">
                              <FiMapPin className="w-3 h-3" />
                              <span>{trackingData.sender_city}</span>
                              {trackingData.sender_country && (
                                <>
                                  <span>·</span>
                                  <span>{getCountryFlag(trackingData.sender_country)} {trackingData.sender_country}</span>
                                </>
                              )}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs text-slate-500 uppercase tracking-wider flex items-center space-x-2">
                            <FiUser className="w-3 h-3" />
                            <span>Recipient</span>
                          </p>
                          <p className="font-semibold text-slate-900">{trackingData.recipient_name}</p>
                          <p className="text-sm text-slate-600">{trackingData.recipient_address}</p>
                          {trackingData.recipient_city && (
                            <p className="text-xs text-slate-500 flex items-center space-x-1">
                              <FiMapPin className="w-3 h-3" />
                              <span>{trackingData.recipient_city}</span>
                              {trackingData.recipient_country && (
                                <>
                                  <span>·</span>
                                  <span>{getCountryFlag(trackingData.recipient_country)} {trackingData.recipient_country}</span>
                                </>
                              )}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Special Handling */}
                      {(trackingData.is_fragile || trackingData.is_perishable || trackingData.is_hazardous || (trackingData.special_handling && trackingData.special_handling.length > 0)) && (
                        <div className="pt-4 border-t border-slate-100">
                          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Special Handling</p>
                          <div className="flex flex-wrap gap-2">
                            {trackingData.is_fragile && (
                              <span className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 border border-amber-200">
                                <FiAlertCircle className="w-3 h-3" />
                                <span>Fragile</span>
                              </span>
                            )}
                            {trackingData.is_perishable && (
                              <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 border border-blue-200">
                                <FiDroplet className="w-3 h-3" />
                                <span>Perishable</span>
                              </span>
                            )}
                            {trackingData.is_hazardous && (
                              <span className="bg-rose-50 text-rose-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 border border-rose-200">
                                <FaFireFlameCurved className="w-3 h-3" />
                                <span>Hazardous</span>
                              </span>
                            )}
                            {trackingData.special_handling?.map((handling: string) => (
                              <span key={handling} className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-medium capitalize border border-purple-200">
                                {handling.replace(/_/g, ' ')}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Reference Numbers */}
                      {trackingData.reference_numbers && Object.keys(trackingData.reference_numbers).length > 0 && (
                        <div className="pt-4 border-t border-slate-100">
                          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Reference Numbers</p>
                          <div className="space-y-2 bg-slate-50 rounded-xl p-4">
                            {Object.entries(trackingData.reference_numbers).map(([key, value]) => (
                              <div key={key} className="flex justify-between items-center text-sm">
                                <span className="text-slate-600">{key.replace(/_/g, ' ')}:</span>
                                <span className="text-slate-900 font-mono font-medium bg-white px-2 py-1 rounded border border-slate-200">
                                  {String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>

                 
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-pointer"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-6xl max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage}
                  alt="Package"
                  className="w-full h-full object-contain rounded-lg"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm border border-white/20"
                >
                  <FiX className="w-6 h-6" />
                </button>
                <p className="absolute bottom-4 left-4 text-white/60 text-sm bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  Click anywhere to close
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}