import { apiRequest } from '../../../services/apiClient';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrganizationData {
  name: string;
  slug: string;
}

interface ApiEnvelope<T> {
  data: T;
}

export const organizationsService = {
  getOrganizations: async (): Promise<Organization[]> => {
    const response = await apiRequest<ApiEnvelope<Organization[]>>(
      '/v1/organizations',
      { authenticated: true }
    );
    return response.data;
  },

  getOrganization: async (organizationId: string): Promise<Organization> => {
    const response = await apiRequest<ApiEnvelope<Organization>>(
      `/v1/organizations/${organizationId}`,
      { authenticated: true }
    );
    return response.data;
  },

  createOrganization: async (data: CreateOrganizationData): Promise<Organization> => {
    const response = await apiRequest<ApiEnvelope<Organization>>(
      '/v1/organizations',
      {
        method: 'POST',
        authenticated: true,
        body: data,
      }
    );
    return response.data;
  },

  updateOrganization: async (
    organizationId: string,
    data: Partial<CreateOrganizationData>,
  ): Promise<Organization> => {
    const response = await apiRequest<ApiEnvelope<Organization>>(
      `/v1/organizations/${organizationId}`,
      {
        method: 'PATCH',
        authenticated: true,
        body: data,
      }
    );
    return response.data;
  },

  getMembers: async (organizationId: string): Promise<Array<{
    user_id: string;
    email: string;
    full_name: string;
    role: string;
    created_at: string;
  }>> => {
    const response = await apiRequest<ApiEnvelope<Array<{
      user_id: string;
      email: string;
      full_name: string;
      role: string;
      created_at: string;
    }>>>(
      `/v1/organizations/${organizationId}/members`,
      { authenticated: true }
    );
    return response.data;
  },

  inviteMember: async (
    organizationId: string,
    data: { email: string; role: string },
  ): Promise<{
    id: string;
    organization_id: string;
    email: string;
    role: string;
    status: string;
    expires_at: string;
    created_at: string;
  }> => {
    const response = await apiRequest<ApiEnvelope<{
      id: string;
      organization_id: string;
      email: string;
      role: string;
      status: string;
      expires_at: string;
      created_at: string;
    }>>(
      `/v1/organizations/${organizationId}/members`,
      {
        method: 'POST',
        authenticated: true,
        body: data,
      }
    );
    return response.data;
  },

  getInvitations: async (organizationId: string): Promise<Array<{
    id: string;
    organization_id: string;
    email: string;
    role: string;
    status: string;
    invited_at: string;
    expires_at: string;
    created_at: string;
  }>> => {
    const response = await apiRequest<ApiEnvelope<Array<{
      id: string;
      organization_id: string;
      email: string;
      role: string;
      status: string;
      invited_at: string;
      expires_at: string;
      created_at: string;
    }>>>(
      `/v1/organizations/${organizationId}/invitations`,
      { authenticated: true },
    );
    return response.data;
  },

  cancelInvitation: async (
    organizationId: string,
    invitationId: string,
  ): Promise<void> => {
    await apiRequest<never>(
      `/v1/organizations/${organizationId}/invitations/${invitationId}`,
      {
        method: 'DELETE',
        authenticated: true,
      },
    );
  },

  removeMember: async (
    organizationId: string,
    memberUserId: string,
  ): Promise<void> => {
    await apiRequest<never>(
      `/v1/organizations/${organizationId}/members/${memberUserId}`,
      {
        method: 'DELETE',
        authenticated: true,
      },
    );
  },

  leaveOrganization: async (organizationId: string): Promise<void> => {
    await apiRequest<never>(
      `/v1/organizations/${organizationId}/members/me`,
      {
        method: 'DELETE',
        authenticated: true,
      },
    );
  },

  transferOwnership: async (
    organizationId: string,
    userId: string,
  ): Promise<{ organization_id: string; new_owner_user_id: string }> => {
    const response = await apiRequest<ApiEnvelope<{
      organization_id: string;
      new_owner_user_id: string;
    }>>(
      `/v1/organizations/${organizationId}/transfer-ownership`,
      {
        method: 'POST',
        authenticated: true,
        body: { user_id: userId },
      },
    );
    return response.data;
  },

  acceptInvitation: async (token: string): Promise<{
    id: string;
    organization_id: string;
    email: string;
    role: string;
    status: string;
    accepted_at: string;
  }> => {
    const response = await apiRequest<ApiEnvelope<{
      id: string;
      organization_id: string;
      email: string;
      role: string;
      status: string;
      accepted_at: string;
    }>>(
      '/v1/organizations/invitations/accept',
      {
        method: 'POST',
        authenticated: true,
        body: { token },
      },
    );
    return response.data;
  },
};