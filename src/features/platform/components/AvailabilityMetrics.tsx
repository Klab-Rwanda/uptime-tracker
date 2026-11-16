import { PlatformAvailability } from '../types/platformDetails.types';
import { StatusBadge } from './StatusBadge';
import { formatDateTime } from '../utils/platform.utils';

interface AvailabilityMetricsProps {
  availability: PlatformAvailability;
}

/**
 * Displays platform availability metrics including status,
 * last check time, and check statistics.
 */
export const AvailabilityMetrics = ({ availability }: AvailabilityMetricsProps) => {
  const { status, lastCheck, lastSuccessfulCheck, totalChecks, successfulChecks, lastCheckDurationMs } = availability;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Status
        </h3>
        <div className="mt-1 flex items-center">
          <StatusBadge status={status} />
        </div>
      </div>

      <div>
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Last Check
        </h3>
        <p className="mt-1 text-sm text-gray-900">
          {lastCheck ? formatDateTime(lastCheck) : 'N/A'}
        </p>
      </div>

      <div>
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Last Successful Check
        </h3>
        <p className="mt-1 text-sm text-gray-900">
          {lastSuccessfulCheck ? formatDateTime(lastSuccessfulCheck) : 'N/A'}
        </p>
      </div>

      <div>
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Check Duration
        </h3>
        <p className="mt-1 text-sm text-gray-900">
          {lastCheckDurationMs !== null ? `${lastCheckDurationMs} ms` : 'N/A'}
        </p>
      </div>

      <div>
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Total Checks
        </h3>
        <p className="mt-1 text-sm text-gray-900">{totalChecks}</p>
      </div>

      <div>
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Successful Checks
        </h3>
        <p className="mt-1 text-sm text-gray-900">{successfulChecks}</p>
      </div>
    </div>
  );
};
