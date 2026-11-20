import { useState, useEffect, useCallback } from 'react';
import {
  Save,
  Monitor,
  Sun,
  Moon,
  Layout,
  User as UserIcon,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { settingsService } from '../services/settingsService';
import type { Appearance } from '../types/settings.types';
import { DEFAULT_TIMEZONES } from '../types/settings.types';

type AppearanceOption = { value: Appearance; label: string; icon: React.ElementType };

const APPEARANCE_OPTIONS: AppearanceOption[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Layout },
];

const CAN_EDIT_COMPANY: string[] = ['Workspace owner', 'Administrator'];

export const SettingsPage = () => {
  const { user } = useAuth();

  const [companyName, setCompanyName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [appearance, setAppearance] = useState<Appearance>('system');

  const [isSavingCompany, setIsSavingCompany] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [companyError, setCompanyError] = useState<string | null>(null);
  const [companySuccess, setCompanySuccess] = useState<string | null>(null);
  const [preferencesError, setPreferencesError] = useState<string | null>(null);
  const [preferencesSuccess, setPreferencesSuccess] = useState<string | null>(null);

  const isCompanyEditable = user ? CAN_EDIT_COMPANY.includes(user.role) : false;

  const loadData = useCallback(async () => {
    try {
      const [company, preferences] = await Promise.all([
        settingsService.getCompany(),
        settingsService.getPreferences(),
      ]);
      setCompanyName(company.companyName);
      setDisplayName(preferences.displayName);
      setTimezone(preferences.timezone);
      setNotificationsEnabled(preferences.notificationsEnabled);
      setAppearance(preferences.appearance);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const clearCompanyMessages = useCallback(() => {
    setCompanyError(null);
    setCompanySuccess(null);
  }, []);

  const clearPreferencesMessages = useCallback(() => {
    setPreferencesError(null);
    setPreferencesSuccess(null);
  }, []);

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCompanyEditable) {
      setCompanyError('You do not have permission to edit company details.');
      return;
    }
    if (!companyName.trim()) {
      setCompanyError('Company name cannot be empty.');
      return;
    }
    setIsSavingCompany(true);
    clearCompanyMessages();
    try {
      await settingsService.saveCompany({ companyName: companyName.trim() });
      setCompanySuccess('Company details saved successfully.');
    } catch (error) {
      setCompanyError(
        error instanceof Error ? error.message : 'Failed to save company details.',
      );
    } finally {
      setIsSavingCompany(false);
    }
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPreferences(true);
    clearPreferencesMessages();
    try {
      await settingsService.savePreferences({
        displayName,
        timezone,
        notificationsEnabled,
        appearance,
      });
      setPreferencesSuccess('Preferences saved successfully.');
    } catch (error) {
      setPreferencesError(
        error instanceof Error ? error.message : 'Failed to save preferences.',
      );
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const handleAppearanceSelect = (value: Appearance) => {
    setAppearance(value);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your workspace and personal preferences.
          </p>
        </div>

        {/* Company Details Section */}
        <section className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Monitor size={16} strokeWidth={1.5} className="text-gray-600" />
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Company details
              </h2>
            </div>
          </div>
          <div className="p-6">
            <form onSubmit={handleSaveCompany} className="space-y-5">
              <div>
                <label
                  htmlFor="company-name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Company name
                </label>
                <input
                  id="company-name"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={!isCompanyEditable}
                  className={`block w-full pl-3 pr-3 py-2 border rounded-md text-sm leading-5 bg-white
                    ${isCompanyEditable
                      ? 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                      : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'}
                  `}
                  placeholder="Enter company name"
                  aria-disabled={!isCompanyEditable}
                />
                {isCompanyEditable && companyName.trim() === '' && companyError === null && (
                  <p className="mt-1 text-xs text-red-500">
                    Company name is required.
                  </p>
                )}
              </div>

              {companyError && (
                <div className="flex items-start gap-2 px-3 py-2 rounded bg-red-50 border border-red-100">
                  <AlertCircle size={14} strokeWidth={1.5} className="text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{companyError}</p>
                </div>
              )}
              {companySuccess && (
                <div className="flex items-start gap-2 px-3 py-2 rounded bg-green-50 border border-green-100">
                  <CheckCircle size={14} strokeWidth={1.5} className="text-green-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">{companySuccess}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!isCompanyEditable || isSavingCompany || !companyName.trim()}
                className={`inline-flex items-center gap-2 justify-center py-2 px-4 border rounded-md text-sm font-medium transition-colors
                  ${isCompanyEditable
                    ? 'border-transparent shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed'
                    : 'border-gray-300 text-gray-500 bg-gray-100 cursor-not-allowed'
                  }
                `}
              >
                {isSavingCompany ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} strokeWidth={1.5} />
                    Save workspace
                  </>
                )}
              </button>
              {!isCompanyEditable && (
                <p className="mt-2 text-xs text-gray-500">
                  Only a workspace owner or administrator can edit company details.
                </p>
              )}
            </form>
          </div>
        </section>

        {/* Personal Preferences Section */}
        <section className="mt-6 bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <UserIcon size={16} strokeWidth={1.5} className="text-gray-600" />
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Personal preferences
              </h2>
            </div>
          </div>
          <div className="p-6">
            <form onSubmit={handleSavePreferences} className="space-y-6">
              <div>
                <label
                  htmlFor="display-name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Display name
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Optional name displayed in your workspace.
                </p>
                <input
                  id="display-name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md text-sm leading-5 bg-white focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Your display name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="timezone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Timezone
                  </label>
                  <select
                    id="timezone"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md text-sm leading-5 bg-white focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {DEFAULT_TIMEZONES.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Notifications
                    </label>
                    <p className="text-xs text-gray-500">
                      {notificationsEnabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                      ${notificationsEnabled
                        ? 'border-indigo-600 bg-indigo-600'
                        : 'border-gray-300 bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 rounded-full bg-white transform transition-transform
                        ${notificationsEnabled ? 'translate-x-7' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Appearance
                </label>
                <div className="flex gap-2">
                  {APPEARANCE_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const isSelected = appearance === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleAppearanceSelect(option.value)}
                        aria-pressed={isSelected}
                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors border
                          ${isSelected
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }
                        `}
                      >
                        <Icon size={16} strokeWidth={1.5} />
                        <span>{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {preferencesError && (
                <div className="flex items-start gap-2 px-3 py-2 rounded bg-red-50 border border-red-100">
                  <AlertCircle size={14} strokeWidth={1.5} className="text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{preferencesError}</p>
                </div>
              )}
              {preferencesSuccess && (
                <div className="flex items-start gap-2 px-3 py-2 rounded bg-green-50 border border-green-100">
                  <CheckCircle size={14} strokeWidth={1.5} className="text-green-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">{preferencesSuccess}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSavingPreferences}
                className="inline-flex items-center gap-2 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingPreferences ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} strokeWidth={1.5} />
                    Save preferences
                  </>
                )}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};
