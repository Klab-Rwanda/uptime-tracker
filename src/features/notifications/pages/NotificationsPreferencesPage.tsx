import { NotificationPreferences } from '../components/NotificationPreferences';

/**
 * Notification preferences page.
 * Allows users to configure global and per-platform notification settings.
 */
export const NotificationsPreferencesPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notification Preferences</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure how you receive notifications.
        </p>
      </div>
      <NotificationPreferences />
    </div>
  );
};
