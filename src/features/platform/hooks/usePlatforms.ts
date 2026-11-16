import { useState, useEffect, useCallback } from 'react';
import { platformService } from '../services/platformService';
import { Platform, PlatformFilters, PlatformListResponse } from '../types/platform.types';

/**
 * Hook for managing a list of platforms with search, filter, and pagination.
 */
export const usePlatforms = (initialFilters?: PlatformFilters) => {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<PlatformFilters>(initialFilters ?? {});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initial load - runs once on mount
  useEffect(() => {
    setLoading(true);
    setError(null);
    platformService
      .getPlatforms(initialFilters ?? {})
      .then((response: PlatformListResponse) => {
        setPlatforms(response.data);
        setTotal(response.total);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error('Failed to load platforms'));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Refresh on filter/page changes
  const fetchPlatforms = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const response: PlatformListResponse = await platformService.getPlatforms(filters);
      setPlatforms(response.data);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load platforms'));
    } finally {
      setRefreshing(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPlatforms();
  }, [fetchPlatforms]);

  const updateFilters = useCallback((nextFilters: Partial<PlatformFilters>) => {
    setFilters((prev) => ({ ...prev, ...nextFilters, page: 1 }));
  }, []);

  const refetch = useCallback(() => {
    fetchPlatforms();
  }, [fetchPlatforms]);

  return {
    platforms,
    total,
    filters,
    loading,
    refreshing,
    error,
    updateFilters,
    refetch,
  };
};