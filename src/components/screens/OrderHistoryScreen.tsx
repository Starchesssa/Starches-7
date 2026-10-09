import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ClipboardList,
  ChevronRight,
  Clock,
  ArrowRight,
  Repeat,
  Package,
} from 'lucide-react';

export const OrderHistoryScreen: React.FC = () => {
  const { orders, navigateTo, reorder, t, language } = useApp();

  return (
    <div className="pb-28 max-w-md mx-auto px-4 space-y-4 animate-in fade-in duration-200">
      <div className="pt-2 flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
        <h1 className="text-lg font-black text-gray-900 dark:text-white">
          {t.myOrders}
        </h1>
        <span className="text-xs text-gray-400">{orders.length} total</span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center mx-auto text-gray-400 mb-3">
            <ClipboardList className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">
            {t.noOrdersTitle}
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
            {t.noOrdersSubtitle}
          </p>
          <button
            onClick={() => navigateTo('home')}
            className="mt-4 px-5 py-2.5 bg-[#FF6B00] text-white rounded-xl text-xs font-bold"
          >
            {t.browseFood}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((ord) => {
            const isActive = ord.status !== 'delivered' && ord.status !== 'cancelled';

            return (
              <div
                key={ord.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#1E2228] border border-gray-100 dark:border-white/5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">
                      {ord.storeName}
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      #{ord.orderNumber} • {new Date(ord.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      isActive
                        ? 'bg-orange-100 text-[#FF6B00] dark:bg-orange-950/40 dark:text-orange-400 animate-pulse'
                        : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                    }`}
                  >
                    {ord.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Items summary */}
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  <p className="line-clamp-1">
                    {ord.items.map((it) => `${it.quantity}x ${it.name}`).join(', ')}
                  </p>
                  <p className="font-black text-[#FF6B00] mt-1 text-xs">
                    TZS {ord.total.toLocaleString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-gray-100 dark:border-white/10 flex items-center justify-between gap-2">
                  {isActive ? (
                    <button
                      onClick={() => navigateTo('track_order', { orderId: ord.id })}
                      className="flex-1 py-2 bg-[#FF6B00] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{t.trackOrder}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => reorder(ord)}
                      className="flex-1 py-2 bg-orange-50 dark:bg-orange-950/20 text-[#FF6B00] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-orange-100 transition-colors"
                    >
                      <Repeat className="w-3.5 h-3.5" />
                      <span>{t.orderAgain}</span>
                    </button>
                  )}

                  <button
                    onClick={() => navigateTo('order_details', { orderId: ord.id })}
                    className="py-2 px-3 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 text-xs font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    {t.viewDetails}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
