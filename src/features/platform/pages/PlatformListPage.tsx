import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlatforms } from '../';
import { platformService } from '../services/platformService';
import { Platform } from '../types/platform.types';
import { PlatformTable } from '../components/PlatformTable';
import { PlatformFilter } from '../components/PlatformFilter';
import { PlatformSearch } from '../components/PlatformSearch';

/**
 * Platform listing page.
 * Displays platforms with search, filtering, assignment, and pagination.
 * Matches the client list page design.
 */
export const PlatformListPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState<'all' | Platform['status']>('all');
  const [clientId, setClientId] = useState<string | null | 'all'>('all');
  const [page] = useState(1);
  const [limit] = useState(10);

  const {
    platforms,
    total,
    loading,
    refreshing,
    error,
    updateFilters,
    refetch,
  } = usePlatforms({
    search: searchQuery.trim() || undefined,
    status: status === 'all' ? undefined : status,
    clientId: clientId === 'all' ? undefined : clientId,
    page,
    limit,
  });

  // Debounce search so it doesn't refetch on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({ search: searchQuery });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, updateFilters]);

  const totalPages = Math.ceil(total / (limit ?? 10));

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="mt-1 text-gray-500">Manage your monitored platforms.</p>
          </div>
          <button
            onClick={() => navigate('/platforms/add')}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm transition-colors"
          >
            Add Platform
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="bg-white shadow rounded-lg border border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Platforms
            </p>
            <p className="text-2xl font-semibold text-gray-900">{total}</p>
          </div>
          <div className="bg-white shadow rounded-lg border border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Online
            </p>
            <p className="text-2xl font-semibold text-gray-900">
              {platforms.filter((p) => p.status === 'online').length}
            </p>
          </div>
          <div className="bg-white shadow rounded-lg border border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Offline
            </p>
            <p className="text-2xl font-semibold text-gray-900">
              {platforms.filter((p) => p.status === 'offline').length}
            </p>
          </div>
          <div className="bg-white shadow rounded-lg border border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Degraded
            </p>
            <p className="text-2xl font-semibold text-gray-900">
              {platforms.filter((p) => p.status === 'degraded').length}
            </p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="w-full sm:w-96">
              <PlatformSearch
                value={searchQuery}
                onChange={(val) => setSearchQuery(val)}
              />
            </div>
            <div>
              <PlatformFilter
                status={status}
                clientId={clientId}
                onChange={(filters) => {
                  setStatus(filters.status ?? 'all');
                  setClientId(filters.clientId ?? 'all');
                  setSearchQuery('');
                }}
              />
            </div>
          </div>

          {refreshing && (
            <div className="flex justify-center py-4">
              <p className="text-sm text-gray-500">Searching...</p>
            </div>
          )}

          {loading && (
            <div className="flex justify-center py-8">
              <p className="text-sm text-gray-500">Loading platforms...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h3 className="text-red-800 font-medium text-sm">Error loading platforms</h3>
              <p className="mt-1 text-red-600 text-sm">{error.message}</p>
              <button
                onClick={() => updateFilters({})}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && platforms.length === 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500 text-sm">
                {searchQuery || status !== 'all' || clientId !== 'all' || page > 1
                  ? 'No platforms match your current filters.'
                  : 'No platforms found.'}
              </p>
            </div>
          )}

          {!loading && !error && platforms.length > 0 && (
            <>
              <PlatformTable
                platforms={platforms}
                onEdit={(id) => {
                  updateFilters({ page: 1, limit });
                  window.location.href = `/platforms/edit/${id}`;
                }}
                onDelete={async (id) => {
                  if (confirm('Are you sure you want to delete this platform?')) {
                    await platformService.deletePlatform(id);
                    refetch();
                  }
                }}
                onAssignClient={async (id) => {
                  const clientId = prompt('Enter client ID to assign:');
                  if (clientId) {
                    await platformService.assignClient(id, clientId || null);
                    refetch();
                  }
                }}
                onView={(id) => {
                  updateFilters({ page: 1, limit });
                  window.location.href = `/platforms/${id}`;
                }}
              />

              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex -space-x-px">
                    <button
                      onClick={() =>
                        updateFilters({ page: Math.max(1, page - 1) })
                      }
                      disabled={page <= 1}
                      className={page <= 1
                        ? 'px-3 py-2 ml-1 text-sm font-medium bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'px-3 py-2 ml-1 text-sm font-medium bg-white text-indigo-600 border border-gray-300 rounded-l-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                      }
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        updateFilters({ page: Math.min(totalPages, page + 1) })
                      }
                      disabled={page >= totalPages}
                      className={page >= totalPages
                        ? 'px-3 py-2 mr-1 text-sm font-medium bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'px-3 py-2 mr-1 text-sm font-medium bg-white text-indigo-600 border border-gray-300 rounded-r-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                      }
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
