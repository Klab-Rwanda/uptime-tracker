import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { platformRoutes } from './features/platform';
import { clientRoutes } from './features/client';
import { logsIncidentsRoutes } from './features/logs-incidents';
import { notificationsRoutes } from './features/notifications';
import { AuthProvider } from './contexts/AuthContext';
import { WorkspaceLayout } from './components/layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <WorkspaceLayout />
      </AuthProvider>
    ),
    children: [
      ...platformRoutes,
      ...clientRoutes,
      ...logsIncidentsRoutes,
      ...notificationsRoutes,
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
