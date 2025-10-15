import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { offlineQueue } from '@/utils/offlineQueue';

export function OfflineIndicator() {
  const { isOnline, wasOffline } = useNetworkStatus();
  const [queueSize, setQueueSize] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    const updateQueueSize = async () => {
      const size = await offlineQueue.getQueueSize();
      setQueueSize(size);
    };

    updateQueueSize();
    const interval = setInterval(updateQueueSize, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isOnline) {
      setShowNotification(true);
      setJustReconnected(false);
    } else if (wasOffline) {
      setJustReconnected(true);
      setShowNotification(true);
      
      // Hide reconnection message after 5 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
        setJustReconnected(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (!showNotification) return null;

  return (
    <div
      className={cn(
        "fixed bottom-20 left-1/2 -translate-x-1/2 z-[200] transition-all duration-300",
        "px-6 py-3 rounded-full shadow-xl backdrop-blur-lg",
        isOnline
          ? "bg-green-500/90 text-white"
          : "bg-orange-500/90 text-white"
      )}
    >
      <div className="flex items-center gap-3">
        {isOnline ? (
          justReconnected ? (
            <>
              <CheckCircle2 className="w-5 h-5 animate-pulse" />
              <div className="flex flex-col">
                <span className="font-semibold">تم استعادة الاتصال</span>
                {queueSize > 0 && (
                  <span className="text-xs opacity-90">
                    جاري مزامنة {queueSize} طلب...
                  </span>
                )}
              </div>
            </>
          ) : (
            <>
              <Wifi className="w-5 h-5" />
              <span className="font-semibold">متصل</span>
            </>
          )
        ) : (
          <>
            <WifiOff className="w-5 h-5 animate-pulse" />
            <div className="flex flex-col">
              <span className="font-semibold">وضع الأوف لاين</span>
              {queueSize > 0 && (
                <span className="text-xs opacity-90">
                  {queueSize} طلب في الانتظار
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
