import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { platformRoutes } from './features/platform';
import { clientRoutes } from './features/client';
import { logsIncidentsRoutes } from './features/logs-incidents';

const router = createBrowserRouter([
  ...platformRoutes,
  ...clientRoutes,
  ...logsIncidentsRoutes,
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
