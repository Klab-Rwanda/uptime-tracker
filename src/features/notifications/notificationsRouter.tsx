import { RouteObject } from 'react-router-dom';
import {
  NotificationsListPage,
  NotificationsDetailsPage,
  NotificationsPreferencesPage,
} from './pages';

/**
 * Notifications feature routes.
 * All notification routes are defined here and kept feature-scoped.
 */
export const notificationsRoutes: RouteObject[] = [
  {
    path: '/notifications',
    element: <NotificationsListPage />,
  },
  {
    path: '/notifications/:notificationId',
    element: <NotificationsDetailsPage />,
  },
  {
    path: '/notifications/preferences',
    element: <NotificationsPreferencesPage />,
  },
];
