import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { BearingId } from '../data/bearings';
import type { HeartNote } from './HistoryContext';

interface QuizSession {
  selfRatingLevelId: string | null;
  /** Depth answers: depth question id -> 1..5 */
  answers: Record<string, number>;
  /** Direction answers: aspect id -> bearing */
  directionAnswers: Record<string, BearingId>;
  startedAt: number | null;
  heartNote: HeartNote | null;
  /** Set once results are persisted so refresh does not duplicate history. */
  savedEntryId: string | null;
}

interface QuizContextValue extends QuizSession {
  setSelfRating: (levelId: string) => void;
  setAnswer: (questionId: string, value: number) => void;
  setDirectionAnswer: (aspectId: string, bearingId: BearingId) => void;
  setHeartNote: (note: HeartNote) => void;
  markSaved: (entryId: string) => void;
  start: () => void;
  clear: () => void;
}

const STORAGE_KEY = 'ic:session';
const EMPTY: QuizSession = {
  selfRatingLevelId: null,
  answers: {},
  directionAnswers: {},
  startedAt: null,
  heartNote: null,
  savedEntryId: null,
};

function read(): QuizSession {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return EMPTY;
  }
}

function write(session: QuizSession) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // sessionStorage unavailable — quiz just won't survive a refresh
  }
}

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<QuizSession>(() => read());

  useEffect(() => write(session), [session]);

  const value = useMemo<QuizContextValue>(
    () => ({
      ...session,
      setSelfRating: (levelId) => setSession((s) => ({ ...s, selfRatingLevelId: levelId })),
      setAnswer: (questionId, val) =>
        setSession((s) => ({ ...s, answers: { ...s.answers, [questionId]: val } })),
      setDirectionAnswer: (aspectId, bearingId) =>
        setSession((s) => ({
          ...s,
          directionAnswers: { ...s.directionAnswers, [aspectId]: bearingId },
        })),
      setHeartNote: (note) => setSession((s) => ({ ...s, heartNote: note })),
      markSaved: (entryId) => setSession((s) => ({ ...s, savedEntryId: entryId })),
      start: () => setSession((s) => ({ ...s, startedAt: s.startedAt ?? Date.now() })),
      clear: () => setSession(EMPTY),
    }),
    [session],
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz(): QuizContextValue {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error('useQuiz must be used within QuizProvider');
  return ctx;
}
