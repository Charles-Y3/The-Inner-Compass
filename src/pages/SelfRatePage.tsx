import { useNavigate } from 'react-router-dom';
import { useT } from '../i18n/useT';
import { LEVELS } from '../data/levels';
import { Button } from '../components/Button';
import { useQuiz } from '../state/QuizContext';

export function SelfRatePage() {
  const navigate = useNavigate();
  const { t, L } = useT();
  const { selfRatingLevelId, setSelfRating } = useQuiz();
  const sorted = [...LEVELS].sort((a, b) => a.order - b.order);

  function handleContinue() {
    if (!selfRatingLevelId) {
      window.alert(t('selfRate_required'));
      return;
    }
    navigate('/questions');
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <p className="body" style={{ marginBottom: 'var(--space-5)' }}>{t('selfRate_prompt')}</p>
      <div className="selfRateList">
        {sorted.map((l) => (
          <button
            key={l.id}
            className={`selfRateItem ${selfRatingLevelId === l.id ? 'selfRateItemSelected' : ''}`}
            onClick={() => setSelfRating(l.id)}
          >
            <div className="selfRateItemName">{L(l.name)}</div>
            {l.stage && <div className="selfRateItemStage">{L(l.stage)}</div>}
            <div className="selfRateItemDesc">{L(l.description)}</div>
          </button>
        ))}
      </div>
      <div className="buttonRow">
        <Button onClick={handleContinue}>{t('selfRate_continue')}</Button>
      </div>
    </div>
  );
}
