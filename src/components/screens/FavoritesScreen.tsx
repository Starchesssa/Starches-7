import React from 'react';
import { useApp } from '../../context/AppContext';
import { Heart, Star, MapPin, Clock, ChevronRight } from 'lucide-react';

export const FavoritesScreen: React.FC = () => {
  const { stores, products, favorites, toggleFavorite, navigateTo, t } = useApp();

  const favoriteStores = stores.filter((s) => favorites.includes(s.id));
  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="pb-28 max-w-md mx-auto px-4 space-y-4 animate-in fade-in duration-200">
      <div className="pt-2 flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
        <h1 className="text-lg font-black text-gray-900 dark:text-white">
          {t.favorites}
        </h1>
        <span className="text-xs text-gray-400">
          {favoriteStores.length + favoriteProducts.length} items
        </span>
      </div>

      {favoriteStores.length === 0 && favoriteProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-950/20 text-[#FF6B00] flex items-center justify-center mx-auto mb-3">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">
            No favorites saved yet
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
            Tap the heart icon on any restaurant or meal to quickly access it here anytime.
          </p>
          <button
            onClick={() => navigateTo('home')}
            className="mt-4 px-5 py-2.5 bg-[#FF6B00] text-white rounded-xl text-xs font-bold"
          >
            {t.browseFood}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Favorite Stores */}
          {favoriteStores.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">
                Saved Restaurants & Shops
              </h3>
              {favoriteStores.map((store) => (
                <div
                  key={store.id}
                  onClick={() => navigateTo('restaurant_detail', { storeId: store.id })}
                  className="p-3 rounded-2xl bg-white dark:bg-[#1E2228] border border-gray-100 dark:border-white/5 shadow-xs flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-18 h-18 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                    <img
                      src={store.heroImage}
                      alt={store.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-xs text-gray-900 dark:text-white truncate">
                        {store.name}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(store.id);
                        }}
                        className="p-1 text-[#FF6B00]"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    <p className="text-[11px] text-gray-400 truncate mt-0.5 capitalize">
                      {store.categories.join(' · ')}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {store.rating}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-[#FF6B00]" />
                        {store.distanceKm} km
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Favorite Products */}
          {favoriteProducts.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">
                Saved Meals & Items
              </h3>
              {favoriteProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => navigateTo('restaurant_detail', { storeId: prod.storeId })}
                  className="p-3 rounded-2xl bg-white dark:bg-[#1E2228] border border-gray-100 dark:border-white/5 shadow-xs flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-gray-900 dark:text-white truncate">
                        {prod.name}
                      </h4>
                      <p className="text-[10px] text-gray-400">{prod.storeName}</p>
                      <p className="text-xs font-black text-[#FF6B00] mt-0.5">
                        TZS {prod.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(prod.id);
                    }}
                    className="p-1 text-[#FF6B00]"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
