import { BEARINGS, type BearingId, type BearingMixItem } from '../data/bearings';
import { useT } from '../i18n/useT';

interface BearingCompassProps {
  mix: BearingMixItem[];
  highlightIds: BearingId[];
  tendId?: BearingId;
}

/**
 * Percent badges sit in a padding ring around the art so they do not cover
 * the animal name labels baked into the illustration.
 * North turtle, East dragon, South phoenix, West tiger, Center qilin.
 */
const POS: Record<BearingId, { x: number; y: number }> = {
  water: { x: 50, y: 3.5 },
  wood: { x: 96.5, y: 50 },
  fire: { x: 50, y: 96.5 },
  metal: { x: 3.5, y: 50 },
  // Anchor on the Qilin medallion’s lower rim; badge hangs upward (see CSS)
  earth: { x: 50, y: 62 },
};

export function BearingCompass({ mix, highlightIds, tendId }: BearingCompassProps) {
  const { L, t } = useT();
  const byId = Object.fromEntries(mix.map((m) => [m.bearingId, m])) as Record<
    BearingId,
    BearingMixItem
  >;

  return (
    <div
      className="bearingCompass"
      role="img"
      aria-label={t('results_compass_label')}
    >
      <div className="bearingCompassArtWrap">
        <img
          className="bearingCompassArt"
          src="/images/five-animals-compass.png"
          alt=""
          draggable={false}
        />
      </div>

      {BEARINGS.map((b) => {
        const pos = POS[b.id];
        const pct = byId[b.id]?.percent ?? 0;
        const hot = highlightIds.includes(b.id);
        const thin = tendId === b.id && !hot;
        return (
          <div
            key={b.id}
            className={[
              'bearingCompassPoint',
              `bearingCompassPoint--${b.id}`,
              hot ? 'isPrimary' : '',
              thin ? 'isTend' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <span className="bearingCompassPct" aria-label={`${L(b.animal)} ${pct}%`}>
              {pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
