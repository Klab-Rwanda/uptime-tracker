import { Notification } from '../types/notifications.types';
import { formatDateTime } from '../utils/notifications.utils';
import { NotificationTypeBadge } from './NotificationTypeBadge';
import { NotificationReadBadge } from './NotificationReadBadge';

interface NotificationTableProps {
  notifications: Notification[];
  onView?: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
}

/**
 * Displays a list of notifications in a table with timestamp, title, message,
 * platform, type, read/unread status, and actions.
 */
export const NotificationTable = ({
  notifications,
  onView,
  onMarkAsRead,
}: NotificationTableProps) => {
  if (notifications.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg border border-gray-200">
        <div className="px-6 py-8 text-center">
          <p className="text-gray-500 text-sm">No notifications found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Timestamp
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Message
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Platform
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {notifications.map((notification) => (
            <tr
              key={notification.id}
              className={`hover:bg-gray-50 transition-colors ${
                notification.status === 'unread' ? 'bg-blue-50' : ''
              }`}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {formatDateTime(notification.timestamp)}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className={`text-sm font-medium ${
                  notification.status === 'unread' ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {notification.title}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-700 truncate max-w-xs" title={notification.message}>
                  {notification.message}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {notification.platformName || 'Unknown platform'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <NotificationTypeBadge type={notification.type} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <NotificationReadBadge status={notification.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {notification.status === 'unread' && onMarkAsRead ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsRead(notification.id);
                    }}
                    className="text-indigo-600 hover:text-indigo-500 text-xs"
                  >
                    Mark as read
                  </button>
                ) : null}
                {onView ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(notification.id);
                    }}
                    className="ml-2 text-indigo-600 hover:text-indigo-500 text-xs"
                  >
                    View
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
