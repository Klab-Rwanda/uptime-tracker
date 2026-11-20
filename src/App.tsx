import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { platformRoutes } from './features/platform';
import { clientRoutes } from './features/client';
import { logsIncidentsRoutes } from './features/logs-incidents';
import { notificationsRoutes } from './features/notifications';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { WorkspaceLayout } from './components/layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ThemeProvider>
        <AuthProvider>
          <WorkspaceLayout />
        </AuthProvider>
      </ThemeProvider>
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
