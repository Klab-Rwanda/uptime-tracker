import { incidentStatusLabel, incidentStatusColor } from '../utils/logsIncidents.utils';

interface IncidentStatusBadgeProps {
  status: string;
}

/**
 * Displays an incident status badge with appropriate color coding.
 */
export const IncidentStatusBadge = ({ status }: IncidentStatusBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${incidentStatusColor(
        status,
      )}`}
      title={`Status: ${incidentStatusLabel(status)}`}
    >
      {incidentStatusLabel(status)}
    </span>
  );
};
