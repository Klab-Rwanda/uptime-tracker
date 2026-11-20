import { useParams } from 'react-router-dom';
import { useNotification } from '../hooks/useNotification';
import { formatDateTime, timeAgo } from '../utils/notifications.utils';
import { NotificationTypeBadge } from '../components/NotificationTypeBadge';
import { NotificationReadBadge } from '../components/NotificationReadBadge';

/**
 * Notification details page.
 * Displays full notification details and links to the related platform or incident.
 */
export const NotificationsDetailsPage = () => {
  const { notificationId } = useParams<{ notificationId: string }>();
  const { notification, loading, error, refetch, markAsRead } = useNotification(
    notificationId ?? '',
  );

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-500">Loading notification details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-sm text-red-600">{error.message}</p>
          <button
            onClick={refetch}
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-500">Notification not found.</p>
        </div>
      </div>
    );
  }

  const handleMarkAsRead = async () => {
    await markAsRead();
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <button
          onClick={() => (window.location.href = '/notifications')}
          className="text-sm text-indigo-600 hover:text-indigo-500 mb-3"
        >
          ← Back to notifications
        </button>
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <NotificationTypeBadge type={notification.type} />
          <NotificationReadBadge status={notification.status} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{notification.title}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {timeAgo(notification.timestamp)} · {formatDateTime(notification.timestamp)}
        </p>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200 p-6 space-y-6">
        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-2">Message</h2>
          <p className="text-sm text-gray-900 whitespace-pre-wrap">{notification.message}</p>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-500">Platform:</span>
          {notification.platformId ? (
            <button
              onClick={() => (window.location.href = `/platforms/${notification.platformId}`)}
              className="text-indigo-600 hover:text-indigo-500 underline"
            >
              {notification.platformName || `Platform #${notification.platformId}`}
            </button>
          ) : (
            <span className="text-gray-400">—</span>
          )}
        </div>

        {notification.incidentId && (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-500">Related incident:</span>
            <button
              onClick={() => (window.location.href = `/incidents/${notification.incidentId}`)}
              className="text-indigo-600 hover:text-indigo-500 underline"
            >
              {notification.incidentTitle || `Incident #${notification.incidentId}`}
            </button>
          </div>
        )}

        {!notification.platformId && !notification.incidentId && (
          <p className="text-sm text-gray-500">
            No related platform or incident associated with this notification.
          </p>
        )}
      </div>

      {notification.status === 'unread' && (
        <div className="mt-6">
          <button
            onClick={handleMarkAsRead}
            className="inline-flex items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Mark as read
          </button>
        </div>
      )}
    </div>
  );
};
