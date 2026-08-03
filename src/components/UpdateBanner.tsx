import { useEffect, useState } from 'react';
import { useT } from '../i18n/useT';
import { Button } from './Button';
import { applyPwaUpdate, subscribePwaNeedRefresh } from '../utils/pwaUpdate';

export function UpdateBanner() {
  const { t } = useT();
  const [available, setAvailable] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => subscribePwaNeedRefresh(setAvailable), []);

  if (!available || dismissed) return null;

  return (
    <div className="updateBanner" role="status">
      <span className="updateBannerBody">{t('update_available')}</span>
      <div className="updateBannerActions">
        <Button variant="primary" onClick={() => applyPwaUpdate()}>
          {t('update_reload')}
        </Button>
        <Button variant="secondary" onClick={() => setDismissed(true)}>
          {t('update_later')}
        </Button>
      </div>
    </div>
  );
}
