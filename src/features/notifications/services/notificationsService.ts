import {
  Notification,
  NotificationFilters,
  NotificationListResponse,
  NotificationPreferences,
  NotificationStatus,
  PlatformNotificationPreferences,
} from '../types/notifications.types';

const NOTIFICATIONS_STORAGE_KEY = 'uptime_notifications';
const PREFERENCES_STORAGE_KEY = 'uptime_notification_preferences';

const initialNotifications: Notification[] = [];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const loadNotifications = (): Notification[] => {
  if (typeof window === 'undefined') return initialNotifications;
  const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialNotifications;
    }
  }
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(initialNotifications));
  return initialNotifications;
};

const saveNotifications = (notifications: Notification[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
};

const loadPreferences = (): NotificationPreferences => {
  if (typeof window === 'undefined') return defaultPreferences();
  const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultPreferences();
    }
  }
  return defaultPreferences();
};

const savePreferences = (preferences: NotificationPreferences) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
};

const defaultPreferences = (): NotificationPreferences => ({
  emailEnabled: true,
  downtimeAlerts: true,
  recoveryNotifications: true,
  anomalyAlerts: true,
  platformPreferences: {},
});

/**
 * Notifications API service (mocked with localStorage).
 * Replace with real HTTP calls when a backend is available.
 */
export const notificationsService = {
  getNotifications: async (filters?: NotificationFilters): Promise<NotificationListResponse> => {
    await delay(300);
    let notifications = loadNotifications();

    if (filters?.search) {
      const term = filters.search.toLowerCase();
      notifications = notifications.filter(
        (n) =>
          n.title.toLowerCase().includes(term) ||
          n.message.toLowerCase().includes(term) ||
          n.platformName?.toLowerCase().includes(term) ||
          n.type.toLowerCase().includes(term),
      );
    }

    if (filters?.type && filters.type !== 'all') {
      notifications = notifications.filter((n) => n.type === filters.type);
    }

    if (filters?.status && filters.status !== 'all') {
      notifications = notifications.filter((n) => n.status === filters.status);
    }

    if (filters?.platformId && filters.platformId !== 'all') {
      notifications = notifications.filter((n) => n.platformId === filters.platformId);
    }

    // Sort newest first
    notifications = notifications.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    const total = notifications.length;
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const start = (page - 1) * limit;
    const paginated = notifications.slice(start, start + limit);

    return { data: paginated, total, page, limit };
  },

  getNotificationById: async (id: string): Promise<Notification> => {
    await delay(200);
    const notifications = loadNotifications();
    const notification = notifications.find((n) => n.id === id);
    if (!notification) {
      throw new Error(`Notification with id ${id} not found`);
    }
    return notification;
  },

  markAsRead: async (id: string): Promise<Notification> => {
    await delay(300);
    const notifications = loadNotifications();
    const index = notifications.findIndex((n) => n.id === id);
    if (index === -1) {
      throw new Error(`Notification with id ${id} not found`);
    }
    const updatedNotification: Notification = {
      ...notifications[index],
      status: 'read',
    };
    notifications[index] = updatedNotification;
    saveNotifications(notifications);
    return updatedNotification;
  },

  markAllAsRead: async (): Promise<void> => {
    await delay(300);
    const notifications = loadNotifications();
    const updated = notifications.map((n) => ({ ...n, status: 'read' as NotificationStatus }));
    saveNotifications(updated);
  },

  getPreferences: async (): Promise<NotificationPreferences> => {
    await delay(200);
    return loadPreferences();
  },

  updatePreferences: async (data: Partial<NotificationPreferences>): Promise<NotificationPreferences> => {
    await delay(300);
    const current = loadPreferences();
    const updated: NotificationPreferences = { ...current, ...data };
    savePreferences(updated);
    return updated;
  },

  updatePlatformPreferences: async (
    platformId: string,
    data: Partial<PlatformNotificationPreferences>,
  ): Promise<NotificationPreferences> => {
    await delay(300);
    const current = loadPreferences();
    const updated: NotificationPreferences = {
      ...current,
      platformPreferences: {
        ...current.platformPreferences,
        [platformId]: { ...current.platformPreferences[platformId], ...data },
      },
    };
    savePreferences(updated);
    return updated;
  },
};
