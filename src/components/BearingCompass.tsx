import type { CSSProperties } from 'react';
import { BEARINGS, type BearingId, type BearingMixItem } from '../data/bearings';
import { useT } from '../i18n/useT';

interface BearingCompassProps {
  mix: BearingMixItem[];
  highlightIds: BearingId[];
  tendId?: BearingId;
}

/** N/E/S/W: % of the padded compass box (outer ring). E/W nudged slightly out. */
const OUTER_POS: Record<Exclude<BearingId, 'earth'>, { x: number; y: number }> = {
  water: { x: 50, y: 3.5 },
  wood: { x: 98.5, y: 50 },
  fire: { x: 50, y: 96.5 },
  metal: { x: 1.5, y: 50 },
};

/**
 * Earth: % of the illustration (inside art wrap).
 * Anchor on the inner gold rim; CSS hangs the badge upward into the gold band.
 */
const EARTH_ART_POS = { x: 50, y: 68.5 };

function PctBadge({
  bearingId,
  animal,
  pct,
  hot,
  thin,
  className,
  style,
}: {
  bearingId: BearingId;
  animal: string;
  pct: number;
  hot: boolean;
  thin: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={[
        'bearingCompassPoint',
        `bearingCompassPoint--${bearingId}`,
        hot ? 'isPrimary' : '',
        thin ? 'isTend' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      <span className="bearingCompassPct" aria-label={`${animal} ${pct}%`}>
        {pct}%
      </span>
    </div>
  );
}

export function BearingCompass({ mix, highlightIds, tendId }: BearingCompassProps) {
  const { L, t } = useT();
  const byId = Object.fromEntries(mix.map((m) => [m.bearingId, m])) as Record<
    BearingId,
    BearingMixItem
  >;

  const earth = BEARINGS.find((b) => b.id === 'earth')!;
  const earthPct = byId.earth?.percent ?? 0;
  const earthHot = highlightIds.includes('earth');
  const earthThin = tendId === 'earth' && !earthHot;

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
        <PctBadge
          bearingId="earth"
          animal={L(earth.animal)}
          pct={earthPct}
          hot={earthHot}
          thin={earthThin}
          style={{ left: `${EARTH_ART_POS.x}%`, top: `${EARTH_ART_POS.y}%` }}
        />
      </div>

      {(Object.keys(OUTER_POS) as Array<keyof typeof OUTER_POS>).map((id) => {
        const b = BEARINGS.find((x) => x.id === id)!;
        const pos = OUTER_POS[id];
        const pct = byId[id]?.percent ?? 0;
        const hot = highlightIds.includes(id);
        const thin = tendId === id && !hot;
        return (
          <PctBadge
            key={id}
            bearingId={id}
            animal={L(b.animal)}
            pct={pct}
            hot={hot}
            thin={thin}
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          />
        );
      })}
    </div>
  );
}
