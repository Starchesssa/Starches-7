import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CATEGORIES,
} from '../../data/mockData';
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
  Sparkles,
  Percent,
} from 'lucide-react';
import { Store } from '../../types';

export const HomeScreen: React.FC = () => {
  const {
    stores,
    products,
    selectedCategory,
    setSelectedCategory,
    navigateTo,
    language,
    t,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'open' | 'top_rated' | 'fast'>('all');

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
    // Category match
    if (selectedCategory !== 'all' && !store.categories.includes(selectedCategory)) {
      return false;
    }
    // Filter chips
    if (activeFilter === 'open' && !store.isOpen) return false;
    if (activeFilter === 'top_rated' && store.rating < 4.6) return false;
    if (activeFilter === 'fast' && store.deliveryTimeMinutes.max > 35) return false;
    return true;
  });

  const popularStores = stores.filter((s) => s.isPopular || s.rating >= 4.5);

  return (
    <div className="pb-24 max-w-md mx-auto px-4 space-y-5 animate-in fade-in duration-200">
      {/* 1. Hot Food Fast Delivery Hero Banner (matches mockup screen 2 & 10) */}
      <div
        onClick={() => navigateTo('restaurant_detail', { storeId: 'store-mamboz' })}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FF5500] via-[#FF6B00] to-[#FFA048] p-5 text-white shadow-lg cursor-pointer group transition-transform active:scale-[0.99]"
      >
        {/* Background decorative circles */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-[62%]">
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full mb-1.5">
            <Percent className="w-3 h-3" />
            Special Deal
          </span>
          <h2
            className="text-xl font-black leading-tight drop-shadow-xs"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {t.heroTitle}
          </h2>
          <p className="text-xs text-white/90 font-medium mt-1 leading-snug line-clamp-2">
            {t.heroSubtitle}
          </p>

          <div className="mt-3.5 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#FF6B00] shadow-md group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>

        {/* Hero Food Photography (Burger) */}
        <div className="absolute -right-4 -bottom-3 w-40 h-40 group-hover:scale-105 transition-transform duration-300">
          <img
            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80"
            alt="Burger Promo"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* 2. Categories Row (matches mockup buttons) */}
      <div>
        <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="flex flex-col items-center gap-1.5 flex-shrink-0 group focus:outline-none"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/25 scale-105'
                      : 'bg-white dark:bg-[#1E2228] text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-white/5 group-hover:border-orange-300'
                  }`}
                >
                  {getCategoryIcon(cat.icon, 'w-6 h-6')}
                </div>
                <span
                  className={`text-[11px] font-semibold tracking-tight transition-colors ${
                    isSelected
                      ? 'text-[#FF6B00] font-bold'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {language === 'sw' ? cat.nameSw : cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Popular Near You Horizontal Section (matches mockup screen 2) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-extrabold text-sm md:text-base text-gray-900 dark:text-white">
            {t.popularNearYou}
          </h3>
          <button
            onClick={() => navigateTo('explore')}
            className="text-xs font-bold text-[#FF6B00] flex items-center gap-0.5 hover:underline"
          >
            <span>{t.seeAll}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
          {popularStores.slice(0, 4).map((store) => (
            <div
              key={store.id}
              onClick={() => navigateTo('restaurant_detail', { storeId: store.id })}
              className="w-48 flex-shrink-0 rounded-2xl bg-white dark:bg-[#1E2228] border border-gray-100 dark:border-white/5 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="relative h-28 w-full bg-gray-100 dark:bg-gray-800">
                <img
                  src={store.heroImage}
                  alt={store.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Rating Badge */}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-xs">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{store.rating}</span>
                </div>
              </div>

              <div className="p-3">
                <h4 className="font-extrabold text-xs text-gray-900 dark:text-white truncate">
                  {store.name}
                </h4>
                <p className="text-[11px] text-gray-400 dark:text-gray-400 truncate mt-0.5 capitalize">
                  {store.categories.join(' · ')}
                </p>

                <div className="flex items-center gap-2 mt-2 text-[10px] font-medium text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-0.5">
                    <MapPin className="w-3 h-3 text-[#FF6B00]" />
                    {store.distanceKm} {t.km}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-3 h-3 text-gray-400" />
                    {store.deliveryTimeMinutes.min}-{store.deliveryTimeMinutes.max} {t.mins}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Filter Chips (All, Open Now, Top Rated, Fast Delivery - matches mockup screen 3) */}
      <div className="pt-1">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="font-extrabold text-sm md:text-base text-gray-900 dark:text-white">
            {t.featuredRestaurants}
          </h3>
          <span className="text-xs text-gray-400">
            {filteredStores.length} spots
          </span>
        </div>

        {/* Filter Chip Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 text-xs font-semibold">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-full transition-colors ${
              activeFilter === 'all'
                ? 'bg-[#FF6B00] text-white font-bold'
                : 'bg-white dark:bg-[#1E2228] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10'
            }`}
          >
            {t.catAll}
          </button>
          <button
            onClick={() => setActiveFilter('open')}
            className={`px-3 py-1.5 rounded-full transition-colors ${
              activeFilter === 'open'
                ? 'bg-[#FF6B00] text-white font-bold'
                : 'bg-white dark:bg-[#1E2228] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10'
            }`}
          >
            {t.openNow}
          </button>
          <button
            onClick={() => setActiveFilter('top_rated')}
            className={`px-3 py-1.5 rounded-full transition-colors ${
              activeFilter === 'top_rated'
                ? 'bg-[#FF6B00] text-white font-bold'
                : 'bg-white dark:bg-[#1E2228] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10'
            }`}
          >
            {t.topRated}
          </button>
          <button
            onClick={() => setActiveFilter('fast')}
            className={`px-3 py-1.5 rounded-full transition-colors ${
              activeFilter === 'fast'
                ? 'bg-[#FF6B00] text-white font-bold'
                : 'bg-white dark:bg-[#1E2228] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10'
            }`}
          >
            {t.fastDelivery}
          </button>
        </div>

        {/* Store Items Vertical List (matches mockup screen 3) */}
        <div className="mt-3 space-y-3">
          {filteredStores.map((store) => (
            <div
              key={store.id}
              onClick={() => navigateTo('restaurant_detail', { storeId: store.id })}
              className="p-3 rounded-2xl bg-white dark:bg-[#1E2228] border border-gray-100 dark:border-white/5 flex items-center gap-3.5 shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              {/* Thumbnail with rounded corners */}
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                <img
                  src={store.heroImage}
                  alt={store.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                {!store.isOpen && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white uppercase">Closed</span>
                  </div>
                )}
              </div>

              {/* Store Information */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs md:text-sm text-gray-900 dark:text-white truncate">
                    {store.name}
                  </h4>
                  <div className="flex items-center gap-1 text-xs font-bold text-gray-900 dark:text-white">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{store.rating}</span>
                  </div>
                </div>

                <p className="text-[11px] text-gray-400 dark:text-gray-400 truncate mt-0.5 capitalize">
                  {store.categories.join(' · ')}
                </p>

                <div className="flex items-center gap-2.5 mt-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-0.5">
                    <MapPin className="w-3 h-3 text-[#FF6B00]" />
                    {store.distanceKm} {t.km}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-3 h-3 text-gray-400" />
                    {store.deliveryTimeMinutes.min}-{store.deliveryTimeMinutes.max} {t.mins}
                  </span>
                </div>

                {/* Free delivery promo pill or delivery fee */}
                <div className="mt-1.5">
                  <span className="inline-block text-[10px] font-bold text-[#FF6B00] bg-orange-50 dark:bg-orange-950/30 px-2 py-0.5 rounded-full">
                    {store.freeDeliveryThreshold
                      ? `${t.freeDelivery} (TZS 5k+)`
                      : `TZS ${store.deliveryFee.toLocaleString()} delivery`}
                  </span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </div>
          ))}
        </div>
      </div>

      {/* 5. Everyday Marketplace Shortcuts (Groceries & Essentials) */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-extrabold text-sm md:text-base text-gray-900 dark:text-white">
              {t.localMarketplace}
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Order fresh pantry essentials, milk, and daily needs
            </p>
          </div>
          <button
            onClick={() => navigateTo('explore', { mode: 'marketplace' })}
            className="text-xs font-bold text-[#FF6B00] flex items-center gap-0.5 hover:underline"
          >
            <span>{t.seeAll}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {products
            .filter((p) => p.category === 'groceries' || p.category === 'pharmacy')
            .slice(0, 2)
            .map((item) => (
              <div
                key={item.id}
                onClick={() => navigateTo('restaurant_detail', { storeId: item.storeId })}
                className="p-3 rounded-2xl bg-white dark:bg-[#1E2228] border border-gray-100 dark:border-white/5 shadow-xs hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="h-24 w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <h5 className="font-bold text-xs text-gray-900 dark:text-white line-clamp-1">
                  {language === 'sw' ? item.nameSw : item.name}
                </h5>
                <p className="text-[10px] text-gray-400 mt-0.5 truncate">{item.storeName}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-black text-[#FF6B00]">
                    TZS {item.price.toLocaleString()}
                  </span>
                  {item.unit && (
                    <span className="text-[10px] text-gray-400">{item.unit}</span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
