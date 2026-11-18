import { useState, useEffect, useCallback } from 'react';
import { logsService } from '../services/logsIncidentsService';
import { Log, LogFilters, LogListResponse } from '../types/logsIncidents.types';

/**
 * Hook for managing a list of logs with search, filter, and pagination.
 */
export const useLogs = (initialFilters?: LogFilters) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<LogFilters>(initialFilters ?? {});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initial load - runs once on mount
  useEffect(() => {
    setLoading(true);
    setError(null);
    logsService
      .getLogs(initialFilters ?? {})
      .then((response: LogListResponse) => {
        setLogs(response.data);
        setTotal(response.total);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error('Failed to load logs'));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Refresh on filter/page changes
  const fetchLogs = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const response: LogListResponse = await logsService.getLogs(filters);
      setLogs(response.data);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load logs'));
    } finally {
      setRefreshing(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const updateFilters = useCallback((nextFilters: Partial<LogFilters>) => {
    setFilters((prev) => ({ ...prev, ...nextFilters, page: 1 }));
  }, []);

  const refetch = useCallback(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    total,
    filters,
    loading,
    refreshing,
    error,
    updateFilters,
    refetch,
  };
};
