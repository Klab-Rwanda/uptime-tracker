import { apiRequest } from '../../../services/apiClient';

export interface Organization {
  id: string;
  name: string;
  role: string;
}

export interface DashboardSummary {
  organization_id: string;
  total_monitors: number;
  status_counts: {
    up: number;
    down: number;
    pending: number;
    paused: number;
    maintenance: number;
  };
  total_projects: number;
  projects: Array<{
    id: string;
    name: string;
    total_monitors: number;
    status_counts: DashboardSummary['status_counts'];
  }>;
}

export interface DashboardMonitor {
  id: string;
  project_id: string | null;
  name: string;
  type: string;
  target: string;
  status: string;
  interval_seconds: number;
  is_active: boolean;
}

export interface DashboardIncident {
  id: string;
  monitor_id: string;
  status: string;
  title: string;
  cause: string | null;
  started_at: string;
  resolved_at: string | null;
}

interface ApiEnvelope<T> {
  data: T;
}

const organizationQuery = (organizationId: string) =>
  `?organization_id=${encodeURIComponent(organizationId)}`;

export const dashboardService = {
  async getOrganizations(): Promise<Organization[]> {
    const response = await apiRequest<ApiEnvelope<Organization[]>>('/v1/organizations');
    return response.data;
  },

  async createOrganization(name: string): Promise<Organization> {
    const response = await apiRequest<ApiEnvelope<Organization>>('/v1/organizations', {
      method: 'POST',
      body: { name },
    });
    return response.data;
  },

  async getSummary(organizationId: string): Promise<DashboardSummary> {
    const response = await apiRequest<ApiEnvelope<DashboardSummary>>(
      `/v1/dashboard/summary${organizationQuery(organizationId)}`,
    );
    return response.data;
  },

  async getMonitors(organizationId: string): Promise<DashboardMonitor[]> {
    const response = await apiRequest<ApiEnvelope<DashboardMonitor[]>>(
      `/v1/monitors${organizationQuery(organizationId)}`,
    );
    return response.data;
  },

  async getRecentIncidents(organizationId: string): Promise<DashboardIncident[]> {
    const response = await apiRequest<ApiEnvelope<DashboardIncident[]>>(
      `/v1/incidents${organizationQuery(organizationId)}&limit=5`,
    );
    return response.data;
  },
};
