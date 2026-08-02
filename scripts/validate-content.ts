// prebuild gate. Fails loudly (non-zero exit) rather than shipping broken
// or stale content. Run manually with `npm run validate-content`.
import * as OpenCC from 'opencc-js';
import { ASPECTS } from '../src/data/questions';
import { LEVELS } from '../src/data/levels';
import { BEARINGS, type BearingId } from '../src/data/bearings';
import { QUIZ, computeBands } from '../src/data/quiz';
import { UI } from '../src/i18n/strings';
import hansMap from '../src/i18n/zhHans.generated.json';

const CJK = /[㐀-鿿豈-﫿]/;
const errors: string[] = [];
const BEARING_IDS = new Set(BEARINGS.map((b) => b.id));

const ALLOW_CJK_IN_EN = new Set([
  'UI/langGate_zhHant',
  'UI/langGate_zhHans',
]);

function checkLocalized(path: string, loc: { en: unknown; zhHant: unknown }) {
  const enVal = loc.en;
  const zhVal = loc.zhHant;
  const enStr = Array.isArray(enVal) ? enVal.join(' ') : String(enVal ?? '');
  const zhStr = Array.isArray(zhVal) ? zhVal.join(' ') : String(zhVal ?? '');
  if (!enStr.trim()) errors.push(`${path}: empty "en"`);
  if (!zhStr.trim()) errors.push(`${path}: empty "zhHant"`);
  if (Array.isArray(enVal) && Array.isArray(zhVal) && enVal.length !== zhVal.length) {
    errors.push(`${path}: en[] and zhHant[] have different lengths (${enVal.length} vs ${zhVal.length})`);
  }
  if (CJK.test(enStr) && !ALLOW_CJK_IN_EN.has(path)) {
    errors.push(`${path}: "en" contains CJK characters — looks untranslated`);
  }
  if (enStr && !CJK.test(zhStr) && zhStr.length > 8) {
    errors.push(`${path}: "zhHant" has no CJK characters and is longer than 8 chars — looks untranslated`);
  }
}

// --- Rule 1: completeness ------------------------------------------------
for (const aspect of ASPECTS) {
  checkLocalized(`aspects/${aspect.id}/direction/prompt`, aspect.direction.prompt);
  aspect.direction.options.forEach((o, i) =>
    checkLocalized(`aspects/${aspect.id}/direction/options[${i}]`, o.label),
  );
  checkLocalized(`aspects/${aspect.id}/depth/prompt`, aspect.depth.prompt);
  aspect.depth.options.forEach((o, i) =>
    checkLocalized(`aspects/${aspect.id}/depth/options[${i}]`, o.label),
  );
}
for (const l of LEVELS) {
  checkLocalized(`levels/${l.id}/name`, l.name);
  if (l.stage) checkLocalized(`levels/${l.id}/stage`, l.stage);
  checkLocalized(`levels/${l.id}/description`, l.description);
  if (l.encouragement) checkLocalized(`levels/${l.id}/encouragement`, l.encouragement);
}
for (const b of BEARINGS) {
  checkLocalized(`bearings/${b.id}/direction`, b.direction);
  checkLocalized(`bearings/${b.id}/element`, b.element);
  checkLocalized(`bearings/${b.id}/animal`, b.animal);
  checkLocalized(`bearings/${b.id}/virtue`, b.virtue);
  checkLocalized(`bearings/${b.id}/blurb`, b.blurb);
  checkLocalized(`bearings/${b.id}/strengths`, b.strengths);
  checkLocalized(`bearings/${b.id}/toWorkOn`, b.toWorkOn);
  checkLocalized(`bearings/${b.id}/whenThin`, b.whenThin);
  if (!b.glyph?.trim()) errors.push(`bearings/${b.id}: missing glyph`);
}
for (const [key, val] of Object.entries(UI)) {
  checkLocalized(`UI/${key}`, val);
}

// --- Rule 2: generated-Simplified staleness ------------------------------
const converter = OpenCC.Converter({ from: 'tw', to: 'cn' });
const found = new Set<string>();
function collect(value: unknown): void {
  if (typeof value === 'string') {
    if (CJK.test(value)) found.add(value);
    return;
  }
  if (Array.isArray(value)) return value.forEach(collect);
  if (value && typeof value === 'object') Object.values(value as Record<string, unknown>).forEach(collect);
}
[ASPECTS, LEVELS, BEARINGS, UI].forEach(collect);
const expected: Record<string, string> = {};
for (const s of found) {
  const converted = converter(s);
  if (converted !== s) expected[s] = converted;
}
const actual = hansMap as Record<string, string>;
const expectedKeys = Object.keys(expected).sort();
const actualKeys = Object.keys(actual).sort();
const stale =
  expectedKeys.length !== actualKeys.length ||
  expectedKeys.some((k, i) => k !== actualKeys[i] || expected[k] !== actual[k]);
if (stale) {
  errors.push('zhHans.generated.json is stale — run `npm run gen:i18n` and commit src/i18n/zhHans.generated.json');
}

