// Capture beforeinstallprompt early (Settings mounts late).

export type InstallGuideKind = 'ios' | 'android' | 'desktop';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferred: BeforeInstallPromptEvent | null = null;

const listeners = new Set<() => void>();

function notify() {
  for (const cb of listeners) cb();
}

export function registerPwaInstall() {
  if (typeof window === 'undefined') return;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e as BeforeInstallPromptEvent;
    notify();
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    notify();
  });
}

export function getDeferredInstallPrompt() {
  return deferred;
}

export function subscribePwaInstall(cb: () => void) {
  listeners.add(cb);
  cb();
  return () => {
    listeners.delete(cb);
  };
}

export async function promptPwaInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
  if (!deferred) return 'unavailable';
  const event = deferred;
  deferred = null;
  notify();
  await event.prompt();
  const { outcome } = await event.userChoice;
  return outcome;
}

export function isStandaloneDisplay() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  );
}

export function isIosDevice() {
  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua);
  const iPadOs = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return iOS || iPadOs;
}

export function isAndroidDevice() {
  return /Android/i.test(navigator.userAgent);
}

export function installGuideKind(): InstallGuideKind {
  if (isIosDevice()) return 'ios';
  if (isAndroidDevice()) return 'android';
  return 'desktop';
}
