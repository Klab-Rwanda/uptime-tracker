import { Platform, PlatformFilters, PlatformListResponse, PlatformFormData } from '../types/platform.types';

const STORAGE_KEY = 'uptime_platforms';

const initialPlatforms: Platform[] = [
  {
    id: '1',
    name: 'API Gateway',
    url: 'https://api.example.com',
    description: 'Main API gateway for the platform',
    status: 'unknown',
    clientId: null,
    clientName: null,
    monitoringInterval: 60,
    lastChecked: null,
    responseTime: null,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: '2',
    name: 'Auth Service',
    url: 'https://auth.example.com',
    description: 'Authentication and authorization service',
    status: 'unknown',
    clientId: null,
    clientName: null,
    monitoringInterval: 30,
    lastChecked: null,
    responseTime: null,
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const loadPlatforms = (): Platform[] => {
  if (typeof window === 'undefined') return initialPlatforms;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialPlatforms;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPlatforms));
  return initialPlatforms;
};

const savePlatforms = (platforms: Platform[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(platforms));
};

/**
 * Platform API service (mocked with localStorage).
 * Replace with real HTTP calls when a backend is available.
 */
export const platformService = {
  getPlatforms: async (filters?: PlatformFilters): Promise<PlatformListResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let platforms = loadPlatforms();

    if (filters?.search) {
      const term = filters.search.toLowerCase();
      platforms = platforms.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.url.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term),
      );
    }

    if (filters?.status) {
      platforms = platforms.filter((p) => p.status === filters.status);
    }

    if (filters?.clientId !== undefined) {
      platforms = platforms.filter((p) => p.clientId === filters.clientId);
    }

    const total = platforms.length;
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const start = (page - 1) * limit;
    const paginated = platforms.slice(start, start + limit);

    return {
      data: paginated,
      total,
      page,
      limit,
    };
  },

  getPlatformById: async (id: string): Promise<Platform> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const platforms = loadPlatforms();
    const platform = platforms.find((p) => p.id === id);
    if (!platform) {
      throw new Error(`Platform with id ${id} not found`);
    }
    return platform;
  },

  createPlatform: async (data: PlatformFormData): Promise<Platform> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const platforms = loadPlatforms();
    const now = new Date().toISOString();
    const newPlatform: Platform = {
      id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
      ...data,
      clientName: data.clientId ? null : null,
      clientId: data.clientId ?? null,
      lastChecked: null,
      responseTime: null,
      createdAt: now,
      updatedAt: now,
    };
    savePlatforms([...platforms, newPlatform]);
    return newPlatform;
  },

  updatePlatform: async (id: string, data: PlatformFormData): Promise<Platform> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const platforms = loadPlatforms();
    const index = platforms.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Platform with id ${id} not found`);
    }
    const updatedPlatform: Platform = {
      ...platforms[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    platforms[index] = updatedPlatform;
    savePlatforms(platforms);
    return updatedPlatform;
  },

  deletePlatform: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const platforms = loadPlatforms();
    const filtered = platforms.filter((p) => p.id !== id);
    if (filtered.length === platforms.length) {
      throw new Error(`Platform with id ${id} not found`);
    }
    savePlatforms(filtered);
  },

  assignClient: async (platformId: string, clientId: string | null): Promise<Platform> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const platforms = loadPlatforms();
    const index = platforms.findIndex((p) => p.id === platformId);
    if (index === -1) {
      throw new Error(`Platform with id ${platformId} not found`);
    }
    const updatedPlatform: Platform = {
      ...platforms[index],
      clientId,
      clientName: clientId ? platforms.find((p) => p.id === platformId)?.clientName ?? null : null,
      updatedAt: new Date().toISOString(),
    };
    platforms[index] = updatedPlatform;
    savePlatforms(platforms);
    return updatedPlatform;
  },
};