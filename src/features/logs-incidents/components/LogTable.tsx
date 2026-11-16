import { Log } from '../types/logsIncidents.types';
import { formatDateTime } from '../utils/logsIncidents.utils';
import { LogSeverityBadge } from './LogSeverityBadge';
import { IncidentStatusBadge } from './IncidentStatusBadge';

interface LogTableProps {
  logs: Log[];
  onView?: (id: string) => void;
}

/**
 * Displays a list of logs in a table with timestamp, platform, message, severity, and status.
 */
export const LogTable = ({ logs, onView }: LogTableProps) => {
  if (logs.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg border border-gray-200">
        <div className="px-6 py-8 text-center">
          <p className="text-gray-500 text-sm">No logs found.</p>
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
              Platform
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Message
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Severity
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Error Details
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {formatDateTime(log.timestamp)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {log.platformName || 'Unknown platform'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-700 truncate max-w-xs" title={log.message}>
                  {log.message}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <LogSeverityBadge level={log.level} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {log.status ? (
                  <IncidentStatusBadge status={log.status} />
                ) : (
                  <span className="text-sm text-gray-400">—</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {log.errorDetails ? (
                  <div className="text-sm text-gray-500 truncate max-w-xs" title={log.errorDetails}>
                    {log.errorDetails}
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">—</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {onView ? (
                  <button
                    onClick={() => onView(log.id)}
                    className="text-indigo-600 hover:text-indigo-500"
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
