// Generate PWA / favicon sizes from the authored app mark (app-logo-alt).
// Re-run with `npm run icons` whenever that source changes.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'icons');
const SOURCE = path.join(OUT_DIR, 'app-logo-alt.png');
const BG = '#f3f1f8';

fs.mkdirSync(OUT_DIR, { recursive: true });

if (!fs.existsSync(SOURCE)) {
  console.error(`icons: missing source ${SOURCE}`);
  process.exit(1);
}

async function writeSquare(name, size) {
  await sharp(SOURCE)
    .resize(size, size, { fit: 'cover', position: 'centre' })
    .png()
    .toFile(path.join(OUT_DIR, name));
  console.log(`icons: wrote ${name} (${size}x${size})`);
}

/** Maskable icons need ~20% safe-zone padding so Android masks don't crop the mark. */
async function writeMaskable(name, size, contentScale = 0.8) {
  const inner = Math.round(size * contentScale);
  const logo = await sharp(SOURCE)
    .resize(inner, inner, { fit: 'contain', background: { r: 243, g: 241, b: 248, alpha: 1 } })
    .png()
    .toBuffer();
  const offset = Math.round((size - inner) / 2);
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 3,
      background: BG,
    },
  })
    .composite([{ input: logo, left: offset, top: offset }])
    .png()
    .toFile(path.join(OUT_DIR, name));
  console.log(`icons: wrote ${name} (${size}x${size}, maskable)`);
}

await writeSquare('icon192.png', 192);
await writeSquare('icon512.png', 512);
await writeMaskable('iconMaskable512.png', 512);
await writeSquare('apple-touch-icon.png', 180);
await writeSquare('favicon.png', 64);
// Compact mark for the in-app header / export canvas (source is multi-MB).
await writeSquare('app-logo-ui.png', 128);
fs.copyFileSync(path.join(OUT_DIR, 'favicon.png'), path.join(OUT_DIR, 'favicon.ico'));

console.log('\nicons: done.');
