import { statusLabel, statusColor } from '../utils/platform.utils';

interface StatusBadgeProps {
  status: string;
}

/**
 * Displays a platform status badge with appropriate color coding.
 */
export const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(status)}`}>
      {statusLabel(status)}
    </span>
  );
};