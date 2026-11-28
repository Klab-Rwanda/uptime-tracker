import { apiRequest } from '../../../services/apiClient';
import {
  Notification,
  NotificationFilters,
  NotificationListResponse,
  NotificationPreferences,
  PlatformNotificationPreferences,
} from '../types/notifications.types';

interface ApiEnvelope<T> {
  data: T;
}

/**
 * Notifications API service.
 * Uses /v1/notification-channels endpoints documented in the public API spec.
 * NOTE: /v1/notifications (list/get/mark-as-read) and preferences endpoints
 * are not yet documented — flagged as "not yet implemented".
 */
export const notificationsService = {
  getNotifications: async (_filters?: NotificationFilters): Promise<NotificationListResponse> => {
    const response = await apiRequest<ApiEnvelope<NotificationListResponse>>(
      '/v1/notification-channels',
      { authenticated: true }
    );
    return response.data;
  },

  getNotificationById: async (_id: string): Promise<Notification> => {
    const response = await apiRequest<ApiEnvelope<Notification>>(
      `/v1/notification-channels/${_id}`,
      { authenticated: true }
    );
    return response.data;
  },

  markAsRead: async (_id: string): Promise<Notification> => {
    throw new Error('markAsRead: /v1/notifications/{id}/read endpoint not yet implemented');
  },

  markAllAsRead: async (): Promise<void> => {
    throw new Error('markAllAsRead: /v1/notifications/read-all endpoint not yet implemented');
  },

  getPreferences: async (): Promise<NotificationPreferences> => {
    throw new Error('getPreferences: /v1/notification-preferences endpoint not yet implemented');
  },

  updatePreferences: async (_data: Partial<NotificationPreferences>): Promise<NotificationPreferences> => {
    throw new Error('updatePreferences: /v1/notification-preferences endpoint not yet implemented');
  },

  updatePlatformPreferences: async (
    _platformId: string,
    _data: Partial<PlatformNotificationPreferences>,
  ): Promise<NotificationPreferences> => {
    throw new Error(
      'updatePlatformPreferences: /v1/notification-preferences/platform endpoint not yet implemented',
    );
  },
};
