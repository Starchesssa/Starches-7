import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  MapPin,
  Navigation,
  Check,
  AlertCircle,
  Building2,
  Home,
  Briefcase,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { TanzaniaAddress, TanzaniaCity } from '../../types';
import { GoogleAddressPickerMap } from '../maps/GoogleAddressPickerMap';

export const AddressModal: React.FC = () => {
  const {
    isAddressModalOpen,
    setIsAddressModalOpen,
    cities,
    currentCity,
    selectCity,
    currentAddress,
    savedAddresses,
    addAddress,
    selectAddress,
    t,
    isDarkMode,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'saved' | 'new' | 'cities'>('saved');
  const [cityNotice, setCityNotice] = useState<string | null>(null);

  // New Address Form State
  const [title, setTitle] = useState('Home');
  const [district, setDistrict] = useState('Kinondoni');
  const [ward, setWard] = useState('Mikocheni');
  const [mtaa, setMtaa] = useState('');
  const [landmark, setLandmark] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [mapPinCoords, setMapPinCoords] = useState<{ lat: number; lng: number }>(
    currentAddress.coordinates || { lat: -6.7725, lng: 39.2483 }
  );

  if (!isAddressModalOpen) return null;

  const handleCityPick = (city: TanzaniaCity) => {
    const isAvail = selectCity(city.id);
    if (!isAvail) {
      setCityNotice(`Starches is not available in ${city.name} yet. We are launching soon!`);
    } else {
      setCityNotice(null);
      setActiveTab('saved');
    }
  };

  const handleUseGps = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          setMapPinCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setWard('Current Location Area');
          setMtaa('Near Detected Coordinates');
        },
        () => {
          setIsLocating(false);
          // Fallback simulation for Dar es Salaam
          setMapPinCoords({ lat: -6.782, lng: 39.242 });
          setWard('Mikocheni A');
          setMtaa('Bagamoyo Road');
        },
        { timeout: 5000 }
      );
    } else {
      setIsLocating(false);
      setMapPinCoords({ lat: -6.782, lng: 39.242 });
    }
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ward) return;

    addAddress({
      title: title || 'Other',
      city: currentCity.name,
      district: district || 'Kinondoni',
      ward,
      mtaa: mtaa || 'Main Street',
      landmark: landmark || 'Prominent landmark',
      deliveryInstructions,
      coordinates: mapPinCoords,
      isDefault: false,
    });

    setIsAddressModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1E2228] rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden transition-colors border border-gray-100 dark:border-white/10">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base">
              {t.selectLocation}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {currentCity.name}, Tanzania
            </p>
          </div>
          <button
            onClick={() => setIsAddressModalOpen(false)}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-100 dark:border-white/10 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              activeTab === 'saved'
                ? 'border-[#FF6B00] text-[#FF6B00]'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {t.savedAddresses}
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              activeTab === 'new'
                ? 'border-[#FF6B00] text-[#FF6B00]'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            + Add New
          </button>
          <button
            onClick={() => setActiveTab('cities')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              activeTab === 'cities'
                ? 'border-[#FF6B00] text-[#FF6B00]'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Change City
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {cityNotice && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-200">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{cityNotice}</p>
                <p className="text-[11px] mt-0.5 opacity-90">{t.availableCities}</p>
              </div>
            </div>
          )}

          {/* TAB 1: Saved Addresses */}
          {activeTab === 'saved' && (
            <div className="space-y-3">
              {/* GPS Assist Button */}
              <button
                onClick={handleUseGps}
                disabled={isLocating}
                className="w-full flex items-center justify-between p-3.5 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 rounded-xl text-xs font-semibold text-[#FF6B00] hover:bg-orange-100 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? 'Detecting GPS...' : t.gpsAssist}</span>
                </div>
                <span className="text-[11px] bg-[#FF6B00] text-white px-2 py-0.5 rounded-full font-bold">
                  Auto
                </span>
              </button>

              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400 pt-1">
                Your Saved Locations
              </div>

              {savedAddresses.map((addr) => {
                const isSelected = currentAddress.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => {
                      selectAddress(addr.id);
                      setIsAddressModalOpen(false);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'border-[#FF6B00] bg-orange-50/50 dark:bg-orange-950/20 ring-1 ring-[#FF6B00]'
                        : 'border-gray-200 dark:border-white/10 hover:border-orange-300 dark:hover:border-white/20 bg-gray-50/50 dark:bg-[#16191E]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-[#FF6B00] text-white'
                            : 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {addr.title === 'Home' ? (
                          <Home className="w-4 h-4" />
                        ) : addr.title === 'Work' ? (
                          <Briefcase className="w-4 h-4" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-gray-900 dark:text-white">
                            {addr.title}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-white/10 px-1.5 py-0.2 rounded font-medium">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-0.5">
                          {addr.ward}, {addr.district}
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">
                          {addr.landmark || addr.mtaa}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#FF6B00] flex items-center justify-center text-white flex-shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}

              <button
                onClick={() => setActiveTab('new')}
                className="w-full py-2.5 border-2 border-dashed border-gray-200 dark:border-white/15 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-[#FF6B00] hover:border-[#FF6B00] transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add Another Tanzanian Address
              </button>
            </div>
          )}

          {/* TAB 2: Add New Address with Interactive Pin Map */}
          {activeTab === 'new' && (
            <form onSubmit={handleSaveNewAddress} className="space-y-3.5 text-xs">
              {/* Interactive Google Map Pin Selector (Uber / Bolt Style) */}
              <GoogleAddressPickerMap
                initialCoordinates={mapPinCoords}
                onLocationChange={(coords) => {
                  setMapPinCoords(coords);
                }}
              />

              {/* Title selection chips */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Location Label
                </label>
                <div className="flex gap-2">
                  {['Home', 'Work', 'Friend', 'Other'].map((tLabel) => (
                    <button
                      key={tLabel}
                      type="button"
                      onClick={() => setTitle(tLabel)}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors ${
                        title === tLabel
                          ? 'bg-[#FF6B00] text-white'
                          : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {tLabel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tanzanian Administrative Fields */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    {t.district}
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[#16191E] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-medium focus:border-[#FF6B00] outline-none"
                  >
                    <option value="Kinondoni">Kinondoni</option>
                    <option value="Ilala">Ilala</option>
                    <option value="Ubungo">Ubungo</option>
                    <option value="Kigamboni">Kigamboni</option>
                    <option value="Temeke">Temeke</option>
                    <option value="Urban West">Urban West (ZNZ)</option>
                    <option value="Arusha Urban">Arusha Urban</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    {t.ward} *
                  </label>
                  <input
                    type="text"
                    required
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    placeholder="e.g. Mikocheni B, Masaki"
                    className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[#16191E] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-medium focus:border-[#FF6B00] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  {t.mtaa}
                </label>
                <input
                  type="text"
                  value={mtaa}
                  onChange={(e) => setMtaa(e.target.value)}
                  placeholder="e.g. Mwinyijuma St, Chole Road"
                  className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[#16191E] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-medium focus:border-[#FF6B00] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  {t.landmark} *
                </label>
                <input
                  type="text"
                  required
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder={t.landmarkPlaceholder}
                  className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[#16191E] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-medium focus:border-[#FF6B00] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  {t.deliveryInstructions}
                </label>
                <input
                  type="text"
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder={t.deliveryInstructionsPlaceholder}
                  className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[#16191E] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-medium focus:border-[#FF6B00] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-bold rounded-xl shadow-md transition-colors text-sm"
              >
                {t.saveAddress}
              </button>
            </form>
          )}

          {/* TAB 3: City Selector */}
          {activeTab === 'cities' && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Select your city in Tanzania to discover active local restaurants and marketplace shops.
              </p>
              {cities.map((city) => {
                const isSelected = currentCity.id === city.id;
                return (
                  <button
                    key={city.id}
                    onClick={() => handleCityPick(city)}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'border-[#FF6B00] bg-orange-50/40 dark:bg-orange-950/20'
                        : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-700 dark:text-gray-300">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-gray-900 dark:text-white">
                            {city.name}
                          </span>
                          {city.isAvailable ? (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-1.5 py-0.2 rounded">
                              Active
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 dark:bg-white/5 px-1.5 py-0.2 rounded">
                              Coming Soon
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-400">{city.region}</span>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
