import type { Level } from '../data/types';
import { useT } from '../i18n/useT';

export function LevelCard({ level, feedback }: { level: Level; feedback?: string }) {
  const { L } = useT();
  return (
    <div className="levelCard">
      {level.stage && <div className="levelCardStage">{L(level.stage)}</div>}
      <h2 className="levelCardName">{L(level.name)}</h2>
      {feedback && <p className="levelCardFeedback">{feedback}</p>}
      <p className="levelCardDescription">{L(level.description)}</p>
      {level.encouragement && <p className="levelCardEncouragement">{L(level.encouragement)}</p>}
    </div>
  );
}
