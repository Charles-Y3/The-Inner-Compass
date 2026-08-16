import { useEffect, useRef, useState, type ChangeEvent } from 'react';
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
import { readBackupFile, applyBackup, isValidBackup, type Backup } from '../utils/backup';
import {
  isFolderBackupSupported,
  isFolderBackupEnabled,
  getFolderName,
  enableFolderBackup,
  disableFolderBackup,
  exportSmart,
  importFromFolder,
} from '../utils/folderBackup';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [installAvailable, setInstallAvailable] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [folderEnabled, setFolderEnabled] = useState(() => isFolderBackupEnabled());
  const [folderName, setFolderName] = useState(() => getFolderName());
  const [folderBusy, setFolderBusy] = useState(false);
  const [folderError, setFolderError] = useState('');
  const [importBusy, setImportBusy] = useState(false);
  const [importError, setImportError] = useState('');

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

  function applyAndReload(backup: Backup) {
    if (!window.confirm(t('settings_backup_import_confirm'))) return;
    applyBackup(backup);
    window.location.reload();
  }

  // When the File System Access API is available, one folder picker does
  // double duty: it reads the backup file out of the chosen folder AND
  // re-grants auto-save access to that same folder. Falls back to a plain
  // file picker where unsupported.
  async function handleImportClick() {
    if (!isFolderBackupSupported()) {
      fileInputRef.current?.click();
      return;
    }
    setImportError('');
    setImportBusy(true);
    try {
      const { backup, folderName: name } = await importFromFolder();
      if (!isValidBackup(backup)) {
        setImportError(t('settings_backup_import_invalid'));
        return;
      }
      setFolderEnabled(true);
      setFolderName(name);
      applyAndReload(backup);
    } catch (err) {
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        setImportError(
          err instanceof Error && err.message === 'NO_BACKUP_FILE'
            ? t('settings_backup_import_missing')
            : t('settings_backup_import_failed'),
        );
      }
    } finally {
      setImportBusy(false);
    }
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const obj = await readBackupFile(file);
      if (!isValidBackup(obj)) {
        setImportError(t('settings_backup_import_invalid'));
        return;
      }
      setImportError('');
      applyAndReload(obj);
    } catch {
      setImportError(t('settings_backup_import_failed'));
    }
  }

  async function handleEnableFolderBackup() {
    setFolderError('');
    setFolderBusy(true);
    try {
      const name = await enableFolderBackup();
      setFolderName(name);
      setFolderEnabled(true);
    } catch (err) {
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        setFolderError(t('settings_backup_folder_error'));
      }
    } finally {
      setFolderBusy(false);
    }
  }

  async function handleDisableFolderBackup() {
    await disableFolderBackup();
    setFolderEnabled(false);
    setFolderName('');
  }

  // Delegates to exportSmart() (shared with the post-survey save prompt) so
  // this can't drift into its own "just download" behavior.
  async function handleExportClick() {
    setFolderError('');
    setFolderBusy(true);
    try {
      const result = await exportSmart();
      if (result.mode === 'folder') {
        setFolderEnabled(true);
        setFolderName(result.folderName);
      }
      if ('error' in result && result.error) {
        setFolderError(t('settings_backup_export_fallback'));
      }
    } finally {
      setFolderBusy(false);
    }
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

          <div className="popoverLabel">{t('settings_backup_title')}</div>
          <div className="popoverRow">
            <button className="popoverChip" onClick={() => void handleExportClick()} disabled={folderBusy}>
              {t('settings_backup_export')}
            </button>
            <button className="popoverChip" onClick={() => void handleImportClick()} disabled={importBusy}>
              {t('settings_backup_import')}
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={(e) => void handleFileChange(e)}
          />
          {importError && <p className="popoverHint">{importError}</p>}

          {isFolderBackupSupported() && (
            <>
              <div className="popoverLabel">{t('settings_backup_folder_title')}</div>
              {folderEnabled ? (
                <>
                  <p className="popoverHint">{t('settings_backup_folder_enabled', { name: folderName })}</p>
                  <div className="popoverRow">
                    <button className="popoverChip" onClick={() => void handleDisableFolderBackup()}>
                      {t('settings_backup_folder_disable')}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="popoverHint">{t('settings_backup_folder_hint')}</p>
                  <div className="popoverRow">
                    <button className="popoverChip" onClick={() => void handleEnableFolderBackup()} disabled={folderBusy}>
                      {t('settings_backup_folder_enable')}
                    </button>
                  </div>
                </>
              )}
              {folderError && <p className="popoverHint">{folderError}</p>}
            </>
          )}

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
