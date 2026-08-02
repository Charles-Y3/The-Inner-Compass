// Core i18n primitives for The Inner Compass 內在羅盤.
//
// IMPORTANT — this repo's i18n direction is the REVERSE of Atlas of
// Wisdom / Journey to Great Harmony: content here is authored in English
// and Traditional Chinese (ground truth). Simplified Chinese is derived
// at build time (scripts/gen-zh-hans.ts) via opencc-js into
// zhHans.generated.json — no conversion library ships to the browser.
//
// This is why the Chinese field is named `zhHant`, never `zh`: Atlas's
// `Localized<T>` uses `zh` to mean Simplified. Copy-pasting a `Localized`
// value between that repo and this one would silently produce the wrong
// language if the field names matched. Words of Sages and Little Stories
// Great Insights already author Traditional as ground truth too — this
// repo follows their convention, not Atlas's.

export type Locale = 'en' | 'zh-Hant' | 'zh-Hans';

export const LOCALES: Locale[] = ['en', 'zh-Hant', 'zh-Hans'];

export const LOCALE_LABELS: Record<Locale, { name: string; native: string }> = {
  en: { name: 'English', native: 'English' },
  'zh-Hant': { name: 'Traditional Chinese', native: '繁體中文' },
  'zh-Hans': { name: 'Simplified Chinese', native: '简体中文' },
};

/**
 * A piece of human-readable content authored in English and Traditional
 * Chinese. `T` is usually `string` or `string[]`. Simplified Chinese is
 * generated from `zhHant`, never authored directly.
 */
export interface Localized<T = string> {
  en: T;
  zhHant: T;
}

export function localized<T>(en: T, zhHant: T): Localized<T> {
  return { en, zhHant };
}
