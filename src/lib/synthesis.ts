import type { BearingId } from '../data/bearings';
import { getBearing } from '../data/bearings';
import type { Level } from '../data/types';
import type { Locale, Localized } from '../i18n/types';
import { UI } from '../i18n/strings';

export type SynthesisBand = 'early' | 'mid' | 'late';
export type SynthesisGap = 'match' | 'under' | 'over';

type UiKey = keyof typeof UI;
type TFn = (key: UiKey, vars?: Record<string, string | number>) => string;

export function synthesisBand(order: number): SynthesisBand {
  if (order <= 3) return 'early';
  if (order <= 6) return 'mid';
  return 'late';
}

/** Self vs scored stage: under = self lower than result; over = self higher. */
export function synthesisGap(selfOrder: number | null | undefined, resultOrder: number): SynthesisGap {
  if (selfOrder == null) return 'match';
  if (selfOrder < resultOrder) return 'under';
  if (selfOrder > resultOrder) return 'over';
  return 'match';
}

export function synthesisVars(
  level: Level,
  primaryIds: BearingId[],
  tendId: BearingId,
  resolve: (loc: Localized<string>) => string,
  selfLevel?: Level | null,
): Record<string, string> {
  const tend = getBearing(tendId);
  const primary = getBearing(primaryIds[0]);
  return {
    stageName: resolve(level.name),
    stage: level.stage ? resolve(level.stage) : resolve(level.name),
    selfStageName: selfLevel
      ? resolve(selfLevel.name)
      : resolve(level.name),
    animal: resolve(primary.animal),
    virtue: resolve(primary.virtue),
    element: resolve(primary.element),
    animals: primaryIds.map((id) => resolve(getBearing(id).animal)).join('–'),
    tendAnimal: resolve(tend.animal),
    tendVirtue: resolve(tend.virtue),
  };
}

function joinClauses(parts: string[], locale: Locale): string {
  const cleaned = parts.map((p) => p.trim()).filter(Boolean);
  if (!cleaned.length) return '';
  if (locale === 'en') return cleaned.join(' ');
  // Chinese: clauses already end with 。 — join without extra spaces
  return cleaned.join('');
}

/**
 * Compose summary from gap × stage × primary × tend clause banks.
 * Skips the tend clause when the thinnest bearing is also a primary (exact tie).
 */
export function buildSynthesis(
  t: TFn,
  locale: Locale,
  opts: {
    resultOrder: number;
    selfOrder?: number | null;
    primaryIds: BearingId[];
    tendId: BearingId;
    vars: Record<string, string>;
  },
): string {
  const band = synthesisBand(opts.resultOrder);
  const coPrimary = opts.primaryIds.length > 1;
  const primaryId = opts.primaryIds[0];
  const parts: string[] = [];

  if (opts.selfOrder != null) {
    const gap = synthesisGap(opts.selfOrder, opts.resultOrder);
    const gapKey = (
      {
        match: 'results_syn_gap_match',
        under: 'results_syn_gap_under',
        over: 'results_syn_gap_over',
      } as const
    )[gap];
    parts.push(t(gapKey, opts.vars));
  }

  const stageKey = (
    {
      early: 'results_syn_stage_early',
      mid: 'results_syn_stage_mid',
      late: 'results_syn_stage_late',
    } as const
  )[band];
  parts.push(t(stageKey, opts.vars));

  if (coPrimary) {
    parts.push(t('results_syn_primary_co', opts.vars));
  } else {
    const primaryKey = (
      {
        wood: 'results_syn_primary_wood',
        fire: 'results_syn_primary_fire',
        earth: 'results_syn_primary_earth',
        metal: 'results_syn_primary_metal',
        water: 'results_syn_primary_water',
      } as const
    )[primaryId];
    parts.push(t(primaryKey, opts.vars));
  }

  if (!opts.primaryIds.includes(opts.tendId)) {
    const tendKey = (
      {
        wood: 'results_syn_tend_wood',
        fire: 'results_syn_tend_fire',
        earth: 'results_syn_tend_earth',
        metal: 'results_syn_tend_metal',
        water: 'results_syn_tend_water',
      } as const
    )[opts.tendId];
    parts.push(t(tendKey, opts.vars));
  }

  return joinClauses(parts, locale);
}
