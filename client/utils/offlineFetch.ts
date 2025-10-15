import { offlineQueue } from './offlineQueue';
import { dbManager } from './indexedDB';

interface OfflineFetchOptions extends RequestInit {
  skipOfflineQueue?: boolean;
  cacheKey?: string;
  cacheExpiry?: number; // in milliseconds
}

export async function offlineFetch(
  url: string,
  options: OfflineFetchOptions = {}
): Promise<Response> {
  const {
    skipOfflineQueue = false,
    cacheKey,
    cacheExpiry,
    ...fetchOptions
  } = options;

  // Try to fetch from network
  try {
    if (!navigator.onLine && !skipOfflineQueue) {
      throw new Error('Device is offline');
    }

    const response = await fetch(url, fetchOptions);

    // Cache successful GET requests
    if (response.ok && fetchOptions.method === 'GET' && cacheKey) {
      const data = await response.clone().json();
      await dbManager.setCachedData(cacheKey, data, cacheExpiry);
    }

    return response;
  } catch (error) {
    console.warn('Fetch failed:', url, error);

    // For GET requests, try to return cached data
    if (fetchOptions.method === 'GET' || !fetchOptions.method) {
      if (cacheKey) {
        const cachedData = await dbManager.getCachedData(cacheKey);
        if (cachedData) {
          console.log('📦 Returning cached data for:', url);
          return new Response(JSON.stringify(cachedData), {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'X-From-Cache': 'true' },
          });
        }
      }
    }

    // For POST/PUT/DELETE requests, add to offline queue
    if (!skipOfflineQueue && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(fetchOptions.method || '')) {
      const headers: Record<string, string> = {};
      if (fetchOptions.headers) {
        if (fetchOptions.headers instanceof Headers) {
          fetchOptions.headers.forEach((value, key) => {
            headers[key] = value;
          });
        } else if (Array.isArray(fetchOptions.headers)) {
          fetchOptions.headers.forEach(([key, value]) => {
            headers[key] = value;
          });
        } else {
          Object.assign(headers, fetchOptions.headers);
        }
      }

      await offlineQueue.addToQueue(
        url,
        fetchOptions.method || 'POST',
        headers,
        fetchOptions.body
      );

      // Return a fake success response
      return new Response(
        JSON.stringify({
          success: true,
          message: 'سيتم مزامنة البيانات عند استعادة الاتصال',
          offline: true,
        }),
        {
          status: 202, // Accepted
          headers: { 'Content-Type': 'application/json', 'X-Queued': 'true' },
        }
      );
    }

    throw error;
  }
}

// Hook for React components
export function useOfflineFetch() {
  return {
    fetch: offlineFetch,
    isOnline: navigator.onLine,
  };
}
