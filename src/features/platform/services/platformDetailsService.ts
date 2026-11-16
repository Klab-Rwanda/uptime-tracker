import { Platform } from '../types/platform.types';
import { PlatformMetrics, PlatformMonitoringHistory, PlatformAvailability } from '../types/platformDetails.types';

/**
 * Platform Details API Service
 * Provides detailed platform information for the details interface.
 */
export const platformDetailsService = {
  /**
   * Fetch detailed information for a single platform,
   * include metrics, history, and availability data.
   */
  async getPlatformDetails(platformId: string): Promise<Platform> {
    // TODO: Replace with real API call when backend is available.
    // Currently falls back to platformService for compatibility.
    const platformService = await import('./platformService');
    const platform = await platformService.platformService.getPlatformById(platformId);
    return platform;
  },

  /**
   * Fetch platform metrics (uptime, response times, availability).
   */
  async getPlatformMetrics(platformId: string): Promise<PlatformMetrics> {
    void platformId;
    // TODO: Replace with real API call when backend is available.
    // Returning empty metrics for now - backend will provide actual values.
    return {
      uptimePercentage: null,
      averageResponseTime: null,
      currentResponseTime: null,
      availabilityInformation: [],
    };
  },

  /**
   * Fetch monitoring history for a platform.
   */
  async getMonitoringHistory(platformId: string, limit: number = 100): Promise<PlatformMonitoringHistory[]> {
    void platformId;
    void limit;
    // TODO: Replace with real API call when backend is available.
    // Returning empty history for now - backend will provide actual data.
    return [];
  },

  /**
   * Fetch availability information for a platform.
   */
  async getAvailability(platformId: string): Promise<PlatformAvailability> {
    void platformId;
    // TODO: Replace with real API call when backend is available.
    // Returning empty availability for now - backend will provide actual data.
    return {
      status: 'unknown',
      lastCheck: null,
      lastSuccessfulCheck: null,
      totalChecks: 0,
      successfulChecks: 0,
      lastCheckDurationMs: null,
    };
  },
};
