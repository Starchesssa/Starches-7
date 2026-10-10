import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CATEGORIES,
  POPULAR_DELIVERY_ZONES,
  MAP_POI_LOCATIONS,
  PopularDeliveryZone,
  MapPoiItem,
  calculateDistanceKm,
} from '../../data/mockData';
import { GoogleAddressPickerMap } from '../maps/GoogleAddressPickerMap';
import { Logo } from '../common/Logo';
import { ThemeToggle } from '../common/ThemeToggle';
import {
  UtensilsCrossed,
  Beef,
  Pizza,
  Soup,
  CupSoda,
  ShoppingBag,
  Croissant,
  Pill,
  Star,
  MapPin,
  Clock,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Percent,
  Search,
  X,
  Layers,
  Building,
  Bike,
  Globe,
  Bell,
  Heart,
  ShieldCheck,
} from 'lucide-react';
import { Store } from '../../types';

type SheetState = 'collapsed' | 'half' | 'expanded';

export const HomeScreen: React.FC = () => {
  const {
    stores,
    products,
    selectedCategory,
    setSelectedCategory,
    navigateTo,
    currentAddress,
    currentCity,
    accessibleStoresCount,
    setIsDropoffMapPickerOpen,
    setDropoffLocation,
    language,
    setLanguage,
    isDarkMode,
    notifications,
    setIsNotificationsOpen,
    t,
  } = useApp();

  const [sheetState, setSheetState] = useState<SheetState>('collapsed');
  const [activeFilter, setActiveFilter] = useState<'all' | 'open' | 'top_rated' | 'fast'>('all');
  const [deliverySearchQuery, setDeliverySearchQuery] = useState('');
  const [activePoiCategory, setActivePoiCategory] = useState<string>('all');
  const [dragStartY, setDragStartY] = useState<number | null>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Autocomplete matching for Delivery Search
  const searchResults = useMemo<{ pois: MapPoiItem[]; zones: PopularDeliveryZone[] }>(() => {
    if (!deliverySearchQuery.trim()) return { pois: [], zones: [] };
    const q = deliverySearchQuery.toLowerCase().trim();

    const matchedPois = MAP_POI_LOCATIONS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.ward.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.addressSnippet.toLowerCase().includes(q)
    ).slice(0, 5);

    const matchedZones = POPULAR_DELIVERY_ZONES.filter(
      (z) =>
        z.name.toLowerCase().includes(q) ||
        z.district.toLowerCase().includes(q) ||
        z.popularLandmark.toLowerCase().includes(q) ||
        z.city.toLowerCase().includes(q)
    ).slice(0, 5);

    return { pois: matchedPois, zones: matchedZones };
  }, [deliverySearchQuery]);

  const handleSelectZone = (zone: PopularDeliveryZone) => {
    setDropoffLocation({
      ward: zone.name,
      district: zone.district,
      city: zone.city,
      landmark: zone.popularLandmark,
      coordinates: zone.coordinates,
    });
    setDeliverySearchQuery('');
  };

  const handleSelectPoi = (poi: MapPoiItem) => {
    setDropoffLocation({
      ward: poi.ward,
      district: poi.district,
      city: poi.city,
      landmark: `${poi.name} (${poi.addressSnippet})`,
      coordinates: poi.coordinates,
    });
    setDeliverySearchQuery('');
  };

  const handleMapLocationChange = (coords: { lat: number; lng: number }, poi?: MapPoiItem) => {
    if (poi) {
      handleSelectPoi(poi);
      return;
    }
    setDropoffLocation({
      ward: currentAddress.ward || 'Selected Pin',
      district: currentAddress.district,
      city: currentAddress.city,
      coordinates: coords,
    });
  };

  // Category Icon resolver
  const getCategoryIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'Beef':
        return <Beef className={className} />;
      case 'Pizza':
        return <Pizza className={className} />;
      case 'Soup':
        return <Soup className={className} />;
      case 'CupSoda':
        return <CupSoda className={className} />;
      case 'ShoppingBag':
        return <ShoppingBag className={className} />;
      case 'Croissant':
        return <Croissant className={className} />;
      case 'Pill':
        return <Pill className={className} />;
      default:
        return <UtensilsCrossed className={className} />;
    }
  };

  // Filter stores
  const filteredStores = stores.filter((store) => {
    if (selectedCategory !== 'all' && !store.categories.includes(selectedCategory)) {
      return false;
    }
    if (activeFilter === 'open' && !store.isOpen) return false;
    if (activeFilter === 'top_rated' && store.rating < 4.6) return false;
    if (activeFilter === 'fast' && store.deliveryTimeMinutes.max > 35) return false;
    return true;
  });

  const popularStores = stores.filter((s) => s.isPopular || s.rating >= 4.5);

  // Bottom Sheet Drag Handlers
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStartY(clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (dragStartY === null) return;
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;
    const deltaY = clientY - dragStartY;
    setDragStartY(null);

    // Threshold of 40px
    if (deltaY < -40) {
      // Swiped UP: expand
      if (sheetState === 'collapsed') setSheetState('half');
      else if (sheetState === 'half') setSheetState('expanded');
    } else if (deltaY > 40) {
      // Swiped DOWN: collapse
      if (sheetState === 'expanded') setSheetState('half');
      else if (sheetState === 'half') setSheetState('collapsed');
    }
  };

  const cycleSheetState = () => {
    if (sheetState === 'collapsed') setSheetState('half');
    else if (sheetState === 'half') setSheetState('expanded');
    else setSheetState('collapsed');
  };

  // Determine Sheet height class
  const getSheetHeightClasses = () => {
    switch (sheetState) {
      case 'collapsed':
        return 'h-[142px]';
      case 'half':
        return 'h-[52vh]';
      case 'expanded':
        return 'h-[calc(100vh-76px)]';
    }
  };

  // Controls bottom offset for GPS and Zoom buttons on the map
  const getControlsOffsetClass = () => {
    switch (sheetState) {
      case 'collapsed':
        return 'bottom-[155px]';
      case 'half':
        return 'bottom-[54vh]';
      case 'expanded':
        return 'bottom-[20px]';
    }
  };

  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] overflow-hidden bg-[#FAF7F2] dark:bg-[#121417] text-gray-900 dark:text-gray-100 flex flex-col">
      {/* =========================================================================
          1. FULL-SCREEN, EDGE-TO-EDGE 2D GOOGLE MAP CANVAS
          ========================================================================= */}
      <div className="absolute inset-0 w-full h-full z-0">
        <GoogleAddressPickerMap
          initialCoordinates={currentAddress.coordinates || { lat: -6.7725, lng: 39.2483 }}
          onLocationChange={handleMapLocationChange}
          isEdgeToEdge={true}
          heightClass="h-full"
          showZoomControls={sheetState !== 'expanded'}
          showPoiFilters={false}
          showCenterPin={sheetState !== 'expanded'}
          controlsBottomOffsetClass={getControlsOffsetClass()}
          activePoiCategory={activePoiCategory}
          className="w-full h-full"
        />
      </div>

      {/* =========================================================================
          2. FLOATING TOP OVERLAY: BRAND, LOCATION, SEARCH & POI CATEGORIES
          ========================================================================= */}
      <div className="absolute top-0 left-0 right-0 z-20 max-w-md mx-auto p-3 space-y-2 pointer-events-none">
        {/* Top Header Card: Brand + Deliver To + Theme & Lang Controls */}
        <div className="bg-white/95 dark:bg-[#1A1D22]/95 backdrop-blur-md rounded-2xl shadow-lg border border-black/10 dark:border-white/10 px-3.5 py-2.5 flex items-center justify-between pointer-events-auto transition-colors">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => setSheetState('collapsed')}
              className="focus:outline-none flex items-center text-left flex-shrink-0"
              aria-label="Starches Home"
            >
              <Logo size="sm" isDark={isDarkMode} />
            </button>

            {/* Delivery address button */}
            <button
              type="button"
              onClick={() => setIsDropoffMapPickerOpen(true)}
              className="flex items-center gap-1.5 min-w-0 text-left hover:opacity-80 transition-opacity pl-1"
            >
              <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950/70 flex items-center justify-center text-[#FF6B00] flex-shrink-0">
                <MapPin className="w-3.5 h-3.5 fill-[#FF6B00]" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 block leading-tight">
                  {t.deliverTo}
                </span>
                <span className="text-xs font-black text-gray-900 dark:text-white truncate flex items-center gap-0.5 leading-tight">
                  {currentAddress.ward || currentAddress.district || currentCity.name}
                  <ChevronDown className="w-3 h-3 text-[#FF6B00]" />
                </span>
              </div>
            </button>
          </div>

          {/* Top Right Controls: Theme + Lang + Notifications */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <ThemeToggle showLabels={false} />

            <button
              type="button"
              onClick={() => setLanguage(language === 'en' ? 'sw' : 'en')}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-extrabold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-white/10 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
              title="Toggle English / Kiswahili"
            >
              <Globe className="w-3 h-3 text-[#FF6B00]" />
              <span>{language === 'en' ? 'EN' : 'SW'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF6B00] ring-2 ring-white dark:ring-[#121417]"></span>
              )}
            </button>
          </div>
        </div>

        {/* Delivery Address Search Bar with Live Autocomplete Dropdown */}
        <div className="relative pointer-events-auto">
          <div className="relative bg-white/95 dark:bg-[#1A1D22]/95 backdrop-blur-md rounded-2xl shadow-lg border border-black/10 dark:border-white/10 overflow-hidden">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#FF6B00]" />
            <input
              type="text"
              value={deliverySearchQuery}
              onChange={(e) => setDeliverySearchQuery(e.target.value)}
              placeholder={
                language === 'sw'
                  ? 'Tafuta eneo au duka (Mikocheni, Aga Khan, Samaki...)'
                  : 'Search delivery address, hospital, or shop...'
              }
              className="w-full pl-10 pr-9 py-2.5 bg-transparent text-xs text-gray-900 dark:text-gray-100 focus:outline-none font-semibold placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
            {deliverySearchQuery && (
              <button
                type="button"
                onClick={() => setDeliverySearchQuery('')}
                className="absolute right-3 top-2.5 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {deliverySearchQuery.trim().length > 0 && (
            <div className="absolute top-12 left-0 right-0 z-30 bg-white dark:bg-[#1A1D22] rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 max-h-56 overflow-y-auto divide-y divide-gray-100 dark:divide-white/5 animate-in fade-in duration-150">
              {searchResults.pois.map((poi) => (
                <button
                  key={poi.id}
                  type="button"
                  onClick={() => handleSelectPoi(poi)}
                  className="w-full text-left p-2.5 hover:bg-orange-50 dark:hover:bg-orange-950/30 flex items-center gap-2.5 transition-colors"
                >
                  <span className="text-base">
                    {poi.type === 'hospital' ? '🏥' : poi.type === 'shop' ? '🛒' : poi.type === 'restaurant' ? '🍔' : '🛵'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black text-gray-900 dark:text-white truncate">
                      {poi.name}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                      {poi.categoryLabel} • {poi.addressSnippet}
                    </p>
                  </div>
                </button>
              ))}

              {searchResults.zones.map((zone) => (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => handleSelectZone(zone)}
                  className="w-full text-left p-2.5 hover:bg-orange-50 dark:hover:bg-orange-950/30 flex items-center gap-2.5 transition-colors"
                >
                  <span className="text-base">📍</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black text-gray-900 dark:text-white truncate">
                      {zone.name}, {zone.district}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                      {zone.popularLandmark}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Floating POI Category Filters (All Icons, Hospitals, Shops, Food, Boda) */}
        {sheetState !== 'expanded' && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pointer-events-auto py-0.5">
            <button
              type="button"
              onClick={() => setActivePoiCategory('all')}
              className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-black transition-all shadow-md backdrop-blur-md flex items-center gap-1 ${
                activePoiCategory === 'all'
                  ? 'bg-gray-950 text-white dark:bg-white dark:text-gray-950 border border-transparent'
                  : 'bg-white/95 dark:bg-[#1E2228]/95 text-gray-700 dark:text-gray-200 border border-black/10 hover:border-gray-400'
              }`}
            >
              <Layers className="w-3 h-3 text-[#FF6B00]" />
              <span>All Icons</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePoiCategory('hospital')}
              className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-black transition-all shadow-md backdrop-blur-md flex items-center gap-1 ${
                activePoiCategory === 'hospital'
                  ? 'bg-red-600 text-white border border-transparent'
                  : 'bg-white/95 dark:bg-[#1E2228]/95 text-red-600 dark:text-red-400 border border-black/10 hover:border-red-400'
              }`}
            >
              <span>🏥</span>
              <span>Hospitals</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePoiCategory('shop')}
              className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-black transition-all shadow-md backdrop-blur-md flex items-center gap-1 ${
                activePoiCategory === 'shop'
                  ? 'bg-blue-600 text-white border border-transparent'
                  : 'bg-white/95 dark:bg-[#1E2228]/95 text-blue-600 dark:text-blue-400 border border-black/10 hover:border-blue-400'
              }`}
            >
              <span>🛒</span>
              <span>Shops & Malls</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePoiCategory('restaurant')}
              className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-black transition-all shadow-md backdrop-blur-md flex items-center gap-1 ${
                activePoiCategory === 'restaurant'
                  ? 'bg-orange-500 text-white border border-transparent'
                  : 'bg-white/95 dark:bg-[#1E2228]/95 text-orange-600 dark:text-orange-400 border border-black/10 hover:border-orange-400'
              }`}
            >
              <span>🍔</span>
              <span>Food Spots</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePoiCategory('transit')}
              className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-black transition-all shadow-md backdrop-blur-md flex items-center gap-1 ${
                activePoiCategory === 'transit'
                  ? 'bg-emerald-600 text-white border border-transparent'
                  : 'bg-white/95 dark:bg-[#1E2228]/95 text-emerald-600 dark:text-emerald-400 border border-black/10 hover:border-emerald-400'
              }`}
            >
              <span>🛵</span>
              <span>Boda Stands</span>
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          3. DRAGGABLE RESTAURANT DISCOVERY BOTTOM SHEET
          (Collapsed: 142px preview; Half: 52vh; Expanded: full scrollable list)
          ========================================================================= */}
      <div
        className={`fixed bottom-[60px] left-0 right-0 z-30 max-w-md mx-auto bg-white dark:bg-[#16191E] rounded-t-3xl shadow-2xl border-t border-black/10 dark:border-white/10 flex flex-col transition-all duration-300 ease-out ${getSheetHeightClasses()}`}
      >
        {/* DRAG HANDLE & PEAK HEADER */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseUp={handleTouchEnd}
          onClick={cycleSheetState}
          className="pt-2.5 pb-2 px-4 cursor-grab active:cursor-grabbing flex flex-col items-center flex-shrink-0 border-b border-gray-100 dark:border-white/5 select-none"
        >
          {/* Subtle Pill Handle */}
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-white/20 rounded-full mb-2 hover:bg-[#FF6B00] transition-colors" />

          {/* Delivery Status & Store Count Row */}
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3.5 h-3.5 fill-emerald-600" />
              </div>
              <div className="min-w-0 leading-tight">
                <p className="text-xs font-black text-gray-900 dark:text-white truncate">
                  {accessibleStoresCount} {language === 'sw' ? 'Migahawa & Maduka' : 'Restaurants & Stores Nearby'}
                </p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  ✓ {language === 'sw' ? 'Yanafikisha kwa Boda' : 'Delivering via Swift Boda'} • ~15-25 min
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-[11px] font-extrabold text-[#FF6B00] bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 px-2.5 py-1 rounded-xl transition-colors border border-orange-200/50 flex items-center gap-1">
                <span>{sheetState === 'collapsed' ? 'Explore ↗' : sheetState === 'half' ? 'Full View ↗' : 'Show Map ▾'}</span>
                {sheetState === 'expanded' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </span>
            </div>
          </div>
        </div>

        {/* SHEET CONTENT AREA */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 no-scrollbar">
          {/* A. Collapsed Peek: Quick Category Pills */}
          {sheetState === 'collapsed' && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <button
                  key={cat.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategory(cat.id);
                    setSheetState('half');
                  }}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? 'bg-[#FF6B00] text-white border-[#FF6B00]'
                      : 'bg-gray-50 dark:bg-[#1E2228] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10'
                  }`}
                >
                  {getCategoryIcon(cat.icon, 'w-3.5 h-3.5')}
                  <span>{language === 'sw' ? cat.nameSw : cat.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* B. Half or Expanded State Content */}
          {sheetState !== 'collapsed' && (
            <>
              {/* Special Deal Promo Banner (Screen 2 & 10 mockup) */}
              <div
                onClick={() => navigateTo('restaurant_detail', { storeId: 'store-mamboz' })}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FF5500] via-[#FF6B00] to-[#FFA048] p-4 text-white shadow-md cursor-pointer group transition-transform active:scale-[0.99]"
              >
                <div className="relative z-10 max-w-[62%]">
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full mb-1">
                    <Percent className="w-3 h-3" />
                    Special Deal
                  </span>
                  <h3
                    className="text-base font-black leading-tight drop-shadow-xs"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {t.heroTitle}
                  </h3>
                  <p className="text-[11px] text-white/90 font-medium mt-0.5 leading-snug line-clamp-2">
                    {t.heroSubtitle}
                  </p>
                  <div className="mt-2.5 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-[#FF6B00] shadow-sm group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                </div>

                <div className="absolute -right-3 -bottom-2 w-32 h-32 group-hover:scale-105 transition-transform duration-300">
                  <img
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80"
                    alt="Burger Promo"
                    className="w-full h-full object-contain drop-shadow-xl"
                  />
                </div>
              </div>

              {/* Category Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {language === 'sw' ? 'Makundi ya Chakula' : 'Food Categories'}
                  </h4>
                  {selectedCategory !== 'all' && (
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="text-[11px] font-bold text-[#FF6B00] hover:underline"
                    >
                      {language === 'sw' ? 'Onyesha Yote' : 'Clear filter'}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex-shrink-0 flex flex-col items-center justify-center p-2.5 rounded-2xl transition-all ${
                          isSelected
                            ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/20 scale-105 font-bold'
                            : 'bg-white dark:bg-[#1E2228] text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-white/5 hover:border-orange-300'
                        }`}
                        style={{ minWidth: '70px' }}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1 ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-orange-50 dark:bg-orange-950/40 text-[#FF6B00]'
                          }`}
                        >
                          {getCategoryIcon(cat.icon, 'w-4 h-4')}
                        </div>
                        <span className="text-[11px] font-extrabold tracking-tight whitespace-nowrap">
                          {language === 'sw' ? cat.nameSw : cat.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filter Chips Row */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                    activeFilter === 'all'
                      ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 border-transparent'
                      : 'bg-gray-100 dark:bg-[#1E2228] text-gray-600 dark:text-gray-300 border-transparent hover:border-gray-300'
                  }`}
                >
                  {language === 'sw' ? 'Yote' : 'All'}
                </button>
                <button
                  onClick={() => setActiveFilter('open')}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                    activeFilter === 'open'
                      ? 'bg-emerald-600 text-white border-transparent'
                      : 'bg-gray-100 dark:bg-[#1E2228] text-gray-600 dark:text-gray-300 border-transparent hover:border-gray-300'
                  }`}
                >
                  {t.openNow}
                </button>
                <button
                  onClick={() => setActiveFilter('top_rated')}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                    activeFilter === 'top_rated'
                      ? 'bg-amber-500 text-white border-transparent'
                      : 'bg-gray-100 dark:bg-[#1E2228] text-gray-600 dark:text-gray-300 border-transparent hover:border-gray-300'
                  }`}
                >
                  ★ {t.topRated}
                </button>
                <button
                  onClick={() => setActiveFilter('fast')}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                    activeFilter === 'fast'
                      ? 'bg-blue-600 text-white border-transparent'
                      : 'bg-gray-100 dark:bg-[#1E2228] text-gray-600 dark:text-gray-300 border-transparent hover:border-gray-300'
                  }`}
                >
                  ⚡ &lt;35 min
                </button>
              </div>

              {/* Restaurant Cards List */}
              <div className="space-y-3 pb-8">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-gray-900 dark:text-white">
                    {language === 'sw' ? 'Migahawa Karibu Nawe' : 'Nearby Restaurants'}
                  </h4>
                  <span className="text-[11px] text-gray-400 font-bold">
                    {filteredStores.length} {language === 'sw' ? 'inapatikana' : 'available'}
                  </span>
                </div>

                {filteredStores.map((store) => (
                  <div
                    key={store.id}
                    onClick={() => navigateTo('restaurant_detail', { storeId: store.id })}
                    className="bg-white dark:bg-[#1A1D22] rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex gap-3 p-2.5 items-center"
                  >
                    {/* Store Image */}
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                      <img
                        src={store.heroImage || store.logoImage}
                        alt={store.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {!store.isOpen && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-[10px] font-black uppercase text-white bg-red-600/90 px-1.5 py-0.5 rounded">
                            Closed
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Store Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h5 className="text-xs font-black text-gray-900 dark:text-white truncate group-hover:text-[#FF6B00] transition-colors">
                          {store.name}
                        </h5>
                        <div className="flex items-center gap-0.5 text-[11px] font-black text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded-lg flex-shrink-0">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>{store.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {store.categories.join(' • ')} • {store.district || store.address}
                      </p>

                      <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-600 dark:text-gray-300 font-semibold">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#FF6B00]" />
                          <span>{store.deliveryTimeMinutes.min}-{store.deliveryTimeMinutes.max} min</span>
                        </span>
                        <span>•</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {store.deliveryFee === 0 ? 'Free delivery' : `TZS ${store.deliveryFee.toLocaleString()}`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
