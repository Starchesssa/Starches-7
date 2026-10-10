import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { GoogleLiveTrackingMap } from '../maps/GoogleLiveTrackingMap';
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  Clock,
  MapPin,
  CheckCircle2,
  Navigation,
  ChevronRight,
  Receipt,
  Store as StoreIcon,
} from 'lucide-react';
import { OrderStatus } from '../../types';

export const OrderTrackingScreen: React.FC = () => {
  const {
    orders,
    activeOrder,
    screenParams,
    goBack,
    navigateTo,
    updateOrderStatus,
    language,
    t,
  } = useApp();

  const orderId = screenParams.orderId || activeOrder?.id || orders[0]?.id;
  const order = orders.find((o) => o.id === orderId) || orders[0];

  // Lifecycle steps
  const steps: { key: OrderStatus; label: string; labelSw: string }[] = [
    { key: 'preparing', label: 'Preparing', labelSw: 'Inaandaliwa' },
    { key: 'picked_up', label: 'Picked up', labelSw: 'Imechukuliwa' },
    { key: 'on_the_way', label: 'On the way', labelSw: 'Iko njiani' },
    { key: 'delivered', label: 'Delivered', labelSw: 'Imefikishwa' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
      case 'preparing':
        return 0;
      case 'ready_for_pickup':
      case 'rider_assigned':
      case 'picked_up':
        return 1;
      case 'on_the_way':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(order ? order.status : 'on_the_way');

  // Rider position animation simulation
  const [riderProgress, setRiderProgress] = useState(65);

  useEffect(() => {
    const interval = setInterval(() => {
      setRiderProgress((prev) => (prev >= 90 ? 40 : prev + 2));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!order) {
    return (
      <div className="p-8 text-center text-xs text-gray-500">
        No active order found.
        <button onClick={() => navigateTo('home')} className="mt-4 block mx-auto text-[#FF6B00]">
          Return Home
        </button>
      </div>
    );
  }

  // Developer simulation helper to test all lifecycle phases
  const handleSimulateNextStep = () => {
    const transitions: Record<OrderStatus, OrderStatus> = {
      pending: 'confirmed',
      confirmed: 'preparing',
      preparing: 'picked_up',
      ready_for_pickup: 'picked_up',
      rider_assigned: 'picked_up',
      picked_up: 'on_the_way',
      on_the_way: 'delivered',
      delivered: 'delivered',
      cancelled: 'cancelled',
    };
    const next = transitions[order.status] || 'delivered';
    updateOrderStatus(order.id, next);
  };

  return (
    <div className="pb-24 max-w-md mx-auto flex flex-col min-h-screen animate-in fade-in duration-200">
      {/* 1. Header (matches mockup screen 4) */}
      <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#121417]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('home')}
            className="p-1 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-black text-gray-900 dark:text-white">
              {t.trackOrder}
            </h1>
            <p className="text-[11px] text-gray-400 font-semibold">#{order.orderNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle showLabels={false} />
          <button
            onClick={() => navigateTo('order_details', { orderId: order.id })}
            className="text-xs text-[#FF6B00] font-bold flex items-center gap-1 hover:underline"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Receipt</span>
          </button>
        </div>
      </div>

      {/* 2. Google Maps Live Route & Vehicle Tracking (Uber / Bolt Style) */}
      <div className="relative flex-1 min-h-[350px] bg-[#E9E5DD] dark:bg-[#1B2129] overflow-hidden flex flex-col">
        <GoogleLiveTrackingMap
          restaurantLocation={{ lat: -6.7924, lng: 39.2083 }}
          customerLocation={order.deliveryAddress.coordinates || { lat: -6.7725, lng: 39.2483 }}
          restaurantName={order.storeName}
          orderStatus={order.status}
          estimatedMinutes={order.estimatedDeliveryMinutes}
        />

        {/* Dev simulation trigger button on bottom left of map */}
        <div className="absolute bottom-3 left-3 z-10">
          <button
            onClick={handleSimulateNextStep}
            className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-bold hover:bg-black/80 transition-colors shadow-sm"
          >
            Advance Status (Dev)
          </button>
        </div>
      </div>

      {/* 3. Rider Info Drawer (matches mockup screen 4) */}
      <div className="p-4 bg-white dark:bg-[#1A1D22] border-t border-gray-100 dark:border-white/5 space-y-4 shadow-xl">
        {/* Rider Status Headline */}
        <div>
          <h2 className="text-sm font-black text-gray-900 dark:text-white">
            {order.status === 'delivered'
              ? 'Order Delivered Safely'
              : order.status === 'on_the_way'
              ? t.riderOnTheWay
              : 'Kitchen is preparing your order'}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {order.status === 'delivered'
              ? 'Enjoy your meal!'
              : `${t.foodDistance} 2.5 km ${t.away}`}
          </p>
        </div>

        {/* Rider Contact Card (matches mockup screen 4) */}
        {order.rider && (
          <div className="p-3 rounded-2xl bg-gray-50 dark:bg-[#20252D] border border-gray-100 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                <img
                  src={order.rider.avatar}
                  alt={order.rider.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h4 className="font-extrabold text-xs text-gray-900 dark:text-white">
                  {order.rider.name}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                  <span className="text-amber-500 font-bold">★ {order.rider.rating}</span>
                  <span>({order.rider.completedTrips})</span>
                  <span>·</span>
                  <span className="font-semibold text-gray-600 dark:text-gray-300">
                    {order.rider.vehicleType} ({order.rider.vehiclePlate})
                  </span>
                </div>
              </div>
            </div>

            {/* Call button */}
            <a
              href={`tel:${order.rider.phone}`}
              className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/40 text-[#FF6B00] flex items-center justify-center hover:bg-[#FF6B00] hover:text-white transition-colors"
              aria-label="Call Rider"
            >
              <Phone className="w-4 h-4 fill-current" />
            </a>
          </div>
        )}

        {/* 4. Live Progress Stepper (matches mockup screen 4) */}
        <div>
          <div className="relative flex items-center justify-between px-2 pt-2">
            {/* Connecting Bar */}
            <div className="absolute top-5 left-6 right-6 h-1 bg-gray-100 dark:bg-white/10 z-0">
              <div
                className="h-full bg-[#FF6B00] transition-all duration-500"
                style={{
                  width: `${(currentStepIdx / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>

            {steps.map((st, i) => {
              const isPastOrCurrent = i <= currentStepIdx;
              const isCurrent = i === currentStepIdx;

              return (
                <div key={st.key} className="flex flex-col items-center z-10">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      isPastOrCurrent
                        ? 'bg-[#FF6B00] text-white ring-4 ring-orange-100 dark:ring-orange-950/50'
                        : 'bg-gray-200 dark:bg-[#20252D] text-gray-400'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                  </div>
                  <span
                    className={`text-[10px] mt-1.5 font-bold ${
                      isCurrent
                        ? 'text-[#FF6B00]'
                        : isPastOrCurrent
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-400'
                    }`}
                  >
                    {language === 'sw' ? st.labelSw : st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* View Receipt CTA */}
        <button
          onClick={() => navigateTo('order_details', { orderId: order.id })}
          className="w-full py-3 bg-gray-100 dark:bg-[#20252D] hover:bg-gray-200 dark:hover:bg-[#2A303A] text-gray-900 dark:text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <span>{t.viewDetails}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
