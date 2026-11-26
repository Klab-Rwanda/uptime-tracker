import { RouteObject } from 'react-router-dom';
import {
  ClientListPage,
  ClientAddPage,
  ClientEditPage,
  ClientDetailsPage,
  SettingsPage,
  CompanyTeamPage,
  OverviewPage,
} from './pages';

/**
 * Client feature routes.
 * All client management routes are defined here and kept feature-scoped.
 * Routes are relative and designed to be nested under the root WorkspaceLayout.
 */
export const clientRoutes: RouteObject[] = [
  {
    index: true,
    element: <OverviewPage />,
  },
  {
    path: 'clients',
    element: <ClientListPage />,
  },
  {
    path: 'clients/add',
    element: <ClientAddPage />,
  },
  {
    path: 'clients/edit/:clientId',
    element: <ClientEditPage />,
  },
  {
    path: 'clients/:clientId',
    element: <ClientDetailsPage />,
  },
  {
    path: 'settings',
    element: <SettingsPage />,
  },
  {
    path: 'company/team',
    element: <CompanyTeamPage />,
  },
];