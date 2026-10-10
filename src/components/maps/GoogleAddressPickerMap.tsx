import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { loadGoogleMaps, MAP_STYLES_LIGHT, MAP_STYLES_DARK } from '../../services/googleMapsLoader';
import { useApp } from '../../context/AppContext';
import { MAP_POI_LOCATIONS, MapPoiItem, calculateDistanceKm } from '../../data/mockData';
import {
  MapPin,
  LocateFixed,
  Plus,
  Minus,
  Building,
  ShoppingBag,
  UtensilsCrossed,
  Pill,
  Bike,
  Sparkles,
  Layers,
  Crosshair,
} from 'lucide-react';

interface GoogleAddressPickerMapProps {
  initialCoordinates?: { lat: number; lng: number };
  onLocationChange?: (coords: { lat: number; lng: number }, poi?: MapPoiItem) => void;
  className?: string;
  heightClass?: string;
  showZoomControls?: boolean;
  showPoiFilters?: boolean;
  showCenterPin?: boolean;
  isEdgeToEdge?: boolean;
  controlsBottomOffsetClass?: string;
  activePoiCategory?: string;
}

export const GoogleAddressPickerMap: React.FC<GoogleAddressPickerMapProps> = ({
  initialCoordinates = { lat: -6.7725, lng: 39.2483 }, // Mikocheni, Dar es Salaam
  onLocationChange,
  className = '',
  heightClass = 'h-full',
  showZoomControls = true,
  showPoiFilters = false, // on HomeScreen we render floating category chips
  showCenterPin = true,
  isEdgeToEdge = false,
  controlsBottomOffsetClass = 'bottom-36',
  activePoiCategory = 'all',
}) => {
  const { isDarkMode, currentCity } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const isUserInteractingRef = useRef<boolean>(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [currentCenter, setCurrentCenter] = useState<{ lat: number; lng: number }>(initialCoordinates);
  const [zoomLevel, setZoomLevel] = useState<number>(15);
  const [isLocating, setIsLocating] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedPoi, setSelectedPoi] = useState<MapPoiItem | null>(null);
  const [poiFilter, setPoiFilter] = useState<'all' | 'hospital' | 'shop' | 'restaurant' | 'transit'>('all');

  // Filter POIs matching current city and filter selection
  const effectiveFilter = activePoiCategory !== 'all' ? (activePoiCategory as any) : poiFilter;

  const cityFilteredPois = useMemo(() => {
    return MAP_POI_LOCATIONS.filter((poi) => {
      const cityMatches =
        poi.city.toLowerCase().includes(currentCity.name.toLowerCase()) ||
        currentCity.name.toLowerCase().includes(poi.city.toLowerCase());
      if (!cityMatches && poi.city !== 'Dar es Salaam') return false;
      if (effectiveFilter === 'all') return true;
      return poi.type === effectiveFilter;
    });
  }, [currentCity.name, effectiveFilter]);

  // Debounced notify parent of location changes to keep 60 FPS
  const notifyLocationChange = useCallback(
    (coords: { lat: number; lng: number }, poi?: MapPoiItem) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        if (onLocationChange) {
          onLocationChange(coords, poi);
        }
      }, 120);
    },
    [onLocationChange]
  );

  // Initialize or update Google Maps
  useEffect(() => {
    let isCancelled = false;

    loadGoogleMaps()
      .then((gMaps) => {
        if (isCancelled || !mapContainerRef.current) return;

        // If map already exists, update styles & resize
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setOptions({
            styles: isDarkMode ? MAP_STYLES_DARK : MAP_STYLES_LIGHT,
          });
          google.maps.event.trigger(mapInstanceRef.current, 'resize');
          return;
        }

        // Test vector rendering if available
        const renderingType = (gMaps.maps as any).RenderingType?.VECTOR || 'VECTOR';

        const map = new gMaps.maps.Map(mapContainerRef.current, {
          center: initialCoordinates,
          zoom: 15,
          mapTypeId: 'roadmap',
          tilt: 0,
          heading: 0,
          rotateControl: false,
          disableDefaultUI: true,
          clickableIcons: true,
          isFractionalZoomEnabled: false,
          gestureHandling: 'greedy', // Instant 1-finger / 1-touch response
          keyboardShortcuts: false,
          renderingType: renderingType as any,
          styles: isDarkMode ? MAP_STYLES_DARK : MAP_STYLES_LIGHT,
        });

        // Diagnostic log
        try {
          const actualRenderer = (map as any).getRenderingType?.() || 'VECTOR/ROADMAP';
          console.log('[Starches Google Maps Diagnostic]', {
            status: 'Initialized',
            requestedRenderingType: renderingType,
            actualRenderingType: actualRenderer,
            isVectorSupported: !!(window as any).WebGLRenderingContext,
          });
        } catch {
          // ignore
        }

        mapInstanceRef.current = map;

        map.addListener('dragstart', () => {
          isUserInteractingRef.current = true;
          setIsDragging(true);
          setSelectedPoi(null);
        });

        map.addListener('drag', () => {
          const center = map.getCenter();
          if (center) {
            setCurrentCenter({ lat: center.lat(), lng: center.lng() });
          }
        });

        map.addListener('dragend', () => {
          setIsDragging(false);
          const center = map.getCenter();
          if (center) {
            const coords = { lat: center.lat(), lng: center.lng() };
            setCurrentCenter(coords);
            notifyLocationChange(coords);
          }
          setTimeout(() => {
            isUserInteractingRef.current = false;
          }, 200);
        });

        map.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
            map.panTo(coords);
            setCurrentCenter(coords);
            notifyLocationChange(coords);
          }
        });

        map.addListener('zoom_changed', () => {
          const z = map.getZoom();
          if (z) setZoomLevel(z);
        });

        setMapLoaded(true);
      })
      .catch((err) => {
        console.warn('Google Maps API fallback activated:', err);
      });

    return () => {
      isCancelled = true;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // ResizeObserver to handle container size changes cleanly
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (mapInstanceRef.current && window.google?.maps) {
        google.maps.event.trigger(mapInstanceRef.current, 'resize');
      }
    });
    observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, [mapLoaded]);

  // Sync styles on theme change
  useEffect(() => {
    if (mapInstanceRef.current && window.google?.maps) {
      mapInstanceRef.current.setOptions({
        styles: isDarkMode ? MAP_STYLES_DARK : MAP_STYLES_LIGHT,
      });
    }
  }, [isDarkMode]);

  // Sync center when initialCoordinates changed externally
  useEffect(() => {
    if (mapInstanceRef.current && initialCoordinates && !isUserInteractingRef.current) {
      const current = mapInstanceRef.current.getCenter();
      if (current) {
        const dLat = Math.abs(current.lat() - initialCoordinates.lat);
        const dLng = Math.abs(current.lng() - initialCoordinates.lng);
        if (dLat > 0.0003 || dLng > 0.0003) {
          mapInstanceRef.current.panTo(initialCoordinates);
          setCurrentCenter(initialCoordinates);
        }
      }
    }
  }, [initialCoordinates?.lat, initialCoordinates?.lng]);

  // Render Bolt / Uber Eats styled POI markers on Google Maps
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google?.maps) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    cityFilteredPois.forEach((poi) => {
      // Pick color and icon based on type
      let pinColor = '#EF4444'; // Red for Hospital
      let labelSymbol = '🏥';

      if (poi.type === 'shop') {
        pinColor = '#3B82F6'; // Blue for Shops / Malls
        labelSymbol = '🛒';
      } else if (poi.type === 'restaurant') {
        pinColor = '#FF6B00'; // Orange for Food
        labelSymbol = '🍔';
      } else if (poi.type === 'transit') {
        pinColor = '#10B981'; // Green for Transit / Boda
        labelSymbol = '🛵';
      } else if (poi.type === 'pharmacy') {
        pinColor = '#059669'; // Emerald for Pharmacy
        labelSymbol = '💊';
      }

      // SVG data URL for crisp Bolt/Uber marker
      const svgIcon = {
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
        fillColor: pinColor,
        fillOpacity: 1,
        strokeWeight: 1.5,
        strokeColor: '#FFFFFF',
        scale: 1.3,
        anchor: new window.google.maps.Point(12, 22),
      };

      const marker = new window.google.maps.Marker({
        position: poi.coordinates,
        map: mapInstanceRef.current,
        title: `${labelSymbol} ${poi.name} (${poi.categoryLabel})`,
        icon: svgIcon,
        optimized: true,
      });

      marker.addListener('click', () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo(poi.coordinates);
          mapInstanceRef.current.setZoom(17);
        }
        setCurrentCenter(poi.coordinates);
        setSelectedPoi(poi);
        notifyLocationChange(poi.coordinates, poi);
      });

      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
    };
  }, [cityFilteredPois, isDarkMode]);

  // Zoom handlers
  const handleZoom = (delta: number) => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom() || 15;
      const nextZoom = Math.max(12, Math.min(19, currentZoom + delta));
      mapInstanceRef.current.setZoom(nextZoom);
      setZoomLevel(nextZoom);
    } else {
      setZoomLevel((prev) => Math.max(12, Math.min(19, prev + delta)));
    }
  };

  // GPS Locate Me handler
  const handleLocateMe = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          if (mapInstanceRef.current) {
            mapInstanceRef.current.panTo(coords);
            mapInstanceRef.current.setZoom(17);
          }
          setCurrentCenter(coords);
          setSelectedPoi(null);
          notifyLocationChange(coords);
        },
        () => {
          setIsLocating(false);
          // Default fallback to Mikocheni, Dar es Salaam
          const coords = { lat: -6.7725, lng: 39.2483 };
          if (mapInstanceRef.current) {
            mapInstanceRef.current.panTo(coords);
          }
          setCurrentCenter(coords);
          notifyLocationChange(coords);
        },
        { timeout: 5000, enableHighAccuracy: true }
      );
    } else {
      setIsLocating(false);
    }
  };

  // Select POI from UI badge
  const handleSelectPoi = (poi: MapPoiItem) => {
    setSelectedPoi(poi);
    setCurrentCenter(poi.coordinates);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo(poi.coordinates);
      mapInstanceRef.current.setZoom(17);
    }
    notifyLocationChange(poi.coordinates, poi);
  };

  // Helper icon for POI badge
  const getPoiIcon = (type: string) => {
    switch (type) {
      case 'hospital':
        return <Building className="w-3.5 h-3.5 text-red-500" />;
      case 'shop':
        return <ShoppingBag className="w-3.5 h-3.5 text-blue-500" />;
      case 'restaurant':
        return <UtensilsCrossed className="w-3.5 h-3.5 text-orange-500" />;
      case 'pharmacy':
        return <Pill className="w-3.5 h-3.5 text-emerald-500" />;
      case 'transit':
        return <Bike className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />;
    }
  };

  return (
    <div
      className={`relative ${heightClass} w-full ${
        isEdgeToEdge
          ? 'rounded-none border-none shadow-none'
          : 'rounded-2xl overflow-hidden border-2 border-gray-900/10 dark:border-white/10 shadow-lg'
      } ${className}`}
    >
      {/* 1. Interactive Map Container (Loads Google Maps or Vector Canvas) */}
      <div
        ref={mapContainerRef}
        className="w-full h-full touch-pan-x touch-pan-y cursor-grab active:cursor-grabbing bg-[#f1f3f5] dark:bg-[#0f172a]"
      />

      {/* 2. Bolt Food / Uber Eats Top POI Filter Bar (Optional if shown in parent) */}
      {showPoiFilters && (
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar z-10 pointer-events-auto">
          <button
            type="button"
            onClick={() => setPoiFilter('all')}
            className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-black transition-all shadow-md backdrop-blur-md flex items-center gap-1 ${
              poiFilter === 'all'
                ? 'bg-gray-950 text-white dark:bg-white dark:text-gray-950 border border-transparent'
                : 'bg-white/95 dark:bg-[#1E2228]/95 text-gray-700 dark:text-gray-200 border border-black/10 hover:border-gray-400'
            }`}
          >
            <Layers className="w-3 h-3 text-[#FF6B00]" />
            <span>All Icons</span>
          </button>

          <button
            type="button"
            onClick={() => setPoiFilter('hospital')}
            className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-black transition-all shadow-md backdrop-blur-md flex items-center gap-1 ${
              poiFilter === 'hospital'
                ? 'bg-red-600 text-white border border-transparent'
                : 'bg-white/95 dark:bg-[#1E2228]/95 text-red-600 dark:text-red-400 border border-black/10 hover:border-red-400'
            }`}
          >
            <span>🏥</span>
            <span>Hospitals</span>
          </button>

          <button
            type="button"
            onClick={() => setPoiFilter('shop')}
            className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-black transition-all shadow-md backdrop-blur-md flex items-center gap-1 ${
              poiFilter === 'shop'
                ? 'bg-blue-600 text-white border border-transparent'
                : 'bg-white/95 dark:bg-[#1E2228]/95 text-blue-600 dark:text-blue-400 border border-black/10 hover:border-blue-400'
            }`}
          >
            <span>🛒</span>
            <span>Shops & Malls</span>
          </button>

          <button
            type="button"
            onClick={() => setPoiFilter('restaurant')}
            className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-black transition-all shadow-md backdrop-blur-md flex items-center gap-1 ${
              poiFilter === 'restaurant'
                ? 'bg-orange-500 text-white border border-transparent'
                : 'bg-white/95 dark:bg-[#1E2228]/95 text-orange-600 dark:text-orange-400 border border-black/10 hover:border-orange-400'
            }`}
          >
            <span>🍔</span>
            <span>Food Spots</span>
          </button>

          <button
            type="button"
            onClick={() => setPoiFilter('transit')}
            className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-black transition-all shadow-md backdrop-blur-md flex items-center gap-1 ${
              poiFilter === 'transit'
                ? 'bg-emerald-600 text-white border border-transparent'
                : 'bg-white/95 dark:bg-[#1E2228]/95 text-emerald-600 dark:text-emerald-400 border border-black/10 hover:border-emerald-400'
            }`}
          >
            <span>🛵</span>
            <span>Boda Stands</span>
          </button>
        </div>
      )}

      {/* 3. Bolt / Uber Style Central Delivery Target Pin */}
      {showCenterPin && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center -translate-y-4 z-20">
          <div className="relative flex flex-col items-center">
            {/* Floating 'Drop-off here' tooltip above pin */}
            <div
              className={`bg-gray-950/90 dark:bg-white/95 text-white dark:text-gray-950 font-black text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-lg border border-white/20 mb-1 transition-all duration-200 flex items-center gap-1 ${
                isDragging ? '-translate-y-3 scale-105 opacity-100' : 'translate-y-0 opacity-90'
              }`}
            >
              <Sparkles className="w-2.5 h-2.5 text-[#FF6B00]" />
              <span>Drop food here</span>
            </div>

            {/* Central Pin Body */}
            <div
              className={`w-10 h-10 rounded-full bg-[#FF6B00] text-white flex items-center justify-center shadow-2xl border-[3px] border-white ring-4 ring-orange-500/30 transition-transform duration-150 ${
                isDragging ? '-translate-y-3 scale-110 shadow-orange-500/50' : 'translate-y-0 scale-100'
              }`}
            >
              <MapPin className="w-5 h-5 fill-white text-white drop-shadow-sm" />
            </div>

            {/* Realistic Ground Shadow */}
            <div
              className={`w-3.5 h-1.5 bg-black/60 rounded-full blur-[1px] mt-0.5 transition-all duration-150 ${
                isDragging ? 'scale-75 opacity-20' : 'scale-100 opacity-70'
              }`}
            />
          </div>
        </div>
      )}

      {/* 4. Active Selected POI Highlight Pill (When user clicked hospital/shop/etc) */}
      {selectedPoi && !isDragging && (
        <div className={`absolute ${controlsBottomOffsetClass} left-3 right-16 z-20 pointer-events-auto animate-in slide-in-from-bottom duration-200`}>
          <div className="bg-white/95 dark:bg-[#1E2228]/95 backdrop-blur-md p-2.5 rounded-2xl shadow-xl border-2 border-[#FF6B00] flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/80 text-[#FF6B00] flex items-center justify-center flex-shrink-0">
              {getPoiIcon(selectedPoi.type)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FF6B00]">
                  {selectedPoi.categoryLabel}
                </span>
                <span className="text-[10px] text-gray-400 font-semibold">• Deliver here</span>
              </div>
              <p className="text-xs font-black text-gray-900 dark:text-white truncate leading-tight">
                {selectedPoi.name}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                {selectedPoi.addressSnippet}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. Floating Controls: GPS Locate Me + Zoom Buttons */}
      {showZoomControls && (
        <div className={`absolute ${controlsBottomOffsetClass} right-3 flex flex-col gap-1.5 z-20 pointer-events-auto`}>
          <button
            type="button"
            onClick={handleLocateMe}
            className="p-2.5 rounded-xl bg-white dark:bg-[#1E2228] text-[#FF6B00] shadow-xl border border-gray-200 dark:border-white/10 hover:bg-orange-50 dark:hover:bg-orange-950/40 transition-colors flex items-center justify-center active:scale-95 group"
            title="GPS My Location"
            aria-label="Use Current GPS Location"
          >
            <LocateFixed className={`w-4 h-4 ${isLocating ? 'animate-spin' : 'group-hover:scale-110'}`} />
          </button>

          <div className="flex flex-col bg-white dark:bg-[#1E2228] rounded-xl shadow-xl border border-gray-200 dark:border-white/10 overflow-hidden divide-y divide-gray-100 dark:divide-white/5">
            <button
              type="button"
              onClick={() => handleZoom(1)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex items-center justify-center active:scale-95"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <Plus className="w-3.5 h-3.5 font-bold" />
            </button>
            <button
              type="button"
              onClick={() => handleZoom(-1)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex items-center justify-center active:scale-95"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <Minus className="w-3.5 h-3.5 font-bold" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
