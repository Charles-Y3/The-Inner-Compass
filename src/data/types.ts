import type { Localized } from '../i18n/types';
import type { BearingId } from './bearings';

export interface DepthOption {
  value: 1 | 2 | 3 | 4 | 5;
  label: Localized<string>;
}

export interface DirectionOption {
  bearingId: BearingId;
  label: Localized<string>;
}

export interface DirectionQuestion {
  id: string;
  kind: 'direction';
  prompt: Localized<string>;
  options: DirectionOption[];
}

export interface DepthQuestion {
  id: string;
  kind: 'depth';
  prompt: Localized<string>;
  options: DepthOption[];
}

export interface Aspect {
  id: string;
  direction: DirectionQuestion;
  depth: DepthQuestion;
}

/** Flat step used by the questions UI (pair order preserved). */
export type QuizStep =
  | { aspectId: string; kind: 'direction'; question: DirectionQuestion }
  | { aspectId: string; kind: 'depth'; question: DepthQuestion };

export interface ScoreBand {
  min: number;
  max: number;
}

export interface Level {
  id: string;
  order: number;
  name: Localized<string>;
  /** Used by Inner Compass (a named "stage" alongside the level name); omit for Cayce Reflection. */
  stage?: Localized<string>;
  description: Localized<string>;
  /** Used by Inner Compass; omit for Cayce Reflection. */
  encouragement?: Localized<string>;
  /** Used by Cayce Reflection; omit for Inner Compass. */
  strengths?: Localized<string[]>;
  /** Used by Cayce Reflection; omit for Inner Compass. */
  improvements?: Localized<string[]>;
  /** Share of respondents this level is meant to represent — see data/quiz.ts */
  weight: number;
  band: ScoreBand;
}

export type ScaleMode = 'per-item' | 'shared';

export interface SharedScaleOption {
  value: 1 | 2 | 3 | 4 | 5;
  label: Localized<string>;
}

export interface QuizConfig {
  id: string;
  scaleMode: ScaleMode;
  points: 5;
  /** Shuffle aspect pairs as units; shuffle direction options within each pair. */
  shuffle: boolean;
  selfRating: boolean;
  sharedScale?: SharedScaleOption[];
  minScore: number;
  maxScore: number;
  aspectCount: number;
  stepCount: number;
}
