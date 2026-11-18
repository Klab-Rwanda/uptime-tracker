export type { Platform, PlatformFilters, PlatformListResponse, PlatformFormData } from './types/platform.types';
export { platformService } from './services/platformService';
export { usePlatforms } from './hooks/usePlatforms';
export { usePlatform } from './hooks/usePlatform';
export {
  PlatformTable,
  PlatformForm,
  PlatformCard,
  PlatformSearch,
  PlatformFilter,
} from './components';
export {
  PlatformListPage,
  PlatformAddPage,
  PlatformEditPage,
  PlatformDetailsPage,
} from './pages';
export { platformRoutes } from './platformRouter';