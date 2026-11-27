import { useLocation } from 'react-router-dom';
import { Bell, LayoutDashboard } from 'lucide-react';

const BREADCRUMB_MAP: Record<string, string> = {
  '/dashboard': 'Overview',
  '/platforms': 'Platforms',
  '/logs': 'Logs & incidents',
  '/incidents': 'Incidents',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
  '/company/team': 'Company team',
};

export const WorkspaceTopNav = () => {
  const location = useLocation();

  const getWorkspaceName = () => {
    const path = location.pathname;

    // Platform details
    if (/^\/platforms\/\w+$/.test(path)) return 'Platform Details';
    // Incident details
    if (/^\/incidents\/\w+$/.test(path)) return 'Incident Details';
    // Client details
    if (/^\/clients\/\w+$/.test(path)) return 'Client Details';
    // Client edit
    if (/^\/clients\/edit\/\w+$/.test(path)) return 'Edit Client';

    return BREADCRUMB_MAP[path] || 'Dashboard';
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-100 dark:bg-gray-800 dark:border-gray-700 ">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <LayoutDashboard size={18} strokeWidth={2} />
          </div>
          <span className="font-semibold text-gray-900 dark:text-white text-sm">
            {getWorkspaceName()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 relative"
            aria-label="Notifications"
          >
            <Bell size={18} strokeWidth={1.5} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
          </button>
        </div>
      </div>
    </header>
  );
};