import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { platformRoutes } from './features/platform';
import { clientRoutes } from './features/client';
import { logsIncidentsRoutes } from './features/logs-incidents';
import { notificationsRoutes } from './features/notifications';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { WorkspaceLayout } from './components/layout';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { LoginPage } from './features/auth/pages/LoginPage';
import { SignUpPage } from './features/auth/pages/SignUpPage';
import { ForgotPasswordPage } from './features/auth/pages/ForgotPasswordPage';
import { LandingPage } from './features/auth/pages/LandingPage';

const protectedAppRoutes = [
  ...platformRoutes,
  ...clientRoutes,
  ...logsIncidentsRoutes,
  ...notificationsRoutes,
];

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ThemeProvider>
        <AuthProvider>
          <Outlet />
        </AuthProvider>
      </ThemeProvider>
    ),
    children: [
      {
        path: '',
        element: (
          <ProtectedRoute>
            <WorkspaceLayout />
          </ProtectedRoute>
        ),
        children: protectedAppRoutes,
      },
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'signup',
        element: <SignUpPage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
