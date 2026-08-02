import { Link } from 'react-router-dom';
import { useT } from '../i18n/useT';

/** App mark + name in the shell header. */
export function AppLogo() {
  const { t } = useT();
  return (
    <Link to="/" className="logo" aria-label={t('appName')}>
      <img className="logoIcon" src="/icons/app-logo.png" alt="" width={32} height={32} />
      <span className="logoText">{t('appName')}</span>
    </Link>
  );
}
