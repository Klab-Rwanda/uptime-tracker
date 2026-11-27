import { useState } from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Server,
  Activity,
  Bell,
  Users,
  Settings as SettingsIcon,
  LogOut,
  Menu,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', path: '/dashboard', icon: LayoutDashboard, exact: true },
  { label: 'My platforms', path: '/platforms', icon: Server },
  { label: 'Logs & incidents', path: '/logs', icon: Activity },
  { label: 'Notifications', path: '/notifications', icon: Bell },
  { label: 'Company team', path: '/company/team', icon: Users },
  { label: 'Settings', path: '/settings', icon: SettingsIcon },
];

export const WorkspaceSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleSignOut = () => {
    signOut();
  };

  const toggleCollapse = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    if (isMobile) setIsMobileOpen(false);
  };

  return (
    <>
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed z-30 h-screen bg-white border-r border-gray-200 transition-all duration-300 dark:bg-gray-800 dark:border-gray-700
          ${isMobile ? 'left-0 w-64 -translate-x-full' : 'top-0 left-0 w-64'}
          ${isMobile && isMobileOpen ? 'translate-x-0' : ''}
          ${!isMobile && isCollapsed ? 'w-16' : ''}
        `}
      >
        {/* Branding */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-100 dark:border-gray-700 justify-start">
          <div className="w-8 h-8 rounded bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Activity size={20} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-lg tracking-tight">
            PulseMonitor
          </span>
        </div>

        {/* Navigation */}
        <div className="px-2 py-3">
          <h2 className="px-4 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            CLIENT WORKSPACE
          </h2>
          <nav className="space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.path, item.exact);
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive: navActive }) => {
                    const isNavActive = navActive || active;
                    return `
                      flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                      ${isNavActive
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-r-2 border-indigo-500'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400'
                    }
                    justify-start
                    `;
                  }}
                  onClick={() => handleNavClick(item.path)}
                >
                  <Icon size={18} strokeWidth={2} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="flex-1" />

        {/* Footer */}

        {/* Footer */}

        <div className="mt-auto px-4 pb-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.email || 'user@example.com'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {user?.role || 'workspace owner'}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors border border-transparent"
          >
            <LogOut size={16} strokeWidth={1.5} />
            <span>Sign out</span>
          </button>
        </div>

        {/* Mobile menu button */}
        {isMobile && (
          <button
            onClick={toggleCollapse}
            className="absolute top-4 left-4 z-50 w-9 h-9 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Menu size={20} strokeWidth={2.5} />
          </button>
        )}
      </aside>

      {/* Tablet collapsed overlay */}
      {isTablet && isCollapsed && (
        <div className="fixed inset-0 z-20 bg-black/40" onClick={() => setIsCollapsed(false)} />
      )}
    </>
  );
};