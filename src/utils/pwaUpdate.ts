// Capture waiting service-worker updates and let the UI prompt before reload.
// Requires vite-plugin-pwa `registerType: 'prompt'`.

import { registerSW } from 'virtual:pwa-register';

type NeedRefreshListener = (needRefresh: boolean) => void;

let updateSW: ((reloadPage?: boolean) => Promise<void>) | undefined;

let needRefresh = false;

const listeners = new Set<NeedRefreshListener>();

function emit(next: boolean) {
  needRefresh = next;
  for (const cb of listeners) cb(needRefresh);
}

/**
 * Register the service worker and surface "new version available" to the UI.
 * Call once from main.tsx before React mounts.
 */
export function registerPwaUpdates() {
  updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      emit(true);
    },
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return;
      window.setInterval(() => {
        void registration.update();
      }, 60 * 60 * 1000);
    },
  });
}

export function subscribePwaNeedRefresh(cb: NeedRefreshListener) {
  listeners.add(cb);
  cb(needRefresh);
  return () => {
    listeners.delete(cb);
  };
}

/** Activate the waiting worker and reload so the new build runs. */
export function applyPwaUpdate() {
  void updateSW?.(true);
}
