import type { Localized } from '../i18n/types';
import { localized } from '../i18n/types';

export type BearingId = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

export interface Bearing {
  id: BearingId;
  order: number;
  direction: Localized<string>;
  element: Localized<string>;
  animal: Localized<string>;
  /** Single character / short glyph for compass art */
  glyph: string;
  virtue: Localized<string>;
  /** Short line for the result page — how this virtue shows in practice. */
  blurb: Localized<string>;
  /** Healthy expression — “good at” when primary; “to cultivate” when thin */
  strengths: Localized<string>;
  /** Shadow / excess when this bearing is strong */
  toWorkOn: Localized<string>;
  /** Cost of lacking this virtue — shown when this bearing is thinnest */
  whenThin: Localized<string>;
}

/**
 * Five directions · five elements · five auspicious animals · five constant virtues.
 * Stage (cultivation depth) stays separate; these describe the bearing of practice.
 */
export const BEARINGS: Bearing[] = [
  {
    id: 'wood',
    order: 1,
    direction: localized('East', '東'),
    element: localized('Wood', '木'),
    animal: localized('Dragon', '龍'),
    glyph: '龍',
    virtue: localized('Benevolence', '仁'),
    blurb: localized(
      'Kindness that expands — meeting others with goodwill and a heart that grows outward.',
      '仁慈擴展——以善意待人，心量向外生長。',
    ),
    strengths: localized(
      'Warmth, inclusion, and a natural wish to grow toward others.',
      '溫暖包容，自然願意向他人生長靠近。',
    ),
    toWorkOn: localized(
      'Softness that avoids hard truths, or kindness that forgets boundaries.',
      '過於柔軟而迴避真相，或善意卻失去界限。',
    ),
    whenThin: localized(
      'Life can feel cold or self-enclosed — little room for goodwill to move.',
      '生活易顯冷淡或封閉，善意難有流動的空間。',
    ),
  },
  {
    id: 'fire',
    order: 2,
    direction: localized('South', '南'),
    element: localized('Fire', '火'),
    animal: localized('Phoenix', '鳳'),
    glyph: '鳳',
    virtue: localized('Propriety', '禮'),
    blurb: localized(
      'Clear warmth and right relation — conduct that keeps form without losing heart.',
      '溫明得體——言行有節，不失真心。',
    ),
    strengths: localized(
      'Grace, fitting conduct, and care for how things are done.',
      '優雅得體，重視行事的分寸與合宜。',
    ),
    toWorkOn: localized(
      'Form without heart, or polishing the surface while the inside stays tense.',
      '徒有形式而無真心，或外在光鮮而內在緊繃。',
    ),
    whenThin: localized(
      'Relations can turn careless or brusque — warmth without a fitting shape.',
      '待人易顯隨便或生硬，有熱度卻缺合宜的形。',
    ),
  },
  {
    id: 'earth',
    order: 3,
    direction: localized('Center', '中'),
    element: localized('Earth', '土'),
    animal: localized('Qilin', '麒麟'),
    glyph: '麟',
    virtue: localized('Faith', '信'),
    blurb: localized(
      "Steady trust — keeping one's word and bringing practice into ordinary life.",
      '信實穩厚——言而有信，將修行落實於平常。',
    ),
    strengths: localized(
      'Reliability, follow-through, and a centering presence others can trust.',
      '可靠兌現，予人安定、可託付的中心感。',
    ),
    toWorkOn: localized(
      'Stubborn clinging to old promises, or duty so heavy that life cannot move.',
      '固執舊約不放，或責任過重使生命無法流轉。',
    ),
    whenThin: localized(
      'Words and follow-through can drift apart — hard for trust to take root.',
      '言行易不一致，信任難以生根。',
    ),
  },
  {
    id: 'metal',
    order: 4,
    direction: localized('West', '西'),
    element: localized('Metal', '金'),
    animal: localized('Tiger', '虎'),
    glyph: '虎',
    virtue: localized('Righteousness', '義'),
    blurb: localized(
      'Upright courage — cutting cleanly through ease and hardship without losing integrity.',
      '義勇剛正——順逆皆能切實面對，不失正直。',
    ),
    strengths: localized(
      'Clear cuts, fair stands, and courage when the right path is hard.',
      '能切能立，公道分明，難走的正路也敢行。',
    ),
    toWorkOn: localized(
      'Harshness, cutting people instead of problems, or righteousness without mercy.',
      '過剛傷人，切斷的是人而非事，或有義而無慈。',
    ),
    whenThin: localized(
      'Hard choices may be deferred — fairness softens into convenience.',
      '艱難的抉擇易被延宕，公道容易讓位給方便。',
    ),
  },
  {
    id: 'water',
    order: 5,
    direction: localized('North', '北'),
    element: localized('Water', '水'),
    animal: localized('Turtle', '龜'),
    glyph: '龜',
    virtue: localized('Wisdom', '智'),
    blurb: localized(
      'Deep seeing — stillness, reflection, and ease with the cycles of life.',
      '智慧深觀——安靜反思，安於生命的流轉。',
    ),
    strengths: localized(
      'Patience, insight, and the ability to wait until the pattern is clear.',
      '耐心洞察，能等到格局清明再動。',
    ),
    toWorkOn: localized(
      'Withdrawal that becomes avoidance, or seeing so much that you never act.',
      '退入安靜成了逃避，或看得太多卻遲遲不動。',
    ),
    whenThin: localized(
      'The mind stays busy on the surface — little stillness to see through cycles.',
      '心念易停在表層忙碌，少有安靜看清流轉的時刻。',
    ),
  },
];

