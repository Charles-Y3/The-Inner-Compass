import { useNavigate } from 'react-router-dom';
import { useT } from '../i18n/useT';
import { Button } from '../components/Button';
import { Disclaimer } from '../components/Disclaimer';
import { useQuiz } from '../state/QuizContext';
import { useHistory } from '../state/HistoryContext';
import { version as appVersion } from '../../package.json';

export function IntroPage() {
  const navigate = useNavigate();
  const { t } = useT();
  const { start } = useQuiz();
  const { entries, latestEntry } = useHistory();

  function handleStart() {
    start();
    navigate('/levels');
  }

  let daysSince: number | null = null;
  if (latestEntry) {
    daysSince = Math.max(0, Math.floor((Date.now() - latestEntry.createdAt) / 86_400_000));
  }

  return (
    <div className="card">
      <h1 className="title">{t('intro_title')}</h1>
      <p className="body">{t('intro_body')}</p>
      {daysSince != null && (
        <p className="body introDaysSince">{t('intro_daysSince', { days: daysSince })}</p>
      )}
      <div className="buttonRow">
        <Button onClick={handleStart}>{t('intro_start')}</Button>
        {entries.length > 0 && (
          <Button type="button" variant="secondary" onClick={() => navigate('/history')}>
            {t('intro_history')}
          </Button>
        )}
      </div>
      <Disclaimer />
      <p className="introVersion">{t('intro_version', { version: appVersion })}</p>
    </div>
  );
}
