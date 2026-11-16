import { Platform } from '../types/platform.types';
import { Link } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import { formatDateTime, formatResponseTime } from '../utils/platform.utils';

interface PlatformTableProps {
  platforms: Platform[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onAssignClient?: (id: string) => void;
}

/**
 * Displays a list of platforms in a table with status, client, and response time.
 */
export const PlatformTable = ({
  platforms,
  onEdit,
  onDelete,
  onView,
  onAssignClient,
}: PlatformTableProps) => {
  if (platforms.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg border border-gray-200">
        <div className="px-6 py-8 text-center">
          <p className="text-gray-500 text-sm">No platforms found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              URL
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Client
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Last Checked
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Response Time
            </th>
            <th
              scope="col"
              className="relative px-6 py-3"
            >
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {platforms.map((platform) => (
            <tr key={platform.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  <Link
                    to={`/platforms/${platform.id}`}
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    {platform.name}
                  </Link>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 truncate max-w-xs">
                  {platform.url}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {platform.clientName || 'Unassigned'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={platform.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {platform.lastChecked
                    ? formatDateTime(platform.lastChecked)
                    : 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {formatResponseTime(platform.responseTime)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit?.(platform.id)}
                  className="text-indigo-600 hover:text-indigo-500 mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => onView?.(platform.id)}
                  className="text-indigo-600 hover:text-indigo-500 mr-3"
                >
                  View
                </button>
                <button
                  onClick={() => onAssignClient?.(platform.id)}
                  className="text-blue-600 hover:text-blue-500 mr-3"
                >
                  Assign Client
                </button>
                <button
                  onClick={() => onDelete?.(platform.id)}
                  className="text-red-600 hover:text-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};