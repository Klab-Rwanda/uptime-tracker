import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { platformService, usePlatform } from '../';
import { PlatformFormData } from '../types/platform.types';
import { PlatformForm } from '../components/PlatformForm';

/**
 * Edit platform page.
 * Renders the platform form in edit mode for a given platform ID.
 */
export const PlatformEditPage = () => {
  const { platformId } = useParams<{ platformId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { platform, refetch } = usePlatform(platformId ?? '');

  const handleSubmit = async (data: PlatformFormData) => {
    if (!platformId) return;
    setLoading(true);
    try {
      await platformService.updatePlatform(platformId, data);
      refetch();
      navigate(`/platforms/${platformId}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update platform');
    } finally {
      setLoading(false);
    }
  };

  if (!platform) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-500">Platform not found.</p>
          <button
            onClick={() => navigate('/platforms')}
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
          >
            Back to platforms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Platform</h1>
        <p className="text-sm text-gray-500 mt-1">Update the details of {platform.name}.</p>
      </div>
      <div className="bg-white shadow rounded-lg border border-gray-200 p-6">
        <PlatformForm
          initialData={{
            name: platform.name,
            url: platform.url,
            description: platform.description,
            status: platform.status,
            clientId: platform.clientId,
            monitoringInterval: platform.monitoringInterval,
          }}
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
          loading={loading}
        />
      </div>
    </div>
  );
};