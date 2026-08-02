import { useT } from '../i18n/useT';

export function ProgressLine({ current, total }: { current: number; total: number }) {
  const { t } = useT();
  const pct = Math.round((current / total) * 100);
  return (
    <div>
      <div className="progressLine">
        <div className="progressLineFill" style={{ width: `${pct}%` }} />
      </div>
      <div className="progressLabel">{t('questions_progress', { current, total })}</div>
    </div>
  );
}
