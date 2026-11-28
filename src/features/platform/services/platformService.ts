import { apiRequest } from '../../../services/apiClient';
import { Platform, PlatformFilters, PlatformListResponse, PlatformFormData } from '../types/platform.types';

interface ApiEnvelope<T> {
  data: T;
}

/** Read the currently selected organization ID from localStorage (set by OverviewPage). */
const getSelectedOrganizationId = (): string | null => {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem('uptime_selected_organization');
};

/**
 * Platform API service.
 * Platforms map to the /v1/monitors endpoints on the backend.
 * All calls require authentication and go through the shared apiRequest client.
 */
export const platformService = {
  getPlatforms: async (filters?: PlatformFilters): Promise<PlatformListResponse> => {
    const params = new URLSearchParams();
    if (filters?.search) params.set('search', filters.search);
    if (filters?.status) params.set('status', filters.status);
    if (filters?.clientId !== undefined && filters.clientId !== null) {
      params.set('clientId', filters.clientId);
    }
    const organizationId = filters?.organizationId ?? getSelectedOrganizationId();
    if (organizationId) params.set('organization_id', organizationId);
    if (filters?.page !== undefined) params.set('page', String(filters.page));
    if (filters?.limit !== undefined) params.set('limit', String(filters.limit));

    const response = await apiRequest<ApiEnvelope<PlatformListResponse>>(
      `/v1/monitors?${params.toString()}`,
      { authenticated: true }
    );
    return response.data;
  },

  getPlatformById: async (id: string): Promise<Platform> => {
    const response = await apiRequest<ApiEnvelope<Platform>>(
      `/v1/monitors/${id}`,
      { authenticated: true }
    );
    return response.data;
  },

  createPlatform: async (
    data: PlatformFormData,
    organizationId?: string,
  ): Promise<Platform> => {
    const body: Record<string, unknown> = {
      name: data.name,
      target: data.url,
      type: 'http',
      method: 'GET',
      interval_seconds: data.monitoringInterval,
      timeout_seconds: 10,
      retries: 2,
      retry_interval_seconds: 30,
      accepted_status_codes: [200],
    };
    const orgId = organizationId ?? getSelectedOrganizationId();
    if (orgId) {
      body.organization_id = orgId;
    }
    if (data.clientId) {
      body.project_id = data.clientId;
    }

    const response = await apiRequest<ApiEnvelope<Platform>>('/v1/monitors', {
      method: 'POST',
      authenticated: true,
      body,
    });
    return response.data;
  },

  updatePlatform: async (id: string, data: PlatformFormData): Promise<Platform> => {
    const response = await apiRequest<ApiEnvelope<Platform>>(`/v1/monitors/${id}`, {
      method: 'PATCH',
      authenticated: true,
      body: {
        name: data.name,
        target: data.url,
        project_id: data.clientId,
        interval_seconds: data.monitoringInterval,
        active: data.status === 'online',
      },
    });
    return response.data;
  },

  deletePlatform: async (id: string): Promise<void> => {
    await apiRequest<never>(`/v1/monitors/${id}`, {
      method: 'DELETE',
      authenticated: true,
    });
  },

  assignClient: async (platformId: string, clientId: string | null): Promise<Platform> => {
    const response = await apiRequest<ApiEnvelope<Platform>>(
      `/v1/monitors/${platformId}`,
      {
        method: 'PATCH',
        authenticated: true,
        body: clientId !== null ? { project_id: clientId } : {},
      }
    );
    return response.data;
  },
};