import { useState, useEffect } from 'react';
import { notificationsService } from '../services/notificationsService';
import { platformService } from '../../platform';
import type {
  NotificationPreferences as NotificationPreferencesType,
  PlatformNotificationPreferences,
} from '../types/notifications.types';
import { Platform } from '../../platform/types/platform.types';

interface NotificationPreferencesProps {
  onSuccess?: () => void;
}

/**
 * Notification preferences form.
 * Controls global email, downtime, recovery, and anomaly alerts,
 * plus per-platform notification overrides where platforms exist.
 */
export const NotificationPreferences = ({ onSuccess }: NotificationPreferencesProps) => {
  const [preferences, setPreferences] = useState<NotificationPreferencesType>({
    emailEnabled: true,
    downtimeAlerts: true,
    recoveryNotifications: true,
    anomalyAlerts: true,
    platformPreferences: {},
  });
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    notificationsService
      .getPreferences()
      .then((prefs) => setPreferences(prefs))
      .catch((err) => setError(err instanceof Error ? err : new Error('Failed to load preferences')))
      .finally(() => setLoading(false));

    platformService
      .getPlatforms()
      .then((response) => setPlatforms(response.data))
      .catch(() => setPlatforms([]));
  }, []);

  const handleGlobalChange = (key: keyof NotificationPreferencesType, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handlePlatformChange = (
    platformId: string,
    key: keyof PlatformNotificationPreferences,
    value: boolean,
  ) => {
    setPreferences((prev) => ({
      ...prev,
      platformPreferences: {
        ...prev.platformPreferences,
        [platformId]: {
          ...prev.platformPreferences[platformId],
          [key]: value,
        },
      },
    }));
    setSaved(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const { platformPreferences, ...globalPrefs } = preferences;
      await notificationsService.updatePreferences(globalPrefs);

      for (const [platformId, platformPrefs] of Object.entries(platformPreferences)) {
        await notificationsService.updatePlatformPreferences(platformId, platformPrefs);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save preferences'));
    }
  };

  const getPlatformPrefs = (platformId: string): PlatformNotificationPreferences => {
    return (
      preferences.platformPreferences[platformId] ?? {
        emailEnabled: preferences.emailEnabled,
        downtimeAlerts: preferences.downtimeAlerts,
        recoveryNotifications: preferences.recoveryNotifications,
        anomalyAlerts: preferences.anomalyAlerts,
      }
    );
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-sm text-gray-500">Loading preferences...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="bg-white shadow rounded-lg border border-gray-200 p-6 space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Notification Preferences</h2>
        <p className="text-xs text-gray-500 mb-4">
          Configure how you receive notifications. Changes are saved automatically.
        </p>
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-4">
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Global Preferences</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.emailEnabled}
              onChange={(e) => handleGlobalChange('emailEnabled', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Email notifications</span>
          </label>
          <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.downtimeAlerts}
              onChange={(e) => handleGlobalChange('downtimeAlerts', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Downtime alerts</span>
          </label>
          <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.recoveryNotifications}
              onChange={(e) => handleGlobalChange('recoveryNotifications', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Recovery notifications</span>
          </label>
          <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.anomalyAlerts}
              onChange={(e) => handleGlobalChange('anomalyAlerts', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Anomaly alerts</span>
          </label>
        </div>
      </div>

      {platforms.length > 0 && (
        <div className="border-t border-gray-200 pt-4 space-y-4">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Per-Platform Preferences
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Override global settings for individual platforms.
          </p>
          <div className="space-y-3">
            {platforms.map((platform) => {
              const prefs = getPlatformPrefs(platform.id);
              return (
                <div key={platform.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-900">{platform.name}</span>
                    <span className="text-xs text-gray-500">{platform.url}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prefs.emailEnabled}
                        onChange={(e) =>
                          handlePlatformChange(platform.id, 'emailEnabled', e.target.checked)
                        }
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      Email
                    </label>
                    <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prefs.downtimeAlerts}
                        onChange={(e) =>
                          handlePlatformChange(platform.id, 'downtimeAlerts', e.target.checked)
                        }
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      Downtime
                    </label>
                    <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prefs.recoveryNotifications}
                        onChange={(e) =>
                          handlePlatformChange(platform.id, 'recoveryNotifications', e.target.checked)
                        }
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      Recovery
                    </label>
                    <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prefs.anomalyAlerts}
                        onChange={(e) =>
                          handlePlatformChange(platform.id, 'anomalyAlerts', e.target.checked)
                        }
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      Anomaly
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || saved}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
        >
          {saved ? 'Saved!' : 'Save Preferences'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-sm text-red-800 font-medium">Error saving preferences</h3>
          <p className="mt-1 text-sm text-red-600">{error.message}</p>
        </div>
      )}
    </form>
  );
};
