import { notificationTypeColor, notificationTypeLabel } from '../utils/notifications.utils';

interface NotificationTypeBadgeProps {
  type: string;
}

/**
 * Displays a notification type badge with appropriate color coding.
 * Supports backend-defined notification types (downtime, recovery, anomaly, info).
 */
export const NotificationTypeBadge = ({ type }: NotificationTypeBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${notificationTypeColor(
        type,
      )}`}
      title={`Type: ${notificationTypeLabel(type)}`}
    >
      {notificationTypeLabel(type)}
    </span>
  );
};
