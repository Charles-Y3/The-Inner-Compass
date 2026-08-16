// Optional on-device auto-save: once the user grants a folder via the File
// System Access API, every completed check-in overwrites one fixed file in
// that folder instead of producing a new download each time. Chromium-only;
// callers must fall back to backup.ts's downloadBackup() where unsupported.
import { buildBackup, downloadBackup, type Backup } from './backup';

// Minimal ambient typings for the File System Access API — not yet part of
// TypeScript's DOM lib.
interface FileSystemHandlePermissionDescriptor {
  mode?: 'read' | 'readwrite';
}
interface FileSystemFileHandleLike {
  getFile: () => Promise<File>;
  createWritable: () => Promise<{ write: (data: string) => Promise<void>; close: () => Promise<void> }>;
}
interface FileSystemDirectoryHandleLike {
  name: string;
  queryPermission: (opts: FileSystemHandlePermissionDescriptor) => Promise<'granted' | 'denied' | 'prompt'>;
  requestPermission: (opts: FileSystemHandlePermissionDescriptor) => Promise<'granted' | 'denied' | 'prompt'>;
  getFileHandle: (name: string, opts?: { create?: boolean }) => Promise<FileSystemFileHandleLike>;
}
declare global {
  interface Window {
    showDirectoryPicker?: (opts?: { id?: string; mode?: 'read' | 'readwrite' }) => Promise<FileSystemDirectoryHandleLike>;
  }
}

const DB_NAME = 'ic-fs';
const STORE_NAME = 'handles';
const HANDLE_KEY = 'backupDir';
const BACKUP_FILENAME = 'inner-compass-backup.json';

const ENABLED_KEY = 'ic:autoSaveFolderEnabled';
const FOLDER_NAME_KEY = 'ic:autoSaveFolderName';

export function isFolderBackupSupported(): boolean {
  return typeof window !== 'undefined' && 'showDirectoryPicker' in window;
}

export function isFolderBackupEnabled(): boolean {
  return localStorage.getItem(ENABLED_KEY) === '1';
}

export function getFolderName(): string {
  return localStorage.getItem(FOLDER_NAME_KEY) || '';
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('Could not open IndexedDB'));
  });
}

async function idbGet<T>(key: string): Promise<T | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(key);
    req.onsuccess = () => resolve((req.result as T) ?? null);
    req.onerror = () => reject(req.error || new Error('Could not read from IndexedDB'));
  });
}

async function idbSet(key: string, value: unknown): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error('Could not write to IndexedDB'));
  });
}

async function idbDelete(key: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error('Could not write to IndexedDB'));
  });
}

async function writeBackupToFolder(dirHandle: FileSystemDirectoryHandleLike): Promise<void> {
  const fileHandle = await dirHandle.getFileHandle(BACKUP_FILENAME, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(JSON.stringify(buildBackup(), null, 2));
  await writable.close();
}

// Must be called from within a user gesture (click handler) — showDirectoryPicker
// requires transient activation.
export async function enableFolderBackup(): Promise<string> {
  if (!window.showDirectoryPicker) throw new Error('File System Access API not supported');
  const dirHandle = await window.showDirectoryPicker({ id: 'ic-backup', mode: 'readwrite' });
  await idbSet(HANDLE_KEY, dirHandle);
  localStorage.setItem(ENABLED_KEY, '1');
  localStorage.setItem(FOLDER_NAME_KEY, dirHandle.name);
  await writeBackupToFolder(dirHandle);
  return dirHandle.name;
}

// Lets a user pick their existing auto-save folder to import from — one
// picker does double duty: it reads inner-compass-backup.json out of that
// folder AND grants the same readwrite handle auto-save uses, so choosing
// the folder once both restores the data and re-enables auto-save to it.
// Throws NO_BACKUP_FILE if the chosen folder has no backup file in it (the
// folder handle/enabled flag are only persisted once a real file is found).
export async function importFromFolder(): Promise<{ backup: unknown; folderName: string }> {
  if (!window.showDirectoryPicker) throw new Error('File System Access API not supported');
  const dirHandle = await window.showDirectoryPicker({ id: 'ic-backup', mode: 'readwrite' });
  let fileHandle: FileSystemFileHandleLike;
  try {
    fileHandle = await dirHandle.getFileHandle(BACKUP_FILENAME);
  } catch {
    throw new Error('NO_BACKUP_FILE');
  }
  const file = await fileHandle.getFile();
  const backup = JSON.parse(await file.text());
  await idbSet(HANDLE_KEY, dirHandle);
  localStorage.setItem(ENABLED_KEY, '1');
  localStorage.setItem(FOLDER_NAME_KEY, dirHandle.name);
  return { backup, folderName: dirHandle.name };
}

export async function disableFolderBackup(): Promise<void> {
  await idbDelete(HANDLE_KEY);
  localStorage.removeItem(ENABLED_KEY);
  localStorage.removeItem(FOLDER_NAME_KEY);
}

// Returns a writable directory handle, re-requesting permission if needed
// (only succeeds if called within a user gesture), or null if unavailable.
async function getVerifiedHandle(): Promise<FileSystemDirectoryHandleLike | null> {
  const handle = await idbGet<FileSystemDirectoryHandleLike>(HANDLE_KEY);
  if (!handle) return null;
  const opts: FileSystemHandlePermissionDescriptor = { mode: 'readwrite' };
  if ((await handle.queryPermission(opts)) === 'granted') return handle;
  try {
    if ((await handle.requestPermission(opts)) === 'granted') return handle;
  } catch {
    // requestPermission throws outside a user gesture — treat as unavailable.
  }
  return null;
}

// Silent, best-effort: writes to the saved folder if auto-save is on and
// permission is still valid; does nothing (and never throws) otherwise.
export async function autoSaveIfEnabled(): Promise<boolean> {
  if (!isFolderBackupEnabled()) return false;
  try {
    const handle = await getVerifiedHandle();
    if (!handle) return false;
    await writeBackupToFolder(handle);
    return true;
  } catch {
    return false;
  }
}

// Explicit save-now used by Export/Save when folder mode is on — surfaces
// failures instead of swallowing them.
export async function saveToFolderNow(): Promise<void> {
  const handle = await getVerifiedHandle();
  if (!handle) throw new Error('Folder access is no longer available');
  await writeBackupToFolder(handle);
}

export type ExportResult =
  | { mode: 'folder'; folderName: string; justEnabled?: boolean }
  | { mode: 'download'; error?: unknown }
  | { mode: 'cancelled' };

// The single "what should Save/Export actually do" decision, shared by
// every entry point (Settings button, the post-survey save prompt) so they
// can't drift apart: reuse an already-granted folder (silent overwrite); if
// none is granted yet, ask for one now — never default straight to a
// download when the folder flow is available. Falls back to a timestamped
// download only when the File System Access API isn't supported, or the
// folder step genuinely fails (a cancelled picker does nothing, rather than
// surprising the user with an unrequested download).
export async function exportSmart(): Promise<ExportResult> {
  if (isFolderBackupEnabled()) {
    try {
      await saveToFolderNow();
      return { mode: 'folder', folderName: getFolderName() };
    } catch (err) {
      downloadBackup();
      return { mode: 'download', error: err };
    }
  }
  if (isFolderBackupSupported()) {
    try {
      const name = await enableFolderBackup();
      return { mode: 'folder', folderName: name, justEnabled: true };
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return { mode: 'cancelled' };
      downloadBackup();
      return { mode: 'download', error: err };
    }
  }
  downloadBackup();
  return { mode: 'download' };
}

export type { Backup };
