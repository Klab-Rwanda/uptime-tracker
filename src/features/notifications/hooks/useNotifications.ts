import { useState, useEffect, useCallback } from 'react';
import { notificationsService } from '../services/notificationsService';
import {
  Notification,
  NotificationFilters,
  NotificationListResponse,
} from '../types/notifications.types';

/**
 * Hook for managing notifications with search, filter, and pagination.
 */
export const useNotifications = (initialFilters?: NotificationFilters) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<NotificationFilters>(initialFilters ?? {});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initial load - runs once on mount
  useEffect(() => {
    setLoading(true);
    setError(null);
    notificationsService
      .getNotifications(initialFilters ?? {})
      .then((response: NotificationListResponse) => {
        setNotifications(response.data);
        setTotal(response.total);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error('Failed to load notifications'));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Refresh on filter/page changes
  const fetchNotifications = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const response: NotificationListResponse = await notificationsService.getNotifications(filters);
      setNotifications(response.data);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load notifications'));
    } finally {
      setRefreshing(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const updateFilters = useCallback((nextFilters: Partial<NotificationFilters>) => {
    setFilters((prev) => ({ ...prev, ...nextFilters, page: 1 }));
  }, []);

  const refetch = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      const updated = await notificationsService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? updated : n)),
      );
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to mark notification as read'));
      throw err;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, status: 'read' })),
      );
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to mark all notifications as read'));
      throw err;
    }
  }, []);

  return {
    notifications,
    total,
    filters,
    loading,
    refreshing,
    error,
    updateFilters,
    refetch,
    markAsRead,
    markAllAsRead,
  };
};
