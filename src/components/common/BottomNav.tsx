import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Compass, ClipboardList, ShoppingCart, User } from 'lucide-react';
import { ScreenName } from '../../types';

export const BottomNav: React.FC = () => {
  const { activeScreen, navigateTo, cart, orders, t, role } = useApp();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;

  interface NavItem {
    id: ScreenName;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }

  const items: NavItem[] = [
    {
      id: 'home',
      label: t.navHome,
      icon: Home,
    },
    {
      id: 'explore',
      label: t.navExplore,
      icon: Compass,
    },
    {
      id: 'orders',
      label: t.navOrders,
      icon: ClipboardList,
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
    },
    {
      id: 'cart',
      label: t.navCart,
      icon: ShoppingCart,
      badge: cartCount > 0 ? cartCount : undefined,
    },
    {
      id: 'profile',
      label: t.navProfile,
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#1A1D22]/95 backdrop-blur-md border-t border-gray-100 dark:border-white/5 transition-colors">
      <div className="max-w-md mx-auto px-2 py-1.5 flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-[#FF6B00] font-bold'
                  : 'text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#FF6B00] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight leading-none">
                {item.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] mt-0.5"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
