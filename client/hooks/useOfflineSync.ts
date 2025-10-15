import { useEffect } from 'react';
import { dbManager } from '@/utils/indexedDB';
import { offlineQueue } from '@/utils/offlineQueue';

export function useOfflineSync() {
  useEffect(() => {
    // Initialize IndexedDB
    const initDB = async () => {
      try {
        await dbManager.init();
        console.log('✅ IndexedDB initialized');
      } catch (error) {
        console.error('❌ Failed to initialize IndexedDB:', error);
      }
    };

    initDB();

    // Clean expired cache periodically
    const cleanupInterval = setInterval(async () => {
      try {
        await dbManager.clearExpiredCache();
        console.log('🧹 Cleared expired cache');
      } catch (error) {
        console.error('Failed to clear expired cache:', error);
      }
    }, 60 * 60 * 1000); // Every hour

    // Process offline queue when online
    const handleOnline = async () => {
      console.log('🌐 Network restored - processing offline queue');
      try {
        await offlineQueue.processQueue();
      } catch (error) {
        console.error('Failed to process offline queue:', error);
      }
    };

    window.addEventListener('online', handleOnline);

    // Initial queue processing if online
    if (navigator.onLine) {
      offlineQueue.processQueue();
    }

    return () => {
      clearInterval(cleanupInterval);
      window.removeEventListener('online', handleOnline);
    };
  }, []);
}
