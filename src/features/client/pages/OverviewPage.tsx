import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Server,
  Activity,
  AlertCircle,
  Bell,
  ChevronRight,
} from 'lucide-react';
import { platformService } from '../../platform/services/platformService';
import { Platform } from '../../platform/types/platform.types';
import { incidentsService } from '../../logs-incidents/services/logsIncidentsService';
import { Incident } from '../../logs-incidents/types/logsIncidents.types';
import { notificationsService } from '../../notifications/services/notificationsService';
import { Notification } from '../../notifications/types/notifications.types';
import { settingsService } from '../services/settingsService';
import { statusLabel, statusColor, formatResponseTime } from '../../platform/utils/platform.utils';

interface SummaryCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  iconColor: string;
  onClick?: () => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  label,
  value,
  icon: Icon,
  iconColor,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white shadow rounded-lg border border-gray-200 p-5 transition-colors cursor-pointer hover:bg-gray-50"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {label}
          </p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColor}`}>
          <Icon size={16} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
};

interface ActivityItem {
  id: string;
  title: string;
  platformName?: string | null;
  timestamp: string;
  icon: React.ElementType;
  iconColor: string;
}

export const OverviewPage = () => {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState('PulseMonitor Workspace');
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        company,
        platformsResponse,
        incidentsResponse,
        notificationsResponse,
      ] = await Promise.all([
        settingsService.getCompany(),
        platformService.getPlatforms(),
        incidentsService.getIncidents({ status: 'open' }),
        notificationsService.getNotifications({ status: 'unread' }),
      ]);
      setCompanyName(company.companyName);
      setPlatforms(platformsResponse.data);
      setIncidents(incidentsResponse.data);
      setNotifications(notificationsResponse.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workspace overview.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openIncidents = incidents.filter(
    (i) => i.status === 'open' || i.status === 'investigating',
  );
  const operationalPlatforms = platforms.filter((p) => p.status === 'online');
  const unreadNotifications = notifications.filter(
    (n) => n.status === 'unread',
  );

  const recentActivity: ActivityItem[] = [
    ...platforms.map((p) => ({
      id: `platform-${p.id}`,
      title: 'Platform registered',
      platformName: p.name,
      timestamp: p.createdAt,
      icon: Server,
      iconColor: 'bg-blue-100 text-blue-600',
    })),
    ...openIncidents.map((i) => ({
      id: `incident-${i.id}`,
      title: i.title,
      platformName: i.platformName ?? null,
      timestamp: i.startTime,
      icon: AlertCircle,
      iconColor: 'bg-red-100 text-red-600',
    })),
    ...unreadNotifications.map((n) => ({
      id: `notification-${n.id}`,
      title: n.title,
      platformName: n.platformName ?? null,
      timestamp: n.timestamp,
      icon: Bell,
      iconColor: 'bg-orange-100 text-orange-600',
    })),
  ].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  ).slice(0, 5);

  if (loading) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading workspace overview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error loading overview</h3>
          <p className="mt-1 text-red-600">{error}</p>
          <button
            onClick={loadData}
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="mb-2">
          <h1 className="text-xl font-bold text-gray-900">{companyName}</h1>
          <p className="mt-1 text-sm text-gray-500">Workspace overview.</p>
        </div>

        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate('/platforms/add')}
            className="inline-flex items-center gap-2 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm transition-colors"
          >
            <Server size={14} strokeWidth={2} />
            Add platform
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <SummaryCard
            label="My platforms"
            value={platforms.length}
            icon={Server}
            iconColor="bg-blue-100 text-blue-600"
            onClick={() => navigate('/platforms')}
          />
          <SummaryCard
            label="Operational"
            value={operationalPlatforms.length}
            icon={Activity}
            iconColor="bg-green-100 text-green-600"
            onClick={() => navigate('/platforms')}
          />
          <SummaryCard
            label="Open incidents"
            value={openIncidents.length}
            icon={AlertCircle}
            iconColor="bg-red-100 text-red-600"
            onClick={() => navigate('/logs')}
          />
          <SummaryCard
            label="Unread notifications"
            value={unreadNotifications.length}
            icon={Bell}
            iconColor="bg-orange-100 text-orange-600"
            onClick={() => navigate('/notifications')}
          />
        </div>

        {/* My platforms section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                My platforms
              </h2>
            </div>
            <a
              href="/platforms"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              View all <ChevronRight size={14} strokeWidth={2} />
            </a>
          </div>
          <div className="border-t border-gray-200 pt-4"></div>

          {platforms.length === 0 ? (
            <div className="mt-6 text-center py-12">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <Server size={32} strokeWidth={2} className="text-blue-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                No platforms yet
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Start monitoring by adding your first platform.
              </p>
              <button
                onClick={() => navigate('/platforms/add')}
                className="inline-flex items-center gap-2 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <Server size={14} strokeWidth={2} />
                Add platform
              </button>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {platforms.slice(0, 5).map((platform) => (
                <Link
                  key={platform.id}
                  to={`/platforms/${platform.id}`}
                  className="flex items-center gap-4 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 flex-shrink-0">
                    <Server size={18} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {platform.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {platform.url}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full ${statusColor(platform.status)}`}
                    >
                      {statusLabel(platform.status)}
                    </span>
                    <span className="text-gray-400">
                      {formatResponseTime(platform.responseTime)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent activity section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Recent activity
              </h2>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4"></div>

          {recentActivity.length === 0 ? (
            <div className="mt-6 text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Activity size={32} strokeWidth={2} className="text-gray-500" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                No activity yet
              </h3>
              <p className="text-sm text-gray-500">
                Recent workspace activity will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div
                    className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${activity.iconColor}`}
                  >
                    <activity.icon size={14} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 leading-tight">
                      {activity.title}
                      {activity.platformName && (
                        <span className="ml-1 text-xs text-gray-500">
                          • {activity.platformName}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;