import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Bell, CheckCircle2, Tag, Info } from 'lucide-react';

export const NotificationsModal: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markAllNotificationsRead,
    language,
    navigateTo,
  } = useApp();

  if (!isNotificationsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1E2228] rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10 flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#FF6B00]" />
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">
              Notifications
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="text-xs text-[#FF6B00] hover:underline font-semibold"
            >
              Mark all read
            </button>
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="p-1 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs">
              No notifications yet.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  if (notif.orderId) {
                    setIsNotificationsOpen(false);
                    navigateTo('track_order', { orderId: notif.orderId });
                  }
                }}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                  notif.isRead
                    ? 'border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 opacity-80'
                    : 'border-orange-200 dark:border-orange-950/60 bg-orange-50/40 dark:bg-orange-950/20'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">
                    {notif.type === 'order' ? (
                      <CheckCircle2 className="w-4 h-4 text-[#FF6B00]" />
                    ) : notif.type === 'promo' ? (
                      <Tag className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Info className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        {language === 'sw' ? notif.titleSw : notif.title}
                      </h4>
                      <span className="text-[10px] text-gray-400">{notif.timestamp}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                      {language === 'sw' ? notif.messageSw : notif.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
