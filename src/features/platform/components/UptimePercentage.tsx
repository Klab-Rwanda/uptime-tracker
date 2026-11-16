import { PlatformMetrics } from '../types/platformDetails.types';

interface UptimePercentageProps {
  metrics: PlatformMetrics;
}

/**
 * Displays the platform uptime percentage.
 * The value is provided by the backend - not calculated locally.
 */
export const UptimePercentage = ({ metrics }: UptimePercentageProps) => {
  const { uptimePercentage } = metrics;

  return (
    <div className="bg-white shadow rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900">Uptime Percentage</h2>
      <p className="text-3xl font-bold text-gray-900">
        {uptimePercentage !== null ? `${uptimePercentage}%` : 'N/A'}
      </p>
      <p className="text-sm text-gray-500">
        Provided by the backend monitoring system.
      </p>
    </div>
  );
};