// --- Rule 3: structural content rules ------------------------------------
const sortedLevels = [...LEVELS].sort((a, b) => a.order - b.order);
sortedLevels.forEach((l, i) => {
  if (l.order !== i + 1) errors.push(`levels: order is not contiguous 1..n at "${l.id}" (got ${l.order}, expected ${i + 1})`);
});
const weightSum = LEVELS.reduce((a, l) => a + l.weight, 0);
if (Math.abs(weightSum - 1) > 0.005) {
  errors.push(`levels: weights sum to ${weightSum.toFixed(3)}, expected 1.000`);
}
let cursor = QUIZ.minScore;
for (const l of sortedLevels) {
  if (l.band.min !== cursor) {
    errors.push(`levels/${l.id}: band.min (${l.band.min}) does not continue from the previous band's max+1 (expected ${cursor})`);
  }
  cursor = l.band.max + 1;
}
if (cursor - 1 !== QUIZ.maxScore) {
  errors.push(`levels: bands cover up to ${cursor - 1}, expected they cover up to QUIZ.maxScore (${QUIZ.maxScore})`);
}
const recomputed = computeBands(LEVELS, QUIZ.minScore, QUIZ.maxScore);
recomputed.forEach((b) => {
  const l = LEVELS.find((x) => x.id === b.id)!;
  if (Math.abs(l.band.min - b.min) > 2 || Math.abs(l.band.max - b.max) > 2) {
    console.warn(
      `warn: levels/${l.id} band [${l.band.min}-${l.band.max}] drifted from its weight-derived band [${b.min}-${b.max}] by more than 2 — check it's still intentional`,
    );
  }
});

if (ASPECTS.length !== QUIZ.aspectCount) {
  errors.push(`aspects: found ${ASPECTS.length}, QUIZ.aspectCount is ${QUIZ.aspectCount}`);
}
if (QUIZ.stepCount !== ASPECTS.length * 2) {
  errors.push(`QUIZ.stepCount (${QUIZ.stepCount}) should be aspects * 2 (${ASPECTS.length * 2})`);
}
if (QUIZ.minScore !== ASPECTS.length || QUIZ.maxScore !== ASPECTS.length * 5) {
  errors.push(`QUIZ score range should be [${ASPECTS.length}, ${ASPECTS.length * 5}], got [${QUIZ.minScore}, ${QUIZ.maxScore}]`);
}

const ids = new Set<string>();
const aspectIds = new Set<string>();
for (const aspect of ASPECTS) {
  if (aspectIds.has(aspect.id)) errors.push(`aspects: duplicate id "${aspect.id}"`);
  aspectIds.add(aspect.id);

  const dir = aspect.direction;
  const depth = aspect.depth;
  if (dir.kind !== 'direction') errors.push(`aspects/${aspect.id}: direction.kind must be "direction"`);
  if (depth.kind !== 'depth') errors.push(`aspects/${aspect.id}: depth.kind must be "depth"`);

  for (const qid of [dir.id, depth.id]) {
    if (ids.has(qid)) errors.push(`questions: duplicate id "${qid}"`);
    ids.add(qid);
  }

  if (dir.options.length !== QUIZ.points) {
    errors.push(`aspects/${aspect.id}/direction: has ${dir.options.length} options, expected ${QUIZ.points}`);
  }
  const dirBearings = new Set<BearingId>();
  for (const o of dir.options) {
    if (!BEARING_IDS.has(o.bearingId)) {
      errors.push(`aspects/${aspect.id}/direction: unknown bearingId "${o.bearingId}"`);
    }
    if (dirBearings.has(o.bearingId)) {
      errors.push(`aspects/${aspect.id}/direction: duplicate bearingId "${o.bearingId}"`);
    }
    dirBearings.add(o.bearingId);
  }
  for (const b of BEARINGS) {
    if (!dirBearings.has(b.id)) {
      errors.push(`aspects/${aspect.id}/direction: missing option for bearing "${b.id}"`);
    }
  }

  if (depth.options.length !== QUIZ.points) {
    errors.push(`aspects/${aspect.id}/depth: has ${depth.options.length} options, expected ${QUIZ.points}`);
  }
  const values = depth.options.map((o) => o.value).sort();
  const expectedValues = Array.from({ length: QUIZ.points }, (_, i) => i + 1);
  if (JSON.stringify(values) !== JSON.stringify(expectedValues)) {
    errors.push(`aspects/${aspect.id}/depth: option values are ${JSON.stringify(values)}, expected ${JSON.stringify(expectedValues)}`);
  }
}

// --- Report ---------------------------------------------------------------
if (errors.length) {
  console.error(`validate-content: ${errors.length} problem(s) found:\n`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log(
    `validate-content: OK (${ASPECTS.length} aspects / ${ASPECTS.length * 2} steps, ${LEVELS.length} levels, ${BEARINGS.length} bearings, ${Object.keys(UI).length} UI strings)`,
  );
}
