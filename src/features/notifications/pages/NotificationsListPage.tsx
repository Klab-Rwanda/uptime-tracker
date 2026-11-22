import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { platformService } from '../../platform';
import { Platform } from '../../platform/types/platform.types';
import { NotificationType, NotificationStatus } from '../types/notifications.types';
import { NotificationTable } from '../components/NotificationTable';

type TypeOption = 'all' | NotificationType;
type StatusOption = 'all' | NotificationStatus;

/**
 * Notifications list page.
 * Displays notifications with title, message, platform, timestamp, type, and
 * read/unread status. Supports marking individual or all notifications as read,
 * opening notification details, and navigating to related platforms/incidents.
 */
export const NotificationsListPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<TypeOption>('all');
  const [selectedStatus, setSelectedStatus] = useState<StatusOption>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>('all');
  const [platforms, setPlatforms] = useState<{ id: string; name: string }[]>([]);

  const {
    notifications,
    total,
    loading,
    refreshing,
    error,
    updateFilters,
    refetch,
    markAsRead,
    markAllAsRead,
  } = useNotifications({
    search: searchQuery.trim() || undefined,
    type: selectedType === 'all' ? undefined : selectedType,
    status: selectedStatus === 'all' ? undefined : selectedStatus,
    platformId: selectedPlatform === 'all' ? undefined : selectedPlatform,
    page: 1,
    limit: 20,
  });

  const unreadCount = notifications.filter((n) => n.status === 'unread').length;

  useEffect(() => {
    platformService
      .getPlatforms()
      .then((response) =>
        setPlatforms(response.data.map((p: Platform) => ({ id: p.id, name: p.name }))),
      )
      .catch(() => setPlatforms([]));
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    updateFilters({ search: e.target.value.trim() || undefined, page: 1 });
  };

  const handleTypeChange = (value: TypeOption) => {
    setSelectedType(value);
    updateFilters({ type: value === 'all' ? undefined : value, page: 1 });
  };

  const handleStatusChange = (value: StatusOption) => {
    setSelectedStatus(value);
    updateFilters({ status: value === 'all' ? undefined : value, page: 1 });
  };

  const handlePlatformChange = (value: string) => {
    setSelectedPlatform(value);
    updateFilters({
      platformId: value === 'all' ? undefined : value,
      page: 1,
    });
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    refetch();
  };

  const handleViewNotification = (id: string) => {
    navigate('/notifications/' + id);
  };

  if (loading) {
    return (
      <div className='max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800'>
        <div className='bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center'>
          <p className='text-sm text-gray-500 dark:text-gray-400'>Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800'>
        <div className='bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center'>
          <p className='text-sm text-red-600'>{error.message}</p>
          <button
            onClick={refetch}
            className='mt-2 text-sm text-indigo-600 hover:text-indigo-500'
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-6xl min-h-screen mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800'>
      <div className='mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-800'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-800'>Notifications</h1>
          <p className='text-sm text-gray-500 mt-1'>
            Manage your notifications and preferences.
          </p>
        </div>
        <div className='flex gap-2'>
          <button
            onClick={refetch}
            disabled={refreshing}
            className='inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50'
          >
            Refresh
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors'
            >
              Mark all as read ({unreadCount})
            </button>
          )}
        </div>
      </div>

      <div className='bg-white shadow rounded-lg border border-gray-200 p-6 mb-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search notifications...'
              value={searchQuery}
              onChange={handleSearchChange}
              className='block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            />
            <span className='absolute left-3 top-2.5 text-gray-400'>🔍</span>
          </div>
          <select
            value={selectedType}
            onChange={(e) => handleTypeChange(e.target.value as TypeOption)}
            className='block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md text-sm leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          >
            <option value='all'>All types</option>
            <option value='downtime'>Downtime</option>
            <option value='recovery'>Recovery</option>
            <option value='anomaly'>Anomaly</option>
            <option value='info'>Information</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value as StatusOption)}
            className='block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md text-sm leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          >
            <option value='all'>All statuses</option>
            <option value='unread'>Unread</option>
            <option value='read'>Read</option>
          </select>
          <select
            value={selectedPlatform ?? 'all'}
            onChange={(e) => handlePlatformChange(e.target.value)}
            className='block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md text-sm leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          >
            <option value='all'>All platforms</option>
            {platforms.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {notifications.length === 0 && (
        <div className='bg-white shadow rounded-lg border border-gray-200 p-8 text-center'>
          <h2 className='text-sm font-semibold text-gray-900 mb-2'>No notifications</h2>
          <p className='text-sm text-gray-500 mb-4'>
            {selectedStatus === 'unread'
              ? 'You have no unread notifications.'
              : 'No notifications match your filters.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedType('all');
              setSelectedStatus('all');
              setSelectedPlatform('all');
              updateFilters({ search: undefined, type: undefined, status: undefined, platformId: undefined, page: 1 });
            }}
            className='text-sm text-indigo-600 hover:text-indigo-500'
          >
            Clear filters
          </button>
        </div>
      )}

      {notifications.length > 0 && (
        <NotificationTable
          notifications={notifications}
          onView={handleViewNotification}
          onMarkAsRead={async (id: string) => {
            await markAsRead(id);
            refetch();
          }}
        />
      )}

      <div className='mt-4 flex items-center justify-between'>
        <p className='text-sm text-gray-500'>
          Showing {notifications.length} of {total} notification{total !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
};
