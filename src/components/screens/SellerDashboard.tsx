import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Store,
  Plus,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  Sliders,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
} from 'lucide-react';
import { Product, OrderStatus } from '../../types';

export const SellerDashboard: React.FC = () => {
  const {
    stores,
    products,
    orders,
    updateOrderStatus,
    toggleProductStock,
    addProduct,
    setRole,
    navigateTo,
    t,
    language,
  } = useApp();

  // Active seller store
  const store = stores[0]; // Mamboz Burger
  const storeProducts = products.filter((p) => p.storeId === store.id);
  const incomingOrders = orders.filter((o) => o.storeId === store.id);

  const [activeTab, setActiveTab] = useState<'orders' | 'catalog' | 'stats'>('orders');
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);

  // New product form state
  const [newTitle, setNewTitle] = useState('');
  const [newTitleSw, setNewTitleSw] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('10000');
  const [newCategory, setNewCategory] = useState('burgers');

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    addProduct({
      storeId: store.id,
      storeName: store.name,
      name: newTitle,
      nameSw: newTitleSw || newTitle,
      description: newDesc || 'Delicious local recipe.',
      descriptionSw: newDesc || 'Mapishi matamu ya kienyeji.',
      price: parseInt(newPrice) || 10000,
      category: newCategory,
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
      isHalal: true,
    });

    setNewTitle('');
    setNewTitleSw('');
    setNewDesc('');
    setIsNewProductOpen(false);
  };

  const todayRevenue = incomingOrders.reduce((sum, o) => sum + o.subtotal, 0);

  return (
    <div className="pb-28 max-w-md mx-auto px-4 space-y-4 animate-in fade-in duration-200">
      {/* 1. Header with Store Identity */}
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
              {store.name} Portal
            </h1>
            <p className="text-[11px] text-[#FF6B00] font-bold">Kitchen & Seller Mode</p>
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

      {/* 2. Today's Performance Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">
            {t.dailyRevenue}
          </span>
          <TrendingUp className="w-4 h-4 text-white/90" />
        </div>
        <div className="text-2xl font-black">
          TZS {todayRevenue.toLocaleString()}
        </div>
        <div className="mt-2 text-xs text-white/80 flex items-center gap-2">
          <span>{incomingOrders.length} {t.todayOrders}</span>
          <span>·</span>
          <span>Rating: ★ {store.rating} ({store.reviewCount})</span>
        </div>
      </div>

      {/* 3. Sub Tabs */}
      <div className="flex bg-gray-100 dark:bg-[#1E2228] p-1 rounded-xl text-xs font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            activeTab === 'orders'
              ? 'bg-white dark:bg-[#2A303A] text-[#FF6B00] shadow-xs'
              : 'text-gray-500'
          }`}
        >
          {t.activeOrders} ({incomingOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            activeTab === 'catalog'
              ? 'bg-white dark:bg-[#2A303A] text-[#FF6B00] shadow-xs'
              : 'text-gray-500'
          }`}
        >
          {t.catalogManagement} ({storeProducts.length})
        </button>
      </div>

      {/* 4. Tab Content: Orders Queue */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          {incomingOrders.map((ord) => (
            <div
              key={ord.id}
              className="p-4 rounded-2xl bg-white dark:bg-[#1E2228] border border-gray-100 dark:border-white/5 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-xs text-gray-900 dark:text-white">
                    Order #{ord.orderNumber}
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    Customer: {ord.customerName} ({ord.customerPhone})
                  </p>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase bg-orange-100 dark:bg-orange-950/40 text-[#FF6B00]">
                  {ord.status.replace('_', ' ')}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-1 py-1 border-y border-gray-100 dark:border-white/5 text-xs text-gray-700 dark:text-gray-300">
                {ord.items.map((it, i) => (
                  <div key={i} className="flex justify-between">
                    <span>
                      {it.quantity}x {it.name}
                    </span>
                    <span className="font-semibold">
                      TZS {it.totalPrice.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {ord.deliveryInstructions && (
                <p className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-2 rounded-lg">
                  Note: {ord.deliveryInstructions}
                </p>
              )}

              {/* Status Advance Buttons for Seller */}
              <div className="flex gap-2 pt-1">
                {ord.status === 'confirmed' && (
                  <button
                    onClick={() => updateOrderStatus(ord.id, 'preparing')}
                    className="flex-1 py-2 bg-[#FF6B00] text-white font-bold text-xs rounded-xl hover:bg-[#E55A00]"
                  >
                    {t.markPreparing}
                  </button>
                )}
                {ord.status === 'preparing' && (
                  <button
                    onClick={() => updateOrderStatus(ord.id, 'ready_for_pickup')}
                    className="flex-1 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700"
                  >
                    {t.markReady}
                  </button>
                )}
                {ord.status === 'ready_for_pickup' && (
                  <div className="w-full text-center text-xs font-bold text-gray-400 py-1">
                    Waiting for Rider Pickup ({ord.rider?.name || 'Assigned Rider'})
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Tab Content: Catalog & Inventory Management */}
      {activeTab === 'catalog' && (
        <div className="space-y-3">
          <button
            onClick={() => setIsNewProductOpen(true)}
            className="w-full py-3 bg-[#FF6B00] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t.addNewProduct}</span>
          </button>

          <div className="space-y-2.5">
            {storeProducts.map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-xl bg-white dark:bg-[#1E2228] border border-gray-100 dark:border-white/5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-bold text-gray-900 dark:text-white truncate">
                      {p.name}
                    </h5>
                    <p className="text-gray-400 font-semibold">
                      TZS {p.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Stock Toggle */}
                <button
                  onClick={() => toggleProductStock(p.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] transition-colors ${
                    p.isAvailable
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300'
                  }`}
                >
                  <span>{p.isAvailable ? 'In Stock' : 'Out of Stock'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isNewProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm bg-white dark:bg-[#1E2228] rounded-2xl p-5 border border-gray-100 dark:border-white/10 shadow-2xl space-y-3.5 text-xs">
            <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">
              Add Item to Kitchen Menu
            </h3>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                  Item Name (English)
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Smoky BBQ Beef Burger"
                  className="w-full p-2 rounded-lg bg-gray-50 dark:bg-[#16191E] border border-gray-200 dark:border-white/10 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                  Item Name (Kiswahili)
                </label>
                <input
                  type="text"
                  value={newTitleSw}
                  onChange={(e) => setNewTitleSw(e.target.value)}
                  placeholder="e.g. Baga ya BBQ ya Nyama"
                  className="w-full p-2 rounded-lg bg-gray-50 dark:bg-[#16191E] border border-gray-200 dark:border-white/10 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                  Price (TZS)
                </label>
                <input
                  type="number"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="12000"
                  className="w-full p-2 rounded-lg bg-gray-50 dark:bg-[#16191E] border border-gray-200 dark:border-white/10 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2 rounded-lg bg-gray-50 dark:bg-[#16191E] border border-gray-200 dark:border-white/10 outline-none"
                >
                  <option value="burgers">Burgers</option>
                  <option value="pizza">Pizza</option>
                  <option value="swahili">Swahili</option>
                  <option value="drinks">Drinks</option>
                  <option value="groceries">Groceries</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewProductOpen(false)}
                  className="flex-1 py-2.5 border rounded-xl font-bold text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#FF6B00] text-white font-bold rounded-xl"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
