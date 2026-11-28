import { apiRequest } from '../../../services/apiClient';
import { Client, ClientFilters, ClientListResponse, ClientFormData } from '../types/client.types';

interface ApiEnvelope<T> {
  data: T;
}

/**
 * Client API service.
 * Uses /v1/clients endpoints. NOTE: These endpoints are not yet documented
 * in the public API spec — they should be added to the backend or mapped
 * to the Organizations endpoints until then.
 */
export const clientService = {
  getClients: async (filters?: ClientFilters): Promise<ClientListResponse> => {
    const params = new URLSearchParams();
    if (filters?.search) params.set('search', filters.search);
    if (filters?.status) params.set('status', filters.status);
    if (filters?.page !== undefined) params.set('page', String(filters.page));
    if (filters?.limit !== undefined) params.set('limit', String(filters.limit));

    const response = await apiRequest<ApiEnvelope<ClientListResponse>>(
      `/v1/clients?${params.toString()}`,
      { authenticated: true }
    );
    return response.data;
  },

  getClientById: async (id: string): Promise<Client> => {
    const response = await apiRequest<ApiEnvelope<Client>>(
      `/v1/clients/${id}`,
      { authenticated: true }
    );
    return response.data;
  },

  createClient: async (data: ClientFormData): Promise<Client> => {
    const response = await apiRequest<ApiEnvelope<Client>>('/v1/clients', {
      method: 'POST',
      authenticated: true,
      body: data,
    });
    return response.data;
  },

  updateClient: async (id: string, data: ClientFormData): Promise<Client> => {
    const response = await apiRequest<ApiEnvelope<Client>>(`/v1/clients/${id}`, {
      method: 'PATCH',
      authenticated: true,
      body: data,
    });
    return response.data;
  },

  deleteClient: async (id: string): Promise<void> => {
    await apiRequest<never>(`/v1/clients/${id}`, {
      method: 'DELETE',
      authenticated: true,
    });
  },
};
