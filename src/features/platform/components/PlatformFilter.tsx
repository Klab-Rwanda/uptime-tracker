import { Platform, PlatformFilters } from '../types/platform.types';

interface PlatformFilterProps {
  status: Platform['status'] | 'all';
  clientId: string | null | 'all';
  onChange: (filters: Partial<PlatformFilters>) => void;
}

/**
 * Filter control for platform status and client assignment.
 */
export const PlatformFilter = ({ status, clientId, onChange }: PlatformFilterProps) => {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ status: e.target.value === 'all' ? undefined : (e.target.value as Platform['status']) });
  };

  const handleClientIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ clientId: e.target.value === 'all' ? null : (e.target.value as string) });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
      <label className="text-sm font-medium text-gray-700">Status:</label>
      <select
        value={status}
        onChange={handleStatusChange}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-sm bg-white border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
      >
        <option value="all">All Statuses</option>
        <option value="online">Online</option>
        <option value="offline">Offline</option>
        <option value="degraded">Degraded</option>
        <option value="unknown">Unknown</option>
      </select>

      <label className="text-sm font-medium text-gray-700 ml-4">Client:</label>
      <select
        value={clientId ?? 'all'}
        onChange={handleClientIdChange}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-sm bg-white border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
      >
        <option value="all">All Clients</option>
        <option value="">Unassigned</option>
      </select>
    </div>
  );
};