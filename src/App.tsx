import { createBrowserRouter, NavLink, Outlet, RouterProvider } from 'react-router-dom';
import { clientRoutes } from './features/client';
import { platformRoutes } from './features/platform';

const AppLayout = () => (
  <div className="min-h-screen bg-gray-50 text-gray-900">
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3" aria-label="Uptime home">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">U</span>
          <span>
            <span className="block text-sm font-semibold tracking-wide text-gray-900">UPTIME</span>
            <span className="block text-xs text-gray-500">Service operations</span>
          </span>
        </NavLink>
        <nav className="flex items-center gap-1 overflow-x-auto" aria-label="Main navigation">
          {[
            { label: 'Overview', to: '/' },
            { label: 'Platforms', to: '/platforms' },
            { label: 'Clients', to: '/clients' },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
    <Outlet />
  </div>
);

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [...clientRoutes, ...platformRoutes],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;