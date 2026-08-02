import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Locale } from '../i18n/types';

export type Theme = 'light' | 'dark' | 'sepia'; // labeled Dawn / Night / Dusk in the UI

interface Settings {
  locale: Locale | null;
  theme: Theme;
}

interface SettingsContextValue extends Settings {
  setLocale: (locale: Locale) => void;
  setTheme: (theme: Theme) => void;
  reset: () => void;
}

const STORAGE_KEY = 'ic:settings';
const DEFAULT_SETTINGS: Settings = { locale: null, theme: 'light' };

function readSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function writeSettings(settings: Settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // localStorage unavailable (private mode etc.) — settings just won't persist
  }
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => readSettings());

  useEffect(() => {
    writeSettings(settings);
    document.documentElement.setAttribute('data-theme', settings.theme);
    if (settings.locale) {
      document.documentElement.setAttribute('lang', settings.locale);
    }
  }, [settings]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      ...settings,
      setLocale: (locale) => setSettings((s) => ({ ...s, locale })),
      setTheme: (theme) => setSettings((s) => ({ ...s, theme })),
      reset: () => setSettings(DEFAULT_SETTINGS),
    }),
    [settings],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
