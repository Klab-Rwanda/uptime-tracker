import { useParams } from 'react-router-dom';
import { useIncident } from '../hooks/useIncident';
import { formatDateTime, formatDuration } from '../utils/logsIncidents.utils';
import { IncidentStatusBadge } from '../components/IncidentStatusBadge';
import { LogSeverityBadge } from '../components/LogSeverityBadge';
import { LogTable } from '../components/LogTable';

/**
 * Incident details page.
 * Displays incident details, affected platform link, timing, duration, status,
 * and related logs for the affected platform.
 */
export const IncidentDetailsPage = () => {
  const { incidentId } = useParams<{ incidentId: string }>();
  const {
    incident,
    relatedLogs,
    loading,
    error,
    refetch,
    resolve,
  } = useIncident(incidentId ?? '');

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-500">Loading incident details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-sm text-red-600">{error.message}</p>
          <button
            onClick={refetch}
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-500">Incident not found.</p>
        </div>
      </div>
    );
  }

  const handleResolve = async () => {
    if (window.confirm('Mark this incident as resolved?')) {
      try {
        await resolve();
      } catch {
        // Error surfaced by hook state
      }
    }
  };
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <button
          onClick={() => (window.location.href = '/incidents')}
          className="text-sm text-indigo-600 hover:text-indigo-500 mb-3"
        >
          ← Back to incidents
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{incident.title}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {incident.platformName || `Platform #${incident.platformId}`}
        </p>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200 p-6 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <IncidentStatusBadge status={incident.status} />
          {incident.severity && (
            <LogSeverityBadge level={incident.severity} />
          )}
          <span className="text-sm text-gray-500">
            Affected platform:{' '}
            <button
              onClick={() =>
                (window.location.href = `/platforms/${incident.platformId}`)
              }
              className="text-indigo-600 hover:text-indigo-500 underline"
            >
              {incident.platformName || `Platform #${incident.platformId}`}
            </button>
          </span>
        </div>

        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-2">Description</h2>
          <p className="text-sm text-gray-900">{incident.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Start Time
            </h3>
            <p className="mt-1 text-sm text-gray-900">
              {formatDateTime(incident.startTime)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Recovery Time
            </h3>
            <p className="mt-1 text-sm text-gray-900">
              {incident.recoveryTime ? formatDateTime(incident.recoveryTime) : '—'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duration
            </h3>
            <p className="mt-1 text-sm text-gray-900">
              {incident.duration !== null && incident.duration !== undefined
                ? formatDuration(incident.duration)
                : '—'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </h3>
            <p className="mt-1 text-sm text-gray-900 capitalize">
              {incident.status}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 flex gap-3">
          {incident.status !== 'resolved' && (
            <button
              onClick={handleResolve}
              className="inline-flex items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Mark as Resolved
            </button>
          )}
          <button
            onClick={refetch}
            className="inline-flex items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {relatedLogs.length > 0 && (
        <div className="mt-8 bg-white shadow rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900">
              Related Logs (Affected Platform)
            </h2>
          </div>
          <LogTable logs={relatedLogs} />
        </div>
      )}
    </div>
  );
};

