import { RouteObject } from 'react-router-dom';
import {
  LogsListPage,
  IncidentsListPage,
  IncidentDetailsPage,
} from './pages';

/**
 * Logs and Incidents feature routes.
 * All logs/incidents routes are defined here and kept feature-scoped.
 */
export const logsIncidentsRoutes: RouteObject[] = [
  {
    path: '/logs',
    element: <LogsListPage />,
  },
  {
    path: '/incidents',
    element: <IncidentsListPage />,
  },
  {
    path: '/incidents/:incidentId',
    element: <IncidentDetailsPage />,
  },
];
