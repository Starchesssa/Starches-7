import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Phone, Mail, HelpCircle, MessageSquare, ShieldCheck, ChevronRight } from 'lucide-react';

export const HelpSupportModal: React.FC = () => {
  const { isHelpOpen, setIsHelpOpen, t } = useApp();

  if (!isHelpOpen) return null;

  const faqs = [
    {
      q: 'How does Mobile Money payment work?',
      a: 'When you checkout with M-Pesa, TigoPesa, Airtel Money, or Halopesa, an automated USSD push notification will be sent directly to your handset. You simply enter your secure PIN to confirm the exact TZS amount.',
    },
    {
      q: 'Which Tanzanian cities does Starches serve?',
      a: 'We are fully operational in Dar es Salaam, Zanzibar (Stone Town & beaches), and Arusha. Dodoma and Mwanza are scheduled to launch shortly.',
    },
    {
      q: 'Can I order products from local supermarkets and pharmacies?',
      a: 'Yes! Starches is a full local marketplace. You can order groceries, household essentials, and OTC healthcare from neighborhood vendors.',
    },
    {
      q: 'How are delivery fees calculated?',
      a: 'Delivery fees start at TZS 1,500 – 2,500 based on straight-line proximity to the vendor. Many restaurants offer free delivery on orders above TZS 50,000.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1E2228] rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10 flex flex-col max-h-[85vh]">
        <div className="p-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#FF6B00]" />
            <h3 className="font-bold text-gray-900 dark:text-white text-base">
              {t.helpAndSupport}
            </h3>
          </div>
          <button
            onClick={() => setIsHelpOpen(false)}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Quick contact cards */}
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href="tel:+255700000000"
              className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 text-[#FF6B00] flex flex-col items-center justify-center text-center gap-1 hover:bg-orange-100 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span className="font-bold">Call Support</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">+255 700 000 000</span>
            </a>
            <a
              href="mailto:support@starches.co.tz"
              className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 flex flex-col items-center justify-center text-center gap-1 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <Mail className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="font-bold">Email Us</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">support@starches.co.tz</span>
            </a>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-emerald-900 dark:text-emerald-300">
                Customer Protection Guarantee
              </h4>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                Fresh food delivered right or 100% refunded. Secure local mobile money integrations.
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px] mb-2">
              {t.faqs}
            </h4>
            <div className="space-y-2">
              {faqs.map((f, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5"
                >
                  <p className="font-bold text-gray-900 dark:text-white mb-1">{f.q}</p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[11px]">
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
