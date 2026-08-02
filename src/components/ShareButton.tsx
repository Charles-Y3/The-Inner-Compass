import { useState } from 'react';
import { useT } from '../i18n/useT';
import { Button } from './Button';

export function ShareButton({ text }: { text: string }) {
  const { t } = useT();
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareData = { title: t('appName'), text, url: window.location.origin };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // user cancelled or share failed — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} — ${window.location.origin}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard unavailable — nothing more we can do
    }
  }

  return (
    <Button type="button" variant="secondary" onClick={handleShare}>
      {copied ? t('results_shareCopied') : t('results_share')}
    </Button>
  );
}
