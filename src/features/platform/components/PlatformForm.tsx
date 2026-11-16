import { useState } from 'react';
import { PlatformFormData } from '../types/platform.types';
import { validatePlatformForm } from '../utils/platform.utils';
import { ClientSelect } from './ClientSelect';

interface PlatformFormProps {
  initialData?: PlatformFormData;
  onSubmit: (data: PlatformFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const PlatformForm = ({ initialData, onSubmit, onCancel, loading }: PlatformFormProps) => {
  const [formData, setFormData] = useState<PlatformFormData>({
    name: initialData?.name ?? '',
    url: initialData?.url ?? '',
    description: initialData?.description ?? '',
    status: initialData?.status ?? 'unknown',
    clientId: initialData?.clientId ?? null,
    monitoringInterval: initialData?.monitoringInterval ?? 60,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    field: keyof PlatformFormData,
    value: string | number | null,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { valid, errors: validationErrors } = validatePlatformForm(formData);
    setErrors(validationErrors);
    if (valid) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`mt-1 block w-full pl-3 pr-3 py-2 border leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm rounded-md ${
              errors.name
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300'
            }`}
            placeholder="API Gateway"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">
            URL
          </label>
          <input
            id="url"
            name="url"
            type="url"
            autoComplete="url"
            value={formData.url}
            onChange={(e) => handleChange('url', e.target.value)}
            className={`mt-1 block w-full pl-3 pr-3 py-2 border leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm rounded-md ${
              errors.url
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300'
            }`}
            placeholder="https://api.example.com"
          />
          {errors.url && <p className="mt-1 text-sm text-red-600">{errors.url}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className={`mt-1 block w-full pl-3 pr-3 py-2 border leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm rounded-md ${
            errors.description
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300'
          }`}
          placeholder="Main API gateway for the platform"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="mt-1 block w-full pl-3 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="degraded">Degraded</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        <div>
          <label htmlFor="monitoringInterval" className="block text-sm font-medium text-gray-700">
            Monitoring Interval (seconds)
          </label>
          <input
            id="monitoringInterval"
            name="monitoringInterval"
            type="number"
            min="1"
            value={formData.monitoringInterval}
            onChange={(e) => handleChange('monitoringInterval', Number(e.target.value))}
            className={`mt-1 block w-full pl-3 pr-3 py-2.5 border leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg ${
              errors.monitoringInterval
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300'
            }`}
            placeholder="60"
          />
          {errors.monitoringInterval && (
            <p className="mt-1 text-sm text-red-600">
              {errors.monitoringInterval}
            </p>
          )}
        </div>
      </div>

      <div>
        <ClientSelect
          value={formData.clientId}
          onChange={(val) => handleChange('clientId', val)}
          label="Assign Client"
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 sm:text-sm transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving...' : 'Save Platform'}
        </button>
      </div>
    </form>
  );
};