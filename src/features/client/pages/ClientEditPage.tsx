import { ClientFormData } from '../types/client.types';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClient } from '../hooks/useClient';
import { clientService } from '../services/clientService';
import { ClientForm } from '../components/ClientForm';
/**
 * Edit client page.
 * Renders the client form in edit mode for a given client ID.
 */
export const ClientEditPage = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const { client, loading, error } = useClient(clientId ?? '');
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      setServerError(error.message);
    }
  }, [error]);

  const handleSubmit = async (data: ClientFormData) => {
    if (!clientId) return;
    setSaving(true);
    setServerError(null);
    try {
      await clientService.updateClient(clientId, data);
      navigate('/clients');
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Failed to update client',
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading client...</p>
        </div>
      </div>
    );
  }

  if (!client || serverError) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="bg-white dark:bg-red-900 border border-red-200 dark:border-red-900/30 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Client not found</h3>
          <p className="mt-1 text-red-600">{serverError}</p>
          <button
            onClick={() => navigate('/clients')}
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
          >
            Back to client list
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Client</h1>
        <p className="mt-1 text-gray-500">
          Update details for {client.name}
        </p>
      </div>

      {serverError && (
        <div className="mb-6 bg-white dark:bg-red-900 border border-red-200 dark:border-red-900/30 rounded-lg p-4">
          <h3 className="text-red-800 dark:text-red-400 font-medium">Error</h3>
          <p className="mt-1 text-red-600 dark:text-red-400">{serverError}</p>
        </div>
      )}

      <ClientForm
        initialData={{
          name: client.name,
          email: client.email,
          phone: client.phone,
          address: client.address,
          status: client.status,
          description: client.description,
        }}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/clients')}
        loading={saving}
      />
    </div>
  );
};