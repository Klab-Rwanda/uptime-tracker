import { apiRequest } from '../../../services/apiClient';
import {
  Log,
  LogFilters,
  LogListResponse,
  Incident,
  IncidentFilters,
  IncidentListResponse,
  IncidentFormData,
} from '../types/logsIncidents.types';

interface ApiEnvelope<T> {
  data: T;
}

/** Convert camelCase keys to snake_case for API request bodies. */
const toSnakeCase = (obj: object): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    result[snakeKey] = value;
  }
  return result;
};

/**
 * Logs API service.
 * NOTE: /v1/logs endpoints are not yet documented in the public API spec.
 * Flagged as "not yet implemented" — add to backend when available.
 */
export const logsService = {
  getLogs: async (_filters?: LogFilters): Promise<LogListResponse> => {
    const response = await apiRequest<ApiEnvelope<LogListResponse>>(
      '/v1/logs',
      { authenticated: true }
    );
    return response.data;
  },

  getLogById: async (_id: string): Promise<Log> => {
    const response = await apiRequest<ApiEnvelope<Log>>(
      `/v1/logs/${_id}`,
      { authenticated: true }
    );
    return response.data;
  },
};

/**
 * Incidents API service.
 * Uses /v1/incidents endpoints documented in the public API spec.
 */
export const incidentsService = {
  getIncidents: async (filters?: IncidentFilters): Promise<IncidentListResponse> => {
    const params = new URLSearchParams();
    if (filters?.search) params.set('search', filters.search);
    if (filters?.status && filters.status !== 'all') params.set('status', filters.status);
    if (filters?.severity && filters.severity !== 'all') params.set('severity', filters.severity);
    if (filters?.platformId && filters.platformId !== 'all') params.set('platformId', filters.platformId);
    if (filters?.startDate) params.set('startDate', filters.startDate);
    if (filters?.endDate) params.set('endDate', filters.endDate);
    if (filters?.page !== undefined) params.set('page', String(filters.page));
    if (filters?.limit !== undefined) params.set('limit', String(filters.limit));

    const response = await apiRequest<ApiEnvelope<IncidentListResponse>>(
      `/v1/incidents?${params.toString()}`,
      { authenticated: true }
    );
    return response.data;
  },

  getIncidentById: async (id: string): Promise<Incident> => {
    const response = await apiRequest<ApiEnvelope<Incident>>(
      `/v1/incidents/${id}`,
      { authenticated: true }
    );
    return response.data;
  },

  createIncident: async (data: IncidentFormData): Promise<Incident> => {
    const response = await apiRequest<ApiEnvelope<Incident>>('/v1/incidents', {
      method: 'POST',
      authenticated: true,
      body: toSnakeCase(data),
    });
    return response.data;
  },

  updateIncident: async (
    id: string,
    data: Partial<IncidentFormData>,
  ): Promise<Incident> => {
    const response = await apiRequest<ApiEnvelope<Incident>>(`/v1/incidents/${id}`, {
      method: 'PATCH',
      authenticated: true,
      body: toSnakeCase(data),
    });
    return response.data;
  },

  resolveIncident: async (id: string): Promise<Incident> => {
    const response = await apiRequest<ApiEnvelope<Incident>>(
      `/v1/incidents/${id}/resolve`,
      { method: 'POST', authenticated: true }
    );
    return response.data;
  },

  deleteIncident: async (id: string): Promise<void> => {
    await apiRequest<never>(`/v1/incidents/${id}`, {
      method: 'DELETE',
      authenticated: true,
    });
  },
};

