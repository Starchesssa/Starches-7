import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { SplashScreen } from './components/screens/SplashScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { ExploreScreen } from './components/screens/ExploreScreen';
import { RestaurantDetailScreen } from './components/screens/RestaurantDetailScreen';
import { CartScreen } from './components/screens/CartScreen';
import { CheckoutScreen } from './components/screens/CheckoutScreen';
import { OrderTrackingScreen } from './components/screens/OrderTrackingScreen';
import { OrderDetailsScreen } from './components/screens/OrderDetailsScreen';
import { OrderHistoryScreen } from './components/screens/OrderHistoryScreen';
import { FavoritesScreen } from './components/screens/FavoritesScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { AddressModal } from './components/modals/AddressModal';
import { DropoffLocationModal } from './components/modals/DropoffLocationModal';
import { NotificationsModal } from './components/modals/NotificationsModal';
import { HelpSupportModal } from './components/modals/HelpSupportModal';

const AppContent: React.FC = () => {
  const {
    activeScreen,
    isDarkMode,
    hasConfirmedInitialLocation,
    setHasConfirmedInitialLocation,
    isDropoffMapPickerOpen,
    setIsDropoffMapPickerOpen,
  } = useApp();

  const [showSplash, setShowSplash] = useState<boolean>(() => {
    return !sessionStorage.getItem('starches_splash_dismissed');
  });

  const handleDismissSplash = () => {
    setShowSplash(false);
    sessionStorage.setItem('starches_splash_dismissed', 'true');
  };

  if (showSplash) {
    return <SplashScreen onDismiss={handleDismissSplash} />;
  }

  // Pre-entry Dropoff Location Selection: If user hasn't selected their drop-off point yet
  if (!hasConfirmedInitialLocation) {
    return (
      <div className="min-h-screen bg-[#F0EBE1] dark:bg-[#0B0C0E] text-gray-900 dark:text-gray-100 flex flex-col items-center justify-start transition-colors antialiased">
        <DropoffLocationModal
          isOpen={true}
          isInitialSetup={true}
          onClose={() => setHasConfirmedInitialLocation(true)}
        />
      </div>
    );
  }

  // Screens where Header or BottomNav are hidden for immersion
  // Home uses an edge-to-edge map canvas with integrated floating controls
  const hideHeaderOnScreens = ['home', 'restaurant_detail', 'track_order'];
  const hideBottomNavOnScreens = ['checkout', 'restaurant_detail', 'track_order', 'order_details'];

  const shouldShowHeader = !hideHeaderOnScreens.includes(activeScreen);
  const shouldShowBottomNav = !hideBottomNavOnScreens.includes(activeScreen);

  return (
    <div className="min-h-screen bg-[#F0EBE1] dark:bg-[#0B0C0E] text-gray-900 dark:text-gray-100 flex flex-col items-center justify-start transition-colors antialiased selection:bg-[#FF6B00] selection:text-white">
      {/* Mobile Frame Container: Centered max-w-md on desktop with native mobile customer experience */}
      <div className="w-full max-w-md min-h-screen bg-[#FAF7F2] dark:bg-[#121417] shadow-2xl relative flex flex-col border-x border-black/5 dark:border-white/5 transition-colors">
        {shouldShowHeader && <Header />}

        <main className={`flex-1 w-full ${activeScreen === 'home' ? 'h-[100dvh] max-h-[100dvh] relative overflow-hidden' : 'overflow-x-hidden'}`}>
          {activeScreen === 'home' && <HomeScreen />}
          {activeScreen === 'explore' && <ExploreScreen />}
          {activeScreen === 'restaurant_detail' && <RestaurantDetailScreen />}
          {activeScreen === 'cart' && <CartScreen />}
          {activeScreen === 'checkout' && <CheckoutScreen />}
          {activeScreen === 'track_order' && <OrderTrackingScreen />}
          {activeScreen === 'order_details' && <OrderDetailsScreen />}
          {activeScreen === 'orders' && <OrderHistoryScreen />}
          {activeScreen === 'favorites' && <FavoritesScreen />}
          {activeScreen === 'profile' && <ProfileScreen />}
        </main>

        {shouldShowBottomNav && <BottomNav />}

        {/* Global Modals */}
        <DropoffLocationModal
          isOpen={isDropoffMapPickerOpen}
          isInitialSetup={false}
          onClose={() => setIsDropoffMapPickerOpen(false)}
        />
        <AddressModal />
        <NotificationsModal />
        <HelpSupportModal />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
