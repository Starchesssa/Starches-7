import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const CartScreen: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDeliveryFee,
    cartTotal,
    goBack,
    navigateTo,
    language,
    t,
  } = useApp();

  const [orderNote, setOrderNote] = useState('');

  if (cart.length === 0) {
    return (
      <div className="pb-24 max-w-md mx-auto px-4 min-h-[70vh] flex flex-col items-center justify-center text-center animate-in fade-in">
        <div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center text-[#FF6B00] mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
          {t.emptyCartTitle}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 max-w-xs leading-relaxed">
          {t.emptyCartSubtitle}
        </p>
        <button
          onClick={() => navigateTo('home')}
          className="mt-6 py-3 px-6 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-bold rounded-xl text-xs transition-colors shadow-md"
        >
          {t.browseFood}
        </button>
      </div>
    );
  }

  const storeName = cart[0]?.storeName || 'Selected Restaurant';

  return (
    <div className="pb-28 max-w-md mx-auto px-4 space-y-4 animate-in fade-in duration-200">
      {/* 1. Header (matches mockup screen 7) */}
      <div className="pt-2 flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="p-1 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-black text-gray-900 dark:text-white">
              {t.yourCart}
            </h1>
            <p className="text-[11px] text-gray-400 font-medium">{storeName}</p>
          </div>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-red-500 hover:text-red-600 font-semibold flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t.clearCart}</span>
        </button>
      </div>

      {/* 2. Items List */}
      <div className="space-y-3">
        {cart.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-2xl bg-white dark:bg-[#1E2228] border border-gray-100 dark:border-white/5 shadow-xs flex items-center gap-3"
          >
            {/* Item Thumbnail */}
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title & Price */}
            <div className="flex-1 min-w-0">
              <h4 className="font-extrabold text-xs text-gray-900 dark:text-white truncate">
                {item.name}
              </h4>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mt-0.5">
                TZS {item.price.toLocaleString()}
              </p>
              {item.selectedAddons && item.selectedAddons.length > 0 && (
                <p className="text-[10px] text-gray-400 truncate mt-0.5">
                  +{item.selectedAddons.map((a) => a.name).join(', ')}
                </p>
              )}
            </div>

            {/* Quantity Stepper & Trash (matches mockup screen 7) */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className="flex items-center bg-gray-50 dark:bg-[#16191E] border border-gray-200 dark:border-white/10 rounded-lg p-0.5">
                <button
                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                  className="w-6 h-6 rounded flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-xs font-bold text-gray-900 dark:text-white">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                  className="w-6 h-6 rounded flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Note to Kitchen/Store Input */}
      <div className="p-3 rounded-2xl bg-white dark:bg-[#1E2228] border border-gray-100 dark:border-white/5">
        <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
          Order Instructions
        </label>
        <input
          type="text"
          value={orderNote}
          onChange={(e) => setOrderNote(e.target.value)}
          placeholder={t.cartNotePlaceholder}
          className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-[#16191E] border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:border-[#FF6B00] outline-none placeholder-gray-400"
        />
      </div>

      {/* 4. Price Breakdown (matches mockup screen 7) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1E2228] border border-gray-100 dark:border-white/5 space-y-2 text-xs">
        <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
          <span>{t.subtotal}</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            TZS {cartSubtotal.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
          <span>{t.deliveryFee}</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {cartDeliveryFee === 0 ? (
              <span className="text-emerald-500 font-bold">Free</span>
            ) : (
              `TZS ${cartDeliveryFee.toLocaleString()}`
            )}
          </span>
        </div>

        <div className="pt-2 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
          <span className="text-sm font-black text-gray-900 dark:text-white">{t.total}</span>
          <span className="text-base font-black text-[#FF6B00]">
            TZS {cartTotal.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 5. Checkout Action Button */}
      <div className="pt-2">
        <button
          onClick={() => navigateTo('checkout', { orderNote })}
          className="w-full py-3.5 px-4 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-black rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 text-sm transition-all hover:translate-y-[-1px] active:translate-y-[0px]"
        >
          <span>{t.proceedToCheckout}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
