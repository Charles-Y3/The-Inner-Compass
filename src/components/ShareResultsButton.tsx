import { useState } from 'react';
import { useT } from '../i18n/useT';
import { Button } from './Button';
import { exportResultsImage, type ResultsExportPayload } from '../lib/exportResultsImage';

export function ShareResultsButton({ payload }: { payload: ResultsExportPayload }) {
  const { t } = useT();
  const [status, setStatus] = useState<'idle' | 'working' | 'saved' | 'failed'>('idle');

  async function handleShare() {
    setStatus('working');
    try {
      const blob = await exportResultsImage(payload);
      const file = new File([blob], 'inner-compass-result.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            title: payload.appName,
            text: `${payload.stageName} · ${payload.primaryLine}`,
            files: [file],
          });
          setStatus('idle');
          return;
        } catch {
          // cancelled or failed — fall through to download
        }
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'inner-compass-result.png';
      a.click();
      URL.revokeObjectURL(url);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2500);
    } catch {
      setStatus('failed');
      setTimeout(() => setStatus('idle'), 2500);
    }
  }

  const label =
    status === 'working'
      ? '…'
      : status === 'saved'
        ? t('results_shareSaved')
        : status === 'failed'
          ? t('results_shareFailed')
          : t('results_share');

  return (
    <Button type="button" variant="secondary" onClick={handleShare} disabled={status === 'working'}>
      {label}
    </Button>
  );
}
