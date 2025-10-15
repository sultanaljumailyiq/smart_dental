const API_BASE = "/api/admin";

export interface PlatformSettings {
  id: string;
  platformName: string;
  platformLogo: string | null;
  platformEmail: string;
  platformPhone: string;
  platformAddress: string;
  currency: string;
  timezone: string;
  language: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  enableNotifications: boolean;
  enableEmailVerification: boolean;
  termsOfServiceUrl: string | null;
  privacyPolicyUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseConnection {
  id: string;
  name: string;
  type: "postgresql" | "mongodb" | "firebase" | "supabase";
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  isActive: boolean;
  lastTestedAt: Date | null;
  testStatus: "success" | "failed" | "pending" | null;
  testMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiService {
  id: string;
  name: string;
  type: "stripe" | "google_maps" | "openai" | "zain_cash" | "firebase" | "other";
  apiKey: string;
  apiSecret: string | null;
  webhookUrl: string | null;
  isActive: boolean;
  lastTestedAt: Date | null;
  testStatus: "success" | "failed" | "pending" | null;
  testMessage: string | null;
  additionalConfig: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IntegrationLog {
  id: string;
  type: "database" | "api_service";
  connectionId: string;
  connectionName: string;
  action: string;
  status: "success" | "failed" | "pending";
  requestData: Record<string, any> | null;
  responseData: Record<string, any> | null;
  errorMessage: string | null;
  duration: number | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}

export const platformSettingsApi = {
  async getSettings(): Promise<PlatformSettings> {
    const response = await fetch(`${API_BASE}/platform-settings`);
    if (!response.ok) throw new Error("فشل في جلب الإعدادات");
    return response.json();
  },

  async updateSettings(settings: Partial<PlatformSettings>): Promise<PlatformSettings> {
    const response = await fetch(`${API_BASE}/platform-settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (!response.ok) throw new Error("فشل في تحديث الإعدادات");
    return response.json();
  },
};

export const databaseConnectionsApi = {
  async getAll(): Promise<DatabaseConnection[]> {
    const response = await fetch(`${API_BASE}/database-connections`);
    if (!response.ok) throw new Error("فشل في جلب الاتصالات");
    return response.json();
  },

  async getById(id: string): Promise<DatabaseConnection> {
    const response = await fetch(`${API_BASE}/database-connections/${id}`);
    if (!response.ok) throw new Error("فشل في جلب الاتصال");
    return response.json();
  },

  async create(connection: Omit<DatabaseConnection, "id" | "createdAt" | "updatedAt" | "lastTestedAt" | "testStatus" | "testMessage">): Promise<DatabaseConnection> {
    const response = await fetch(`${API_BASE}/database-connections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(connection),
    });
    if (!response.ok) throw new Error("فشل في إنشاء الاتصال");
    return response.json();
  },

  async update(id: string, connection: Partial<DatabaseConnection>): Promise<DatabaseConnection> {
    const response = await fetch(`${API_BASE}/database-connections/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(connection),
    });
    if (!response.ok) throw new Error("فشل في تحديث الاتصال");
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/database-connections/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("فشل في حذف الاتصال");
  },

  async test(id: string): Promise<{ success: boolean; message: string; testedAt: Date }> {
    const response = await fetch(`${API_BASE}/database-connections/${id}/test`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("فشل في اختبار الاتصال");
    return response.json();
  },
};

export const apiServicesApi = {
  async getAll(): Promise<ApiService[]> {
    const response = await fetch(`${API_BASE}/api-services`);
    if (!response.ok) throw new Error("فشل في جلب الخدمات");
    return response.json();
  },

  async getById(id: string): Promise<ApiService> {
    const response = await fetch(`${API_BASE}/api-services/${id}`);
    if (!response.ok) throw new Error("فشل في جلب الخدمة");
    return response.json();
  },

  async create(service: Omit<ApiService, "id" | "createdAt" | "updatedAt" | "lastTestedAt" | "testStatus" | "testMessage">): Promise<ApiService> {
    const response = await fetch(`${API_BASE}/api-services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(service),
    });
    if (!response.ok) throw new Error("فشل في إنشاء الخدمة");
    return response.json();
  },

  async update(id: string, service: Partial<ApiService>): Promise<ApiService> {
    const response = await fetch(`${API_BASE}/api-services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(service),
    });
    if (!response.ok) throw new Error("فشل في تحديث الخدمة");
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/api-services/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("فشل في حذف الخدمة");
  },

  async test(id: string): Promise<{ success: boolean; message: string; testedAt: Date }> {
    const response = await fetch(`${API_BASE}/api-services/${id}/test`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("فشل في اختبار الاتصال");
    return response.json();
  },
};

export const integrationLogsApi = {
  async getAll(filters?: { type?: string; status?: string; connectionId?: string; limit?: number }): Promise<{ logs: IntegrationLog[]; total: number }> {
    const params = new URLSearchParams();
    if (filters?.type) params.append("type", filters.type);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.connectionId) params.append("connectionId", filters.connectionId);
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await fetch(`${API_BASE}/integration-logs?${params.toString()}`);
    if (!response.ok) throw new Error("فشل في جلب السجلات");
    return response.json();
  },

  async deleteOlderThan(date: Date): Promise<void> {
    const response = await fetch(`${API_BASE}/integration-logs?olderThan=${date.toISOString()}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("فشل في حذف السجلات");
  },

  async deleteAll(): Promise<void> {
    const response = await fetch(`${API_BASE}/integration-logs`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("فشل في حذف السجلات");
  },
};
