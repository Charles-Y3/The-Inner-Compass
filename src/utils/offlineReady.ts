// Best-effort offline readiness: service worker controlling + shell cached.

function hasServiceWorkerSupport() {
  return typeof navigator !== 'undefined' && 'serviceWorker' in navigator;
}

export function getOfflineReady() {
  if (typeof window === 'undefined') return false;
  if (!hasServiceWorkerSupport()) {
    return true;
  }
  return Boolean(navigator.serviceWorker.controller);
}

/** Subscribe to offline-ready changes. Calls listener(boolean). Returns unsubscribe. */
export function subscribeOfflineReady(listener: (ready: boolean) => void) {
  if (typeof window === 'undefined') return () => {};

  const emit = () => listener(getOfflineReady());

  emit();

  if (!hasServiceWorkerSupport()) {
    window.addEventListener('online', emit);
    window.addEventListener('offline', emit);
    return () => {
      window.removeEventListener('online', emit);
      window.removeEventListener('offline', emit);
    };
  }

  const onControllerChange = () => emit();
  navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

  let cancelled = false;
  void navigator.serviceWorker.ready.then(() => {
    if (!cancelled) emit();
  });

  const t1 = window.setTimeout(emit, 500);
  const t2 = window.setTimeout(emit, 2000);

  return () => {
    cancelled = true;
    window.clearTimeout(t1);
    window.clearTimeout(t2);
    navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
  };
}
