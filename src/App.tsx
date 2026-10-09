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
import { SellerDashboard } from './components/screens/SellerDashboard';
import { RiderDashboard } from './components/screens/RiderDashboard';
import { AddressModal } from './components/modals/AddressModal';
import { NotificationsModal } from './components/modals/NotificationsModal';
import { HelpSupportModal } from './components/modals/HelpSupportModal';

const AppContent: React.FC = () => {
  const { activeScreen, isDarkMode } = useApp();
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    // Only show splash once per session unless reloaded
    return !sessionStorage.getItem('starches_splash_dismissed');
  });

  const handleDismissSplash = () => {
    setShowSplash(false);
    sessionStorage.setItem('starches_splash_dismissed', 'true');
  };

  if (showSplash) {
    return <SplashScreen onDismiss={handleDismissSplash} />;
  }

  // Screens where Header or BottomNav might be customized
  const hideHeaderOnScreens = ['restaurant_detail', 'track_order'];
  const hideBottomNavOnScreens = ['checkout', 'restaurant_detail', 'track_order', 'order_details'];

  const shouldShowHeader = !hideHeaderOnScreens.includes(activeScreen);
  const shouldShowBottomNav = !hideBottomNavOnScreens.includes(activeScreen);

  return (
    <div className="min-h-screen bg-[#F0EBE1] dark:bg-[#0B0C0E] text-gray-900 dark:text-gray-100 flex flex-col items-center justify-start transition-colors antialiased selection:bg-[#FF6B00] selection:text-white">
      {/* Mobile Frame Container: Centered max-w-md on desktop with realistic native mobile feel */}
      <div className="w-full max-w-md min-h-screen bg-[#FAF7F2] dark:bg-[#121417] shadow-2xl relative flex flex-col border-x border-black/5 dark:border-white/5 transition-colors">
        {shouldShowHeader && <Header />}

        <main className="flex-1 w-full overflow-x-hidden">
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
          {activeScreen === 'seller_dashboard' && <SellerDashboard />}
          {activeScreen === 'rider_dashboard' && <RiderDashboard />}
        </main>

        {shouldShowBottomNav && <BottomNav />}

        {/* Global Modals */}
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
