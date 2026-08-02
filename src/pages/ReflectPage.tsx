import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useT } from '../i18n/useT';
import { ASPECTS } from '../data/questions';
import { Button } from '../components/Button';
import { useQuiz } from '../state/QuizContext';

export function ReflectPage() {
  const navigate = useNavigate();
  const { t } = useT();
  const { answers, directionAnswers, heartNote, setHeartNote } = useQuiz();
  const [feelings, setFeelings] = useState(heartNote?.feelings ?? '');
  const [improve, setImprove] = useState(heartNote?.improve ?? '');

  const depthDone = ASPECTS.every((a) => typeof answers[a.depth.id] === 'number');
  const directionDone = ASPECTS.every((a) => !!directionAnswers[a.id]);

  if (!depthDone || !directionDone) {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <p className="body">{t('results_noSession_title')}</p>
        <div className="buttonRow">
          <Button onClick={() => navigate('/levels')}>{t('results_noSession_cta')}</Button>
        </div>
      </div>
    );
  }

  function handleContinue() {
    setHeartNote({
      feelings: feelings.trim(),
      improve: improve.trim(),
    });
    navigate('/results');
  }

  return (
    <div className="card reflectCard">
      <h1 className="title">{t('reflect_title')}</h1>
      <p className="body">{t('reflect_body')}</p>

      <label className="reflectLabel" htmlFor="reflect-feelings">
        {t('reflect_feelings')}
      </label>
      <textarea
        id="reflect-feelings"
        className="reflectTextarea"
        rows={4}
        value={feelings}
        placeholder={t('reflect_feelings_placeholder')}
        onChange={(e) => setFeelings(e.target.value)}
      />

      <label className="reflectLabel" htmlFor="reflect-improve">
        {t('reflect_improve')}
      </label>
      <textarea
        id="reflect-improve"
        className="reflectTextarea"
        rows={4}
        value={improve}
        placeholder={t('reflect_improve_placeholder')}
        onChange={(e) => setImprove(e.target.value)}
      />

      <div className="buttonRow">
        <Button onClick={handleContinue}>{t('reflect_continue')}</Button>
      </div>
    </div>
  );
}
