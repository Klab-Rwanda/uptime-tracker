import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogs } from '../hooks/useLogs';
import { LogLevel } from '../types/logsIncidents.types';
import { LogTable } from '../components/LogTable';
import { LogFilters } from '../components/LogFilters';
import { LogSearch } from '../components/LogSearch';
import { platformService } from '../../platform';
import { Platform } from '../../platform/types/platform.types';

/**
 * Logs listing page.
 * Displays log entries with search, severity/platform/date-range filtering, and pagination.
 */
export const LogsListPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [level, setLevel] = useState<LogLevel | 'all'>('all');
  const [platformId, setPlatformId] = useState<string | null | 'all'>('all');
  const [startDate, setStartDate] = useState<string | null>('');
  const [endDate, setEndDate] = useState<string | null>('');
  const [page] = useState(1);
  const [limit] = useState(10);
  const [platforms, setPlatforms] = useState<Platform[]>([]);

  const {
    logs,
    total,
    loading,
    refreshing,
    error,
    updateFilters,
    refetch,
  } = useLogs({
    search: searchQuery.trim() || undefined,
    level: level === 'all' ? undefined : level,
    platformId: platformId === 'all' ? undefined : platformId,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    page,
    limit,
  });

  // Load platforms for the filter dropdown
  useEffect(() => {
    platformService
      .getPlatforms()
      .then((response) => setPlatforms(response.data))
      .catch(() => setPlatforms([]));
  }, []);

  // Debounce search so it doesn't refetch on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({ search: searchQuery });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, updateFilters]);

  const totalPages = Math.ceil(total / (limit ?? 10));

  if (loading) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error loading logs</h3>
          <p className="mt-1 text-red-600">{error.message}</p>
          <button
            onClick={refetch}
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Logs</h2>
            <p className="mt-1 text-gray-500">
              View and filter system log entries.
            </p>
          </div>
          <button
            onClick={refetch}
            className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm transition-colors"
          >
            Refresh
          </button>
        </div>

        <div className="bg-white shadow rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="w-full sm:w-96">
              <LogSearch
                value={searchQuery}
                onChange={(val) => setSearchQuery(val)}
              />
            </div>
            <div className="w-full sm:w-auto">
              <LogFilters
                level={level}
                platformId={platformId}
                startDate={startDate}
                endDate={endDate}
                platforms={platforms.map((p) => ({ id: p.id, name: p.name }))}
                onChange={(next) => {
                  if (next.level !== undefined) setLevel(next.level);
                  if (next.platformId !== undefined)
                    setPlatformId(next.platformId);
                  if (next.startDate !== undefined)
                    setStartDate(next.startDate);
                  if (next.endDate !== undefined) setEndDate(next.endDate);
                  updateFilters({
                    level: next.level,
                    platformId: next.platformId,
                    startDate: next.startDate,
                    endDate: next.endDate,
                  });
                }}
              />
            </div>
          </div>

          {refreshing && (
            <div className="flex justify-center py-4">
              <p className="text-sm text-gray-500">Filtering logs...</p>
            </div>
          )}

          {!loading && !error && logs.length === 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500 text-sm">
                {searchQuery || level !== 'all' || platformId !== 'all' || startDate || endDate
                  ? 'No logs match your current filters.'
                  : 'No logs found.'}
              </p>
            </div>
          )}

          {!loading && !error && logs.length > 0 && (
            <>
              <LogTable
                logs={logs}
                onView={(id) => navigate(`/logs/${id}`)}
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
                        : 'px-3 py-2 ml-1 text-sm font-medium bg-white text-indigo-600 border border-gray-300 rounded-l-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500'}
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
                        : 'px-3 py-2 mr-1 text-sm font-medium bg-white text-indigo-600 border border-gray-300 rounded-r-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500'}
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

