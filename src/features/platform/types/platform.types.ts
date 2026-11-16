export interface Platform {
  id: string;
  name: string;
  url: string;
  description: string;
  status: 'online' | 'offline' | 'degraded' | 'unknown';
  clientId: string | null;
  clientName: string | null;
  monitoringInterval: number; // in seconds
  lastChecked: string | null;
  responseTime: number | null; // in ms
  createdAt: string;
  updatedAt: string;
}

export interface PlatformFilters {
  search?: string;
  status?: Platform['status'];
  clientId?: string | null;
  page?: number;
  limit?: number;
}

export interface PlatformListResponse {
  data: Platform[];
  total: number;
  page: number;
  limit: number;
}

export interface PlatformFormData {
  name: string;
  url: string;
  description: string;
  status: Platform['status'];
  clientId: string | null;
  monitoringInterval: number;
}