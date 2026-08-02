import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useT } from '../i18n/useT';
import { buildQuizSteps } from '../data/quiz';
import type { BearingId } from '../data/bearings';
import { ProgressLine } from '../components/ProgressLine';
import { OptionRow } from '../components/OptionRow';
import { Button } from '../components/Button';
import { useQuiz } from '../state/QuizContext';

export function QuestionsPage() {
  const navigate = useNavigate();
  const { t, L } = useT();
  const { answers, directionAnswers, setAnswer, setDirectionAnswer } = useQuiz();
  const steps = useMemo(() => buildQuizSteps(), []);
  const [index, setIndex] = useState(0);

  const step = steps[index];
  const isDirection = step.kind === 'direction';

  const selectedDepth = !isDirection ? answers[step.question.id] : undefined;
  const selectedDirection = isDirection ? directionAnswers[step.aspectId] : undefined;

  function advance() {
    if (index < steps.length - 1) {
      setIndex((i) => i + 1);
    } else {
      navigate('/reflect');
    }
  }

  function handleDepthSelect(value: number) {
    setAnswer(step.question.id, value);
    advance();
  }

  function handleDirectionSelect(bearingId: BearingId) {
    setDirectionAnswer(step.aspectId, bearingId);
    advance();
  }

  function handleBack() {
    if (index > 0) setIndex((i) => i - 1);
  }

  return (
    <div className="questionsWrap">
      <ProgressLine current={index + 1} total={steps.length} />
      <div className="card questionsCard">
        <p className="questionsPrompt">{L(step.question.prompt)}</p>
        <div className="questionsOptions">
          {isDirection
            ? step.question.options.map((opt) => (
                <OptionRow
                  key={opt.bearingId}
                  label={L(opt.label)}
                  selected={selectedDirection === opt.bearingId}
                  onClick={() => handleDirectionSelect(opt.bearingId)}
                />
              ))
            : step.question.options.map((opt) => (
                <OptionRow
                  key={opt.value}
                  label={L(opt.label)}
                  selected={selectedDepth === opt.value}
                  onClick={() => handleDepthSelect(opt.value)}
                />
              ))}
        </div>
        <div className={`questionsBackRow ${index === 0 ? 'questionsBackRowHidden' : ''}`}>
          <Button variant="secondary" onClick={handleBack}>{t('questions_back')}</Button>
        </div>
      </div>
    </div>
  );
}
