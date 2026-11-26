import { PlatformMonitoringHistory } from '../types/platformDetails.types';
import { formatDateTime } from '../utils/platform.utils';

interface MonitoringHistoryProps {
  history: PlatformMonitoringHistory[];
  loading: boolean;
}

/**
 * Displays platform monitoring history with timestamps,
 * check status, and response times.
 */
export const MonitoringHistory = ({ history, loading }: MonitoringHistoryProps) => {
  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg border border-gray-200">
        <div className="px-6 py-8 text-center">
          <p className="text-sm text-gray-500">Loading monitoring history...</p>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg border border-gray-200">
        <div className="px-6 py-8 text-center">
          <p className="text-sm text-gray-500">No monitoring history available.</p>
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
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Response Time
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Error
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {history.map((entry, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDateTime(entry.timestamp)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-medium rounded ${
                  entry.status === 'success'
                    ? 'bg-green-100 text-green-800'
                    : entry.status === 'error'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {entry.responseTime !== null ? `${entry.responseTime} ms` : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {entry.error || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
