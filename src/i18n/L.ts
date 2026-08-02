import type { Locale, Localized } from './types';
import hansMap from './zhHans.generated.json';

const HANS_MAP: Record<string, string> = hansMap as Record<string, string>;

function hansOf(zhHant: string): string {
  return HANS_MAP[zhHant] ?? zhHant;
}

/**
 * Resolve a Localized<string | string[]> for the given locale.
 *   en       -> loc.en                     (authored)
 *   zh-Hant  -> loc.zhHant                 (authored, zero cost)
 *   zh-Hans  -> generated from loc.zhHant, falling back to zhHant on a miss
 * A stale/incomplete generated table degrades to "Simplified reader sees
 * Traditional text", never to a crash or an empty string.
 */
export function L<T extends string | string[]>(loc: Localized<T>, locale: Locale): T {
  if (locale === 'en') return loc.en;
  if (locale === 'zh-Hant') return loc.zhHant;
  if (Array.isArray(loc.zhHant)) {
    return (loc.zhHant as string[]).map(hansOf) as T;
  }
  return hansOf(loc.zhHant as string) as T;
}
