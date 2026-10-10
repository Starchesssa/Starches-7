import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import {
  MapPin,
  ChevronDown,
  Globe,
  Bell,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentCity,
    currentAddress,
    setIsAddressModalOpen,
    setIsDropoffMapPickerOpen,
    language,
    setLanguage,
    isDarkMode,
    searchQuery,
    setSearchQuery,
    navigateTo,
    activeScreen,
    notifications,
    setIsNotificationsOpen,
    t,
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 transition-colors bg-white/95 dark:bg-[#121417]/95 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
      <div className="max-w-md mx-auto px-4 pt-3 pb-2.5">
        {/* Top Bar: Brand Logo & Top Right Sliding Theme Switch */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          {/* Logo */}
          <button
            onClick={() => navigateTo('home')}
            className="focus:outline-none flex items-center text-left"
            aria-label="Starches Home"
          >
            <Logo size="md" isDark={isDarkMode} />
          </button>

          {/* Top Right Corner Controls: Sliding Switch Toggle + Language + Bell */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Sliding Theme Switch */}
            <ThemeToggle />

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'sw' : 'en')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-white/10 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
              title="Toggle English / Kiswahili"
            >
              <Globe className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span className="text-[11px]">{language === 'en' ? 'EN' : 'SW'}</span>
            </button>

            {/* Notifications Bell */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF6B00] ring-2 ring-white dark:ring-[#121417]"></span>
              )}
            </button>
          </div>
        </div>

        {/* Location Row (Customer Delivery Address) */}
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300 mb-2">
          <button
            onClick={() => setIsDropoffMapPickerOpen(true)}
            className="flex items-center gap-1.5 font-medium hover:text-[#FF6B00] transition-colors group text-left"
          >
            <div className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center text-[#FF6B00]">
              <MapPin className="w-3.5 h-3.5 fill-[#FF6B00]" />
            </div>
            <div className="flex flex-col text-left leading-none">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">
                {t.deliverTo}
              </span>
              <span className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1 text-[13px]">
                {currentAddress.ward || currentAddress.district || currentCity.name}
                <ChevronDown className="w-3 h-3 text-[#FF6B00] group-hover:translate-y-0.5 transition-transform" />
              </span>
            </div>
          </button>
        </div>

        {/* Search Input Bar (Visible on Explore) */}
        {activeScreen === 'explore' && (
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (activeScreen !== 'explore') navigateTo('explore');
              }}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-10 py-2.5 bg-gray-50 dark:bg-[#1E2228] text-gray-900 dark:text-white rounded-xl text-xs md:text-sm border border-gray-200 dark:border-white/10 focus:outline-none focus:border-[#FF6B00] dark:focus:border-[#FF6B00] placeholder-gray-400 dark:placeholder-gray-500 shadow-xs transition-colors"
            />
            <button
              onClick={() => navigateTo('explore')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#FF6B00] transition-colors"
              title="Filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
