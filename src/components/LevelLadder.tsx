import type { Level } from '../data/types';
import { useT } from '../i18n/useT';

interface LevelLadderProps {
  levels: Level[];
  activeLevelId?: string | null;
  title?: string;
}

export function LevelLadder({ levels, activeLevelId, title }: LevelLadderProps) {
  const { L } = useT();
  const sorted = [...levels].sort((a, b) => b.order - a.order);
  return (
    <div className="levelLadder">
      {title && <div className="levelLadderTitle">{title}</div>}
      {sorted.map((l) => (
        <div key={l.id} className={`levelLadderRow ${l.id === activeLevelId ? 'levelLadderRowActive' : ''}`}>
          {L(l.name)}
        </div>
      ))}
    </div>
  );
}
