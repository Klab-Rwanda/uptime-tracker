export interface Client {
  id: string;
  name: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface ClientListResponse {
  data: Client[];
  total: number;
  page: number;
  limit: number;
}

export interface ClientFilters {
  search?: string;
  status?: Client['status'];
  page?: number;
  limit?: number;
}

export interface ClientFormData {
  name: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  status: Client['status'];
}