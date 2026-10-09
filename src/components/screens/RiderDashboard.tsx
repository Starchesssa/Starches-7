import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Bike,
  Navigation,
  Phone,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  TrendingUp,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { OrderStatus } from '../../types';

export const RiderDashboard: React.FC = () => {
  const {
    rider,
    toggleRiderOnline,
    orders,
    updateOrderStatus,
    setRole,
    navigateTo,
    t,
    language,
  } = useApp();

  const activeOrder = orders.find((o) => o.status !== 'delivered' && o.status !== 'cancelled');

  const handleUpdateStatus = (newStatus: OrderStatus) => {
    if (activeOrder) {
      updateOrderStatus(activeOrder.id, newStatus);
    }
  };

  return (
    <div className="pb-28 max-w-md mx-auto px-4 space-y-4 animate-in fade-in duration-200">
      {/* 1. Top Header with Partner Identity */}
      <div className="pt-2 flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setRole('customer');
              navigateTo('home');
            }}
            className="p-1 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-black text-gray-900 dark:text-white">
              {rider.name}
            </h1>
            <p className="text-[11px] text-[#FF6B00] font-bold">
              Boda Boda Partner • {rider.vehiclePlate}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setRole('customer');
            navigateTo('home');
          }}
          className="text-xs text-gray-500 hover:text-[#FF6B00] font-semibold border border-gray-200 dark:border-white/10 px-2.5 py-1 rounded-full"
        >
          Customer View
        </button>
      </div>

      {/* 2. Online / Offline Toggle Banner */}
      <div
        onClick={toggleRiderOnline}
        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
          rider.isOnline
            ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200'
            : 'bg-gray-100 dark:bg-[#1E2228] border-gray-200 dark:border-white/10 text-gray-500'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${
              rider.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
            }`}
          />
          <div>
            <h3 className="font-bold text-xs">
              {rider.isOnline ? t.online : t.offline}
            </h3>
            <p className="text-[10px] opacity-80">
              {rider.isOnline
                ? 'Ready to receive delivery dispatches across Dar es Salaam'
                : 'Tap to go online and accept delivery jobs'}
            </p>
          </div>
        </div>

        <div>
          {rider.isOnline ? (
            <ToggleRight className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <ToggleLeft className="w-8 h-8 text-gray-400" />
          )}
        </div>
      </div>

      {/* 3. Rider Earnings Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1E2228] border border-gray-100 dark:border-white/5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            {t.todayEarnings}
          </span>
          <p className="text-base font-black text-gray-900 dark:text-white mt-1">
            TZS {rider.currentEarningsToday.toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold">+6 deliveries</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1E2228] border border-gray-100 dark:border-white/5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            {t.thisWeekEarnings}
          </span>
          <p className="text-base font-black text-[#FF6B00] mt-1">
            TZS {rider.currentEarningsWeek.toLocaleString()}
          </p>
          <span className="text-[10px] text-gray-400">{rider.completedDeliveries} all-time</span>
        </div>
      </div>

      {/* 4. Active Delivery Task */}
      {activeOrder ? (
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E2228] border border-orange-200 dark:border-orange-900/40 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#FF6B00] flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5" />
              {t.activeDelivery}
            </span>
            <span className="text-xs font-black text-gray-900 dark:text-white">
              Payout: TZS {activeOrder.deliveryFee.toLocaleString()}
            </span>
          </div>

          {/* Route Milestones */}
          <div className="space-y-3 relative pl-4 border-l-2 border-orange-400 text-xs">
            {/* Step 1: Restaurant pickup */}
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">
                1. Pickup Restaurant
              </span>
              <p className="font-extrabold text-gray-900 dark:text-white">
                {activeOrder.storeName}
              </p>
              <p className="text-[11px] text-gray-400">{activeOrder.storeAddress}</p>
              <div className="mt-1 flex items-center gap-2">
                <a
                  href={`tel:${activeOrder.storePhone}`}
                  className="inline-flex items-center gap-1 text-[11px] text-[#FF6B00] font-bold"
                >
                  <Phone className="w-3 h-3" />
                  Call Kitchen
                </a>
              </div>
            </div>

            {/* Step 2: Customer dropoff */}
            <div className="pt-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase">
                2. Dropoff Destination
              </span>
              <p className="font-extrabold text-gray-900 dark:text-white">
                {activeOrder.customerName}
              </p>
              <p className="text-[11px] text-gray-400">
                {activeOrder.deliveryAddress.ward}, {activeOrder.deliveryAddress.landmark}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <a
                  href={`tel:${activeOrder.customerPhone}`}
                  className="inline-flex items-center gap-1 text-[11px] text-[#FF6B00] font-bold"
                >
                  <Phone className="w-3 h-3" />
                  Call Customer ({activeOrder.customerPhone})
                </a>
              </div>
            </div>
          </div>

          {/* Stepper Buttons for Rider */}
          <div className="pt-2 space-y-2">
            {activeOrder.status === 'ready_for_pickup' || activeOrder.status === 'preparing' ? (
              <button
                onClick={() => handleUpdateStatus('picked_up')}
                className="w-full py-3 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                {t.markPickedUp}
              </button>
            ) : activeOrder.status === 'picked_up' ? (
              <button
                onClick={() => handleUpdateStatus('on_the_way')}
                className="w-full py-3 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Start Journey (On The Way)
              </button>
            ) : activeOrder.status === 'on_the_way' ? (
              <button
                onClick={() => handleUpdateStatus('delivered')}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{t.markDelivered}</span>
              </button>
            ) : null}

            <button
              onClick={() => navigateTo('track_order', { orderId: activeOrder.id })}
              className="w-full py-2 bg-gray-100 dark:bg-[#20252D] text-gray-700 dark:text-gray-300 font-bold text-xs rounded-xl"
            >
              Open GPS Route Map
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-white dark:bg-[#1E2228] rounded-2xl border border-gray-100 dark:border-white/5 space-y-2 text-xs">
          <Bike className="w-10 h-10 text-gray-300 mx-auto" />
          <h4 className="font-bold text-gray-900 dark:text-white">
            No Active Deliveries
          </h4>
          <p className="text-gray-400 max-w-xs mx-auto">
            Stay in high-density areas (Kinondoni, Masaki, Mikocheni) to receive new dispatch requests instantly.
          </p>
        </div>
      )}
    </div>
  );
};
