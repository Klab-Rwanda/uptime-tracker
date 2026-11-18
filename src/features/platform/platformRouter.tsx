import { RouteObject } from 'react-router-dom';
import {
  PlatformListPage,
  PlatformAddPage,
  PlatformEditPage,
  PlatformDetailsPage,
} from './pages';

/**
 * Platform feature routes.
 * All platform management routes are defined here and kept feature-scoped.
 */
export const platformRoutes: RouteObject[] = [
  {
    path: '/platforms',
    element: <PlatformListPage />,
  },
  {
    path: '/platforms/add',
    element: <PlatformAddPage />,
  },
  {
    path: '/platforms/edit/:platformId',
    element: <PlatformEditPage />,
  },
  {
    path: '/platforms/:platformId',
    element: <PlatformDetailsPage />,
  },
];