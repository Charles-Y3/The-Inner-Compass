import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useT } from '../i18n/useT';
import { LEVELS } from '../data/levels';
import { getBearing } from '../data/bearings';
import { Button } from '../components/Button';
import { useHistory, type HistoryEntry } from '../state/HistoryContext';
import { useQuiz } from '../state/QuizContext';

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

function dayKey(ts: number): string {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function monthLabel(year: number, month: number, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale === 'en' ? 'en' : locale, {
      year: 'numeric',
      month: 'long',
    }).format(new Date(year, month, 1));
  } catch {
    return `${year}-${month + 1}`;
  }
}

export function HistoryPage() {
  const navigate = useNavigate();
  const { t, L, locale } = useT();
  const { entries, removeEntry } = useHistory();
  const { clear, start, savedEntryId } = useQuiz();

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const daysWithEntries = useMemo(() => {
    const set = new Set<string>();
    for (const e of entries) set.add(dayKey(e.createdAt));
    return set;
  }, [entries]);

  const filtered: HistoryEntry[] = useMemo(() => {
    if (!selectedDay) return entries;
    return entries.filter((e) => dayKey(e.createdAt) === selectedDay);
  }, [entries, selectedDay]);

  const calendarCells = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const startPad = first.getDay(); // 0 Sun
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: Array<{ day: number | null; key: string | null }> = [];
    for (let i = 0; i < startPad; i++) cells.push({ day: null, key: null });
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ day: d, key });
    }
    return cells;
  }, [viewYear, viewMonth]);

  function shiftMonth(delta: number) {
    const d = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }

  function handleNew() {
    clear();
    start();
    navigate('/levels');
  }

  function handleDelete(entryId: string) {
    if (!window.confirm(t('history_deleteConfirm'))) return;
    removeEntry(entryId);
    if (savedEntryId === entryId) clear();
  }

  return (
    <div className="card">
      <h1 className="title">{t('history_title')}</h1>

      {entries.length > 0 && (
        <div className="historyCalendar" aria-label={t('history_calendarLabel')}>
          <div className="historyCalHeader">
            <button type="button" className="iconButton" onClick={() => shiftMonth(-1)} aria-label={t('history_monthPrev')}>
              ‹
            </button>
            <span className="historyCalMonth">{monthLabel(viewYear, viewMonth, locale)}</span>
            <button type="button" className="iconButton" onClick={() => shiftMonth(1)} aria-label={t('history_monthNext')}>
              ›
            </button>
          </div>
          <div className="historyCalGrid historyCalDow">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <span key={`${d}-${i}`} className="historyCalDowCell">{d}</span>
            ))}
          </div>
          <div className="historyCalGrid">
            {calendarCells.map((cell, i) => {
              if (cell.day == null) return <span key={`e-${i}`} className="historyCalCell isEmpty" />;
              const has = daysWithEntries.has(cell.key!);
              const selected = selectedDay === cell.key;
              return (
                <button
                  key={cell.key}
                  type="button"
                  className={[
                    'historyCalCell',
                    has ? 'hasEntry' : '',
                    selected ? 'isSelected' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setSelectedDay(selected ? null : cell.key)}
                  disabled={!has}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
          <div className="historyCalActions">
            {selectedDay ? (
              <Button type="button" variant="secondary" onClick={() => setSelectedDay(null)}>
                {t('history_filterClear')}
              </Button>
            ) : (
              <span className="historyCalHint">{t('history_filterAll')}</span>
            )}
          </div>
        </div>
      )}

      {entries.length === 0 ? (
        <p className="body" style={{ textAlign: 'center' }}>{t('history_empty')}</p>
      ) : filtered.length === 0 ? (
        <p className="body" style={{ textAlign: 'center' }}>{t('history_noOnDate')}</p>
      ) : (
        <ul className="historyList">
          {filtered.map((entry) => {
            const level = LEVELS.find((l) => l.id === entry.levelId);
            const bearing = getBearing(entry.primaryBearingId);
            const preview = entry.heartNote.feelings.trim().slice(0, 80);
            return (
              <li key={entry.id} className="historyItemRow">
                <button
                  type="button"
                  className="historyItem"
                  onClick={() => navigate(`/history/${entry.id}`)}
                >
                  <span className="historyItemDate">{formatDate(entry.createdAt, locale)}</span>
                  <span className="historyItemStage">
                    {t('history_stage', { name: level ? L(level.name) : entry.levelId })}
                  </span>
                  <span className="historyItemBearing">
                    {t('history_bearing', {
                      animal: L(bearing.animal),
                      virtue: L(bearing.virtue),
                    })}
                  </span>
                  {preview && (
                    <span className="historyItemPreview">
                      {preview}
                      {entry.heartNote.feelings.length > 80 ? '…' : ''}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  className="historyItemDelete"
                  aria-label={t('history_delete')}
                  onClick={() => handleDelete(entry.id)}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
                    <path
                      d="M5 7h14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M8 7v12a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 16 19V7"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M10.5 11v5M13.5 11v5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="buttonRow">
        <Button type="button" variant="secondary" onClick={() => navigate('/')}>{t('history_back')}</Button>
        <Button onClick={handleNew}>{t('history_startNew')}</Button>
      </div>
    </div>
  );
}
