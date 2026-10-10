import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { GoogleAddressPickerMap } from '../maps/GoogleAddressPickerMap';
import {
  POPULAR_DELIVERY_ZONES,
  MAP_POI_LOCATIONS,
  calculateDistanceKm,
  PopularDeliveryZone,
  MapPoiItem,
} from '../../data/mockData';
import {
  MapPin,
  Search,
  Navigation,
  CheckCircle2,
  Building,
  ArrowRight,
  X,
  Compass,
  AlertTriangle,
  Sparkles,
  Store as StoreIcon,
  Clock,
  Bike,
  ShoppingBag,
  UtensilsCrossed,
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { ThemeToggle } from '../common/ThemeToggle';

interface DropoffLocationModalProps {
  isOpen: boolean;
  onClose?: () => void;
  isInitialSetup?: boolean; // When shown before entering the app
}

export const DropoffLocationModal: React.FC<DropoffLocationModalProps> = ({
  isOpen,
  onClose,
  isInitialSetup = false,
}) => {
  const {
    currentAddress,
    currentCity,
    selectCity,
    cities,
    setDropoffLocation,
    isDarkMode,
    language,
    t,
  } = useApp();

  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number }>(
    currentAddress.coordinates || { lat: -6.7725, lng: 39.2483 }
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWard, setSelectedWard] = useState(currentAddress.ward || 'Mikocheni B');
  const [selectedDistrict, setSelectedDistrict] = useState(currentAddress.district || 'Kinondoni');
  const [selectedCityName, setSelectedCityName] = useState(currentAddress.city || currentCity.name);
  const [landmark, setLandmark] = useState(currentAddress.landmark || '');
  const [instructions, setInstructions] = useState(currentAddress.deliveryInstructions || '');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [unsupportedCityMsg, setUnsupportedCityMsg] = useState<string | null>(null);
  const [activePoi, setActivePoi] = useState<MapPoiItem | null>(null);

  // Sync coords if currentAddress changes
  useEffect(() => {
    if (currentAddress.coordinates) {
      setSelectedCoords(currentAddress.coordinates);
      setSelectedWard(currentAddress.ward);
      setSelectedDistrict(currentAddress.district);
      setSelectedCityName(currentAddress.city);
    }
  }, [currentAddress]);

  // Find nearest known neighborhood zone based on pin coordinates
  const nearestZone = useMemo(() => {
    let bestZone: PopularDeliveryZone | null = null;
    let minDistance = Infinity;

    for (const zone of POPULAR_DELIVERY_ZONES) {
      const d = calculateDistanceKm(
        selectedCoords.lat,
        selectedCoords.lng,
        zone.coordinates.lat,
        zone.coordinates.lng
      );
      if (d < minDistance) {
        minDistance = d;
        bestZone = zone;
      }
    }

    return { zone: bestZone, distance: minDistance };
  }, [selectedCoords.lat, selectedCoords.lng]);

  // When coordinates pan or user taps a POI on the map
  const handleMapLocationChange = (coords: { lat: number; lng: number }, poi?: MapPoiItem) => {
    setSelectedCoords(coords);
    if (poi) {
      setActivePoi(poi);
      setSelectedWard(poi.ward);
      setSelectedDistrict(poi.district);
      setSelectedCityName(poi.city);
      setLandmark(`${poi.name} (${poi.addressSnippet})`);
      return;
    }

    if (nearestZone.zone) {
      if (nearestZone.distance < 3.5) {
        setSelectedWard(nearestZone.zone.name);
        setSelectedDistrict(nearestZone.zone.district);
        setSelectedCityName(nearestZone.zone.city);
      } else {
        setSelectedWard('Selected Location');
      }
    }
  };

  // Instant matching search results (Neighborhoods + Hospitals + Malls + Food Spots)
  const searchResults = useMemo<{ pois: MapPoiItem[]; zones: PopularDeliveryZone[] }>(() => {
    if (!searchQuery.trim()) return { pois: [], zones: [] };
    const q = searchQuery.toLowerCase().trim();

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
  }, [searchQuery]);

  const handleSelectZone = (zone: PopularDeliveryZone) => {
    setSelectedCoords(zone.coordinates);
    setSelectedWard(zone.name);
    setSelectedDistrict(zone.district);
    setSelectedCityName(zone.city);
    setLandmark(zone.popularLandmark);
    setActivePoi(null);
    setSearchQuery('');
  };

  const handleSelectPoiFromSearch = (poi: MapPoiItem) => {
    setSelectedCoords(poi.coordinates);
    setSelectedWard(poi.ward);
    setSelectedDistrict(poi.district);
    setSelectedCityName(poi.city);
    setLandmark(`${poi.name} (${poi.addressSnippet})`);
    setActivePoi(poi);
    setSearchQuery('');
  };

  const handleConfirm = () => {
    setDropoffLocation({
      ward: selectedWard,
      district: selectedDistrict,
      city: selectedCityName,
      landmark: landmark.trim() || activePoi?.name || nearestZone.zone?.popularLandmark || 'Near pinned road',
      deliveryInstructions: instructions.trim(),
      coordinates: selectedCoords,
    });
    if (onClose) onClose();
  };

  const handleCitySelect = (cityId: string) => {
    const isAvail = selectCity(cityId);
    const chosenCity = cities.find((c) => c.id === cityId);
    if (chosenCity) {
      if (!isAvail) {
        setUnsupportedCityMsg(`Starches is launching soon in ${chosenCity.name}! Currently live in Dar es Salaam, Zanzibar & Arusha.`);
      } else {
        setUnsupportedCityMsg(null);
        setSelectedCityName(chosenCity.name);
        setSelectedCoords(chosenCity.defaultCoordinates);
        setSelectedWard(chosenCity.name + ' Central');
        setActivePoi(null);
      }
    }
    setIsCityDropdownOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
        isInitialSetup ? 'bg-[#FAF7F2] dark:bg-[#121417]' : ''
      }`}
    >
      <div className="w-full max-w-md h-full sm:h-auto sm:max-h-[94vh] flex flex-col bg-[#FAF7F2] dark:bg-[#121417] text-gray-900 dark:text-gray-100 sm:rounded-3xl shadow-2xl overflow-hidden border border-black/10 dark:border-white/10 animate-in slide-in-from-bottom duration-200">
        {/* Top App Header */}
        <div className="p-3.5 bg-white dark:bg-[#1A1D22] border-b border-gray-100 dark:border-white/5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            {isInitialSetup ? (
              <Logo size="sm" isDark={isDarkMode} />
            ) : (
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center text-[#FF6B00]">
                <MapPin className="w-4 h-4 fill-[#FF6B00]" />
              </div>
            )}
            <div>
              <h2 className="text-sm font-black text-gray-900 dark:text-white leading-tight">
                {language === 'sw' ? 'Weka Eneo la Kushusha Chakula' : 'Search Delivery Location'}
              </h2>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                {language === 'sw' ? 'Tutaonyesha vyakula vinavyofika hapa' : 'We will show food deliverable near you'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {!isInitialSetup && onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto flex flex-col space-y-3 p-3.5">
          {/* City Selector */}
          <div className="relative">
            <div className="flex items-center justify-between bg-white dark:bg-[#1A1D22] p-2 rounded-xl border border-gray-200 dark:border-white/10">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-wide">
                  {language === 'sw' ? 'Mji' : 'City'}:
                </span>
                <span className="font-extrabold text-gray-900 dark:text-white">
                  {selectedCityName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="text-xs font-bold text-[#FF6B00] hover:underline px-2 py-0.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/30"
              >
                {language === 'sw' ? 'Badili Mji' : 'Change City'}
              </button>
            </div>

            {isCityDropdownOpen && (
              <div className="absolute top-11 left-0 right-0 z-30 bg-white dark:bg-[#1E2228] rounded-2xl shadow-xl border border-gray-200 dark:border-white/10 p-1.5 space-y-1">
                {cities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleCitySelect(city.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs font-semibold transition-colors ${
                      selectedCityName === city.name
                        ? 'bg-orange-500 text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <span>{language === 'sw' ? city.nameSw : city.name}</span>
                    <span className="text-[10px] opacity-80">
                      {city.isAvailable ? '✓ Available' : 'Coming soon'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {unsupportedCityMsg && (
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600" />
              <span>{unsupportedCityMsg}</span>
            </div>
          )}

          {/* Search Box with Autocomplete Dropdown */}
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'sw'
                    ? 'Tafuta mtaa, hospitali, duka au eneo (Mikocheni, Aga Khan, Shoppers...)'
                    : 'Search address, hospital, mall, or street...'
                }
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white dark:bg-[#1A1D22] border-2 border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#FF6B00] shadow-sm font-medium placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Instant Search Suggestions (Hospitals, Shops, Food Spots & Neighborhoods) */}
            {searchQuery.trim().length > 0 && (
              <div className="absolute top-12 left-0 right-0 z-30 bg-white dark:bg-[#1A1D22] rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-white/5">
                {searchResults.pois.map((poi) => (
                  <button
                    key={poi.id}
                    type="button"
                    onClick={() => handleSelectPoiFromSearch(poi)}
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

                {searchResults.pois.length === 0 && searchResults.zones.length === 0 && (
                  <div className="p-3 text-center text-xs text-gray-500">
                    No matching landmark found. Pan on map or try "Mikocheni", "Masaki", "Aga Khan".
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Popular Neighborhood Pills */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              {POPULAR_DELIVERY_ZONES.slice(0, 7).map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => handleSelectZone(zone)}
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                    selectedWard === zone.name
                      ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-xs'
                      : 'bg-white dark:bg-[#1A1D22] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-orange-400'
                  }`}
                >
                  {zone.name}
                </button>
              ))}
            </div>
          </div>

          {/* 2D Bolt & Uber Eats Style Interactive Map */}
          <div className="space-y-1">
            <GoogleAddressPickerMap
              initialCoordinates={selectedCoords}
              onLocationChange={handleMapLocationChange}
              heightClass="h-64"
              showZoomControls={true}
              showPoiFilters={true}
              className="shadow-md"
            />
          </div>

          {/* Location Details Card */}
          <div className="bg-white dark:bg-[#1A1D22] p-3 rounded-2xl border border-gray-200 dark:border-white/10 space-y-2 shadow-sm">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/60 text-[#FF6B00] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Building className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#FF6B00]">
                    {language === 'sw' ? 'Eneo la Kushusha' : 'Selected Drop-off'}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Boda Deliverable
                  </span>
                </div>
                <p className="text-sm font-black text-gray-900 dark:text-white leading-tight mt-0.5">
                  {selectedWard}, {selectedDistrict}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedCityName} • {landmark || nearestZone.zone?.popularLandmark || 'Near pinned road'}
                </p>
              </div>
            </div>

            {/* Landmark & Rider Notes */}
            <div className="pt-2 border-t border-gray-100 dark:border-white/5 space-y-1.5">
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder={
                  language === 'sw'
                    ? 'Alama / Jengo (mfano: Karibu na Shoppers, lango jeusi)'
                    : 'Landmark / Building (e.g. Near Shoppers, Apt 4B)'
                }
                className="w-full px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-[#121417] border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#FF6B00]"
              />

              <input
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder={
                  language === 'sw'
                    ? 'Maagizo kwa Boda (mfano: Piga simu ukifika)'
                    : 'Rider Notes (e.g. Call phone when at gate)'
                }
                className="w-full px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-[#121417] border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#FF6B00]"
              />
            </div>
          </div>

          {/* Proximity & Delivery Speed Badge */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/5 border border-orange-500/20 text-xs font-bold text-gray-800 dark:text-gray-200">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FF6B00]" />
              <span>Stores calibrated to this exact drop-off spot</span>
            </div>
            <span className="text-[11px] font-extrabold text-[#FF6B00] bg-white dark:bg-[#1A1D22] px-2 py-0.5 rounded-full shadow-2xs">
              ~15-25 min
            </span>
          </div>
        </div>

        {/* Bottom CTA Actions */}
        <div className="p-3.5 bg-white dark:bg-[#1A1D22] border-t border-gray-100 dark:border-white/5 space-y-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#FF6B00] hover:bg-[#E55A00] text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-transform active:scale-[0.99]"
          >
            <span>
              {language === 'sw'
                ? 'Thibitisha Eneo & Angalia Vyakula'
                : 'Confirm Drop-off & Explore Food'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {isInitialSetup && (
            <button
              type="button"
              onClick={handleConfirm}
              className="w-full py-1.5 text-center text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              {language === 'sw'
                ? 'Endelea kwa sasa (Mikocheni B, Dar)'
                : 'Browse Now (Mikocheni B, Dar)'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
