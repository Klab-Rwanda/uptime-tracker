import { useState, useEffect, useCallback } from 'react';
import { notificationsService } from '../services/notificationsService';
import { Notification } from '../types/notifications.types';

/**
 * Hook for managing a single notification.
 */
export const useNotification = (notificationId: string) => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchNotification = useCallback(async () => {
    if (!notificationId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await notificationsService.getNotificationById(notificationId);
      setNotification(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load notification'));
    } finally {
      setLoading(false);
    }
  }, [notificationId]);

  useEffect(() => {
    fetchNotification();
  }, [fetchNotification]);

  const refetch = useCallback(() => {
    fetchNotification();
  }, [fetchNotification]);

  const markAsRead = useCallback(async () => {
    if (!notification) return;
    try {
      const updated = await notificationsService.markAsRead(notification.id);
      setNotification(updated);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to mark notification as read'));
      throw err;
    }
  }, [notification]);

  return {
    notification,
    loading,
    error,
    refetch,
    markAsRead,
  };
};
