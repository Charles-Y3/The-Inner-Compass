import type { QuizConfig, Level, QuizStep, Aspect } from './types';
import { ASPECTS } from './questions';
import { LEVELS } from './levels';

export const QUIZ: QuizConfig = {
  id: 'inner-compass',
  scaleMode: 'per-item',
  points: 5,
  shuffle: true,
  selfRating: true,
  aspectCount: ASPECTS.length,
  stepCount: ASPECTS.length * 2,
  minScore: ASPECTS.length * 1,
  maxScore: ASPECTS.length * 5,
};

/**
 * Derive contiguous raw-score bands from each level's population `weight`,
 * proportional to the total number of possible raw scores. Levels must
 * already be sorted by `order` ascending.
 */
export function computeBands(levels: Level[], minScore: number, maxScore: number): Array<{ id: string; min: number; max: number }> {
  const span = maxScore - minScore + 1;
  const sorted = [...levels].sort((a, b) => a.order - b.order);
  const rawWidths = sorted.map((l) => l.weight * span);
  const widths = rawWidths.map((w) => Math.max(1, Math.round(w)));
  const drift = span - widths.reduce((a, b) => a + b, 0);
  widths[widths.length - 1] += drift;

  let cursor = minScore;
  return sorted.map((l, i) => {
    const min = cursor;
    const max = i === widths.length - 1 ? maxScore : cursor + widths[i] - 1;
    cursor = max + 1;
    return { id: l.id, min, max };
  });
}

export function scoreToLevel(totalScore: number): Level {
  const sorted = [...LEVELS].sort((a, b) => a.order - b.order);
  return (
    sorted.find((l) => totalScore >= l.band.min && totalScore <= l.band.max) ??
    sorted[0]
  );
}

/** Sum depth answers only (ignore any stray keys). */
export function sumDepthAnswers(answers: Record<string, number>, aspects: Aspect[] = ASPECTS): number {
  return aspects.reduce((sum, a) => sum + (answers[a.depth.id] ?? 0), 0);
}

export function sumAnswers(answers: Record<string, number>): number {
  return sumDepthAnswers(answers);
}

function shuffled<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Build quiz steps: shuffle aspect pairs as units; within each direction
 * question, shuffle the five animal options.
 */
export function buildQuizSteps(aspects: Aspect[] = ASPECTS, shuffle = QUIZ.shuffle): QuizStep[] {
  const ordered = shuffle ? shuffled(aspects) : [...aspects];
  return ordered.flatMap((aspect) => {
    const directionOptions = shuffle
      ? shuffled(aspect.direction.options)
      : aspect.direction.options;
    return [
      {
        aspectId: aspect.id,
        kind: 'direction' as const,
        question: { ...aspect.direction, options: directionOptions },
      },
      {
        aspectId: aspect.id,
        kind: 'depth' as const,
        question: aspect.depth,
      },
    ];
  });
}
