// components/Tracking/WorldMap.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGlobe, FiMapPin, FiNavigation } from 'react-icons/fi';

interface CountryCoordinates {
  lat: number;
  lng: number;
}

interface MapProps {
  originCountry?: string;
  originCoordinates?: CountryCoordinates;
  currentCountry?: string;
  currentCoordinates?: CountryCoordinates;
  destinationCountry?: string;
  destinationCoordinates?: CountryCoordinates;
  locationHistory?: Array<{
    country: string;
    city?: string;
    updated_at: string;
  }>;
  status?: string;
}

// Predefined country coordinates (fallback if not in database)
const countryCoordinates: Record<string, CountryCoordinates> = {
  US: { lat: 39.8283, lng: -98.5795 },
  CA: { lat: 56.1304, lng: -106.3468 },
  GB: { lat: 55.3781, lng: -3.4360 },
  DE: { lat: 51.1657, lng: 10.4515 },
  FR: { lat: 46.2276, lng: 2.2137 },
  JP: { lat: 36.2048, lng: 138.2529 },
  CN: { lat: 35.8617, lng: 104.1954 },
  IN: { lat: 20.5937, lng: 78.9629 },
  BR: { lat: -14.2350, lng: -51.9253 },
  AU: { lat: -25.2744, lng: 133.7751 },
  MX: { lat: 23.6345, lng: -102.5528 },
  AE: { lat: 23.4241, lng: 53.8478 },
  SG: { lat: 1.3521, lng: 103.8198 },
  ZA: { lat: -30.5595, lng: 22.9375 },
  RU: { lat: 61.5240, lng: 105.3188 },
  IT: { lat: 41.8719, lng: 12.5674 },
  ES: { lat: 40.4637, lng: -3.7492 },
  NL: { lat: 52.1326, lng: 5.2913 },
  BE: { lat: 50.5039, lng: 4.4699 },
  CH: { lat: 46.8182, lng: 8.2275 }
};

// Country names mapping
const countryNames: Record<string, string> = {
  US: 'United States',
  CA: 'Canada',
  GB: 'United Kingdom',
  DE: 'Germany',
  FR: 'France',
  JP: 'Japan',
  CN: 'China',
  IN: 'India',
  BR: 'Brazil',
  AU: 'Australia',
  MX: 'Mexico',
  AE: 'UAE',
  SG: 'Singapore',
  ZA: 'South Africa',
  RU: 'Russia',
  IT: 'Italy',
  ES: 'Spain',
  NL: 'Netherlands',
  BE: 'Belgium',
  CH: 'Switzerland'
};

// Helper function to get country display name safely
const getCountryDisplayName = (countryCode?: string): string => {
  if (!countryCode) return 'Unknown';
  return countryNames[countryCode] || countryCode;
};

