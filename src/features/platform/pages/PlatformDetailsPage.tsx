import { useParams } from 'react-router-dom';
import { platformService, usePlatform } from '../';
import { StatusBadge } from '../components/StatusBadge';

/**
 * Platform details page.
 * Displays full details of a single platform.
 */
export const PlatformDetailsPage = () => {
  const { platformId } = useParams<{ platformId: string }>();
  const { platform, loading, error, refetch } = usePlatform(platformId ?? '');

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-500">Loading platform details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
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

  if (!platform) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-500">Platform not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => (window.location.href = '/platforms')}
          className="text-sm text-indigo-600 hover:text-indigo-500 mb-3"
        >
          ← Back to platforms
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{platform.name}</h1>
        <p className="text-sm text-gray-500 mt-1">{platform.url}</p>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200 p-6 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={platform.status} />
          <span className="text-sm text-gray-500">
            Client: {platform.clientName || 'Unassigned'}
          </span>
        </div>

        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-2">Description</h2>
          <p className="text-sm text-gray-900">{platform.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Monitoring Interval
            </h3>
            <p className="mt-1 text-sm text-gray-900">{platform.monitoringInterval} seconds</p>
          </div>
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Checked
            </h3>
            <p className="mt-1 text-sm text-gray-900">
              {platform.lastChecked ? new Date(platform.lastChecked).toLocaleString() : 'N/A'}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Response Time
            </h3>
            <p className="mt-1 text-sm text-gray-900">
              {platform.responseTime !== null ? `${platform.responseTime} ms` : 'N/A'}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </h3>
            <p className="mt-1 text-sm text-gray-900 capitalize">{platform.status}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 flex gap-3">
          <button
            onClick={() => (window.location.href = `/platforms/edit/${platform.id}`)}
            className="inline-flex items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
          >
            Edit Platform
          </button>
          <button
            onClick={() => {
              if (confirm('Remove this platform from the assigned client?')) {
                platformService.assignClient(platform.id, null).then(refetch);
              }
            }}
            className="inline-flex items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
          >
            Unassign Client
          </button>
        </div>
      </div>
    </div>
  );
};