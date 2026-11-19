import { useAuth } from '../../../contexts/AuthContext';

export const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">Settings</h1>

        <div className="bg-white shadow rounded-lg border border-gray-200 p-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Account</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Email address</p>
                <p className="text-sm font-medium text-gray-900">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {user?.role || 'workspace owner'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white shadow rounded-lg border border-gray-200 p-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Preferences</h2>
          <p className="text-sm text-gray-500">
            Notification and display preferences coming soon.
          </p>
        </div>
      </div>
    </div>
  );
};