/**
 * Logs and Incidents utility functions.
 * Formatters and label/color maps for log severity and incident status.
 */

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDuration = (seconds: number | null): string => {
  if (seconds === null || seconds === undefined) return 'N/A';
  const total = Math.max(0, Math.round(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

export const severityLabel = (level: string): string => {
  const labels: Record<string, string> = {
    INFO: 'Info',
    WARNING: 'Warning',
    ERROR: 'Error',
    DEBUG: 'Debug',
    TRACE: 'Trace',
  };
  return labels[level] ?? level;
};

export const severityColor = (level: string): string => {
  const colors: Record<string, string> = {
    INFO: 'bg-blue-100 text-blue-800',
    WARNING: 'bg-yellow-100 text-yellow-800',
    ERROR: 'bg-red-100 text-red-800',
    DEBUG: 'bg-purple-100 text-purple-800',
    TRACE: 'bg-gray-100 text-gray-800',
  };
  return colors[level] ?? 'bg-gray-100 text-gray-800';
};

export const incidentStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    open: 'Open',
    investigating: 'Investigating',
    resolved: 'Resolved',
    closed: 'Closed',
  };
  return labels[status] ?? status;
};

export const incidentStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    open: 'bg-red-100 text-red-800',
    investigating: 'bg-orange-100 text-orange-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
  };
  return colors[status] ?? 'bg-gray-100 text-gray-800';
};

/** Computes incident duration in seconds from start and recovery timestamps. */
export const computeDuration = (
  startTime: string,
  recoveryTime?: string | null,
): number | null => {
  if (!recoveryTime) return null;
  const start = new Date(startTime).getTime();
  const end = new Date(recoveryTime).getTime();
  if (isNaN(start) || isNaN(end)) return null;
  return Math.max(0, Math.round((end - start) / 1000));
};
