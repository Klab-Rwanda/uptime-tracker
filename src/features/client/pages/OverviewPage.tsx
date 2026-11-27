import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock3,
  Plus,
  RefreshCw,
  Server,
  ShieldCheck,
  Wifi,
  WifiOff,
  Zap,
} from 'lucide-react';
import {
  DashboardIncident,
  DashboardMonitor,
  DashboardSummary,
  dashboardService,
  Organization,
} from '../services/dashboardService';

type MonitorHealthStatus = 'online' | 'offline' | 'degraded' | 'unknown' | 'maintenance';

const STATUS_STYLES: Record<
  MonitorHealthStatus,
  { label: string; dot: string; text: string; bar: string }
> = {
  online: {
    label: 'Online',
    dot: 'bg-green-500',
    text: 'text-green-700 dark:text-green-400',
    bar: 'bg-green-500',
  },
  offline: {
    label: 'Offline',
    dot: 'bg-red-500',
    text: 'text-red-700 dark:text-red-400',
    bar: 'bg-red-500',
  },
  degraded: {
    label: 'Degraded',
    dot: 'bg-amber-500',
    text: 'text-amber-700 dark:text-amber-400',
    bar: 'bg-amber-500',
  },
  unknown: {
    label: 'Pending / paused',
    dot: 'bg-gray-400',
    text: 'text-gray-600 dark:text-gray-400',
    bar: 'bg-gray-300 dark:bg-gray-600',
  },
  maintenance: {
    label: 'Maintenance',
    dot: 'bg-blue-500',
    text: 'text-blue-700 dark:text-blue-400',
    bar: 'bg-blue-500',
  },
};

const STATUS_ORDER: MonitorHealthStatus[] = [
  'online',
  'degraded',
  'offline',
  'maintenance',
  'unknown',
];

interface MetricCardProps {
  label: string;
  value: number | string;
  description: string;
  icon: typeof Server;
  accent: string;
}

const MetricCard = ({
  label,
  value,
  description,
  icon: Icon,
  accent,
}: MetricCardProps) => {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}>
          <Icon size={19} />
        </span>
      </div>
      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">{description}</p>
    </>
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {content}
    </div>
  );
};

const monitorStatus = (status: string): MonitorHealthStatus => {
  if (status === 'up') return 'online';
  if (status === 'down') return 'offline';
  if (status === 'maintenance') return 'maintenance';
  return 'unknown';
};

const formatIncidentTime = (value: string) => {
  const timestamp = new Date(value);
  return Number.isNaN(timestamp.getTime())
    ? 'Time unavailable'
    : timestamp.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
};

