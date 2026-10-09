import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ThemeToggle } from '../common/ThemeToggle';
import {
  ArrowLeft,
  Heart,
  Star,
  MapPin,
  Clock,
  Plus,
  ShoppingCart,
  Share2,
  Info,
} from 'lucide-react';
import { Product } from '../../types';
import { ProductDetailModal } from '../modals/ProductDetailModal';

export const RestaurantDetailScreen: React.FC = () => {
  const {
    stores,
    products,
    screenParams,
    goBack,
    navigateTo,
    favorites,
    toggleFavorite,
    cart,
    cartTotal,
    language,
    t,
  } = useApp();

  const storeId = screenParams.storeId || 'store-mamboz';
  const store = stores.find((s) => s.id === storeId) || stores[0];
  const storeProducts = products.filter((p) => p.storeId === store.id);

  const [activeTab, setActiveTab] = useState<'menu' | 'reviews' | 'about'>('menu');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const isFav = favorites.includes(store.id);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Group products by category
  const categories = Array.from(new Set(storeProducts.map((p) => p.category)));

  return (
    <div className="pb-28 max-w-md mx-auto animate-in fade-in duration-200">
      {/* 1. Header with Cover Photo (matches mockup screen 6) */}
      <div className="relative h-60 w-full bg-gray-100 dark:bg-gray-800">
        <img
          src={store.heroImage}
          alt={store.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />

        {/* Top Floating Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <ThemeToggle showLabels={false} />

            <button
              onClick={() => toggleFavorite(store.id)}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors"
              aria-label="Toggle Favorite"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFav ? 'fill-[#FF6B00] text-[#FF6B00]' : 'text-white'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Floating Brand Logo on hero */}
        <div className="absolute -bottom-5 left-4 z-10">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white dark:bg-[#1E2228] p-1 shadow-lg border border-gray-100 dark:border-white/10">
            <img
              src={store.logoImage}
              alt={store.name}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* 2. Restaurant Info Card */}
      <div className="px-4 pt-8 pb-3 bg-white dark:bg-[#121417] border-b border-gray-100 dark:border-white/5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
              {store.name}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 capitalize">
              {store.categories.join(' · ')}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-lg">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-xs font-black text-gray-900 dark:text-white">
              {store.rating}
            </span>
            <span className="text-[10px] text-gray-400">({store.reviewCount})</span>
          </div>
        </div>

        {/* Distance & Delivery Stats */}
        <div className="flex items-center gap-3 mt-3 text-xs text-gray-600 dark:text-gray-300">
          <span className="flex items-center gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
            {store.distanceKm} {t.km}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            {store.deliveryTimeMinutes.min}-{store.deliveryTimeMinutes.max} {t.mins}
          </span>
          <span>·</span>
          <span className="text-[#FF6B00] font-bold">
            {store.freeDeliveryThreshold ? 'Free delivery (TZS 5k+)' : `TZS ${store.deliveryFee} delivery`}
          </span>
        </div>
      </div>

      {/* 3. Tabs: Menu, Reviews, About */}
      <div className="flex border-b border-gray-100 dark:border-white/10 px-4 text-xs font-bold bg-white dark:bg-[#121417] sticky top-[60px] z-20">
        <button
          onClick={() => setActiveTab('menu')}
          className={`py-3 mr-6 relative transition-colors ${
            activeTab === 'menu'
              ? 'text-[#FF6B00]'
              : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          {t.menu}
          {activeTab === 'menu' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B00] rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`py-3 mr-6 relative transition-colors ${
            activeTab === 'reviews'
              ? 'text-[#FF6B00]'
              : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          {t.reviews} ({store.reviewCount})
          {activeTab === 'reviews' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B00] rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`py-3 relative transition-colors ${
            activeTab === 'about'
              ? 'text-[#FF6B00]'
              : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          {t.about}
          {activeTab === 'about' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B00] rounded-full" />
          )}
        </button>
      </div>

      {/* 4. Tab Content */}
      <div className="p-4 space-y-6">
        {activeTab === 'menu' && (
          <div>
            {categories.map((catKey) => {
              const catItems = storeProducts.filter((p) => p.category === catKey);
              return (
                <div key={catKey} className="mb-6 last:mb-0">
                  <h3 className="font-extrabold text-sm text-gray-900 dark:text-white mb-3 capitalize">
                    {catKey}
                  </h3>

                  <div className="space-y-3">
                    {catItems.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => setSelectedProduct(prod)}
                        className="p-3 rounded-2xl bg-white dark:bg-[#1E2228] border border-gray-100 dark:border-white/5 flex items-center justify-between gap-3 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                      >
                        {/* Thumbnail */}
                        <div className="w-18 h-18 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>

                        {/* Title & Description */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-extrabold text-xs text-gray-900 dark:text-white line-clamp-1">
                            {language === 'sw' ? prod.nameSw : prod.name}
                          </h4>
                          <p className="text-[11px] text-gray-400 dark:text-gray-400 line-clamp-2 mt-0.5 leading-snug">
                            {language === 'sw' ? prod.descriptionSw : prod.description}
                          </p>
                          <div className="mt-1.5 flex items-center gap-2">
                            <span className="text-xs font-black text-gray-900 dark:text-white">
                              TZS {prod.price.toLocaleString()}
                            </span>
                            {prod.unit && (
                              <span className="text-[10px] text-gray-400">{prod.unit}</span>
                            )}
                          </div>
                        </div>

                        {/* Plus Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(prod);
                          }}
                          className="w-7 h-7 rounded-full bg-[#FF6B00] hover:bg-[#E55A00] text-white flex items-center justify-center flex-shrink-0 shadow-xs transition-transform active:scale-90"
                          aria-label="Add item"
                        >
                          <Plus className="w-4 h-4 stroke-[3]" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#1E2228] border border-gray-100 dark:border-white/5 text-center">
              <span className="text-3xl font-black text-gray-900 dark:text-white">
                {store.rating}
              </span>
              <div className="flex items-center justify-center gap-1 my-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-gray-400">Based on {store.reviewCount} customer ratings</p>
            </div>

            {/* Sample Tanzanian customer reviews */}
            <div className="space-y-2.5">
              {[
                {
                  name: 'Salum M.',
                  rating: 5,
                  date: 'Yesterday',
                  comment: 'Burger safi sana! Hot and juicy beef, chips crispy kabisa. Rider came in 20 mins to Kinondoni.',
                },
                {
                  name: 'Amina Rashid',
                  rating: 5,
                  date: '3 days ago',
                  comment: 'Best smash burger in Dar es Salaam. Packaging was sealed securely with Starches tape.',
                },
              ].map((rev, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-white dark:bg-[#1E2228] border border-gray-100 dark:border-white/5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 dark:text-white">{rev.name}</span>
                    <span className="text-[10px] text-gray-400">{rev.date}</span>
                  </div>
                  <div className="flex gap-0.5 my-1">
                    {[...Array(rev.rating)].map((_, r) => (
                      <Star key={r} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[11px]">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1E2228] border border-gray-100 dark:border-white/5 space-y-3 text-xs">
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">About the Kitchen</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{store.tagline}</p>
            </div>
            <div className="pt-2 border-t border-gray-100 dark:border-white/10">
              <span className="text-gray-400 block mb-0.5">Location & Neighborhood</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {store.address}, {store.district}, {store.city}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-100 dark:border-white/10">
              <span className="text-gray-400 block mb-0.5">Operating Hours</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {store.openingHours}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Cart Bar if Cart Has Items */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-14 left-0 right-0 p-3 z-30 pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <button
              onClick={() => navigateTo('cart')}
              className="w-full py-3.5 px-4 bg-[#FF6B00] hover:bg-[#E55A00] text-white rounded-2xl shadow-xl shadow-orange-500/30 flex items-center justify-between font-extrabold text-xs sm:text-sm transition-all hover:scale-[1.01]"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center text-xs">
                  {cartItemCount}
                </div>
                <span>{t.navCart}</span>
              </div>
              <span>TZS {cartTotal.toLocaleString()}</span>
            </button>
          </div>
        </div>
      )}

      {/* Item Customizer Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};
