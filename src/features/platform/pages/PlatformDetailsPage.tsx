import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { platformDetailsService } from '../services';
import { StatusBadge } from '../components/StatusBadge';
import { AvailabilityMetrics } from '../components/AvailabilityMetrics';
import { ResponseTimeMetrics } from '../components/ResponseTimeMetrics';
import { MonitoringHistory } from '../components/MonitoringHistory';
import { UptimePercentage } from '../components/UptimePercentage';
import { PlatformMetrics, PlatformAvailability, PlatformMonitoringHistory } from '../types/platformDetails.types';
import { Platform } from '../types/platform.types';
import { formatDateTime } from '../utils/platform.utils';

/**
 * Platform details page.
 * Displays detailed information about a single platform including
 * metrics, availability, monitoring history, and related data.
 */
export const PlatformDetailsPage = () => {
  const navigate = useNavigate();
  const { platformId } = useParams<{ platformId: string }>();
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [metrics, setMetrics] = useState<PlatformMetrics>({
    uptimePercentage: null,
    averageResponseTime: null,
    currentResponseTime: null,
    availabilityInformation: [],
  });
  const [availability, setAvailability] = useState<PlatformAvailability>({
    status: 'unknown',
    lastCheck: null,
    lastSuccessfulCheck: null,
    totalChecks: 0,
    successfulChecks: 0,
    lastCheckDurationMs: null,
  });
  const [history, setHistory] = useState<PlatformMonitoringHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPlatformDetails = async () => {
      if (!platformId) return;

      try {
        setLoading(true);
        setError(null);

        const platformData = await platformDetailsService.getPlatformDetails(platformId);
        setPlatform(platformData);

        const metricsData = await platformDetailsService.getPlatformMetrics(platformId);
        setMetrics(metricsData);

        const availabilityData = await platformDetailsService.getAvailability(platformId);
        setAvailability(availabilityData);

        const historyData = await platformDetailsService.getMonitoringHistory(platformId, 100);
        setHistory(historyData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load platform details'));
      } finally {
        setLoading(false);
      }
    };

    fetchPlatformDetails();
  }, [platformId]);

  if (loading) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading platform details...</p>
        </div>
      </div>
    );
  }

  if (error || !platform) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Platform not found</h3>
          <p className="mt-1 text-red-600">{error?.message}</p>
          <button
            onClick={() => navigate('/platforms')}
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
          >
            Back to platform list
          </button>
        </div>
      </div>
    );
  }

  if (!platform) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-sm text-gray-500">Platform not found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{platform.name}</h1>
          <p className="mt-1 text-gray-500">Platform details</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/platforms/edit/${platform.id}`)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit
          </button>
          <button
            onClick={() => navigate('/platforms')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            Back
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Name
              </p>
              <p className="text-sm text-gray-900 font-medium">{platform.name}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                URL
              </p>
              <p className="text-sm text-gray-900 truncate">{platform.url}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Description
              </p>
              <p className="text-sm text-gray-900">{platform.description}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Status
              </p>
              <div className="flex items-center">
                <StatusBadge status={platform.status} />
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Client
              </p>
              <p className="text-sm text-gray-900">{platform.clientName || 'Unassigned'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Monitoring Interval
              </p>
              <p className="text-sm text-gray-900">{platform.monitoringInterval} seconds</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Last Checked
              </p>
              <p className="text-sm text-gray-900">
                {platform.lastChecked ? formatDateTime(platform.lastChecked) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg border border-gray-200 p-6">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
              Platform Metrics
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <ResponseTimeMetrics metrics={metrics} />
              <UptimePercentage metrics={metrics} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg border border-gray-200 p-6">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
              Availability
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <AvailabilityMetrics availability={availability} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="bg-white shadow rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
              Monitoring History
            </h2>
            <MonitoringHistory history={history} loading={loading} />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center gap-1"
        >
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Refresh
        </button>
      </div>
    </div>
  );
};
