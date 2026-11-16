import { useState, useEffect } from 'react';
import { clientService } from '../../client/services/clientService';
import { Client } from '../../client/types/client.types';

interface ClientSelectProps {
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
}

/**
 * Dropdown for selecting a client to assign to a platform.
 * Populates options using the available client API.
 */
export const ClientSelect = ({ value, onChange, label = 'Client' }: ClientSelectProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clientService
      .getClients({ limit: 100 })
      .then((response) => {
        setClients(response.data);
      })
      .catch(() => {
        setClients([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const clientName = clients.find((c) => c.id === value)?.name ?? null;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value ? e.target.value : null)}
        className="w-full pl-3 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="">None (unassigned)</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>
      {clientName && (
        <p className="mt-1 text-xs text-gray-500">Selected: {clientName}</p>
      )}
      {loading && <p className="mt-1 text-xs text-gray-400">Loading clients...</p>}
    </div>
  );
};