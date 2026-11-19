/**
 * Notifications feature types.
 * Defines the backend API contracts for notifications and notification preferences.
 */

/** Backend-defined notification types. */
export type NotificationType = 'downtime' | 'recovery' | 'anomaly' | 'info';

/** Read/unread status of a notification. */
export type NotificationStatus = 'read' | 'unread';

export interface Notification {
  id: string;
  title: string;
  message: string;
  platformId?: string | null;
  platformName?: string | null;
  incidentId?: string | null;
  incidentTitle?: string | null;
  type: NotificationType;
  status: NotificationStatus;
  timestamp: string;
  createdAt: string;
}

export interface NotificationFilters {
  search?: string;
  type?: NotificationType | 'all';
  status?: NotificationStatus | 'all';
  platformId?: string | null | 'all';
  page?: number;
  limit?: number;
}

export interface NotificationListResponse {
  data: Notification[];
  total: number;
  page: number;
  limit: number;
}

export interface PlatformNotificationPreferences {
  emailEnabled: boolean;
  downtimeAlerts: boolean;
  recoveryNotifications: boolean;
  anomalyAlerts: boolean;
}

export interface NotificationPreferences {
  emailEnabled: boolean;
  downtimeAlerts: boolean;
  recoveryNotifications: boolean;
  anomalyAlerts: boolean;
  platformPreferences: Record<string, PlatformNotificationPreferences>;
}

export interface NotificationPreferencesFormData {
  emailEnabled: boolean;
  downtimeAlerts: boolean;
  recoveryNotifications: boolean;
  anomalyAlerts: boolean;
}
