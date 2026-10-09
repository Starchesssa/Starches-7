import React from 'react';
import { useApp } from '../../context/AppContext';
import { ThemeToggle } from '../common/ThemeToggle';
import {
  ArrowLeft,
  Star,
  MapPin,
  CheckCircle,
  Receipt,
  Repeat,
  Share2,
} from 'lucide-react';

export const OrderDetailsScreen: React.FC = () => {
  const { orders, screenParams, goBack, reorder, navigateTo, t } = useApp();

  const orderId = screenParams.orderId || orders[0]?.id;
  const order = orders.find((o) => o.id === orderId) || orders[0];

  if (!order) {
    return (
      <div className="p-8 text-center text-xs text-gray-500">
        Order not found.
      </div>
    );
  }

  return (
    <div className="pb-28 max-w-md mx-auto px-4 space-y-4 animate-in fade-in duration-200">
      {/* 1. Header (matches mockup screen 5) */}
      <div className="pt-2 flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="p-1 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-black text-gray-900 dark:text-white">
            {t.orderDetails}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle showLabels={false} />
          <span className="text-xs text-gray-400 font-semibold">#{order.orderNumber}</span>
        </div>
      </div>

      {/* 2. Restaurant Cover Photo Card with Delivered Badge (matches mockup screen 5) */}
      <div className="rounded-2xl overflow-hidden bg-white dark:bg-[#1E2228] border border-gray-100 dark:border-white/5 shadow-xs">
        <div className="relative h-44 w-full bg-gray-100 dark:bg-gray-800">
          <img
            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
            alt={order.storeName}
            className="w-full h-full object-cover"
          />
          {/* Delivered Badge */}
          <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
            <CheckCircle className="w-3 h-3" />
            <span className="capitalize">{order.status.replace('_', ' ')}</span>
          </div>
        </div>

        <div className="p-3.5">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">
              {order.storeName}
            </h3>
            <div className="flex items-center gap-1 text-xs font-bold text-gray-900 dark:text-white">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.6</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-1">
            <span>Burgers · Fast Food</span>
            <span>·</span>
            <span className="flex items-center gap-0.5 text-gray-500 dark:text-gray-400">
              <MapPin className="w-3 h-3 text-[#FF6B00]" />
              1.2 km
            </span>
          </div>
        </div>
      </div>

      {/* 3. Order Summary (matches mockup screen 5) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1E2228] border border-gray-100 dark:border-white/5 shadow-xs space-y-3">
        <h4 className="font-extrabold text-xs text-gray-900 dark:text-white uppercase tracking-wider">
          {t.orderSummary}
        </h4>

        {/* Item Rows */}
        <div className="space-y-3 pt-1">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h5 className="font-bold text-gray-900 dark:text-white line-clamp-1">
                    {item.name}
                  </h5>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {item.quantity} × TZS {item.unitPrice.toLocaleString()}
                  </p>
                </div>
              </div>

              <span className="font-bold text-gray-900 dark:text-white">
                {item.totalPrice.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Financial Breakdown (matches mockup screen 5) */}
        <div className="pt-3 border-t border-gray-100 dark:border-white/10 space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex justify-between">
            <span>{t.subtotal}</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {order.subtotal.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t.deliveryFee}</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {order.deliveryFee.toLocaleString()}
            </span>
          </div>
          <div className="pt-2 border-t border-gray-100 dark:border-white/10 flex justify-between font-black text-sm text-gray-900 dark:text-white">
            <span>{t.total}</span>
            <span className="text-[#FF6B00]">
              TZS {order.total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Delivery Address Info */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1E2228] border border-gray-100 dark:border-white/5 text-xs">
        <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px] block mb-1">
          Delivered To
        </span>
        <p className="font-bold text-gray-900 dark:text-white">
          {order.deliveryAddress.title} • {order.deliveryAddress.ward}, {order.deliveryAddress.district}
        </p>
        <p className="text-gray-400 text-[11px] mt-0.5">
          {order.deliveryAddress.landmark || order.deliveryAddress.mtaa}
        </p>
      </div>

      {/* 5. Order Again Primary Action Button (matches mockup screen 5) */}
      <div className="pt-1">
        <button
          onClick={() => reorder(order)}
          className="w-full py-3.5 px-4 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-black rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 text-sm transition-all"
        >
          <Repeat className="w-4 h-4" />
          <span>{t.orderAgain}</span>
        </button>
      </div>
    </div>
  );
};
