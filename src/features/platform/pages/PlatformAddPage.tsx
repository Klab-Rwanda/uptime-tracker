import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { platformService, usePlatforms } from '../';
import { PlatformFormData } from '../types/platform.types';
import { PlatformForm } from '../components/PlatformForm';

/**
 * Add platform page.
 * Renders the platform form in create mode.
 */
export const PlatformAddPage = ({ organizationId }: { organizationId?: string }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { refetch } = usePlatforms();

  const handleSubmit = async (data: PlatformFormData) => {
    setLoading(true);
    try {
      await platformService.createPlatform(data, organizationId);
      refetch();
      navigate('/platforms');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create platform');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Platform</h1>
        <p className="text-sm text-gray-500 mt-1">
          Enter the details of the new platform to monitor.
        </p>
      </div>
      <div className="bg-white shadow rounded-lg border border-gray-200 p-6">
        <PlatformForm
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
          loading={loading}
        />
      </div>
    </div>
  );
};