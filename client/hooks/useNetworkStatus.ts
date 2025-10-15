import { useState, useEffect } from 'react';
import { offlineQueue } from '@/utils/offlineQueue';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = async () => {
      console.log('🌐 Network connection restored');
      setIsOnline(true);
      setWasOffline(false);
      
      // Process offline queue when back online
      try {
        await offlineQueue.processQueue();
      } catch (error) {
        console.error('Failed to process offline queue:', error);
      }
    };

    const handleOffline = () => {
      console.log('📴 Network connection lost');
      setIsOnline(false);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check current status
    if (navigator.onLine && wasOffline) {
      handleOnline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  return {
    isOnline,
    wasOffline,
  };
}
