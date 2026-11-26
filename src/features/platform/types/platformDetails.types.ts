/**
 * Platform monitoring history entry.
 */
export interface PlatformMonitoringHistory {
  timestamp: string;
  status: 'success' | 'error' | 'timeout';
  responseTime: number | null;
  error?: string;
  checkDurationMs?: number;
}

/**
 * Platform metrics for the details interface.
 * Values are provided by the backend monitoring system.
 */
export interface PlatformMetrics {
  /**
   * Uptime percentage (0-100).
   * Provided by backend - not calculated locally to avoid misleading statistics.
   */
  uptimePercentage: number | null;

  /**
   * Average response time in milliseconds over the configured period.
   * Provided by backend - not calculated locally.
   */
  averageResponseTime: number | null;

  /**
   * Current response time in milliseconds.
   */
  currentResponseTime: number | null;

  /**
   * Availability information (check counts, periods).
   */
  availabilityInformation: PlatformAvailability[];
}

/**
 * Availability information for a platform.
 */
export interface PlatformAvailability {
  status: 'online' | 'offline' | 'degraded' | 'unknown';
  lastCheck: string | null;
  lastSuccessfulCheck: string | null;
  totalChecks: number;
  successfulChecks: number;
  lastCheckDurationMs: number | null;
}
