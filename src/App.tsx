import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { platformRoutes } from './features/platform';
import { clientRoutes } from './features/client';
import { logsIncidentsRoutes } from './features/logs-incidents';
import { notificationsRoutes } from './features/notifications';

const router = createBrowserRouter([
  ...platformRoutes,
  ...clientRoutes,
  ...logsIncidentsRoutes,
  ...notificationsRoutes,
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
