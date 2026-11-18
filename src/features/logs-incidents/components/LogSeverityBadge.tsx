import { severityLabel, severityColor } from '../utils/logsIncidents.utils';

interface LogSeverityBadgeProps {
  level: string;
}

/**
 * Displays a log severity badge with appropriate color coding.
 * Supports backend-defined severity values (INFO, WARNING, ERROR, ...).
 */
export const LogSeverityBadge = ({ level }: LogSeverityBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${severityColor(
        level,
      )}`}
      title={`Severity: ${severityLabel(level)}`}
    >
      {severityLabel(level)}
    </span>
  );
};
