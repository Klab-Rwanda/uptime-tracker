import { notificationStatusColor, notificationStatusLabel } from '../utils/notifications.utils';

interface NotificationReadBadgeProps {
  status: string;
}

/**
 * Displays a notification read/unread status badge with appropriate color coding.
 */
export const NotificationReadBadge = ({ status }: NotificationReadBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${notificationStatusColor(
        status,
      )}`}
      title={`Status: ${notificationStatusLabel(status)}`}
    >
      {notificationStatusLabel(status)}
    </span>
  );
};
