import {
  Log,
  LogFilters,
  LogListResponse,
  Incident,
  IncidentFilters,
  IncidentListResponse,
  IncidentFormData,
} from '../types/logsIncidents.types';
import { computeDuration } from '../utils/logsIncidents.utils';

const LOGS_STORAGE_KEY = 'uptime_logs';
const INCIDENTS_STORAGE_KEY = 'uptime_incidents';

/**
 * No seed data is provided here on purpose.
 * Incident and log records are not invented; the service operates on
 * whatever is persisted in localStorage (empty by default).
 */
const initialLogs: Log[] = [];
const initialIncidents: Incident[] = [];

const loadLogs = (): Log[] => {
  if (typeof window === 'undefined') return initialLogs;
  const stored = localStorage.getItem(LOGS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialLogs;
    }
  }
  localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(initialLogs));
  return initialLogs;
};

const loadIncidents = (): Incident[] => {
  if (typeof window === 'undefined') return initialIncidents;
  const stored = localStorage.getItem(INCIDENTS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialIncidents;
    }
  }
  localStorage.setItem(INCIDENTS_STORAGE_KEY, JSON.stringify(initialIncidents));
  return initialIncidents;
};

const saveIncidents = (incidents: Incident[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(INCIDENTS_STORAGE_KEY, JSON.stringify(incidents));
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const matchesDateRange = (
  value: string,
  startDate?: string | null,
  endDate?: string | null,
): boolean => {
  if (!startDate && !endDate) return true;
  const ts = new Date(value).getTime();
  if (isNaN(ts)) return false;
  if (startDate && ts < new Date(startDate).getTime()) return false;
  if (endDate && ts > new Date(endDate).getTime()) return false;
  return true;
};

/**
 * Logs API service (mocked with localStorage).
 * Replace with real HTTP calls when a backend is available.
 */
export const logsService = {
  getLogs: async (filters?: LogFilters): Promise<LogListResponse> => {
    await delay(300);
    let logs = loadLogs();

    if (filters?.search) {
      const term = filters.search.toLowerCase();
      logs = logs.filter(
        (log) =>
          log.message.toLowerCase().includes(term) ||
          log.platformName?.toLowerCase().includes(term) ||
          log.level.toLowerCase().includes(term),
      );
    }

    if (filters?.level && filters.level !== 'all') {
      logs = logs.filter((log) => log.level === filters.level);
    }

    if (filters?.platformId && filters.platformId !== 'all') {
      logs = logs.filter((log) => log.platformId === filters.platformId);
    }

    if (filters?.startDate || filters?.endDate) {
      logs = logs.filter((log) =>
        matchesDateRange(log.timestamp, filters.startDate, filters.endDate),
      );
    }

    const total = logs.length;
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const start = (page - 1) * limit;
    const paginated = logs.slice(start, start + limit);

    return { data: paginated, total, page, limit };
  },

  getLogById: async (id: string): Promise<Log> => {
    await delay(200);
    const logs = loadLogs();
    const log = logs.find((l) => l.id === id);
    if (!log) {
      throw new Error(`Log with id ${id} not found`);
    }
    return log;
  },
};

/**
 * Incidents API service (mocked with localStorage).
 * Replace with real HTTP calls when a backend is available.
 */
export const incidentsService = {
  getIncidents: async (filters?: IncidentFilters): Promise<IncidentListResponse> => {
    await delay(300);
    let incidents = loadIncidents();

    if (filters?.search) {
      const term = filters.search.toLowerCase();
      incidents = incidents.filter(
        (incident) =>
          incident.title.toLowerCase().includes(term) ||
          incident.description.toLowerCase().includes(term) ||
          incident.platformName?.toLowerCase().includes(term),
      );
    }

    if (filters?.status && filters.status !== 'all') {
      incidents = incidents.filter((i) => i.status === filters.status);
    }

    if (filters?.severity && filters.severity !== 'all') {
      incidents = incidents.filter((i) => i.severity === filters.severity);
    }

    if (filters?.platformId && filters.platformId !== 'all') {
      incidents = incidents.filter((i) => i.platformId === filters.platformId);
    }

    if (filters?.startDate || filters?.endDate) {
      incidents = incidents.filter((i) =>
        matchesDateRange(i.startTime, filters.startDate, filters.endDate),
      );
    }

    const total = incidents.length;
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const start = (page - 1) * limit;
    const paginated = incidents.slice(start, start + limit);

    return { data: paginated, total, page, limit };
  },

  getIncidentById: async (id: string): Promise<Incident> => {
    await delay(200);
    const incidents = loadIncidents();
    const incident = incidents.find((i) => i.id === id);
    if (!incident) {
      throw new Error(`Incident with id ${id} not found`);
    }
    return incident;
  },

  createIncident: async (data: IncidentFormData): Promise<Incident> => {
    await delay(400);
    const incidents = loadIncidents();
    const now = new Date().toISOString();
    const newIncident: Incident = {
      id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
      ...data,
      startTime: now,
      createdAt: now,
      updatedAt: now,
    };
    saveIncidents([...incidents, newIncident]);
    return newIncident;
  },

  updateIncident: async (
    id: string,
    data: Partial<IncidentFormData>,
  ): Promise<Incident> => {
    await delay(400);
    const incidents = loadIncidents();
    const index = incidents.findIndex((i) => i.id === id);
    if (index === -1) {
      throw new Error(`Incident with id ${id} not found`);
    }
    const updatedIncident: Incident = {
      ...incidents[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    incidents[index] = updatedIncident;
    saveIncidents(incidents);
    return updatedIncident;
  },

  resolveIncident: async (id: string): Promise<Incident> => {
    await delay(300);
    const incidents = loadIncidents();
    const index = incidents.findIndex((i) => i.id === id);
    if (index === -1) {
      throw new Error(`Incident with id ${id} not found`);
    }
    const incident = incidents[index];
    const recoveryTime = new Date().toISOString();
    const duration = computeDuration(incident.startTime, recoveryTime);
    const updatedIncident: Incident = {
      ...incident,
      status: 'resolved',
      recoveryTime,
      duration,
      updatedAt: recoveryTime,
    };
    incidents[index] = updatedIncident;
    saveIncidents(incidents);
    return updatedIncident;
  },

  deleteIncident: async (id: string): Promise<void> => {
    await delay(300);
    const incidents = loadIncidents();
    const filtered = incidents.filter((i) => i.id !== id);
    if (filtered.length === incidents.length) {
      throw new Error(`Incident with id ${id} not found`);
    }
    saveIncidents(filtered);
  },
};

