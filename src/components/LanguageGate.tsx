import { useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import { useSettings } from '../state/SettingsContext';
import type { Locale } from '../i18n/types';
import { UI } from '../i18n/strings';
import { L } from '../i18n/L';
import { readBackupFile, applyBackup, isValidBackup } from '../utils/backup';
import { isFolderBackupSupported, importFromFolder } from '../utils/folderBackup';

const OPTIONS: { locale: Locale; key: keyof typeof UI }[] = [
  { locale: 'en', key: 'langGate_en' },
  { locale: 'zh-Hant', key: 'langGate_zhHant' },
  { locale: 'zh-Hans', key: 'langGate_zhHans' },
];

// No locale is chosen yet on this screen, so its own copy (import hint,
// error text) renders all three languages stacked, same idea as the
// language buttons themselves.
function tri(key: keyof typeof UI): string {
  return OPTIONS.map((o) => L(UI[key], o.locale)).join(' / ');
}

export function LanguageGate({ children }: { children: ReactNode }) {
  const { locale, setLocale } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState('');
  const [importBusy, setImportBusy] = useState(false);

  if (locale) return <>{children}</>;

  // Nothing to protect with an "overwrite?" confirm here — this screen only
  // shows when storage was just wiped or on first launch, so there's no
  // existing data yet.
  function applyAndReload(backup: unknown) {
    if (!isValidBackup(backup)) {
      setImportError(tri('langGate_import_invalid'));
      return;
    }
    applyBackup(backup);
    window.location.reload();
  }

  // When the File System Access API is available, one folder picker does
  // double duty: it reads the backup file out of the chosen folder AND
  // grants auto-save access to that same folder, restoring data and
  // re-enabling auto-save after storage was cleared in one action. Falls
  // back to a plain file picker where unsupported.
  async function handleImportClick() {
    if (!isFolderBackupSupported()) {
      fileInputRef.current?.click();
      return;
    }
    setImportError('');
    setImportBusy(true);
    try {
      const { backup } = await importFromFolder();
      applyAndReload(backup);
    } catch (err) {
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        setImportError(
          err instanceof Error && err.message === 'NO_BACKUP_FILE'
            ? tri('langGate_import_missing')
            : tri('langGate_import_failed'),
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
      applyAndReload(obj);
    } catch {
      setImportError(tri('langGate_import_failed'));
    }
  }

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
      <p className="langGateImportHint">{tri('langGate_import_hint')}</p>
      <button
        type="button"
        className="button buttonSecondary langGateButton langGateImportButton"
        onClick={() => void handleImportClick()}
        disabled={importBusy}
      >
        {tri('langGate_import')}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        style={{ display: 'none' }}
        onChange={(e) => void handleFileChange(e)}
      />
      {importError && <p className="langGateImportError">{importError}</p>}
    </div>
  );
}
