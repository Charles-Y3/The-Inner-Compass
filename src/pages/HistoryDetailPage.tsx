import { useNavigate, useParams } from 'react-router-dom';
import { useT } from '../i18n/useT';
import { LEVELS } from '../data/levels';
import { LevelCard } from '../components/LevelCard';
import { BearingMix } from '../components/BearingMix';
import { SynthesisCard } from '../components/SynthesisCard';
import { Button } from '../components/Button';
import { useHistory } from '../state/HistoryContext';
import { useQuiz } from '../state/QuizContext';
import { buildSynthesis, synthesisVars } from '../lib/synthesis';

function formatDate(ts: number, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale === 'en' ? 'en' : locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(ts));
  } catch {
    return new Date(ts).toLocaleDateString();
  }
}

export function HistoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, L, locale } = useT();
  const { getEntry } = useHistory();
  const { clear, start } = useQuiz();
  const entry = id ? getEntry(id) : undefined;

  if (!entry) {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <p className="body">{t('history_empty')}</p>
        <div className="buttonRow">
          <Button onClick={() => navigate('/history')}>{t('history_back')}</Button>
        </div>
      </div>
    );
  }

  const level = LEVELS.find((l) => l.id === entry.levelId) ?? LEVELS[0];
  const selfLevel = entry.selfRatingLevelId
    ? LEVELS.find((l) => l.id === entry.selfRatingLevelId) ?? null
    : null;
  const coIds = entry.coPrimaryBearingIds ?? [entry.primaryBearingId];
  const synthesisBody = buildSynthesis(t, locale, {
    resultOrder: level.order,
    selfOrder: selfLevel?.order,
    primaryIds: coIds,
    tendId: entry.toTendBearingId,
    vars: synthesisVars(level, coIds, entry.toTendBearingId, L, selfLevel),
  });

  function handleNew() {
    clear();
    start();
    navigate('/levels');
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 className="title" style={{ marginBottom: 'var(--space-5)' }}>
        {t('history_detailTitle', { date: formatDate(entry.createdAt, locale) })}
      </h1>

      <div className="card">
        <BearingMix
          mix={entry.mix}
          primaryBearingId={entry.primaryBearingId}
          coPrimaryBearingIds={entry.coPrimaryBearingIds}
          toTendBearingId={entry.toTendBearingId}
        />
      </div>

      <div className="card" style={{ marginTop: 'var(--space-5)' }}>
        <LevelCard level={level} />
      </div>

      {(entry.heartNote.feelings.trim() || entry.heartNote.improve.trim()) && (
        <div className="card heartNoteCard" style={{ marginTop: 'var(--space-5)' }}>
          <h2 className="heartNoteTitle">
            {t('results_heartTitle', { date: formatDate(entry.createdAt, locale) })}
          </h2>
          {entry.heartNote.feelings.trim() && (
            <>
              <p className="heartNoteLabel">{t('results_heartFeelings')}</p>
              <p className="heartNoteBody">{entry.heartNote.feelings}</p>
            </>
          )}
          {entry.heartNote.improve.trim() && (
            <>
              <p className="heartNoteLabel">{t('results_heartImprove')}</p>
              <p className="heartNoteBody">{entry.heartNote.improve}</p>
            </>
          )}
        </div>
      )}

      <div style={{ width: '100%', marginTop: 'var(--space-5)' }}>
        <SynthesisCard title={t('results_synthesis_title')} body={synthesisBody} />
      </div>

      <div className="buttonRow">
        <Button type="button" variant="secondary" onClick={() => navigate('/history')}>
          {t('history_back')}
        </Button>
        <Button onClick={handleNew}>{t('history_startNew')}</Button>
      </div>
    </div>
  );
}
