/**
 * Notifications feature utilities.
 * Label and color mappings for notification types and read/unread status.
 */

/** Human-readable label for a notification type. */
export const notificationTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    downtime: 'Downtime',
    recovery: 'Recovery',
    anomaly: 'Anomaly',
    info: 'Information',
  };
  return labels[type] || type;
};

/** Tailwind color classes for a notification type badge. */
export const notificationTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    downtime: 'bg-red-100 text-red-800',
    recovery: 'bg-green-100 text-green-800',
    anomaly: 'bg-amber-100 text-amber-800',
    info: 'bg-indigo-100 text-indigo-800',
  };
  return colors[type] || 'bg-gray-100 text-gray-800';
};

/** Human-readable label for notification read/unread status. */
export const notificationStatusLabel = (status: string): string => {
  return status === 'unread' ? 'Unread' : 'Read';
};

/** Tailwind color classes for a notification status badge. */
export const notificationStatusColor = (status: string): string => {
  return status === 'unread' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600';
};

/** Format an ISO timestamp string for display. */
export const formatDateTime = (isoString: string): string => {
  return new Date(isoString).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/** Relative time descriptor for a timestamp (e.g. "5 minutes ago"). */
export const timeAgo = (isoString: string): string => {
  const now = new Date();
  const then = new Date(isoString);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};
