import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { platformRoutes } from './features/platform';
import { clientRoutes } from './features/client';

/** Combined application routes. */
export const appRoutes = [...clientRoutes, ...platformRoutes];

const router = createBrowserRouter(appRoutes);

function App() {
  return <RouterProvider router={router} />;
}

export default App;