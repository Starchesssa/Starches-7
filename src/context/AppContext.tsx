import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppRole,
  AppTheme,
  AppLanguage,
  ScreenName,
  TanzaniaCity,
  TanzaniaAddress,
  Store,
  Product,
  CartItem,
  Order,
  OrderStatus,
  RiderProfile,
  UserProfile,
  NotificationItem,
} from '../types';
import {
  TANZANIA_CITIES,
  DEFAULT_ADDRESSES,
  STORES,
  PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_RIDER,
  INITIAL_USER,
} from '../data/mockData';
import { translations } from '../i18n/translations';

interface ScreenState {
  screen: ScreenName;
  params?: Record<string, any>;
}

interface AppContextType {
  // Theme & Language
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: typeof translations.en;

  // Role
  role: AppRole;
  setRole: (role: AppRole) => void;

  // Navigation
  activeScreen: ScreenName;
  screenParams: Record<string, any>;
  navigateTo: (screen: ScreenName, params?: Record<string, any>) => void;
  goBack: () => void;

  // Location & City
  currentCity: TanzaniaCity;
  selectCity: (cityId: string) => boolean;
  cities: TanzaniaCity[];
  currentAddress: TanzaniaAddress;
  savedAddresses: TanzaniaAddress[];
  addAddress: (address: Omit<TanzaniaAddress, 'id'>) => TanzaniaAddress;
  selectAddress: (id: string) => void;

  // Catalog
  stores: Store[];
  products: Product[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    selectedAddons?: { groupId: string; addonId: string; name: string; price: number }[],
    note?: string
  ) => void;
  updateCartQuantity: (cartItemId: string, newQty: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartDeliveryFee: number;
  cartTotal: number;

  // Orders
  orders: Order[];
  activeOrder: Order | null;
  placeOrder: (paymentDetails: {
    paymentMethod: 'mobile_money' | 'cash_on_delivery' | 'card';
    mobileMoneyProvider?: 'tigopesa' | 'mpesa' | 'airtel' | 'halopesa';
    mobileMoneyPhone?: string;
    instructions?: string;
  }) => Order;
  reorder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Favorites
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  // User & Rider Profiles
  user: UserProfile;
  rider: RiderProfile;
  toggleRiderOnline: () => void;

  // Seller Operations
  toggleProductStock: (productId: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;

  // Modals
  isAddressModalOpen: boolean;
  setIsAddressModalOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isHelpOpen: boolean;
  setIsHelpOpen: (open: boolean) => void;
  notifications: NotificationItem[];
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme
  const [theme, setThemeState] = useState<AppTheme>(() => {
    return (localStorage.getItem('starches_theme') as AppTheme) || 'light';
  });

  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const isDarkMode = theme === 'dark' || (theme === 'system' && systemIsDark);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.remove('bg-[#FAF7F2]', 'text-[#1A1D20]');
      document.body.classList.add('bg-[#121417]', 'text-white');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-[#121417]', 'text-white');
      document.body.classList.add('bg-[#FAF7F2]', 'text-[#1A1D20]');
    }
  }, [isDarkMode]);

