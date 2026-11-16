import { Platform } from '../types/platform.types';
import { Link } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import { formatDateTime, formatResponseTime } from '../utils/platform.utils';

interface PlatformCardProps {
  platform: Platform;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAssignClient?: (id: string) => void;
}

/**
 * Displays a single platform as a card with status, client, and response time.
 */
export const PlatformCard = ({ platform, onEdit, onDelete, onAssignClient }: PlatformCardProps) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              <Link to={`/platforms/${platform.id}`} className="text-indigo-600 hover:text-indigo-500">
                {platform.name}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-gray-500 truncate">{platform.url}</p>
            <p className="mt-1 text-sm text-gray-500">
              {platform.clientName || 'Unassigned'}
            </p>
          </div>
          <StatusBadge status={platform.status} />
        </div>
        <p className="mt-4 text-sm text-gray-600">{platform.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-gray-500">
            Last checked: {platform.lastChecked ? formatDateTime(platform.lastChecked) : 'N/A'}
          </span>
          <span className="text-xs text-gray-500">
            Response: {formatResponseTime(platform.responseTime)}
          </span>
          <span className="text-xs text-gray-500">
            Interval: {platform.monitoringInterval}s
          </span>
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
        <div className="flex justify-between">
          <button
            onClick={() => onEdit?.(platform.id)}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Edit
          </button>
          <button
            onClick={() => onAssignClient?.(platform.id)}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 ml-3"
          >
            Assign Client
          </button>
          <button
            onClick={() => onDelete?.(platform.id)}
            className="text-sm font-medium text-red-600 hover:text-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};