export default function WorldMap({
  originCountry,
  originCoordinates,
  currentCountry,
  currentCoordinates,
  destinationCountry,
  destinationCoordinates,
  locationHistory = [],
  status
}: MapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [airplanePosition, setAirplanePosition] = useState<{ x: number; y: number } | null>(null);
  const [pathPoints, setPathPoints] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');

  // Convert lat/lng to canvas coordinates (Mercator projection approximation)
  const latLngToCanvas = (lat: number, lng: number, width: number, height: number) => {
    const x = (lng + 180) * (width / 360);
    const y = height / 2 - (width * Math.log(Math.tan((Math.PI / 4) + (lat * Math.PI / 360))) / (2 * Math.PI));
    return { x, y };
  };

  // Draw the world map
  const drawMap = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background (ocean)
    ctx.fillStyle = '#0B1A33';
    ctx.fillRect(0, 0, width, height);

    // Draw simplified world map (you can replace this with actual GeoJSON data)
    ctx.strokeStyle = '#2A3F5E';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#1E2F47';

    // Draw some basic shapes for continents (simplified)
    // North America
    ctx.beginPath();
    ctx.moveTo(latLngToCanvas(55, -130, width, height).x, latLngToCanvas(55, -130, width, height).y);
    ctx.lineTo(latLngToCanvas(30, -120, width, height).x, latLngToCanvas(30, -120, width, height).y);
    ctx.lineTo(latLngToCanvas(20, -100, width, height).x, latLngToCanvas(20, -100, width, height).y);
    ctx.lineTo(latLngToCanvas(25, -80, width, height).x, latLngToCanvas(25, -80, width, height).y);
    ctx.lineTo(latLngToCanvas(45, -70, width, height).x, latLngToCanvas(45, -70, width, height).y);
    ctx.lineTo(latLngToCanvas(60, -80, width, height).x, latLngToCanvas(60, -80, width, height).y);
    ctx.lineTo(latLngToCanvas(65, -100, width, height).x, latLngToCanvas(65, -100, width, height).y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Europe
    ctx.beginPath();
    ctx.moveTo(latLngToCanvas(60, -10, width, height).x, latLngToCanvas(60, -10, width, height).y);
    ctx.lineTo(latLngToCanvas(50, -5, width, height).x, latLngToCanvas(50, -5, width, height).y);
    ctx.lineTo(latLngToCanvas(40, -5, width, height).x, latLngToCanvas(40, -5, width, height).y);
    ctx.lineTo(latLngToCanvas(35, 10, width, height).x, latLngToCanvas(35, 10, width, height).y);
    ctx.lineTo(latLngToCanvas(40, 30, width, height).x, latLngToCanvas(40, 30, width, height).y);
    ctx.lineTo(latLngToCanvas(50, 40, width, height).x, latLngToCanvas(50, 40, width, height).y);
    ctx.lineTo(latLngToCanvas(60, 30, width, height).x, latLngToCanvas(60, 30, width, height).y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Asia
    ctx.beginPath();
    ctx.moveTo(latLngToCanvas(60, 60, width, height).x, latLngToCanvas(60, 60, width, height).y);
    ctx.lineTo(latLngToCanvas(40, 70, width, height).x, latLngToCanvas(40, 70, width, height).y);
    ctx.lineTo(latLngToCanvas(20, 100, width, height).x, latLngToCanvas(20, 100, width, height).y);
    ctx.lineTo(latLngToCanvas(10, 120, width, height).x, latLngToCanvas(10, 120, width, height).y);
    ctx.lineTo(latLngToCanvas(20, 140, width, height).x, latLngToCanvas(20, 140, width, height).y);
    ctx.lineTo(latLngToCanvas(40, 130, width, height).x, latLngToCanvas(40, 130, width, height).y);
    ctx.lineTo(latLngToCanvas(60, 110, width, height).x, latLngToCanvas(60, 110, width, height).y);
    ctx.lineTo(latLngToCanvas(70, 80, width, height).x, latLngToCanvas(70, 80, width, height).y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Africa
    ctx.beginPath();
    ctx.moveTo(latLngToCanvas(30, -10, width, height).x, latLngToCanvas(30, -10, width, height).y);
    ctx.lineTo(latLngToCanvas(10, 10, width, height).x, latLngToCanvas(10, 10, width, height).y);
    ctx.lineTo(latLngToCanvas(-10, 20, width, height).x, latLngToCanvas(-10, 20, width, height).y);
    ctx.lineTo(latLngToCanvas(-20, 30, width, height).x, latLngToCanvas(-20, 30, width, height).y);
    ctx.lineTo(latLngToCanvas(-10, 40, width, height).x, latLngToCanvas(-10, 40, width, height).y);
    ctx.lineTo(latLngToCanvas(10, 40, width, height).x, latLngToCanvas(10, 40, width, height).y);
    ctx.lineTo(latLngToCanvas(20, 30, width, height).x, latLngToCanvas(20, 30, width, height).y);
    ctx.lineTo(latLngToCanvas(30, 20, width, height).x, latLngToCanvas(30, 20, width, height).y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // South America
    ctx.beginPath();
    ctx.moveTo(latLngToCanvas(10, -80, width, height).x, latLngToCanvas(10, -80, width, height).y);
    ctx.lineTo(latLngToCanvas(0, -70, width, height).x, latLngToCanvas(0, -70, width, height).y);
    ctx.lineTo(latLngToCanvas(-10, -60, width, height).x, latLngToCanvas(-10, -60, width, height).y);
    ctx.lineTo(latLngToCanvas(-20, -50, width, height).x, latLngToCanvas(-20, -50, width, height).y);
    ctx.lineTo(latLngToCanvas(-30, -60, width, height).x, latLngToCanvas(-30, -60, width, height).y);
    ctx.lineTo(latLngToCanvas(-40, -70, width, height).x, latLngToCanvas(-40, -70, width, height).y);
    ctx.lineTo(latLngToCanvas(-30, -80, width, height).x, latLngToCanvas(-30, -80, width, height).y);
    ctx.lineTo(latLngToCanvas(-10, -80, width, height).x, latLngToCanvas(-10, -80, width, height).y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Australia
    ctx.beginPath();
    ctx.moveTo(latLngToCanvas(-10, 110, width, height).x, latLngToCanvas(-10, 110, width, height).y);
    ctx.lineTo(latLngToCanvas(-20, 120, width, height).x, latLngToCanvas(-20, 120, width, height).y);
    ctx.lineTo(latLngToCanvas(-30, 130, width, height).x, latLngToCanvas(-30, 130, width, height).y);
    ctx.lineTo(latLngToCanvas(-40, 140, width, height).x, latLngToCanvas(-40, 140, width, height).y);
    ctx.lineTo(latLngToCanvas(-30, 150, width, height).x, latLngToCanvas(-30, 150, width, height).y);
    ctx.lineTo(latLngToCanvas(-20, 150, width, height).x, latLngToCanvas(-20, 150, width, height).y);
    ctx.lineTo(latLngToCanvas(-10, 140, width, height).x, latLngToCanvas(-10, 140, width, height).y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw country highlights
    if (originCoordinates) {
      const { x, y } = latLngToCanvas(originCoordinates.lat, originCoordinates.lng, width, height);
      
      // Draw highlight circle
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
      ctx.fill();
      ctx.strokeStyle = '#22C55E';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw label
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillStyle = '#22C55E';
      ctx.fillText('Origin', x - 25, y - 20);
    }

    if (destinationCoordinates) {
      const { x, y } = latLngToCanvas(destinationCoordinates.lat, destinationCoordinates.lng, width, height);
      
      // Draw highlight circle
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.fill();
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw label
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillStyle = '#EF4444';
      ctx.fillText('Destination', x - 35, y - 20);
    }

    if (currentCoordinates) {
      const { x, y } = latLngToCanvas(currentCoordinates.lat, currentCoordinates.lng, width, height);
      
      // Draw current position indicator (pulsing)
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = '#3B82F6';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw label
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillStyle = '#3B82F6';
      ctx.fillText('Current', x - 25, y - 20);

      // Store airplane position for animation
      setAirplanePosition({ x, y });
    }

    // Draw flight path between origin and destination
    if (originCoordinates && destinationCoordinates) {
      const origin = latLngToCanvas(originCoordinates.lat, originCoordinates.lng, width, height);
      const dest = latLngToCanvas(destinationCoordinates.lat, destinationCoordinates.lng, width, height);

      // Draw curved path (great circle approximation)
      ctx.beginPath();
      ctx.moveTo(origin.x, origin.y);
      
      // Create a curved line using quadratic curve
      const midX = (origin.x + dest.x) / 2;
      const midY = (origin.y + dest.y) / 2 - 50; // Curve upward
      
      ctx.quadraticCurveTo(midX, midY, dest.x, dest.y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]); // Reset

      // Draw dashed line for the path
      ctx.beginPath();
      ctx.moveTo(origin.x, origin.y);
      ctx.quadraticCurveTo(midX, midY, dest.x, dest.y);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();

      setPathPoints({ x1: origin.x, y1: origin.y, x2: dest.x, y2: dest.y });
    }

    // Draw location history points
    if (locationHistory.length > 0) {
      locationHistory.forEach((location, index) => {
        if (locationHistory.length > 0) {
          const coords = countryCoordinates[location.country as keyof typeof countryCoordinates];
          if (coords) {
            const { x, y } = latLngToCanvas(coords.lat, coords.lng, width, height);
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + (index / locationHistory.length) * 0.5})`;
            ctx.fill();
          }
        }
      });
    }
  };

  // Handle canvas resize and drawing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        const height = width * 0.5; // 2:1 aspect ratio
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Draw map when dimensions or coordinates change
  useEffect(() => {
    if (!canvasRef.current || !dimensions.width) return;

    const canvas = canvasRef.current;
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawMap(ctx, dimensions.width, dimensions.height);
  }, [dimensions, originCoordinates, currentCoordinates, destinationCoordinates, locationHistory]);

  // Handle mouse move for tooltips
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if hovering over country markers
    const checkHover = (coords: { lat: number; lng: number } | undefined, countryCode: string | undefined, type: string) => {
      if (!coords || !countryCode) return false;
      
      const point = latLngToCanvas(coords.lat, coords.lng, dimensions.width, dimensions.height);
      const distance = Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2));
      
      if (distance < 20) {
        setTooltipContent(`${getCountryDisplayName(countryCode)} (${type})`);
        setShowTooltip(true);
        return true;
      }
      return false;
    };

    let hovered = false;
    
    if (originCoordinates && originCountry) {
      hovered = checkHover(originCoordinates, originCountry, 'Origin');
    }
    
    if (!hovered && currentCoordinates && currentCountry) {
      hovered = checkHover(currentCoordinates, currentCountry, 'Current');
    }
    
    if (!hovered && destinationCoordinates && destinationCountry) {
      hovered = checkHover(destinationCoordinates, destinationCountry, 'Destination');
    }

    if (!hovered) {
      setShowTooltip(false);
    }
  };

  return (
    <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
      <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FiGlobe className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-semibold">Live Shipment Tracking</h3>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-slate-400">Origin</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-xs text-slate-400">Current</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs text-slate-400">Destination</span>
          </div>
        </div>
      </div>
      
      <div ref={containerRef} className="relative">
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setShowTooltip(false)}
          className="w-full h-auto cursor-crosshair"
        />
        
        {/* Animated Airplane */}
        <AnimatePresence>
          {airplanePosition && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute pointer-events-none z-10"
              style={{
                left: airplanePosition.x - 20,
                top: airplanePosition.y - 20,
              }}
            >
              <motion.div
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                <FiNavigation className="w-10 h-10 text-white drop-shadow-lg transform -rotate-45" />
                <div className="absolute inset-0 blur-lg bg-blue-500/50 rounded-full" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-4 left-4 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-xl border border-slate-700"
            >
              {tooltipContent}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Overlay */}
        {currentCountry && (
          <div className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-slate-700">
            <p className="text-xs text-slate-400">Current Location</p>
            <p className="text-white font-semibold flex items-center space-x-2">
              <FiMapPin className="w-4 h-4 text-blue-400" />
              <span>{getCountryDisplayName(currentCountry)}</span>
            </p>
          </div>
        )}
      </div>

      {/* Legend/Info Bar */}
      <div className="px-6 py-3 bg-slate-800/50 border-t border-slate-700 flex flex-wrap items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-4">
          <span>🛫 {getCountryDisplayName(originCountry)}</span>
          <FiNavigation className="w-3 h-3 rotate-90" />
          <span>🛬 {getCountryDisplayName(destinationCountry)}</span>
        </div>
        {status && (
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${
              status === 'delivered' ? 'bg-green-500' :
              status === 'in_transit' ? 'bg-blue-500' :
              status === 'out_for_delivery' ? 'bg-yellow-500' :
              status === 'exception' ? 'bg-red-500' :
              'bg-slate-500'
            }`} />
            <span className="capitalize">{status.replace(/_/g, ' ')}</span>
          </div>
        )}
      </div>
    </div>
  );
}