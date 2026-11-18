import { IncidentStatus, IncidentSeverity } from '../types/logsIncidents.types';

interface IncidentFilterProps {
  status: IncidentStatus | 'all';
  severity: IncidentSeverity | 'all';
  platformId: string | null | 'all';
  startDate: string | null;
  endDate: string | null;
  platforms: { id: string; name: string }[];
  onChange: (filters: Partial<{
    status: IncidentStatus | undefined;
    severity: IncidentSeverity | undefined;
    platformId: string | null | undefined;
    startDate: string | null;
    endDate: string | null;
  }>) => void;
}

/**
 * Filter controls for incidents: status, severity, platform, and date range.
 */
export const IncidentFilters = ({
  status,
  severity,
  platformId,
  startDate,
  endDate,
  platforms,
  onChange,
}: IncidentFilterProps) => {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      status: e.target.value === 'all' ? undefined : (e.target.value as IncidentStatus),
    });
  };

  const handleSeverityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      severity: e.target.value === 'all' ? undefined : (e.target.value as IncidentSeverity),
    });
  };

  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      platformId: e.target.value === 'all' ? null : e.target.value,
    });
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ startDate: e.target.value });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ endDate: e.target.value });
  };

  const statusOptions: { label: string; value: IncidentStatus | 'all' }[] = [
    { label: 'All Status', value: 'all' },
    { label: 'Open', value: 'open' },
    { label: 'Investigating', value: 'investigating' },
    { label: 'Resolved', value: 'resolved' },
    { label: 'Closed', value: 'closed' },
  ];

  const severityOptions: { label: string; value: IncidentSeverity | 'all' }[] = [
    { label: 'All Severity', value: 'all' },
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Critical', value: 'critical' },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-start gap-4">
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 w-full min-w-0 flex-1">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <select
            value={status}
            onChange={handleStatusChange}
            className="block w-full pl-3 pr-10 py-2 text-sm bg-white border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value} className="text-sm">
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1 min-w-0 flex-1 ml-4 sm:ml-0">
          <label className="text-sm font-medium text-gray-700">Severity:</label>
          <select
            value={severity}
            onChange={handleSeverityChange}
            className="block w-full pl-3 pr-10 py-2 text-sm bg-white border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
          >
            {severityOptions.map((option) => (
              <option key={option.value} value={option.value} className="text-sm">
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1 min-w-0 flex-1 ml-4 sm:ml-0">
          <label className="text-sm font-medium text-gray-700">Platform:</label>
          <select
            value={platformId ?? 'all'}
            onChange={handlePlatformChange}
            className="block w-full pl-3 pr-10 py-2 text-sm bg-white border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
          >
            <option value="all">All Platforms</option>
            {platforms.map((platform) => (
              <option key={platform.id} value={platform.id} className="text-sm">
                {platform.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 w-full min-w-0 flex-1">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <label className="text-sm font-medium text-gray-700">From:</label>
          <input
            type="date"
            value={startDate ?? ''}
            onChange={handleStartDateChange}
            className="block w-full pl-3 py-2 text-sm bg-white border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-1 min-w-0 flex-1 ml-2 sm:ml-0 mt-2 sm:mt-0">
          <label className="text-sm font-medium text-gray-700">To:</label>
          <input
            type="date"
            value={endDate ?? ''}
            onChange={handleEndDateChange}
            className="block w-full pl-3 py-2 text-sm bg-white border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
          />
        </div>
      </div>
    </div>
  );
};
