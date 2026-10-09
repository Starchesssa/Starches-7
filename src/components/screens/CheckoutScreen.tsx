import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  MapPin,
  CheckCircle2,
  Smartphone,
  Banknote,
  CreditCard,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { PaymentMethodType, MobileMoneyProvider } from '../../types';

export const CheckoutScreen: React.FC = () => {
  const {
    currentAddress,
    setIsAddressModalOpen,
    cartTotal,
    cartSubtotal,
    cartDeliveryFee,
    placeOrder,
    goBack,
    navigateTo,
    user,
    t,
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('mobile_money');
  const [mobileProvider, setMobileProvider] = useState<MobileMoneyProvider>('tigopesa');
  const [mobilePhone, setMobilePhone] = useState(user.phone || '+255 754 991 223');
  const [deliveryInstructions, setDeliveryInstructions] = useState(
    currentAddress.deliveryInstructions || ''
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [ussdModalStep, setUssdModalStep] = useState<
    'idle' | 'initiating' | 'push_sent' | 'completed'
  >('idle');

  const grandTotal = cartTotal + 500; // includes 500 TZS platform/service fee

  const handlePayNow = () => {
    setIsProcessing(true);

    if (paymentMethod === 'mobile_money') {
      // Simulate authentic Tanzanian mobile money USSD prompt workflow
      setUssdModalStep('initiating');
      setTimeout(() => {
        setUssdModalStep('push_sent');
        setTimeout(() => {
          setUssdModalStep('completed');
          setTimeout(() => {
            const order = placeOrder({
              paymentMethod,
              mobileMoneyProvider: mobileProvider,
              mobileMoneyPhone: mobilePhone,
              instructions: deliveryInstructions,
            });
            setIsProcessing(false);
            navigateTo('track_order', { orderId: order.id });
          }, 1200);
        }, 1500);
      }, 1000);
    } else {
      setTimeout(() => {
        const order = placeOrder({
          paymentMethod,
          instructions: deliveryInstructions,
        });
        setIsProcessing(false);
        navigateTo('track_order', { orderId: order.id });
      }, 1000);
    }
  };

  return (
    <div className="pb-28 max-w-md mx-auto px-4 space-y-4 animate-in fade-in duration-200">
      {/* 1. Header (matches mockup screen 8) */}
      <div className="pt-2 flex items-center gap-3 border-b border-gray-100 dark:border-white/5 pb-3">
        <button
          onClick={goBack}
          className="p-1 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-black text-gray-900 dark:text-white">
          {t.checkout}
        </h1>
      </div>

      {/* 2. Delivery Address Card (matches mockup screen 8) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1E2228] border border-gray-100 dark:border-white/5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            {t.deliveryAddress}
          </span>
          <button
            onClick={() => setIsAddressModalOpen(true)}
            className="text-xs font-bold text-[#FF6B00] hover:underline"
          >
            {t.change}
          </button>
        </div>

        <div className="flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-[#FF6B00] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-gray-900 dark:text-white">
              {currentAddress.ward || currentAddress.district}, {currentAddress.city}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
              {currentAddress.landmark || currentAddress.mtaa}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Payment Method Section (matches mockup screen 8) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1E2228] border border-gray-100 dark:border-white/5 shadow-xs space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
          {t.paymentMethod}
        </span>

        {/* Radio Option 1: Mobile Money (TigoPesa / HaloPesa / M-Pesa / Airtel) */}
        <div
          onClick={() => setPaymentMethod('mobile_money')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            paymentMethod === 'mobile_money'
              ? 'border-[#FF6B00] bg-orange-50/40 dark:bg-orange-950/20 ring-1 ring-[#FF6B00]'
              : 'border-gray-200 dark:border-white/10 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'mobile_money'
                    ? 'border-[#FF6B00]'
                    : 'border-gray-400'
                }`}
              >
                {paymentMethod === 'mobile_money' && (
                  <div className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  {t.mobileMoney}
                </span>
                <span className="text-[11px] text-gray-400 ml-1">
                  (TigoPesa / HaloPesa / M-Pesa / Airtel)
                </span>
              </div>
            </div>
          </div>

          {/* Provider Logos & Badges */}
          <div className="flex items-center gap-2 mt-2.5 pl-6">
            <span
              onClick={(e) => {
                e.stopPropagation();
                setMobileProvider('tigopesa');
              }}
              className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                mobileProvider === 'tigopesa'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
              }`}
            >
              Tigo Pesa
            </span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                setMobileProvider('mpesa');
              }}
              className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                mobileProvider === 'mpesa'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300'
              }`}
            >
              M-Pesa
            </span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                setMobileProvider('airtel');
              }}
              className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                mobileProvider === 'airtel'
                  ? 'bg-red-500 text-white'
                  : 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-300'
              }`}
            >
              Airtel Money
            </span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                setMobileProvider('halopesa');
              }}
              className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                mobileProvider === 'halopesa'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
              }`}
            >
              HaloPesa
            </span>
          </div>

          {paymentMethod === 'mobile_money' && (
            <div className="mt-3 pl-6 space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {t.phoneNumber}
              </label>
              <input
                type="tel"
                value={mobilePhone}
                onChange={(e) => setMobilePhone(e.target.value)}
                placeholder="+255 7XX XXX XXX"
                className="w-full p-2 bg-white dark:bg-[#16191E] border border-gray-200 dark:border-white/10 rounded-lg text-xs font-semibold text-gray-900 dark:text-white focus:border-[#FF6B00] outline-none"
              />
              <p className="text-[10px] text-gray-400 leading-tight">
                {t.securePaymentNotice}
              </p>
            </div>
          )}
        </div>

        {/* Radio Option 2: Cash on Delivery (matches mockup screen 8) */}
        <div
          onClick={() => setPaymentMethod('cash_on_delivery')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
            paymentMethod === 'cash_on_delivery'
              ? 'border-[#FF6B00] bg-orange-50/40 dark:bg-orange-950/20 ring-1 ring-[#FF6B00]'
              : 'border-gray-200 dark:border-white/10 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'cash_on_delivery'
                  ? 'border-[#FF6B00]'
                  : 'border-gray-400'
              }`}
            >
              {paymentMethod === 'cash_on_delivery' && (
                <div className="w-2 h-2 rounded-full bg-[#FF6B00]" />
              )}
            </div>
            <div>
              <span className="text-xs font-bold text-gray-900 dark:text-white">
                {t.cashOnDelivery}
              </span>
              <p className="text-[10px] text-gray-400 mt-0.5">{t.payWithCash}</p>
            </div>
          </div>
          <Banknote className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* 4. Delivery Instructions (matches mockup screen 8) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1E2228] border border-gray-100 dark:border-white/5 shadow-xs">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
          {t.deliveryInstructions}
        </label>
        <textarea
          rows={2}
          value={deliveryInstructions}
          onChange={(e) => setDeliveryInstructions(e.target.value)}
          placeholder={t.deliveryInstructionsPlaceholder}
          className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-[#16191E] border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:border-[#FF6B00] outline-none placeholder-gray-400 resize-none"
        />
      </div>

      {/* 5. Total and Pay Now Action Button (matches mockup screen 8) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1E2228] border border-gray-100 dark:border-white/5 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-gray-600 dark:text-gray-400">Total</span>
          <span className="text-lg font-black text-[#FF6B00]">
            TZS {grandTotal.toLocaleString()}
          </span>
        </div>

        <button
          onClick={handlePayNow}
          disabled={isProcessing}
          className="w-full py-3.5 px-4 bg-[#FF6B00] hover:bg-[#E55A00] disabled:opacity-75 text-white font-black rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 text-sm transition-all"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Initiating Order...</span>
            </>
          ) : (
            <span>{t.payNow}</span>
          )}
        </button>
      </div>

      {/* Simulated USSD Mobile Money Push Modal */}
      {ussdModalStep !== 'idle' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-[#1E2228] rounded-2xl p-6 text-center border border-gray-100 dark:border-white/10 shadow-2xl space-y-4">
            <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-950/40 text-[#FF6B00] mx-auto flex items-center justify-center">
              {ussdModalStep === 'initiating' ? (
                <Loader2 className="w-7 h-7 animate-spin" />
              ) : ussdModalStep === 'push_sent' ? (
                <Smartphone className="w-7 h-7 animate-bounce" />
              ) : (
                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
              )}
            </div>

            <div>
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                {ussdModalStep === 'initiating'
                  ? 'Connecting to Payment Gateway...'
                  : ussdModalStep === 'push_sent'
                  ? 'USSD Push Prompt Sent!'
                  : 'Payment Confirmed!'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                {ussdModalStep === 'push_sent'
                  ? `Check phone ${mobilePhone} to authorize TZS ${grandTotal.toLocaleString()}.`
                  : 'Finalizing your Starches delivery order...'}
              </p>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-[#16191E] rounded-xl text-[11px] text-gray-600 dark:text-gray-300 flex items-center gap-2 justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Tanzania National Payment System (TIPS) Compliant</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
