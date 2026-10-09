import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CATEGORIES,
} from '../../data/mockData';
import {
  Search,
  SlidersHorizontal,
  Star,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { Store, Product } from '../../types';
import { ProductDetailModal } from '../modals/ProductDetailModal';

export const ExploreScreen: React.FC = () => {
  const {
    stores,
    products,
    searchQuery,
    setSearchQuery,
    navigateTo,
    language,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'restaurants' | 'marketplace'>('all');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [filterHalal, setFilterHalal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter products & stores
  const query = searchQuery.toLowerCase().trim();

  const matchedStores = stores.filter((store) => {
    if (activeTab === 'marketplace' && store.type === 'restaurant') return false;
    if (activeTab === 'restaurants' && store.type !== 'restaurant') return false;
    if (selectedCat !== 'all' && !store.categories.includes(selectedCat)) return false;

    if (!query) return true;
    return (
      store.name.toLowerCase().includes(query) ||
      store.categories.some((c) => c.toLowerCase().includes(query)) ||
      store.tagline.toLowerCase().includes(query)
    );
  });

  const matchedProducts = products.filter((prod) => {
    if (selectedCat !== 'all' && prod.category !== selectedCat) return false;
    if (filterHalal && !prod.isHalal) return false;

    if (!query) return true;
    return (
      prod.name.toLowerCase().includes(query) ||
      prod.nameSw.toLowerCase().includes(query) ||
      prod.description.toLowerCase().includes(query) ||
      prod.storeName.toLowerCase().includes(query)
    );
  });

  return (
    <div className="pb-24 max-w-md mx-auto px-4 space-y-4 animate-in fade-in duration-200">
      {/* Top Type Switcher: All, Restaurants, Marketplace */}
      <div className="flex bg-gray-100 dark:bg-[#1E2228] p-1 rounded-xl text-xs font-bold">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            activeTab === 'all'
              ? 'bg-white dark:bg-[#2A303A] text-gray-900 dark:text-white shadow-xs'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          All Discoveries
        </button>
        <button
          onClick={() => setActiveTab('restaurants')}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            activeTab === 'restaurants'
              ? 'bg-white dark:bg-[#2A303A] text-[#FF6B00] shadow-xs'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Food & Dining
        </button>
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            activeTab === 'marketplace'
              ? 'bg-white dark:bg-[#2A303A] text-[#FF6B00] shadow-xs'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Local Shops
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 text-xs font-semibold">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-3 py-1.5 rounded-full flex-shrink-0 transition-colors ${
              selectedCat === cat.id
                ? 'bg-[#FF6B00] text-white font-bold'
                : 'bg-white dark:bg-[#1E2228] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10'
            }`}
          >
            {language === 'sw' ? cat.nameSw : cat.name}
          </button>
        ))}
      </div>

      {/* Search Header / Result Counts */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>
          {query ? `Results for "${query}"` : 'Browse by popularity & proximity'}
        </span>
        <button
          onClick={() => setFilterHalal(!filterHalal)}
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
            filterHalal
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
              : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300'
          }`}
        >
          {filterHalal ? '✓ Halal Only' : 'Halal'}
        </button>
      </div>

      {/* Popular Meals & Products Grid */}
      {matchedProducts.length > 0 && (
        <div>
          <h3 className="font-extrabold text-sm text-gray-900 dark:text-white mb-2.5">
            Meals & Marketplace Items ({matchedProducts.length})
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {matchedProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => setSelectedProduct(prod)}
                className="p-3 rounded-2xl bg-white dark:bg-[#1E2228] border border-gray-100 dark:border-white/5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-28 w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-2">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    {prod.isHalal && (
                      <span className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-md text-emerald-400 text-[9px] font-bold px-1.5 py-0.2 rounded">
                        Halal
                      </span>
                    )}
                  </div>
                  <h4 className="font-extrabold text-xs text-gray-900 dark:text-white line-clamp-1">
                    {language === 'sw' ? prod.nameSw : prod.name}
                  </h4>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">{prod.storeName}</p>
                </div>

                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-xs font-black text-[#FF6B00]">
                    TZS {prod.price.toLocaleString()}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#FF6B00] flex items-center justify-center group-hover:bg-[#FF6B00] group-hover:text-white transition-colors">
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stores List */}
      <div className="pt-2">
        <h3 className="font-extrabold text-sm text-gray-900 dark:text-white mb-2.5">
          Restaurants & Shops ({matchedStores.length})
        </h3>

        {matchedStores.length === 0 ? (
          <div className="text-center py-8 bg-white dark:bg-[#1E2228] rounded-2xl p-6 text-gray-400 text-xs">
            No stores matched your search query. Try another keyword.
          </div>
        ) : (
          <div className="space-y-3">
            {matchedStores.map((store) => (
              <div
                key={store.id}
                onClick={() => navigateTo('restaurant_detail', { storeId: store.id })}
                className="p-3 rounded-2xl bg-white dark:bg-[#1E2228] border border-gray-100 dark:border-white/5 flex items-center gap-3.5 shadow-xs hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                  <img
                    src={store.heroImage}
                    alt={store.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

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

                  <p className="text-[11px] text-gray-400 truncate mt-0.5 capitalize">
                    {store.categories.join(' · ')}
                  </p>

                  <div className="flex items-center gap-2 mt-1.5 text-[11px] text-gray-500 dark:text-gray-400">
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

                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Item Customizer Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};
