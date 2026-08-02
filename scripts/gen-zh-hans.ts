// Build-time script: collects every Traditional Chinese string authored in
// this app's content/UI data, converts each to Simplified Chinese via
// opencc-js, and writes a flat lookup table consumed at runtime by
// src/i18n/L.ts. Run with `npm run gen:i18n` whenever content changes.
//
// This repo's i18n direction is the REVERSE of Atlas of Wisdom / Journey
// to Great Harmony (which author zh-Hans and generate zh-Hant) — see the
// header comment in src/i18n/types.ts for why. Converter direction below
// is deliberately `tw` -> `cn`, character-level only:
//
//   OpenCC.Converter({ from: 'tw', to: 'cn' })   -- correct
//   OpenCC.Converter({ from: 'twp', to: 'cn' })  -- WRONG for this content
//
// `twp` also swaps Taiwan *vocabulary* for Mainland equivalents. This
// app's register (道務, 修行, 心念, 覺悟) should keep its lexis and only
// change glyphs — do not "fix" this to `twp`.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as OpenCC from 'opencc-js';

import { ASPECTS } from '../src/data/questions';
import { LEVELS } from '../src/data/levels';
import { BEARINGS } from '../src/data/bearings';
import { UI } from '../src/i18n/strings';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const CJK = /[㐀-鿿豈-﫿]/;

/** Recursively collect every full string value that contains CJK text. */
function collect(value: unknown, out: Set<string>): void {
  if (typeof value === 'string') {
    if (CJK.test(value)) out.add(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const v of value) collect(v, out);
    return;
  }
  if (value && typeof value === 'object') {
    for (const v of Object.values(value as Record<string, unknown>)) collect(v, out);
  }
}

const found = new Set<string>();
for (const root_ of [ASPECTS, LEVELS, BEARINGS, UI]) {
  collect(root_, found);
}

const converter = OpenCC.Converter({ from: 'tw', to: 'cn' });
const map: Record<string, string> = {};
for (const s of found) {
  const converted = converter(s);
  if (converted !== s) map[s] = converted;
}

const outPath = path.join(root, 'src/i18n/zhHans.generated.json');
fs.writeFileSync(outPath, JSON.stringify(map), 'utf8');
console.log(
  `gen-zh-hans: wrote ${Object.keys(map).length} entries (of ${found.size} unique zh strings scanned) -> ${path.relative(root, outPath)}`,
);
