import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ClipboardList,
  MapPin,
  CreditCard,
  Heart,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight,
  Sun,
  Moon,
  Laptop,
  Store,
  Bike,
  Shield,
  Smartphone,
  Globe,
  Bell,
} from 'lucide-react';
import { AppTheme } from '../../types';

export const ProfileScreen: React.FC = () => {
  const {
    user,
    role,
    setRole,
    theme,
    setTheme,
    isDarkMode,
    language,
    setLanguage,
    navigateTo,
    setIsAddressModalOpen,
    setIsHelpOpen,
    setIsNotificationsOpen,
    t,
  } = useApp();

  const [showSettingsSub, setShowSettingsSub] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const menuItems = [
    {
      id: 'orders',
      icon: ClipboardList,
      label: t.myOrders,
      action: () => navigateTo('orders'),
    },
    {
      id: 'addresses',
      icon: MapPin,
      label: t.savedAddresses,
      action: () => setIsAddressModalOpen(true),
    },
    {
      id: 'payment',
      icon: CreditCard,
      label: t.paymentMethods,
      action: () => setShowPaymentModal(true),
    },
    {
      id: 'favorites',
      icon: Heart,
      label: t.favorites,
      action: () => navigateTo('favorites'),
    },
    {
      id: 'help',
      icon: HelpCircle,
      label: t.helpAndSupport,
      action: () => setIsHelpOpen(true),
    },
    {
      id: 'settings',
      icon: Settings,
      label: t.settings,
      action: () => setShowSettingsSub(!showSettingsSub),
    },
  ];

  return (
    <div className="pb-28 max-w-md mx-auto px-4 space-y-4 animate-in fade-in duration-200">
      {/* 1. User Profile Header (matches mockup screen 9) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1E2228] border border-gray-100 dark:border-white/5 shadow-xs flex items-center gap-3.5">
        {/* Avatar Circle with initial 'I' */}
        <div className="w-14 h-14 rounded-full bg-[#1A1D20] text-white flex items-center justify-center font-black text-xl flex-shrink-0 shadow-sm border-2 border-white dark:border-white/10">
          {user.name.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="font-extrabold text-sm md:text-base text-gray-900 dark:text-white truncate">
            {user.name}
          </h2>
          <p className="text-xs text-gray-400 font-medium mt-0.5">{user.phone}</p>
          <span className="inline-block mt-1 text-[10px] font-bold text-[#FF6B00] bg-orange-50 dark:bg-orange-950/30 px-2 py-0.5 rounded-full">
            Starches Customer Account
          </span>
        </div>
      </div>

      {/* 2. Switch Role Cards (Seller & Rider Dashboards) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-orange-200 dark:border-orange-950/40 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#FF6B00]">
            Operational Dashboards
          </span>
          <span className="text-[10px] text-gray-400">Tanzania Partner Portal</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              setRole('seller');
              navigateTo('seller_dashboard');
            }}
            className="p-3 rounded-xl bg-white dark:bg-[#1E2228] border border-gray-200 dark:border-white/10 text-left hover:border-[#FF6B00] transition-colors group"
          >
            <Store className="w-5 h-5 text-[#FF6B00] mb-1.5" />
            <h4 className="font-extrabold text-xs text-gray-900 dark:text-white">
              Seller Dashboard
            </h4>
            <p className="text-[10px] text-gray-400 mt-0.5">Kitchens & Shops</p>
          </button>

          <button
            onClick={() => {
              setRole('rider');
              navigateTo('rider_dashboard');
            }}
            className="p-3 rounded-xl bg-white dark:bg-[#1E2228] border border-gray-200 dark:border-white/10 text-left hover:border-[#FF6B00] transition-colors group"
          >
            <Bike className="w-5 h-5 text-[#FF6B00] mb-1.5" />
            <h4 className="font-extrabold text-xs text-gray-900 dark:text-white">
              Rider Dashboard
            </h4>
            <p className="text-[10px] text-gray-400 mt-0.5">Boda Boda Partner</p>
          </button>
        </div>
      </div>

      {/* 3. Main Navigation Items (matches mockup screen 9) */}
      <div className="rounded-2xl bg-white dark:bg-[#1E2228] border border-gray-100 dark:border-white/5 shadow-xs overflow-hidden divide-y divide-gray-100 dark:divide-white/5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50/80 dark:hover:bg-white/5 transition-colors text-left"
            >
              <div className="flex items-center gap-3.5">
                <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="font-bold text-xs text-gray-800 dark:text-gray-200">
                  {item.label}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          );
        })}
      </div>

      {/* Sub-Settings Expansion (Theme, Language, Notifications) */}
      {showSettingsSub && (
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E2228] border border-gray-100 dark:border-white/5 space-y-4 animate-in fade-in text-xs">
          {/* Theme Selector */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              {t.theme}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['light', 'dark', 'system'] as AppTheme[]).map((thm) => (
                <button
                  key={thm}
                  onClick={() => setTheme(thm)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 font-bold capitalize transition-colors ${
                    theme === thm
                      ? 'border-[#FF6B00] bg-orange-50/50 dark:bg-orange-950/30 text-[#FF6B00]'
                      : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {thm === 'light' ? (
                    <Sun className="w-4 h-4" />
                  ) : thm === 'dark' ? (
                    <Moon className="w-4 h-4" />
                  ) : (
                    <Laptop className="w-4 h-4" />
                  )}
                  <span>{thm}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Language Selector */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              {t.language}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setLanguage('en')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition-colors ${
                  language === 'en'
                    ? 'border-[#FF6B00] bg-orange-50/50 dark:bg-orange-950/30 text-[#FF6B00]'
                    : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>English (EN)</span>
              </button>
              <button
                onClick={() => setLanguage('sw')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition-colors ${
                  language === 'sw'
                    ? 'border-[#FF6B00] bg-orange-50/50 dark:bg-orange-950/30 text-[#FF6B00]'
                    : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>Kiswahili (SW)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Log Out button (matches mockup screen 9) */}
      <button
        onClick={() => {
          alert('You are currently browsing in demo account mode.');
        }}
        className="w-full p-4 rounded-2xl bg-white dark:bg-[#1E2228] border border-gray-100 dark:border-white/5 text-red-500 font-bold text-xs flex items-center gap-2.5 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>{t.logOut}</span>
      </button>

      {/* Payment Methods Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm bg-white dark:bg-[#1E2228] rounded-2xl p-5 border border-gray-100 dark:border-white/10 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                Payment Preferences
              </h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400">
                ✕
              </button>
            </div>
            <div className="space-y-2">
              <div className="p-3 rounded-xl border border-orange-200 bg-orange-50/40 dark:bg-orange-950/20 flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-900 dark:text-white block">
                    Tigo Pesa / Halopesa
                  </span>
                  <span className="text-[11px] text-gray-500">{user.phone}</span>
                </div>
                <span className="text-[10px] font-bold text-[#FF6B00]">Primary</span>
              </div>
              <div className="p-3 rounded-xl border border-gray-200 dark:border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-900 dark:text-white block">
                    Cash on Delivery
                  </span>
                  <span className="text-[11px] text-gray-400">Active upon doorstep delivery</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold">Enabled</span>
              </div>
            </div>
            <button
              onClick={() => setShowPaymentModal(false)}
              className="w-full py-2.5 bg-[#FF6B00] text-white font-bold rounded-xl"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
