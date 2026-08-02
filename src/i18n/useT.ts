import { useSettings } from '../state/SettingsContext';
import type { Locale, Localized } from './types';
import { UI, interpolate } from './strings';
import { L } from './L';

export function useT() {
  const { locale } = useSettings();
  const effectiveLocale: Locale = locale ?? 'en';

  function t(key: keyof typeof UI, vars?: Record<string, string | number>): string {
    const entry = UI[key];
    if (!entry) return String(key);
    const resolved = L(entry, effectiveLocale);
    return vars ? interpolate(resolved, vars) : resolved;
  }

  function L_<T extends string | string[]>(loc: Localized<T>): T {
    return L(loc, effectiveLocale);
  }

  return { t, L: L_, locale: effectiveLocale };
}
