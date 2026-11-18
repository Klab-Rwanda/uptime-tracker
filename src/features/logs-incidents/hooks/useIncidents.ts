import { useState, useEffect, useCallback } from 'react';
import { incidentsService } from '../services/logsIncidentsService';
import { Incident, IncidentFilters, IncidentListResponse } from '../types/logsIncidents.types';

/**
 * Hook for managing a list of incidents with search, filter, and pagination.
 */
export const useIncidents = (initialFilters?: IncidentFilters) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<IncidentFilters>(initialFilters ?? {});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initial load - runs once on mount
  useEffect(() => {
    setLoading(true);
    setError(null);
    incidentsService
      .getIncidents(initialFilters ?? {})
      .then((response: IncidentListResponse) => {
        setIncidents(response.data);
        setTotal(response.total);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error('Failed to load incidents'));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Refresh on filter/page changes
  const fetchIncidents = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const response: IncidentListResponse = await incidentsService.getIncidents(filters);
      setIncidents(response.data);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load incidents'));
    } finally {
      setRefreshing(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const updateFilters = useCallback((nextFilters: Partial<IncidentFilters>) => {
    setFilters((prev) => ({ ...prev, ...nextFilters, page: 1 }));
  }, []);

  const refetch = useCallback(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  return {
    incidents,
    total,
    filters,
    loading,
    refreshing,
    error,
    updateFilters,
    refetch,
  };
};
