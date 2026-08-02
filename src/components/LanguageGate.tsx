import type { ReactNode } from 'react';
import { useSettings } from '../state/SettingsContext';
import type { Locale } from '../i18n/types';
import { UI } from '../i18n/strings';
import { L } from '../i18n/L';

const OPTIONS: { locale: Locale; key: keyof typeof UI }[] = [
  { locale: 'en', key: 'langGate_en' },
  { locale: 'zh-Hant', key: 'langGate_zhHant' },
  { locale: 'zh-Hans', key: 'langGate_zhHans' },
];

export function LanguageGate({ children }: { children: ReactNode }) {
  const { locale, setLocale } = useSettings();

  if (locale) return <>{children}</>;

  return (
    <div className="langGate">
      <div className="langGateColumn">
        {OPTIONS.map((o) => (
          <button
            key={o.locale}
            className="button buttonSecondary langGateButton"
            onClick={() => setLocale(o.locale)}
          >
            {L(UI[o.key], o.locale)}
          </button>
        ))}
      </div>
    </div>
  );
}