export const OverviewPage = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [monitors, setMonitors] = useState<DashboardMonitor[]>([]);
  const [incidents, setIncidents] = useState<DashboardIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [organizationName, setOrganizationName] = useState('');
  const [creatingOrganization, setCreatingOrganization] = useState(false);

  const loadData = useCallback(async (organizationId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const availableOrganizations = await dashboardService.getOrganizations();
      setOrganizations(availableOrganizations);

      const storedOrganizationId = localStorage.getItem('uptime_selected_organization');
      const selectedOrganization =
        availableOrganizations.find((organization) => organization.id === organizationId) ??
        availableOrganizations.find((organization) => organization.id === storedOrganizationId) ??
        availableOrganizations[0];

      if (!selectedOrganization) {
        setSelectedOrganizationId(null);
        setSummary(null);
        setMonitors([]);
        setIncidents([]);
        localStorage.removeItem('uptime_selected_organization');
        return;
      }

      setSelectedOrganizationId(selectedOrganization.id);
      localStorage.setItem('uptime_selected_organization', selectedOrganization.id);

      const [summaryResponse, monitorResponse, incidentResponse] = await Promise.all([
        dashboardService.getSummary(selectedOrganization.id),
        dashboardService.getMonitors(selectedOrganization.id),
        dashboardService.getRecentIncidents(selectedOrganization.id),
      ]);
      setSummary(summaryResponse);
      setMonitors(monitorResponse);
      setIncidents(incidentResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const statusCounts = useMemo<Record<MonitorHealthStatus, number | null>>(
    () => ({
      online: summary?.status_counts.up ?? 0,
      offline: summary?.status_counts.down ?? 0,
      degraded: null,
      unknown:
        (summary?.status_counts.pending ?? 0) + (summary?.status_counts.paused ?? 0),
      maintenance: summary?.status_counts.maintenance ?? 0,
    }),
    [summary],
  );

  const openIncidents = incidents.filter(
    (incident) => incident.status !== 'resolved' && incident.status !== 'closed',
  );
  const platformTotal = summary?.total_monitors ?? 0;
  const monitorNames = useMemo(
    () => new Map(monitors.map((monitor) => [monitor.id, monitor.name])),
    [monitors],
  );

  const handleCreateOrganization = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = organizationName.trim();
    if (!name) return;

    setCreatingOrganization(true);
    setError(null);
    try {
      const organization = await dashboardService.createOrganization(name);
      setOrganizationName('');
      await loadData(organization.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create organization.');
    } finally {
      setCreatingOrganization(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <RefreshCw size={17} className="animate-spin text-indigo-600" />
          Loading dashboard…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30">
          <h2 className="font-semibold text-red-800 dark:text-red-300">Dashboard unavailable</h2>
          <p className="mt-1 text-sm text-red-700 dark:text-red-400">{error}</p>
          <button
            type="button"
            onClick={() => void loadData()}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!selectedOrganizationId) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
            <Server size={22} />
          </div>
          <h1 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
            Create your monitoring workspace
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
            The API account does not belong to an organization yet. Create one to view its projects,
            monitors, and incidents.
          </p>
          <form onSubmit={handleCreateOrganization} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              aria-label="Organization name"
              required
              minLength={1}
              maxLength={120}
              value={organizationName}
              onChange={(event) => setOrganizationName(event.target.value)}
              placeholder="Organization name"
              className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />
            <button
              type="submit"
              disabled={creatingOrganization}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={16} />
              {creatingOrganization ? 'Creating…' : 'Create organization'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-7 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              Monitoring overview
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              {organizations.find((organization) => organization.id === selectedOrganizationId)?.name}
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              A live snapshot of your platform health and recent incidents.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {organizations.length > 1 && (
              <label className="sr-only" htmlFor="dashboard-organization">
                Organization
              </label>
            )}
            {organizations.length > 1 && (
              <select
                id="dashboard-organization"
                value={selectedOrganizationId}
                onChange={(event) => void loadData(event.target.value)}
                className="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                {organizations.map((organization) => (
                  <option key={organization.id} value={organization.id}>
                    {organization.name}
                  </option>
                ))}
              </select>
            )}
            <button
              type="button"
              onClick={() => void loadData(selectedOrganizationId)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </section>

        <section aria-label="Platform health summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            label="Total monitors"
            value={platformTotal}
            description="Monitors in this organization"
            icon={Server}
            accent="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300"
          />
          <MetricCard
            label="Online"
            value={statusCounts.online ?? 0}
            description="Responding normally"
            icon={CheckCircle2}
            accent="bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
          />
          <MetricCard
            label="Offline"
            value={statusCounts.offline ?? 0}
            description="Not responding"
            icon={WifiOff}
            accent="bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
          />
          <MetricCard
            label="Degraded"
            value="—"
            description="Not reported by this API"
            icon={Zap}
            accent="bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
          />
          <MetricCard
            label="Open incidents (recent)"
            value={openIncidents.length}
            description="In the latest five incidents"
            icon={AlertCircle}
            accent="bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
          />
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Platform availability
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Current status across {platformTotal} monitors
                </p>
              </div>
            </div>

            {platformTotal === 0 ? (
              <div className="mt-7 rounded-xl border border-dashed border-gray-300 px-5 py-9 text-center dark:border-gray-600">
                <Server size={25} className="mx-auto text-gray-400" />
                <p className="mt-3 text-sm font-medium text-gray-800 dark:text-gray-200">
                  No monitors are configured yet
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Add a monitor to start seeing its health here.
                </p>
              </div>
            ) : (
              <>
                <div
                  className="mt-7 flex h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700"
                  role="img"
                  aria-label={STATUS_ORDER
                    .filter((status) => statusCounts[status] !== null)
                    .map(
                      (status) =>
                        `${statusCounts[status]} ${STATUS_STYLES[status].label.toLowerCase()}`,
                    )
                    .join(', ')}
                >
                  {STATUS_ORDER.map((status) =>
                    statusCounts[status] !== null &&
                    statusCounts[status] > 0 ? (
                      <div
                        key={status}
                        className={STATUS_STYLES[status].bar}
                        style={{
                          width: `${((statusCounts[status] ?? 0) / platformTotal) * 100}%`,
                        }}
                      />
                    ) : null,
                  )}
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {STATUS_ORDER.map((status) => (
                    <div key={status} className="rounded-xl bg-gray-50 p-3 dark:bg-gray-900/60">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${STATUS_STYLES[status].dot}`} />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {STATUS_STYLES[status].label}
                        </span>
                      </div>
                      <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                        {statusCounts[status] ?? '—'}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Uptime
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Verified monitoring history
                </p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
                <ShieldCheck size={19} />
              </span>
            </div>

            <div className="mt-6 flex items-center gap-5">
              <div
                className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-[8px] border-gray-200 dark:border-gray-700"
                role="img"
                aria-label="Uptime percentage is not available"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-xl font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  N/A
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Uptime data isn’t available yet
                </p>
                <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  The monitoring service has not provided historical check data, so an uptime
                  percentage cannot be calculated reliably.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2.5 text-xs text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
              <Activity size={15} />
              Current availability is shown separately from historical uptime.
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-700 sm:px-6">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Recent incidents
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Latest events across your monitors
                </p>
              </div>
            </div>
            {incidents.length === 0 ? (
              <div className="px-5 py-10 text-center sm:px-6">
                <CheckCircle2 size={26} className="mx-auto text-green-500" />
                <p className="mt-3 text-sm font-medium text-gray-800 dark:text-gray-200">
                  No incidents recorded
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  New incidents will appear here when they are created.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {incidents.slice(0, 5).map((incident) => {
                  const isOpen =
                    incident.status !== 'resolved' && incident.status !== 'closed';
                  return (
                    <li key={incident.id}>
                      <div className="flex items-start gap-3 px-5 py-4 sm:px-6">
                        <span
                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                            isOpen
                              ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                          }`}
                        >
                          {isOpen ? <AlertCircle size={17} /> : <CheckCircle2 size={17} />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="truncate text-sm font-medium text-gray-900 dark:text-white">
                              {incident.title}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                isOpen
                                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {incident.status}
                            </span>
                          </span>
                          <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                            <span>{monitorNames.get(incident.monitor_id) || 'Monitor'}</span>
                            <span className="inline-flex items-center gap-1">
                              <Clock3 size={12} />
                              {formatIncidentTime(incident.started_at)}
                            </span>
                          </span>
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-700 sm:px-6">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Monitoring summary
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Latest known status for each monitor
                </p>
              </div>
            </div>
            {monitors.length === 0 ? (
              <div className="px-5 py-10 text-center sm:px-6">
                <Server size={26} className="mx-auto text-gray-400" />
                <p className="mt-3 text-sm font-medium text-gray-800 dark:text-gray-200">
                  Nothing to monitor yet
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Monitor status will appear here when the API has monitor records.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {monitors.slice(0, 5).map((monitor) => {
                  const health = monitorStatus(monitor.status);
                  const status = STATUS_STYLES[health];
                  return (
                    <li key={monitor.id}>
                      <div className="flex items-center gap-3 px-5 py-4 sm:px-6">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                          {health === 'online' ? (
                            <Wifi size={17} />
                          ) : health === 'offline' ? (
                            <WifiOff size={17} />
                          ) : (
                            <Server size={17} />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-gray-900 dark:text-white">
                            {monitor.name}
                          </span>
                          <span className="mt-1 block truncate text-xs text-gray-500 dark:text-gray-400">
                            {monitor.target} · every {monitor.interval_seconds}s
                          </span>
                        </span>
                        <span className={`inline-flex shrink-0 items-center gap-1.5 text-xs font-medium ${status.text}`}>
                          <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default OverviewPage;
