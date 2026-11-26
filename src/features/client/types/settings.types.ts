/**
 * Settings feature types.
 * Defines the data models for company details and personal preferences.
 * Persisted via localStorage (no backend yet).
 */

export type Appearance = 'light' | 'dark' | 'system';

export interface CompanyDetails {
  companyName: string;
}

export interface UserPreferences {
  displayName: string;
  timezone: string;
  notificationsEnabled: boolean;
  appearance: Appearance;
}

export interface SettingsState {
  company: CompanyDetails;
  preferences: UserPreferences;
}

export const DEFAULT_TIMEZONES: { value: string; label: string }[] = [
  { value: 'UTC', label: 'UTC' },
  { value: 'Africa/Kigali', label: 'Africa/Kigali (CAT)' },
  { value: 'Africa/Lagos', label: 'Africa/Lagos (WAT)' },
  { value: 'Africa/Nairobi', label: 'Africa/Nairobi (EAT)' },
  { value: 'America/New_York', label: 'America/New_York (ET)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PT)' },
  { value: 'Europe/London', label: 'Europe/London (GMT)' },
  { value: 'Europe/Paris', label: 'Europe/Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' },
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (AEST)' },
];

export const DEFAULT_COMPANY: CompanyDetails = {
  companyName: 'PulseMonitor Workspace',
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  displayName: '',
  timezone: 'UTC',
  notificationsEnabled: true,
  appearance: 'system',
};