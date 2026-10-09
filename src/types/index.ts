export type AppRole = 'customer' | 'seller' | 'rider';
export type AppTheme = 'light' | 'dark' | 'system';
export type AppLanguage = 'en' | 'sw';

export type ScreenName =
  | 'splash'
  | 'home'
  | 'explore'
  | 'restaurant_detail'
  | 'cart'
  | 'checkout'
  | 'track_order'
  | 'order_details'
  | 'orders'
  | 'favorites'
  | 'profile'
  | 'seller_dashboard'
  | 'rider_dashboard';

export interface TanzaniaCity {
  id: string;
  name: string;
  nameSw: string;
  isAvailable: boolean;
  region: string;
  defaultCoordinates: { lat: number; lng: number };
}

export interface TanzaniaAddress {
  id: string;
  title: string; // e.g. "Home", "Work", "Office"
  city: string; // e.g. "Dar es Salaam"
  district: string; // e.g. "Kinondoni"
  ward: string; // e.g. "Mikocheni B"
  mtaa: string; // e.g. "Mwinyijuma St"
  landmark: string; // e.g. "Near Shoppers Plaza, white gate"
  deliveryInstructions?: string;
  coordinates: { lat: number; lng: number };
  isDefault?: boolean;
}

export type StoreType = 'restaurant' | 'shop' | 'supermarket' | 'bakery' | 'pharmacy';

export interface StoreCategory {
  id: string;
  name: string;
  nameSw: string;
  icon: string;
  type: 'food' | 'marketplace' | 'all';
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  type: StoreType;
  categories: string[];
  rating: number;
  reviewCount: number;
  distanceKm: number;
  deliveryTimeMinutes: { min: number; max: number };
  deliveryFee: number; // in TZS
  freeDeliveryThreshold?: number; // e.g. Free delivery over TZS 5,000
  city: string;
  district: string;
  address: string;
  heroImage: string;
  logoImage: string;
  isOpen: boolean;
  openingHours: string;
  isFeatured?: boolean;
  isPopular?: boolean;
  phone: string;
  tagline: string;
}

export interface ProductAddon {
  id: string;
  name: string;
  nameSw: string;
  price: number; // in TZS
}

export interface ProductAddonGroup {
  id: string;
  name: string;
  nameSw: string;
  required: boolean;
  maxSelectable: number;
  options: ProductAddon[];
}

export interface Product {
  id: string;
  storeId: string;
  storeName: string;
  name: string;
  nameSw: string;
  description: string;
  descriptionSw: string;
  price: number; // in TZS
  originalPrice?: number;
  category: string;
  image: string;
  isAvailable: boolean;
  isPopular?: boolean;
  isSpecialOffer?: boolean;
  isVegetarian?: boolean;
  isHalal?: boolean;
  prepTimeMinutes?: number;
  addonGroups?: ProductAddonGroup[];
  unit?: string; // e.g. "500g", "1L", "pack" for marketplace items
}

export interface CartItem {
  id: string; // cart item unique key
  productId: string;
  storeId: string;
  storeName: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedAddons?: {
    groupId: string;
    addonId: string;
    name: string;
    price: number;
  }[];
  note?: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'rider_assigned'
  | 'picked_up'
  | 'on_the_way'
  | 'delivered'
  | 'cancelled';

export type PaymentMethodType = 'mobile_money' | 'cash_on_delivery' | 'card';

export type MobileMoneyProvider = 'tigopesa' | 'mpesa' | 'airtel' | 'halopesa';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image: string;
  selectedAddons?: string[];
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  storeId: string;
  storeName: string;
  storePhone: string;
  storeAddress: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
  currency: 'TZS';
  status: OrderStatus;
  paymentMethod: PaymentMethodType;
  mobileMoneyProvider?: MobileMoneyProvider;
  mobileMoneyPhone?: string;
  isPaid: boolean;
  deliveryAddress: TanzaniaAddress;
  deliveryInstructions?: string;
  rider?: {
    id: string;
    name: string;
    phone: string;
    rating: number;
    completedTrips: number;
    vehicleType: string;
    vehiclePlate: string;
    avatar: string;
    currentLocation?: { lat: number; lng: number };
  };
  estimatedDeliveryMinutes: number;
  createdAt: string;
  updatedAt: string;
  statusTimestamps: Partial<Record<OrderStatus, string>>;
}

export interface RiderProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleType: 'boda_boda' | 'bajaj' | 'bicycle' | 'car';
  vehiclePlate: string;
  rating: number;
  completedDeliveries: number;
  isOnline: boolean;
  currentEarningsToday: number;
  currentEarningsWeek: number;
  avatar: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  defaultCityId: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  titleSw: string;
  message: string;
  messageSw: string;
  timestamp: string;
  type: 'order' | 'promo' | 'system';
  isRead: boolean;
  orderId?: string;
}
