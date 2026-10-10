import React, { useEffect, useRef, useState } from 'react';
import { loadGoogleMaps, MAP_STYLES_LIGHT, MAP_STYLES_DARK } from '../../services/googleMapsLoader';
import { useApp } from '../../context/AppContext';
import {
  Navigation,
  Target,
  Bike,
  MapPin,
  Lock,
  Unlock,
  Layers,
  Sparkles,
} from 'lucide-react';

interface GoogleLiveTrackingMapProps {
  restaurantLocation?: { lat: number; lng: number };
  customerLocation?: { lat: number; lng: number };
  restaurantName?: string;
  orderStatus?: string;
  estimatedMinutes?: number;
}

export const GoogleLiveTrackingMap: React.FC<GoogleLiveTrackingMapProps> = ({
  restaurantLocation = { lat: -6.7924, lng: 39.2083 }, // Kinondoni Muslim
  customerLocation = { lat: -6.7725, lng: 39.2483 },   // Mikocheni B
  restaurantName = 'Mamboz Burger',
  orderStatus = 'on_the_way',
  estimatedMinutes = 12,
}) => {
  const { isDarkMode } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const riderMarkerRef = useRef<google.maps.Marker | null>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [useLiteVector, setUseLiteVector] = useState(false);
  const [riderProgress, setRiderProgress] = useState(0.65);

  // Waypoints connecting Kinondoni to Mikocheni in Dar es Salaam
  const routeWaypoints = [
    { lat: -6.7924, lng: 39.2083 }, // Mamboz Burger, Kinondoni
    { lat: -6.7890, lng: 39.2150 }, // Morogoro Rd Junction
    { lat: -6.7845, lng: 39.2280 }, // Kawawa Rd
    { lat: -6.7810, lng: 39.2380 }, // Old Bagamoyo Rd
    { lat: -6.7760, lng: 39.2440 }, // Mikocheni Light
    { lat: -6.7725, lng: 39.2483 }, // Customer Gate, Mikocheni B
  ];

  const getInterpolatedPosition = (progress: number) => {
    const totalSegments = routeWaypoints.length - 1;
    const scaled = Math.min(Math.max(progress, 0), 1) * totalSegments;
    const index = Math.floor(scaled);
    const remainder = scaled - index;

    if (index >= totalSegments) return routeWaypoints[totalSegments];

    const p1 = routeWaypoints[index];
    const p2 = routeWaypoints[index + 1];

    return {
      lat: p1.lat + (p2.lat - p1.lat) * remainder,
      lng: p1.lng + (p2.lng - p1.lng) * remainder,
    };
  };

  const riderCurrentPos = getInterpolatedPosition(riderProgress);

  // Initialize strictly 2D Google Maps with cooperative scroll handling
  useEffect(() => {
    if (useLiteVector) return;

    let isCancelled = false;

    loadGoogleMaps()
      .then((gMaps) => {
        if (isCancelled || !mapContainerRef.current) return;

        const centerLat = (restaurantLocation.lat + customerLocation.lat) / 2;
        const centerLng = (restaurantLocation.lng + customerLocation.lng) / 2;

        const map = new gMaps.maps.Map(mapContainerRef.current, {
          center: { lat: centerLat, lng: centerLng },
          zoom: 14,
          mapTypeId: 'roadmap',
          tilt: 0, // Force strict flat 2D map
          heading: 0,
          rotateControl: false,
          disableDefaultUI: true,
          zoomControl: false,
          clickableIcons: false, // Disables heavy POI listener overhead
          isFractionalZoomEnabled: false,
          gestureHandling: isInteractive ? 'greedy' : 'cooperative', // Cooperative enables smooth page scrolling without trapping touch
          styles: isDarkMode ? MAP_STYLES_DARK : MAP_STYLES_LIGHT,
        });

        mapInstanceRef.current = map;

        // 2D High-contrast Polyline route
        new gMaps.maps.Polyline({
          path: routeWaypoints,
          geodesic: false,
          strokeColor: '#FF6B00',
          strokeOpacity: 0.95,
          strokeWeight: 5,
          map,
        });

        // Restaurant 2D Marker
        const restaurantIcon = {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34">
              <circle cx="17" cy="17" r="14" fill="#1A1D20" stroke="#FFFFFF" stroke-width="2.5"/>
              <circle cx="17" cy="17" r="4" fill="#FF6B00"/>
            </svg>
          `),
          scaledSize: new gMaps.maps.Size(34, 34),
          anchor: new gMaps.maps.Point(17, 17),
        };

        new gMaps.maps.Marker({
          position: routeWaypoints[0],
          map,
          title: restaurantName,
          icon: restaurantIcon,
        });

        // Customer Destination 2D Marker
        const destinationIcon = {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15" fill="#FF6B00" stroke="#FFFFFF" stroke-width="2.5"/>
              <path d="M12 20l6-4.5 6 4.5v5.5h-12z" fill="#FFFFFF"/>
            </svg>
          `),
          scaledSize: new gMaps.maps.Size(36, 36),
          anchor: new gMaps.maps.Point(18, 18),
        };

        new gMaps.maps.Marker({
          position: routeWaypoints[routeWaypoints.length - 1],
          map,
          title: 'Delivery Destination',
          icon: destinationIcon,
        });

        // Boda Boda 2D Marker
        const riderIcon = {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="#FF6B00" fill-opacity="0.2"/>
              <circle cx="20" cy="20" r="14" fill="#FF6B00" stroke="#FFFFFF" stroke-width="2.5"/>
              <circle cx="15" cy="22" r="3" fill="#FFFFFF"/>
              <circle cx="25" cy="22" r="3" fill="#FFFFFF"/>
              <path d="M15 22l4-6h4l2 6M19 16h4" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          `),
          scaledSize: new gMaps.maps.Size(40, 40),
          anchor: new gMaps.maps.Point(20, 20),
        };

        const riderMarker = new gMaps.maps.Marker({
          position: riderCurrentPos,
          map,
          title: 'Rider Juma (Boda Boda)',
          icon: riderIcon,
          zIndex: 999,
        });
        riderMarkerRef.current = riderMarker;

        const bounds = new gMaps.maps.LatLngBounds();
        routeWaypoints.forEach((wp) => bounds.extend(wp));
        map.fitBounds(bounds, 40);

        setMapLoaded(true);
      })
      .catch((err) => {
        console.error('Google Maps fallback to Lite 2D:', err);
        setLoadError(true);
        setUseLiteVector(true);
      });

    return () => {
      isCancelled = true;
    };
  }, [useLiteVector]);

  // Update gesture handling dynamically when user toggles interaction
  useEffect(() => {
    if (mapInstanceRef.current && window.google?.maps) {
      mapInstanceRef.current.setOptions({
        gestureHandling: isInteractive ? 'greedy' : 'cooperative',
      });
    }
  }, [isInteractive]);

  // Sync theme
  useEffect(() => {
    if (mapInstanceRef.current && window.google?.maps) {
      mapInstanceRef.current.setOptions({
        styles: isDarkMode ? MAP_STYLES_DARK : MAP_STYLES_LIGHT,
        tilt: 0,
      });
    }
  }, [isDarkMode]);

  // Smooth rider update
  useEffect(() => {
    const timer = setInterval(() => {
      setRiderProgress((prev) => {
        const next = prev >= 0.95 ? 0.35 : prev + 0.025;
        const newPos = getInterpolatedPosition(next);
        if (riderMarkerRef.current) {
          riderMarkerRef.current.setPosition(newPos);
        }
        return next;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const handleRecenterOnRider = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo(riderCurrentPos);
      mapInstanceRef.current.setZoom(15);
    }
  };

  const handleFitRoute = () => {
    if (mapInstanceRef.current && window.google?.maps) {
      const bounds = new window.google.maps.LatLngBounds();
      routeWaypoints.forEach((wp) => bounds.extend(wp));
      mapInstanceRef.current.fitBounds(bounds, 40);
    }
  };

  return (
    <div className="relative w-full h-[340px] overflow-hidden bg-[#f4f2ee] dark:bg-[#14181E] select-none">
      {/* 1. Real 2D Google Map Mode */}
      {!useLiteVector ? (
        <div ref={mapContainerRef} className="w-full h-full" />
      ) : (
        /* 2. Ultra-Lightweight Pure 2D Vector Map (Zero Lag, Instant Scroll) */
        <div className="relative w-full h-full bg-[#f0eee9] dark:bg-[#151921] overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 400 340" className="w-full h-full absolute inset-0" fill="none">
            {/* Coastline */}
            <path
              d="M 270 0 C 285 70 310 140 295 210 C 280 260 330 300 400 320 L 400 0 Z"
              fill={isDarkMode ? '#0f1722' : '#d2e3fc'}
            />
            {/* 2D Grid Roads */}
            <path d="M 0 90 L 280 90" stroke={isDarkMode ? '#202630' : '#ffffff'} strokeWidth="5" />
            <path d="M 0 170 L 290 170" stroke={isDarkMode ? '#202630' : '#ffffff'} strokeWidth="6" />
            <path d="M 0 250 L 280 250" stroke={isDarkMode ? '#202630' : '#ffffff'} strokeWidth="5" />
            <path d="M 110 0 L 110 340" stroke={isDarkMode ? '#202630' : '#ffffff'} strokeWidth="5" />
            <path d="M 210 0 L 210 340" stroke={isDarkMode ? '#202630' : '#ffffff'} strokeWidth="5" />

            {/* Labels */}
            <text x="30" y="80" fill={isDarkMode ? '#6e7681' : '#8c95a0'} fontSize="10" fontWeight="bold">
              KINONDONI
            </text>
            <text x="180" y="290" fill={isDarkMode ? '#6e7681' : '#8c95a0'} fontSize="11" fontWeight="bold">
              Dar es Salaam
            </text>
            <text x="210" y="130" fill={isDarkMode ? '#6e7681' : '#8c95a0'} fontSize="10" fontWeight="bold">
              MIKOCHENI B
            </text>

            {/* 2D Polyline Route */}
            <path
              d="M 80 85 L 140 85 L 140 150 L 220 150 L 220 205 L 290 205"
              stroke="#FF6B00"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Restaurant Pin */}
            <g transform="translate(68, 73)">
              <circle cx="12" cy="12" r="10" fill="#1A1D20" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="12" cy="12" r="3.5" fill="#FF6B00" />
            </g>

            {/* Destination Pin */}
            <g transform="translate(278, 193)">
              <circle cx="12" cy="12" r="11" fill="#FF6B00" stroke="#FFFFFF" strokeWidth="2" />
              <path d="M7 13l5-3.5 5 3.5v4.5h-10z" fill="#FFFFFF" />
            </g>

            {/* Animated Boda Boda 2D Rider */}
            <g transform={`translate(${130 + (riderProgress - 0.4) * 140}, ${140})`}>
              <circle cx="14" cy="14" r="14" fill="#FF6B00" opacity="0.2" className="animate-ping" />
              <circle cx="14" cy="14" r="10" fill="#FF6B00" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="11" cy="15" r="2" fill="#FFFFFF" />
              <circle cx="17" cy="15" r="2" fill="#FFFFFF" />
            </g>
          </svg>
        </div>
      )}

      {/* Floating Uber/Bolt Live ETA Header Card */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="bg-white/95 dark:bg-[#1E2228]/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-gray-100 dark:border-white/10 flex items-center gap-2 pointer-events-auto">
          <div className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
          <div>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block leading-none">
              Live ETA
            </span>
            <span className="text-xs font-black text-gray-900 dark:text-white">
              {orderStatus === 'delivered' ? 'Delivered' : `Arriving in ~${estimatedMinutes} min`}
            </span>
          </div>
        </div>

        {/* 2D Map / Mode Switcher */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setIsInteractive(!isInteractive)}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border shadow-xs transition-colors flex items-center gap-1 ${
              isInteractive
                ? 'bg-[#FF6B00] text-white border-[#FF6B00]'
                : 'bg-white/95 dark:bg-[#1E2228]/95 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-white/10'
            }`}
            title={isInteractive ? 'Lock scroll to page' : 'Unlock 1-finger map pan'}
          >
            {isInteractive ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3 text-[#FF6B00]" />}
            <span>{isInteractive ? 'Panning' : 'Easy Scroll'}</span>
          </button>

          <button
            onClick={() => setUseLiteVector(!useLiteVector)}
            className="px-2 py-1 rounded-xl bg-white/95 dark:bg-[#1E2228]/95 border border-gray-200 dark:border-white/10 text-[10px] font-bold text-gray-700 dark:text-gray-200 shadow-xs hover:text-[#FF6B00] transition-colors"
            title="Toggle between Google Map and ultra-fast 2D vector view"
          >
            {useLiteVector ? 'Google 2D' : 'Lite 2D'}
          </button>
        </div>
      </div>

      {/* Floating 2D Controls (Recenter & Fit) */}
      <div className="absolute right-3 bottom-3 z-10 flex flex-col gap-1.5">
        <button
          onClick={handleRecenterOnRider}
          className="w-8 h-8 rounded-xl bg-white/95 dark:bg-[#1E2228]/95 text-gray-800 dark:text-white shadow-md border border-gray-100 dark:border-white/10 flex items-center justify-center hover:text-[#FF6B00] transition-colors"
          title="Recenter on Rider"
        >
          <Target className="w-4 h-4" />
        </button>

        <button
          onClick={handleFitRoute}
          className="w-8 h-8 rounded-xl bg-white/95 dark:bg-[#1E2228]/95 text-gray-800 dark:text-white shadow-md border border-gray-100 dark:border-white/10 flex items-center justify-center hover:text-[#FF6B00] transition-colors"
          title="Fit Route"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>

      {/* Non-interactive scroll helper prompt */}
      {!isInteractive && !useLiteVector && (
        <div className="absolute bottom-2 left-3 pointer-events-none">
          <span className="bg-black/60 backdrop-blur-xs text-white text-[9px] px-2 py-0.5 rounded-md font-medium opacity-80">
            Swipe anywhere to scroll page
          </span>
        </div>
      )}
    </div>
  );
};
