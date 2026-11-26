import {
  CompanyDetails,
  DEFAULT_COMPANY,
  DEFAULT_PREFERENCES,
  UserPreferences,
} from '../types/settings.types';

const COMPANY_STORAGE_KEY = 'uptime_workspace_company';
const PREFERENCES_STORAGE_KEY = 'uptime_user_preferences';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const loadCompany = (): CompanyDetails => {
  if (typeof window === 'undefined') return DEFAULT_COMPANY;
  const stored = localStorage.getItem(COMPANY_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_COMPANY;
    }
  }
  localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(DEFAULT_COMPANY));
  return DEFAULT_COMPANY;
};

const saveCompany = (company: CompanyDetails) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(company));
};

const loadPreferences = (): UserPreferences => {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }
  return DEFAULT_PREFERENCES;
};

const savePreferences = (preferences: UserPreferences) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
};

/**
 * Settings API service (mocked with localStorage).
 * Replace with real HTTP calls when a backend is available.
 *
 * Endpoints needed on the backend:
 *   GET    /api/settings/company        -> load company details
 *   PUT    /api/settings/company        -> save company details
 *   GET    /api/settings/preferences    -> load user preferences
 *   PUT    /api/settings/preferences    -> save user preferences
 */
export const settingsService = {
  getCompany: async (): Promise<CompanyDetails> => {
    await delay(300);
    return loadCompany();
  },

  saveCompany: async (data: Partial<CompanyDetails>): Promise<CompanyDetails> => {
    await delay(300);
    const current = loadCompany();
    const updated: CompanyDetails = { ...current, ...data };
    if (!updated.companyName || updated.companyName.trim() === '') {
      throw new Error('Company name cannot be empty.');
    }
    saveCompany(updated);
    return updated;
  },

  getPreferences: async (): Promise<UserPreferences> => {
    await delay(200);
    return loadPreferences();
  },

  savePreferences: async (
    data: Partial<UserPreferences>,
  ): Promise<UserPreferences> => {
    await delay(300);
    const current = loadPreferences();
    const updated: UserPreferences = { ...current, ...data };
    savePreferences(updated);
    return updated;
  },
};