  const setTheme = (t: AppTheme) => {
    setThemeState(t);
    localStorage.setItem('starches_theme', t);
  };

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  // Language
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    return (localStorage.getItem('starches_lang') as AppLanguage) || 'en';
  });

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('starches_lang', lang);
  };

  const t = translations[language] || translations.en;

  // Role
  const [role, setRole] = useState<AppRole>('customer');

  // Navigation History
  const [navHistory, setNavHistory] = useState<ScreenState[]>([{ screen: 'home' }]);
  const currentNav = navHistory[navHistory.length - 1] || { screen: 'home' };
  const activeScreen = currentNav.screen;
  const screenParams = currentNav.params || {};

  const navigateTo = (screen: ScreenName, params?: Record<string, any>) => {
    setNavHistory((prev) => [...prev, { screen, params }]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setNavHistory((prev) => {
      if (prev.length <= 1) return [{ screen: 'home' }];
      return prev.slice(0, prev.length - 1);
    });
  };

  // Location & City
  const [currentCity, setCurrentCity] = useState<TanzaniaCity>(TANZANIA_CITIES[0]);
  const [savedAddresses, setSavedAddresses] = useState<TanzaniaAddress[]>(DEFAULT_ADDRESSES);
  const [currentAddress, setCurrentAddress] = useState<TanzaniaAddress>(DEFAULT_ADDRESSES[0]);

  const selectCity = (cityId: string) => {
    const found = TANZANIA_CITIES.find((c) => c.id === cityId);
    if (found) {
      setCurrentCity(found);
      return found.isAvailable;
    }
    return false;
  };

  const addAddress = (addr: Omit<TanzaniaAddress, 'id'>) => {
    const newAddr: TanzaniaAddress = {
      ...addr,
      id: `addr-${Date.now()}`,
    };
    setSavedAddresses((prev) => [newAddr, ...prev]);
    setCurrentAddress(newAddr);
    return newAddr;
  };

  const selectAddress = (id: string) => {
    const found = savedAddresses.find((a) => a.id === id);
    if (found) setCurrentAddress(found);
  };

  // Catalog
  const [stores, setStores] = useState<Store[]>(STORES);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedAddons?: { groupId: string; addonId: string; name: string; price: number }[],
    note?: string
  ) => {
    setCart((prev) => {
      // Check if product with same addons exists
      const addonKey = selectedAddons ? selectedAddons.map((a) => a.addonId).sort().join(',') : '';
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === product.id &&
          (item.selectedAddons ? item.selectedAddons.map((a) => a.addonId).sort().join(',') : '') === addonKey
      );

      const addonSum = selectedAddons ? selectedAddons.reduce((sum, a) => sum + a.price, 0) : 0;
      const finalItemPrice = product.price + addonSum;

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
          price: finalItemPrice,
          note: note || next[existingIndex].note,
        };
        return next;
      } else {
        const newItem: CartItem = {
          id: `cart-${product.id}-${Date.now()}`,
          productId: product.id,
          storeId: product.storeId,
          storeName: product.storeName,
          name: product.name,
          price: finalItemPrice,
          quantity,
          image: product.image,
          selectedAddons,
          note,
        };
        return [...prev, newItem];
      }
    });
  };

  const updateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const clearCart = () => setCart([]);

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartDeliveryFee = cartSubtotal > 0 ? (cartSubtotal >= 50000 ? 0 : 2000) : 0;
  const cartTotal = cartSubtotal + cartDeliveryFee;

  // Orders
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const activeOrder = orders.find((o) => o.status !== 'delivered' && o.status !== 'cancelled') || null;

  const placeOrder = (paymentDetails: {
    paymentMethod: 'mobile_money' | 'cash_on_delivery' | 'card';
    mobileMoneyProvider?: 'tigopesa' | 'mpesa' | 'airtel' | 'halopesa';
    mobileMoneyPhone?: string;
    instructions?: string;
  }) => {
    const storeId = cart[0]?.storeId || STORES[0].id;
    const store = stores.find((s) => s.id === storeId) || STORES[0];

    const orderNumber = `STR-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      customerId: user.id,
      customerName: user.name,
      customerPhone: user.phone,
      storeId: store.id,
      storeName: store.name,
      storePhone: store.phone,
      storeAddress: store.address,
      items: cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
        image: item.image,
        selectedAddons: item.selectedAddons?.map((a) => a.name),
      })),
      subtotal: cartSubtotal,
      deliveryFee: cartDeliveryFee,
      serviceFee: 500,
      total: cartTotal + 500,
      currency: 'TZS',
      status: 'confirmed',
      paymentMethod: paymentDetails.paymentMethod,
      mobileMoneyProvider: paymentDetails.mobileMoneyProvider,
      mobileMoneyPhone: paymentDetails.mobileMoneyPhone,
      isPaid: paymentDetails.paymentMethod !== 'cash_on_delivery',
      deliveryAddress: currentAddress,
      deliveryInstructions: paymentDetails.instructions,
      rider: {
        id: 'rider-juma',
        name: 'Juma',
        phone: '+255 712 889 001',
        rating: 4.8,
        completedTrips: 324,
        vehicleType: 'Boda Boda',
        vehiclePlate: 'MC 482 DZ',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        currentLocation: { lat: -6.78, lng: 39.23 },
      },
      estimatedDeliveryMinutes: 25,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusTimestamps: {
        pending: new Date().toISOString(),
        confirmed: new Date().toISOString(),
      },
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Order Confirmed!',
      titleSw: 'Oda Imethibitishwa!',
      message: `Your order #${orderNumber} from ${store.name} is being prepared.`,
      messageSw: `Oda yako #${orderNumber} kutoka ${store.name} inaanza kuandaliwa.`,
      timestamp: 'Just now',
      type: 'order',
      isRead: false,
      orderId: newOrder.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newOrder;
  };

  const reorder = (prevOrder: Order) => {
    // Add all items from prevOrder to cart
    prevOrder.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        addToCart(product, item.quantity);
      }
    });
    navigateTo('cart');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          status,
          updatedAt: new Date().toISOString(),
          statusTimestamps: {
            ...order.statusTimestamps,
            [status]: new Date().toISOString(),
          },
        };
      })
    );
  };

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(['store-mamboz', 'prod-classic-beef', 'store-zanzibar-pizza']);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isFavorite = (id: string) => favorites.includes(id);

  // User & Rider
  const [user] = useState<UserProfile>(INITIAL_USER);
  const [rider, setRider] = useState<RiderProfile>(INITIAL_RIDER);

  const toggleRiderOnline = () => {
    setRider((prev) => ({ ...prev, isOnline: !prev.isOnline }));
  };

  // Seller Operations
  const toggleProductStock = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, isAvailable: !p.isAvailable } : p))
    );
  };

  const addProduct = (newProdData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProd, ...prev]);
  };

  // Modals & Notifications
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Karibu Starches!',
      titleSw: 'Karibu Starches!',
      message: 'Get Free Delivery on your first order over TZS 5,000 using code KARIBU.',
      messageSw: 'Pata usafirishaji wa bure kwenye oda yako ya kwanza zaidi ya TZS 5,000 ukitumia kuponi KARIBU.',
      timestamp: '1 hour ago',
      type: 'promo',
      isRead: false,
    },
    {
      id: 'notif-2',
      title: 'Rider Juma is nearby',
      titleSw: 'Mwendeshaji Juma yuko karibu',
      message: 'Your burger order #STR-9842 is arriving in approximately 12 mins.',
      messageSw: 'Baga yako #STR-9842 inakaribia kufika baada ya dakika 12.',
      timestamp: '4 mins ago',
      type: 'order',
      isRead: false,
      orderId: 'order-str-9842',
    },
  ]);

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isDarkMode,
        language,
        setLanguage,
        t,
        role,
        setRole,
        activeScreen,
        screenParams,
        navigateTo,
        goBack,
        currentCity,
        selectCity,
        cities: TANZANIA_CITIES,
        currentAddress,
        savedAddresses,
        addAddress,
        selectAddress,
        stores,
        products,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartDeliveryFee,
        cartTotal,
        orders,
        activeOrder,
        placeOrder,
        reorder,
        updateOrderStatus,
        favorites,
        toggleFavorite,
        isFavorite,
        user,
        rider,
        toggleRiderOnline,
        toggleProductStock,
        addProduct,
        isAddressModalOpen,
        setIsAddressModalOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isHelpOpen,
        setIsHelpOpen,
        notifications,
        markAllNotificationsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
