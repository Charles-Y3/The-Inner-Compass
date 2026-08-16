import { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useT } from '../i18n/useT';
import { ASPECTS } from '../data/questions';
import { LEVELS } from '../data/levels';
import { scoreToLevel, sumDepthAnswers } from '../data/quiz';
import {
  BEARINGS,
  bearingStackLabel,
  getBearing,
  scoreDirectionMix,
} from '../data/bearings';
import { LevelCard } from '../components/LevelCard';
import { BearingMix } from '../components/BearingMix';
import { SynthesisCard } from '../components/SynthesisCard';
import { ShareResultsButton } from '../components/ShareResultsButton';
import { SaveResultsPrompt } from '../components/SaveResultsPrompt';
import { Button } from '../components/Button';
import { useQuiz } from '../state/QuizContext';
import { useHistory } from '../state/HistoryContext';
import { useSaveResultsPrompt } from '../hooks/useSaveResultsPrompt';
import { buildAnimalExportBlocks } from '../lib/exportResultsImage';
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

export function ResultsPage() {
  const navigate = useNavigate();
  const { t, L, locale } = useT();
  const {
    answers,
    directionAnswers,
    selfRatingLevelId,
    heartNote,
    savedEntryId,
    markSaved,
    clear,
  } = useQuiz();
  const { addEntry, getEntry } = useHistory();
  const saveLock = useRef(false);
  const { showPrompt, busy, failed, triggerAfterSave, saveNow, dismiss } = useSaveResultsPrompt();

  const depthDone = ASPECTS.every((a) => typeof answers[a.depth.id] === 'number');
  const directionDone = ASPECTS.every((a) => !!directionAnswers[a.id]);
  const ready = depthDone && directionDone && heartNote != null;

  const totalScore = ready ? sumDepthAnswers(answers) : 0;
  const computedLevel = ready ? scoreToLevel(totalScore) : null;
  const mixResult = ready ? scoreDirectionMix(directionAnswers) : null;
  const selfLevel = selfRatingLevelId ? LEVELS.find((l) => l.id === selfRatingLevelId) : null;

  useEffect(() => {
    if (!ready || !computedLevel || !mixResult || !heartNote) return;
    if (savedEntryId || saveLock.current) return;
    saveLock.current = true;
    const entry = addEntry({
      selfRatingLevelId,
      levelId: computedLevel.id,
      totalScore,
      mix: mixResult.mix,
      primaryBearingId: mixResult.primaryBearingId,
      coPrimaryBearingIds: mixResult.coPrimaryBearingIds,
      toTendBearingId: mixResult.toTendBearingId,
      heartNote,
    });
    markSaved(entry.id);
    triggerAfterSave();
  }, [
    ready,
    computedLevel,
    mixResult,
    heartNote,
    savedEntryId,
    selfRatingLevelId,
    totalScore,
    addEntry,
    markSaved,
    triggerAfterSave,
  ]);

  const feedback = useMemo(() => {
    if (!computedLevel || !selfLevel) return undefined;
    if (selfLevel.order === computedLevel.order) return t('results_feedback_match');
    if (selfLevel.order < computedLevel.order) return t('results_feedback_low');
    return t('results_feedback_high');
  }, [computedLevel, selfLevel, t]);

  if (!ready || !computedLevel || !mixResult || !heartNote) {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <p className="body">{t('results_noSession_title')}</p>
        <div className="buttonRow">
          <Button onClick={() => navigate(depthDone && directionDone ? '/reflect' : '/levels')}>
            {t('results_noSession_cta')}
          </Button>
        </div>
      </div>
    );
  }

  const primary = getBearing(mixResult.primaryBearingId);
  const saved = savedEntryId ? getEntry(savedEntryId) : undefined;
  const dated = formatDate(saved?.createdAt ?? Date.now(), locale);
  const coIds = mixResult.coPrimaryBearingIds;
  const primaryLine =
    coIds.length > 1
      ? t('results_primary_co', { animals: coIds.map((id) => L(getBearing(id).animal)).join('–') })
      : t('results_primary', { stack: bearingStackLabel(primary, L) });
  const hasHeart =
    heartNote.feelings.trim().length > 0 || heartNote.improve.trim().length > 0;

  const synthesisBody = buildSynthesis(t, locale, {
    resultOrder: computedLevel.order,
    selfOrder: selfLevel?.order,
    primaryIds: coIds,
    tendId: mixResult.toTendBearingId,
    vars: synthesisVars(computedLevel, coIds, mixResult.toTendBearingId, L, selfLevel),
  });

  const exportPayload = {
    appName: t('appName'),
    dateLabel: dated,
    stageName: L(computedLevel.name),
    stageLabel: computedLevel.stage ? L(computedLevel.stage) : '',
    feedback,
    description: L(computedLevel.description),
    encouragement: computedLevel.encouragement ? L(computedLevel.encouragement) : undefined,
    bearingTitle: t('results_bearingTitle'),
    primaryLine,
    mix: mixResult.mix,
    primaryIds: coIds,
    tendId: mixResult.toTendBearingId,
    synthesisTitle: t('results_synthesis_title'),
    synthesisBody,
    animalBlocks: buildAnimalExportBlocks(
      BEARINGS,
      L,
      {
        primary: (animal) => t('results_animal_primary', { animal }),
        tend: (animal) => t('results_animal_tend', { animal }),
        strengths: t('results_animal_strengths'),
        workOn: t('results_animal_workOn'),
        cultivate: t('results_animal_cultivate'),
        whenThin: t('results_animal_whenThin'),
      },
      coIds,
      mixResult.toTendBearingId,
    ),
    heartTitle: hasHeart ? t('results_heartTitle', { date: dated }) : undefined,
    feelingsLabel: t('results_heartFeelings'),
    feelings: heartNote.feelings.trim() || undefined,
    improveLabel: t('results_heartImprove'),
    improve: heartNote.improve.trim() || undefined,
    mirrorNote: t('results_mirrorNote'),
  };

  function handleRetry() {
    clear();
    navigate('/');
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <SaveResultsPrompt open={showPrompt} busy={busy} failed={failed} onSave={saveNow} onDismiss={dismiss} />
      <div className="card">
        <BearingMix
          mix={mixResult.mix}
          primaryBearingId={mixResult.primaryBearingId}
          coPrimaryBearingIds={mixResult.coPrimaryBearingIds}
          toTendBearingId={mixResult.toTendBearingId}
        />
      </div>

      <div className="card" style={{ marginTop: 'var(--space-5)' }}>
        <LevelCard level={computedLevel} feedback={feedback} />
      </div>

      {hasHeart && (
        <div className="card heartNoteCard" style={{ marginTop: 'var(--space-5)' }}>
          <h2 className="heartNoteTitle">{t('results_heartTitle', { date: dated })}</h2>
          {heartNote.feelings.trim() && (
            <>
              <p className="heartNoteLabel">{t('results_heartFeelings')}</p>
              <p className="heartNoteBody">{heartNote.feelings}</p>
            </>
          )}
          {heartNote.improve.trim() && (
            <>
              <p className="heartNoteLabel">{t('results_heartImprove')}</p>
              <p className="heartNoteBody">{heartNote.improve}</p>
            </>
          )}
        </div>
      )}

      <div style={{ width: '100%', marginTop: 'var(--space-5)' }}>
        <SynthesisCard title={t('results_synthesis_title')} body={synthesisBody} />
      </div>

      <p className="mirrorNote">{t('results_mirrorNote')}</p>
      <div className="buttonRow">
        <Button onClick={handleRetry}>{t('results_retry')}</Button>
        <ShareResultsButton payload={exportPayload} />
        <Button type="button" variant="secondary" onClick={() => navigate('/history')}>
          {t('results_history')}
        </Button>
      </div>
    </div>
  );
}
