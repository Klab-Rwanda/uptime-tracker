/**
 * Platform-specific utility functions.
 */

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const statusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    online: 'Online',
    offline: 'Offline',
    degraded: 'Degraded',
    unknown: 'Unknown',
  };
  return labels[status] ?? status;
};

export const statusColor = (status: string): string => {
  const colors: Record<string, string> = {
    online: 'bg-green-100 text-green-800',
    offline: 'bg-red-100 text-red-800',
    degraded: 'bg-yellow-100 text-yellow-800',
    unknown: 'bg-gray-100 text-gray-800',
  };
  return colors[status] ?? 'bg-gray-100 text-gray-800';
};

export const formatResponseTime = (ms: number | null): string => {
  if (ms === null) return 'N/A';
  return `${ms} ms`;
};

export const validatePlatformForm = (data: {
  name: string;
  url: string;
  description: string;
  monitoringInterval: number;
}): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.name.trim()) {
    errors.name = 'Name is required';
  }
  if (!data.url.trim()) {
    errors.url = 'URL is required';
  } else {
    try {
      new URL(data.url);
    } catch {
      errors.url = 'Invalid URL';
    }
  }
  if (!data.description.trim()) {
    errors.description = 'Description is required';
  }
  if (!data.monitoringInterval || data.monitoringInterval < 1) {
    errors.monitoringInterval = 'Monitoring interval must be at least 1 second';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};