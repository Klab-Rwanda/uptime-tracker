import { useState, useEffect, useCallback } from 'react';
import { incidentsService, logsService } from '../services/logsIncidentsService';
import { Incident, Log } from '../types/logsIncidents.types';

/**
 * Hook for managing a single incident and its related logs.
 */
export const useIncident = (incidentId: string) => {
  const [incident, setIncident] = useState<Incident | null>(null);
  const [relatedLogs, setRelatedLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchIncident = useCallback(async () => {
    if (!incidentId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await incidentsService.getIncidentById(incidentId);
      setIncident(data);
      // Load logs related to the affected platform
      const logsResponse = await logsService.getLogs({
        platformId: data.platformId,
        limit: 50,
      });
      setRelatedLogs(logsResponse.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load incident'));
    } finally {
      setLoading(false);
    }
  }, [incidentId]);

  useEffect(() => {
    fetchIncident();
  }, [fetchIncident]);

  const refetch = useCallback(() => {
    fetchIncident();
  }, [fetchIncident]);

  const resolve = useCallback(async () => {
    if (!incident) return;
    try {
      const updated = await incidentsService.resolveIncident(incidentId);
      setIncident(updated);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to resolve incident'));
      throw err;
    }
  }, [incident, incidentId]);

  return {
    incident,
    relatedLogs,
    loading,
    error,
    refetch,
    resolve,
  };
};
