// IndexedDB utility for offline data storage
const DB_NAME = 'smart_dental_offline';
const DB_VERSION = 1;

export interface OfflineRequest {
  id: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
  timestamp: number;
  retryCount: number;
}

export interface OfflineData {
  id: string;
  key: string;
  data: any;
  timestamp: number;
  expiresAt?: number;
}

class IndexedDBManager {
  private db: IDBDatabase | null = null;
  private dbPromise: Promise<IDBDatabase> | null = null;

  async init(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Store for pending requests (offline queue)
        if (!db.objectStoreNames.contains('pendingRequests')) {
          const requestStore = db.createObjectStore('pendingRequests', { keyPath: 'id' });
          requestStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Store for cached data
        if (!db.objectStoreNames.contains('cachedData')) {
          const dataStore = db.createObjectStore('cachedData', { keyPath: 'id' });
          dataStore.createIndex('key', 'key', { unique: false });
          dataStore.createIndex('expiresAt', 'expiresAt', { unique: false });
        }

        // Store for sync status
        if (!db.objectStoreNames.contains('syncStatus')) {
          db.createObjectStore('syncStatus', { keyPath: 'id' });
        }
      };
    });

    return this.dbPromise;
  }

  // Pending Requests Queue
  async addPendingRequest(request: OfflineRequest): Promise<void> {
    const db = await this.init();
    const tx = db.transaction('pendingRequests', 'readwrite');
    const store = tx.objectStore('pendingRequests');
    await store.add(request);
  }

  async getPendingRequests(): Promise<OfflineRequest[]> {
    const db = await this.init();
    const tx = db.transaction('pendingRequests', 'readonly');
    const store = tx.objectStore('pendingRequests');
    const index = store.index('timestamp');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async removePendingRequest(id: string): Promise<void> {
    const db = await this.init();
    const tx = db.transaction('pendingRequests', 'readwrite');
    const store = tx.objectStore('pendingRequests');
    await store.delete(id);
  }

  async clearPendingRequests(): Promise<void> {
    const db = await this.init();
    const tx = db.transaction('pendingRequests', 'readwrite');
    const store = tx.objectStore('pendingRequests');
    await store.clear();
  }

  // Cached Data Management
  async setCachedData(key: string, data: any, expiresInMs?: number): Promise<void> {
    const db = await this.init();
    const tx = db.transaction('cachedData', 'readwrite');
    const store = tx.objectStore('cachedData');
    
    const cacheEntry: OfflineData = {
      id: `cache_${key}_${Date.now()}`,
      key,
      data,
      timestamp: Date.now(),
      expiresAt: expiresInMs ? Date.now() + expiresInMs : undefined,
    };

    await store.add(cacheEntry);
  }

  async getCachedData(key: string): Promise<any | null> {
    const db = await this.init();
    const tx = db.transaction('cachedData', 'readonly');
    const store = tx.objectStore('cachedData');
    const index = store.index('key');

    return new Promise((resolve, reject) => {
      const request = index.getAll(key);
      request.onsuccess = () => {
        const results = request.result;
        if (!results || results.length === 0) {
          resolve(null);
          return;
        }

        // Get most recent non-expired entry
        const now = Date.now();
        const validEntries = results.filter(
          (entry) => !entry.expiresAt || entry.expiresAt > now
        );

        if (validEntries.length === 0) {
          resolve(null);
          return;
        }

        // Return most recent
        const latest = validEntries.sort((a, b) => b.timestamp - a.timestamp)[0];
        resolve(latest.data);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async clearExpiredCache(): Promise<void> {
    const db = await this.init();
    const tx = db.transaction('cachedData', 'readwrite');
    const store = tx.objectStore('cachedData');
    const index = store.index('expiresAt');

    const now = Date.now();
    const range = IDBKeyRange.upperBound(now);

    return new Promise((resolve, reject) => {
      const request = index.openCursor(range);
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Sync Status
  async setSyncStatus(key: string, status: any): Promise<void> {
    const db = await this.init();
    const tx = db.transaction('syncStatus', 'readwrite');
    const store = tx.objectStore('syncStatus');
    await store.put({ id: key, ...status, updatedAt: Date.now() });
  }

  async getSyncStatus(key: string): Promise<any | null> {
    const db = await this.init();
    const tx = db.transaction('syncStatus', 'readonly');
    const store = tx.objectStore('syncStatus');

    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }
}

export const dbManager = new IndexedDBManager();
