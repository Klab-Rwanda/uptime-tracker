import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { platformService } from '../../platform/services/platformService';
import { Platform } from '../../platform/types/platform.types';

const statusStyles: Record<Platform['status'], string> = {
  online: 'bg-emerald-500',
  offline: 'bg-red-500',
  degraded: 'bg-amber-500',
  unknown: 'bg-gray-300',
};

const statusTextStyles: Record<Platform['status'], string> = {
  online: 'bg-emerald-50 text-emerald-700',
  offline: 'bg-red-50 text-red-700',
  degraded: 'bg-amber-50 text-amber-700',
  unknown: 'bg-gray-100 text-gray-600',
};

const formatTimestamp = (value: string | null) => {
  if (!value) return 'Never checked';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
};

export const DashboardPage = () => {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadPlatforms = useCallback(async () => {
    setError(null);
    try {
      const response = await platformService.getPlatforms({ limit: 1000 });
      setPlatforms(response.data);
      setLastUpdated(new Date());
    } catch {
      setError('Platform health could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPlatforms();
  }, [loadPlatforms]);

  const total = platforms.length;
  const counts = {
    online: platforms.filter((platform) => platform.status === 'online').length,
    offline: platforms.filter((platform) => platform.status === 'offline').length,
    degraded: platforms.filter((platform) => platform.status === 'degraded').length,
    unknown: platforms.filter((platform) => platform.status === 'unknown').length,
  };
  const checkedCount = total - counts.unknown;
  const availability = checkedCount
    ? Math.round(((counts.online + counts.degraded) / checkedCount) * 100)
    : null;
  const responseTimes = platforms
    .map((platform) => platform.responseTime)
    .filter((time): time is number => time !== null);
  const averageResponseTime = responseTimes.length
    ? Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length)
    : null;
  const recentPlatforms = [...platforms]
    .sort((a, b) => {
      if (!a.lastChecked && !b.lastChecked) return 0;
      if (!a.lastChecked) return 1;
      if (!b.lastChecked) return -1;
      return new Date(b.lastChecked).getTime() - new Date(a.lastChecked).getTime();
    })
    .slice(0, 5);
  const circumference = 2 * Math.PI * 42;

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-indigo-600">Operations</p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-950 sm:text-3xl">System overview</h1>
          <p className="mt-2 text-sm text-gray-500">An overview of your saved services and their latest recorded status.</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-xs text-gray-500" aria-live="polite">
            {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : ' '}
          </p>
          <button
            type="button"
            onClick={() => void loadPlatforms()}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M16.5 9.5a6.5 6.5 0 0 0-11.1-4.6L3.5 6.8M3.5 6.8V3.5m0 3.3h3.3M3.5 10.5a6.5 6.5 0 0 0 11.1 4.6l1.9-1.9m0 0v3.3m0-3.3h-3.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Refresh
          </button>
          <Link to="/platforms/add" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Add platform
          </Link>
        </div>
      </section>

      {error && (
        <div role="alert" className="flex flex-col gap-3 border-l-4 border-red-500 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-red-800">{error}</p>
          <button type="button" onClick={() => void loadPlatforms()} className="text-left text-sm font-semibold text-red-800 underline">Try again</button>
        </div>
      )}

      <section aria-label="Platform health summary" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Monitored platforms', value: total, tone: 'text-gray-950', marker: 'bg-indigo-600' },
          { label: 'Online', value: counts.online, tone: 'text-emerald-700', marker: 'bg-emerald-500' },
          { label: 'Offline', value: counts.offline, tone: 'text-red-700', marker: 'bg-red-500' },
          { label: 'Degraded', value: counts.degraded, tone: 'text-amber-700', marker: 'bg-amber-500' },
        ].map((metric) => (
          <article key={metric.label} className="border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${metric.marker}`} />
              <p className="text-sm font-medium text-gray-500">{metric.label}</p>
            </div>
            <p className={`mt-3 text-3xl font-semibold tabular-nums ${metric.tone}`}>
              {loading ? <span className="text-gray-300">--</span> : metric.value}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-5">
        <article className="border border-gray-200 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Current availability</h2>
              <p className="mt-1 text-sm text-gray-500">Based on platforms with a reported status</p>
            </div>
            <span className="rounded bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">Snapshot</span>
          </div>
          <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
            <div className="relative h-36 w-36 shrink-0">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100" role="img" aria-label={availability === null ? 'Availability unavailable' : `${availability}% current availability`}>
                <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="9" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={`${circumference * (availability ?? 0) / 100} ${circumference}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-semibold tabular-nums text-gray-950">{loading ? '--' : availability === null ? 'N/A' : `${availability}%`}</span>
                <span className="mt-1 text-xs text-gray-500">available now</span>
              </div>
            </div>
            <div className="w-full max-w-xs space-y-3">
              {([
                ['Online', counts.online, 'bg-emerald-500'],
                ['Degraded', counts.degraded, 'bg-amber-500'],
                ['Offline', counts.offline, 'bg-red-500'],
                ['Unknown', counts.unknown, 'bg-gray-300'],
              ] as const).map(([label, count, color]) => (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-gray-600">{label}</span>
                    <span className="font-medium tabular-nums text-gray-900">{loading ? '--' : count}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${total ? count / total * 100 : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-5 border-t border-gray-100 pt-4 text-xs leading-5 text-gray-500">
            Availability counts online and degraded services as reachable. Historical uptime will appear when probe history is recorded.
          </p>
        </article>

        <article className="border border-gray-200 bg-white p-5 shadow-sm sm:p-6 lg:col-span-3">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Monitoring summary</h2>
              <p className="mt-1 text-sm text-gray-500">Latest data collected across your services</p>
            </div>
            <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">Current snapshot</span>
          </div>
          <div className="mt-5 grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="py-4 sm:px-4 sm:py-2 sm:first:pl-0">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Platforms checked</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-gray-950">{loading ? '--' : `${checkedCount} / ${total}`}</p>
              <p className="mt-1 text-xs text-gray-500">{counts.unknown} awaiting first check</p>
            </div>
            <div className="py-4 sm:px-4 sm:py-2">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Avg. response time</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-gray-950">{loading ? '--' : averageResponseTime === null ? 'N/A' : `${averageResponseTime} ms`}</p>
              <p className="mt-1 text-xs text-gray-500">Across reported measurements</p>
            </div>
            <div className="py-4 sm:px-4 sm:py-2 sm:last:pr-0">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Incident status</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-gray-950">No feed</p>
              <p className="mt-1 text-xs text-gray-500">Incident tracking not connected</p>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="border border-gray-200 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Recent platform checks</h2>
              <p className="mt-1 text-sm text-gray-500">Most recently checked services</p>
            </div>
            <Link to="/platforms" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">All platforms</Link>
          </div>
          {loading ? (
            <p className="px-5 py-8 text-sm text-gray-500 sm:px-6">Loading platform checks...</p>
          ) : recentPlatforms.length ? (
            <ul className="divide-y divide-gray-100">
              {recentPlatforms.map((platform) => (
                <li key={platform.id} className="flex min-w-0 items-center gap-3 px-5 py-4 sm:px-6">
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusStyles[platform.status]}`} />
                  <div className="min-w-0 flex-1">
                    <Link to={`/platforms/${platform.id}`} className="block truncate text-sm font-medium text-gray-900 hover:text-indigo-600">{platform.name}</Link>
                    <p className="mt-0.5 truncate text-xs text-gray-500">{platform.url}</p>
                  </div>
                  <span className={`hidden rounded px-2 py-1 text-xs font-medium capitalize sm:inline-flex ${statusTextStyles[platform.status]}`}>{platform.status}</span>
                  <span className="w-24 shrink-0 text-right text-xs tabular-nums text-gray-500 sm:w-32">{formatTimestamp(platform.lastChecked)}</span>
                  <span className="hidden w-16 shrink-0 text-right text-xs tabular-nums text-gray-700 md:block">{platform.responseTime === null ? '--' : `${platform.responseTime} ms`}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-5 py-10 text-center sm:px-6">
              <p className="text-sm font-medium text-gray-900">No platforms monitored yet</p>
              <p className="mt-1 text-sm text-gray-500">Add a platform to start seeing health checks here.</p>
              <Link to="/platforms/add" className="mt-4 inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-500">Add your first platform</Link>
            </div>
          )}
        </article>

        <article className="border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4 sm:px-6">
            <h2 className="text-base font-semibold text-gray-900">Recent incidents</h2>
            <p className="mt-1 text-sm text-gray-500">Incident activity</p>
          </div>
          <div className="flex min-h-48 flex-col items-center justify-center px-6 py-8 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M10 6v4m0 3h.01M8.3 3.7 2.6 13.5A1.7 1.7 0 0 0 4 16h12a1.7 1.7 0 0 0 1.4-2.5L11.7 3.7a2 2 0 0 0-3.4 0Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className="mt-3 text-sm font-medium text-gray-900">No incident history available</p>
            <p className="mt-1 max-w-xs text-xs leading-5 text-gray-500">Incident summaries will appear here once incident tracking is connected.</p>
          </div>
        </article>
      </section>
    </main>
  );
};