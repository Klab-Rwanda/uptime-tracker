import { Incident } from '../types/logsIncidents.types';
import { Link } from 'react-router-dom';
import { formatDateTime, formatDuration } from '../utils/logsIncidents.utils';
import { IncidentStatusBadge } from './IncidentStatusBadge';
import { LogSeverityBadge } from './LogSeverityBadge';

interface IncidentTableProps {
  incidents: Incident[];
  onView?: (id: string) => void;
  onResolve?: (id: string) => void;
  onDelete?: (id: string) => void;
}

/**
 * Displays a list of incidents in a table with title, platform, timing, duration, status, and severity.
 */
export const IncidentTable = ({
  incidents,
  onView,
  onResolve,
  onDelete,
}: IncidentTableProps) => {
  if (incidents.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg border border-gray-200">
        <div className="px-6 py-8 text-center">
          <p className="text-gray-500 text-sm">No incidents found.</p>
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
              Title
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Platform
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Start Time
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Recovery Time
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duration
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Severity
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {incidents.map((incident) => (
            <tr key={incident.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  <Link to={`/incidents/${incident.id}`} className="text-indigo-600 hover:text-indigo-500">
                    {incident.title}
                  </Link>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-700">
                  {incident.platformName || 'Unknown platform'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {formatDateTime(incident.startTime)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {incident.recoveryTime ? formatDateTime(incident.recoveryTime) : '—'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {incident.duration !== null && incident.duration !== undefined
                    ? formatDuration(incident.duration)
                    : '—'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <IncidentStatusBadge status={incident.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {incident.severity ? (
                  <LogSeverityBadge level={incident.severity} />
                ) : (
                  <span className="text-sm text-gray-400">—</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  {incident.status !== 'resolved' && onResolve ? (
                    <button
                      onClick={() => onResolve(incident.id)}
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      Resolve
                    </button>
                  ) : null}
                  {onView ? (
                    <button
                      onClick={() => onView(incident.id)}
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      View
                    </button>
                  ) : null}
                  {onDelete ? (
                    <button
                      onClick={() => onDelete(incident.id)}
                      className="text-red-600 hover:text-red-500"
                    >
                      Delete
                    </button>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
