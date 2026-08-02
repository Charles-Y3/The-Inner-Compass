import { useT } from '../i18n/useT';

export function Disclaimer() {
  const { t } = useT();
  return <p className="disclaimer">{t('intro_disclaimer')}</p>;
}
