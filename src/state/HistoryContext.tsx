import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { BearingId, BearingMixItem } from '../data/bearings';

export interface HeartNote {
  feelings: string;
  improve: string;
}

export interface HistoryEntry {
  id: string;
  createdAt: number;
  selfRatingLevelId: string | null;
  levelId: string;
  totalScore: number;
  mix: BearingMixItem[];
  primaryBearingId: BearingId;
  coPrimaryBearingIds?: BearingId[];
  toTendBearingId: BearingId;
  heartNote: HeartNote;
}

interface HistoryContextValue {
  entries: HistoryEntry[];
  addEntry: (entry: Omit<HistoryEntry, 'id' | 'createdAt'> & { id?: string; createdAt?: number }) => HistoryEntry;
  getEntry: (id: string) => HistoryEntry | undefined;
  latestEntry: HistoryEntry | null;
}

const STORAGE_KEY = 'ic:history';
const MAX_ENTRIES = 40;

function read(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(entries: HistoryEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // localStorage unavailable — history just won't persist
  }
}

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `h-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const HistoryContext = createContext<HistoryContextValue | null>(null);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<HistoryEntry[]>(() => read());

  useEffect(() => write(entries), [entries]);

  const value = useMemo<HistoryContextValue>(
    () => ({
      entries,
      addEntry: (partial) => {
        const entry: HistoryEntry = {
          id: partial.id ?? newId(),
          createdAt: partial.createdAt ?? Date.now(),
          selfRatingLevelId: partial.selfRatingLevelId,
          levelId: partial.levelId,
          totalScore: partial.totalScore,
          mix: partial.mix,
          primaryBearingId: partial.primaryBearingId,
          coPrimaryBearingIds: partial.coPrimaryBearingIds,
          toTendBearingId: partial.toTendBearingId,
          heartNote: partial.heartNote,
        };
        setEntries((prev) => {
          if (prev.some((e) => e.id === entry.id)) return prev;
          return [entry, ...prev].slice(0, MAX_ENTRIES);
        });
        return entry;
      },
      getEntry: (id) => entries.find((e) => e.id === id),
      latestEntry: entries[0] ?? null,
    }),
    [entries],
  );

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
}

export function useHistory(): HistoryContextValue {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error('useHistory must be used within HistoryProvider');
  return ctx;
}
