/**
 * Logs and Incidents feature types.
 * Defines the backend API contracts for log entries and incident records.
 */

/** Backend-defined log severity levels. Extensible as a plain string. */
export type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG' | 'TRACE';

export interface Log {
  id: string;
  timestamp: string;
  platformId?: string | null;
  platformName?: string | null;
  level: LogLevel;
  message: string;
  status?: string | null;
  errorDetails?: string | null;
  createdAt: string;
}

export interface LogFilters {
  search?: string;
  level?: LogLevel | 'all';
  platformId?: string | null | 'all';
  startDate?: string | null;
  endDate?: string | null;
  page?: number;
  limit?: number;
}

export interface LogListResponse {
  data: Log[];
  total: number;
  page: number;
  limit: number;
}

export type IncidentStatus = 'open' | 'investigating' | 'resolved' | 'closed';
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Incident {
  id: string;
  title: string;
  description: string;
  platformId: string;
  platformName?: string | null;
  startTime: string;
  recoveryTime?: string | null;
  duration?: number | null; // in seconds
  status: IncidentStatus;
  severity?: IncidentSeverity | null;
  createdAt: string;
  updatedAt: string;
}

export interface IncidentFilters {
  search?: string;
  status?: IncidentStatus | 'all';
  severity?: IncidentSeverity | 'all';
  platformId?: string | null | 'all';
  startDate?: string | null;
  endDate?: string | null;
  page?: number;
  limit?: number;
}

export interface IncidentListResponse {
  data: Incident[];
  total: number;
  page: number;
  limit: number;
}

export interface IncidentFormData {
  title: string;
  description: string;
  platformId: string;
  status: IncidentStatus;
  severity?: IncidentSeverity;
}
