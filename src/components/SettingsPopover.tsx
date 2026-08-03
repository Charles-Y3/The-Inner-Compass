import { useEffect, useRef, useState } from 'react';
import { useSettings, type Theme } from '../state/SettingsContext';
import { useQuiz } from '../state/QuizContext';
import { useT } from '../i18n/useT';
import type { Locale } from '../i18n/types';
import {
  subscribePwaInstall,
  getDeferredInstallPrompt,
  promptPwaInstall,
  isStandaloneDisplay,
  installGuideKind,
} from '../utils/pwaInstall';
import { subscribeOfflineReady } from '../utils/offlineReady';

const LOCALE_OPTIONS: { locale: Locale; labelKey: 'langGate_en' | 'langGate_zhHant' | 'langGate_zhHans' }[] = [
  { locale: 'en', labelKey: 'langGate_en' },
  { locale: 'zh-Hant', labelKey: 'langGate_zhHant' },
  { locale: 'zh-Hans', labelKey: 'langGate_zhHans' },
];

const THEME_OPTIONS: { theme: Theme; labelKey: 'settings_theme_dawn' | 'settings_theme_night' | 'settings_theme_dusk' }[] = [
  { theme: 'light', labelKey: 'settings_theme_dawn' },
  { theme: 'sepia', labelKey: 'settings_theme_dusk' },
  { theme: 'dark', labelKey: 'settings_theme_night' },
];

export function SettingsPopover() {
  const [open, setOpen] = useState(false);
  const { locale, theme, setLocale, setTheme, reset: resetSettings } = useSettings();
  const { clear: clearQuiz } = useQuiz();
  const { t } = useT();
  const containerRef = useRef<HTMLDivElement>(null);
  const [installAvailable, setInstallAvailable] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => subscribePwaInstall(() => setInstallAvailable(Boolean(getDeferredInstallPrompt()))), []);
  useEffect(() => subscribeOfflineReady(setOfflineReady), []);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  function handleReset() {
    clearQuiz();
    resetSettings();
    setOpen(false);
  }

  const standalone = typeof window !== 'undefined' && isStandaloneDisplay();
  const guide = typeof window !== 'undefined' ? installGuideKind() : 'desktop';

  return (
    <div style={{ position: 'relative' }} ref={containerRef}>
      <button type="button" className="iconButton" onClick={() => setOpen((o) => !o)}>
        {t('nav_settings')}
      </button>
      {open && (
        <div className="popover">
          <div className="popoverHeader">
            <button
              type="button"
              className="popoverCloseButton"
              aria-label={t('settings_close')}
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>
          <div className="popoverLabel">{t('settings_language')}</div>
          <div className="popoverRow">
            {LOCALE_OPTIONS.map((opt) => (
              <button
                key={opt.locale}
                className={`popoverChip ${locale === opt.locale ? 'popoverChipActive' : ''}`}
                onClick={() => setLocale(opt.locale)}
              >
                {t(opt.labelKey)}
              </button>
            ))}
          </div>
          <div className="popoverLabel">{t('settings_theme')}</div>
          <div className="popoverRow">
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.theme}
                className={`popoverChip ${theme === opt.theme ? 'popoverChipActive' : ''}`}
                onClick={() => setTheme(opt.theme)}
              >
                {t(opt.labelKey)}
              </button>
            ))}
          </div>

          <div className="popoverLabel">{t('settings_app')}</div>
          {standalone ? (
            <p className="popoverHint">{t('settings_install_done')}</p>
          ) : installAvailable ? (
            <div className="popoverRow">
              <button type="button" className="popoverChip popoverChipActive" onClick={() => void promptPwaInstall()}>
                {t('settings_install')}
              </button>
            </div>
          ) : guide === 'ios' ? (
            <p className="popoverHint">{t('settings_install_ios')}</p>
          ) : (
            <p className="popoverHint">{t('settings_install_unavailable')}</p>
          )}
          <p className="popoverHint">{offlineReady ? t('settings_offline_ready') : t('settings_offline_pending')}</p>

          <div className="popoverLabel">
            <button className="popoverChip" onClick={handleReset}>
              {t('settings_reset')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
