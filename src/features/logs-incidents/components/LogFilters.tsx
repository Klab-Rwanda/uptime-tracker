import { LogLevel } from '../types/logsIncidents.types';

interface LogFilterProps {
  level: LogLevel | 'all';
  platformId: string | null | 'all';
  startDate: string | null;
  endDate: string | null;
  platforms: { id: string; name: string }[];
  onChange: (filters: Partial<{
    level: LogLevel | undefined;
    platformId: string | null | undefined;
    startDate: string | null;
    endDate: string | null;
  }>) => void;
}

/**
 * Filter controls for logs: severity level, platform, and date range.
 */
export const LogFilters = ({
  level,
  platformId,
  startDate,
  endDate,
  platforms,
  onChange,
}: LogFilterProps) => {
  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      level: e.target.value === 'all' ? undefined : (e.target.value as LogLevel),
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

  const severityOptions: { label: string; value: LogLevel | 'all' }[] = [
    { label: 'All Severity', value: 'all' },
    { label: 'INFO', value: 'INFO' },
    { label: 'WARNING', value: 'WARNING' },
    { label: 'ERROR', value: 'ERROR' },
    { label: 'DEBUG', value: 'DEBUG' },
    { label: 'TRACE', value: 'TRACE' },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
        <label className="text-sm font-medium text-gray-700">Severity:</label>
        <select
          value={level}
          onChange={handleLevelChange}
          className="block w-full sm:w-48 pl-3 pr-10 py-2 text-sm bg-white border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
        >
          {severityOptions.map((option) => (
            <option key={option.value} value={option.value} className="text-sm">
              {option.label}
            </option>
          ))}
        </select>

        <label className="text-sm font-medium text-gray-700 ml-4 sm:ml-0">Platform:</label>
        <select
          value={platformId ?? 'all'}
          onChange={handlePlatformChange}
          className="block w-full sm:w-48 pl-3 pr-10 py-2 text-sm bg-white border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
        >
          <option value="all">All Platforms</option>
          {platforms.map((platform) => (
            <option key={platform.id} value={platform.id} className="text-sm">
              {platform.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
        <label className="text-sm font-medium text-gray-700">From:</label>
        <input
          type="date"
          value={startDate ?? ''}
          onChange={handleStartDateChange}
          className="block w-full sm:w-40 pl-3 py-2 text-sm bg-white border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
        />

        <label className="text-sm font-medium text-gray-700 ml-2 sm:ml-0">To:</label>
        <input
          type="date"
          value={endDate ?? ''}
          onChange={handleEndDateChange}
          className="block w-full sm:w-40 pl-3 py-2 text-sm bg-white border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
        />
      </div>
    </div>
  );
};
