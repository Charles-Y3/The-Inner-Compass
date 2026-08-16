// Export/import the app's own localStorage data (check-in history + settings)
// as a single JSON file — the only backup mechanism available since
// everything lives client-side only.

const BACKUP_KEYS = ['ic:history', 'ic:settings'] as const;

export interface Backup {
  app: 'path-to-awakening';
  schema: 1;
  exportedAt: string;
  data: Record<string, unknown>;
}

function readRaw(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function buildBackup(): Backup {
  const data: Record<string, unknown> = {};
  for (const key of BACKUP_KEYS) {
    data[key] = readRaw(key);
  }
  return {
    app: 'path-to-awakening',
    schema: 1,
    exportedAt: new Date().toISOString(),
    data,
  };
}

// Timestamped filename (down to the minute): a plain browser download can't
// be overwritten in place — the browser silently appends "(1)", "(2)" etc.
// to repeat downloads of the same name — so an undated fixed name risks the
// user later importing a stale file with no way to tell it apart from the
// latest one. The folder auto-save path (folderBackup.ts) is the one place
// a fixed name is safe, because it genuinely overwrites via the File System
// Access API instead of going through the browser's download manager.
export function downloadBackup(): void {
  const backup = buildBackup();
  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const stamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 16);
  const a = document.createElement('a');
  a.href = url;
  a.download = `inner-compass-backup-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function isValidBackup(obj: unknown): obj is Backup {
  if (!obj || typeof obj !== 'object') return false;
  const candidate = obj as Partial<Backup>;
  return candidate.app === 'path-to-awakening' && !!candidate.data && typeof candidate.data === 'object';
}

export function applyBackup(obj: Backup): void {
  if (!isValidBackup(obj)) throw new Error('Invalid backup file');
  for (const key of BACKUP_KEYS) {
    const value = obj.data[key];
    if (value != null) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
}

export function readBackupFile(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(String(reader.result)));
      } catch {
        reject(new Error('Could not parse backup file'));
      }
    };
    reader.onerror = () => reject(reader.error || new Error('Could not read file'));
    reader.readAsText(file);
  });
}
