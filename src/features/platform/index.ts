export type { Platform, PlatformFilters, PlatformListResponse, PlatformFormData } from './types/platform.types';
export { platformService } from './services/platformService';
export { platformDetailsService } from './services/platformDetailsService';
export { usePlatforms } from './hooks/usePlatforms';
export { usePlatform } from './hooks/usePlatform';
export {
  PlatformTable,
  PlatformForm,
  PlatformCard,
  PlatformSearch,
  PlatformFilter,
  StatusBadge,
  ClientSelect,
  AvailabilityMetrics,
  ResponseTimeMetrics,
  MonitoringHistory,
  UptimePercentage,
} from './components';
export {
  PlatformListPage,
  PlatformAddPage,
  PlatformEditPage,
  PlatformDetailsPage,
} from './pages';
export { platformRoutes, PlatformRouter } from './platformRouter';
