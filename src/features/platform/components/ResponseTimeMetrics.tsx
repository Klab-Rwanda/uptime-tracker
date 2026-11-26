import { PlatformMetrics } from '../types/platformDetails.types';
import { formatResponseTime } from '../utils/platform.utils';

interface ResponseTimeMetricsProps {
  metrics: PlatformMetrics;
}

/**
 * Displays platform response time metrics including current response,
 * average response, and uptime information.
 */
export const ResponseTimeMetrics = ({ metrics }: ResponseTimeMetricsProps) => {
  const { currentResponseTime, averageResponseTime, uptimePercentage } = metrics;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Current Response Time
        </h3>
        <p className="mt-1 text-sm text-gray-900">
          {formatResponseTime(currentResponseTime)}
        </p>
      </div>

      <div>
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Average Response Time
        </h3>
        <p className="mt-1 text-sm text-gray-900">
          {formatResponseTime(averageResponseTime)}
        </p>
      </div>

      <div>
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Uptime Percentage
        </h3>
        <p className="mt-1 text-sm text-gray-900">
          {uptimePercentage !== null ? `${uptimePercentage}%` : 'N/A'}
        </p>
      </div>
    </div>
  );
};
