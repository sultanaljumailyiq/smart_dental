import { dbManager, type OfflineRequest } from './indexedDB';

const MAX_RETRY_COUNT = 3;
const RETRY_DELAY = 2000; // 2 seconds

class OfflineQueueManager {
  private isProcessing = false;

  async addToQueue(
    url: string,
    method: string,
    headers: Record<string, string> = {},
    body?: any
  ): Promise<void> {
    const request: OfflineRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url,
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      timestamp: Date.now(),
      retryCount: 0,
    };

    await dbManager.addPendingRequest(request);
    console.log('✅ Request added to offline queue:', url);
  }

  async processQueue(): Promise<void> {
    if (this.isProcessing) {
      console.log('⏳ Queue processing already in progress');
      return;
    }

    if (!navigator.onLine) {
      console.log('📴 Device is offline, skipping queue processing');
      return;
    }

    this.isProcessing = true;
    console.log('🔄 Starting offline queue processing...');

    try {
      const pendingRequests = await dbManager.getPendingRequests();
      
      if (pendingRequests.length === 0) {
        console.log('✨ No pending requests in queue');
        return;
      }

      console.log(`📦 Processing ${pendingRequests.length} pending requests`);

      for (const request of pendingRequests) {
        try {
          await this.retryRequest(request);
          await dbManager.removePendingRequest(request.id);
          console.log('✅ Request synced successfully:', request.url);
        } catch (error) {
          console.error('❌ Failed to sync request:', request.url, error);
          
          if (request.retryCount >= MAX_RETRY_COUNT) {
            console.warn('⚠️ Max retries reached, removing from queue:', request.url);
            await dbManager.removePendingRequest(request.id);
          } else {
            // Update retry count
            request.retryCount++;
            await dbManager.removePendingRequest(request.id);
            await dbManager.addPendingRequest(request);
            
            // Wait before next retry
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          }
        }
      }

      console.log('✅ Queue processing completed');
    } catch (error) {
      console.error('❌ Error processing queue:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  private async retryRequest(request: OfflineRequest): Promise<Response> {
    const options: RequestInit = {
      method: request.method,
      headers: request.headers,
      body: request.body,
    };

    const response = await fetch(request.url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response;
  }

  async clearQueue(): Promise<void> {
    await dbManager.clearPendingRequests();
    console.log('🗑️ Offline queue cleared');
  }

  async getQueueSize(): Promise<number> {
    const requests = await dbManager.getPendingRequests();
    return requests.length;
  }
}

export const offlineQueue = new OfflineQueueManager();
