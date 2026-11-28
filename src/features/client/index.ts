export type {
  Client,
  ClientListResponse,
  ClientFilters,
  ClientFormData,
} from './types/client.types';
export { clientService } from './services/clientService';
export { dashboardService } from './services/dashboardService';
export { organizationsService } from './services/organizationsService';
export { useClients } from './hooks/useClients';
export { useClient } from './hooks/useClient';
export {
  ClientTable,
  ClientForm,
  ClientCard,
  ClientSearch,
  ClientFilter,
} from './components';
export {
  ClientListPage,
  ClientAddPage,
  ClientEditPage,
  ClientDetailsPage,
} from './pages';
export { clientRoutes } from './clientRouter';

