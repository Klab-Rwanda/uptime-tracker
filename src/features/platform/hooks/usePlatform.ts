import { useState, useEffect, useCallback } from 'react';
import { platformService } from '../services/platformService';
import { Platform } from '../types/platform.types';

/**
 * Hook for managing a single platform.
 */
export const usePlatform = (id: string) => {
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPlatform = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await platformService.getPlatformById(id);
      setPlatform(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load platform'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPlatform();
  }, [fetchPlatform]);

  const refetch = useCallback(() => {
    fetchPlatform();
  }, [fetchPlatform]);

  return {
    platform,
    loading,
    error,
    refetch,
  };
};