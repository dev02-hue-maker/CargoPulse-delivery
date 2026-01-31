/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Tracking/TrackingSection.tsx
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiMapPin, 
 
  FiCopy,
 
  FiPackage,
   FiActivity,
  FiShield,
  FiCheck
} from 'react-icons/fi';
import { 
  getTrackingDetails, 
 
} from '@/lib/tracking';

export default function TrackingSection() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
 

 
  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError('Enter a valid CargoPulse ID');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const result = await getTrackingDetails(trackingNumber);
      if (result.error) {
        setError(result.error);
      } else if (result.trackingDetails) {
        setTrackingData(transformTrackingData(result.trackingDetails));
      }
    } catch (err) {
      setError('Network synchronization failed. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const transformTrackingData = (trackingDetails: any) => {
    const { package: pkg, events } = trackingDetails;
    return {
      ...pkg,
      timeline: events.map((event: any) => ({
        ...event,
        completed: new Date(event.event_timestamp) < new Date()
      })).sort((a: any, b: any) => new Date(b.event_timestamp).getTime() - new Date(a.event_timestamp).getTime())
    };
  };

  const copyTrackingNumber = () => {
    navigator.clipboard.writeText(trackingData.tracking_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusStyle = (status: string) => {
    const map: Record<string, string> = {
      delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      out_for_delivery: 'bg-amber-100 text-amber-700 border-amber-200',
      in_transit: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      exception: 'bg-rose-100 text-rose-700 border-rose-200',
      picked_up: 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return map[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <section id="tracking" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Structural Decor */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-indigo-500 to-teal-500 opacity-20" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2 text-teal-600 font-bold tracking-widest uppercase text-xs mb-4"
          >
            <FiActivity className="animate-pulse" />
            <span>CargoPulse Intelligence</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            Track Shipment <span className="text-slate-400">Live.</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Access enterprise-grade visibility. Monitor your assets across 220 countries 
            with second-by-second telemetry and automated customs insights.
          </p>
        </div>

        {/* Search Interface */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 p-2 border border-slate-100 mb-12"
        >
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter CargoPulse Tracking ID..."
                className="w-full pl-14 pr-6 py-6 text-lg font-medium text-slate-900 bg-transparent border-none focus:ring-0 placeholder:text-slate-300"
              />
            </div>
            <button
              disabled={isLoading}
              className="w-full md:w-auto px-10 py-5 bg-slate-900 text-white rounded-[1.5rem] font-bold flex items-center justify-center space-x-3 hover:bg-teal-600 transition-all active:scale-95 disabled:bg-slate-300"
            >
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Track Now</span><FiActivity /></>}
            </button>
          </form>
        </motion.div>

        {/* Results Engine */}
        <AnimatePresence mode="wait">
          {trackingData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid lg:grid-cols-3 gap-8"
            >
              {/* Left Column: Status Overview */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="bg-slate-900 p-8 text-white">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                      <div className="space-y-1">
                        <p className="text-teal-400 text-xs font-bold uppercase tracking-widest">Global Tracking ID</p>
                        <div className="flex items-center space-x-3">
                          <h3 className="text-3xl font-mono font-bold">{trackingData.tracking_number}</h3>
                          <button onClick={copyTrackingNumber} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                            {copied ? <FiCheck className="text-teal-400" /> : <FiCopy />}
                          </button>
                        </div>
                      </div>
                      <div className={`px-6 py-3 rounded-2xl border font-bold text-sm uppercase tracking-tighter ${getStatusStyle(trackingData.status)}`}>
                        {trackingData.status.replace(/_/g, ' ')}
                      </div>
                    </div>
                  </div>

                  <div className="p-8 grid md:grid-cols-3 gap-8">
                    <div className="space-y-1">
                      <p className="text-slate-400 text-xs font-bold uppercase">Estimated Delivery</p>
                      <p className="text-lg font-bold text-slate-900">{new Date(trackingData.estimated_delivery).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-400 text-xs font-bold uppercase">Current Hub</p>
                      <p className="text-lg font-bold text-slate-900">{trackingData.current_location || 'Global Transit'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-400 text-xs font-bold uppercase">Service Level</p>
                      <p className="text-lg font-bold text-slate-900">{trackingData.service_type}</p>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="px-8 pb-10">
                    <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: trackingData.status === 'delivered' ? '100%' : '65%' }}
                        className="absolute h-full bg-teal-500"
                      />
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      <span>Origin</span>
                      <span>Transit</span>
                      <span>Delivered</span>
                    </div>
                  </div>
                </div>

                {/* Tracking Log */}
                <div className="bg-white rounded-[2rem] border border-slate-100 p-8">
                  <h4 className="text-xl font-bold text-slate-900 mb-8 flex items-center space-x-2">
                    <FiActivity className="text-teal-500" />
                    <span>Telemetry Log</span>
                  </h4>
                  <div className="space-y-10 relative">
                    <div className="absolute left-[19px] top-2 bottom-2 w-px bg-slate-100" />
                    {trackingData.timeline.map((event: any, i: number) => (
                      <div key={i} className="relative flex items-start space-x-6">
                        <div className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center z-10 ${i === 0 ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                          {i === 0 ? <FiPackage /> : <FiMapPin />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className={`font-bold ${i === 0 ? 'text-slate-900' : 'text-slate-500'}`}>{event.description}</p>
                            <span className="text-xs font-bold text-slate-400 uppercase">{new Date(event.event_timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                          <p className="text-sm text-slate-400 font-medium">{event.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Meta Info */}
              <div className="space-y-8">
                <div className="bg-white rounded-[2rem] border border-slate-100 p-8">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Shipment Details</h4>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                      <span className="text-slate-400 text-sm font-medium">Weight</span>
                      <span className="text-slate-900 font-bold">{trackingData.weight || '2.4 kg'}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                      <span className="text-slate-400 text-sm font-medium">Recipient</span>
                      <span className="text-slate-900 font-bold">{trackingData.recipient_name}</span>
                    </div>
                    <div className="space-y-2">
                      <span className="text-slate-400 text-sm font-medium">Destination</span>
                      <p className="text-slate-900 font-bold leading-tight">{trackingData.recipient_address}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-600 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <FiShield className="w-24 h-24" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">Need Support?</h4>
                  <p className="text-indigo-100 text-sm mb-6 leading-relaxed">Our logistics specialists are available 24/7 for premium tier shipments.</p>
                  <button className="w-full py-4 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors">
                    Open Support Ticket
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}