export function getBearing(id: BearingId): Bearing {
  return BEARINGS.find((b) => b.id === id) ?? BEARINGS[0];
}

export interface BearingMixItem {
  bearingId: BearingId;
  score: number;
  percent: number;
}

export interface BearingMixResult {
  mix: BearingMixItem[];
  primaryBearingId: BearingId;
  /** Only bearings tied for the single highest percent. */
  coPrimaryBearingIds: BearingId[];
  toTendBearingId: BearingId;
}

/**
 * Virtue mix from direction picks (aspectId -> bearingId).
 * Percents are shares of pick counts and always reconcile to 100.
 * Primary = highest %; to-tend = lowest %. Co-primary only on exact % ties.
 */
export function scoreDirectionMix(directionAnswers: Record<string, BearingId>): BearingMixResult {
  const scores: Record<BearingId, number> = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0,
  };

  for (const id of Object.values(directionAnswers)) {
    if (id in scores) scores[id] += 1;
  }

  const ordered = [...BEARINGS].sort((a, b) => a.order - b.order);
  const raw = ordered.map((b) => scores[b.id]);
  const total = raw.reduce((a, b) => a + b, 0);

  let percents: number[];
  if (total <= 0) {
    const even = Math.floor(100 / ordered.length);
    percents = ordered.map((_, i) => (i === ordered.length - 1 ? 100 - even * (ordered.length - 1) : even));
  } else {
    percents = raw.map((s) => Math.round((100 * s) / total));
    const drift = 100 - percents.reduce((a, b) => a + b, 0);
    // Put rounding drift on the highest raw count so the leader stays clear.
    let bestRaw = 0;
    for (let i = 1; i < raw.length; i++) {
      if (raw[i] > raw[bestRaw]) bestRaw = i;
    }
    percents[bestRaw] += drift;
  }

  const mix: BearingMixItem[] = ordered.map((b, i) => ({
    bearingId: b.id,
    score: raw[i],
    percent: percents[i],
  }));

  const maxPercent = Math.max(...mix.map((m) => m.percent));
  const minPercent = Math.min(...mix.map((m) => m.percent));
  const coPrimaryBearingIds = mix
    .filter((m) => m.percent === maxPercent)
    .sort((a, b) => a.bearingId.localeCompare(b.bearingId))
    .map((m) => m.bearingId);
  const toTendCandidates = mix
    .filter((m) => m.percent === minPercent)
    .sort((a, b) => a.bearingId.localeCompare(b.bearingId));

  return {
    mix: [...mix].sort((a, b) => b.percent - a.percent || b.score - a.score),
    primaryBearingId: coPrimaryBearingIds[0],
    coPrimaryBearingIds,
    toTendBearingId: toTendCandidates[0].bearingId,
  };
}

/** Stacked label: North · Water · Turtle · Wisdom (智) */
export function bearingStackLabel(
  bearing: Bearing,
  resolve: (loc: Localized<string>) => string,
): string {
  return [bearing.direction, bearing.element, bearing.animal, bearing.virtue]
    .map(resolve)
    .join(' · ');
}
