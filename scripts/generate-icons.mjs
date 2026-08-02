// One-off PWA icon generator: a simple compass-rose mark matching
// AppLogo.tsx's spirit, light-theme (dusk-violet) colors baked in — these
// are OS launcher icons, not re-themed at runtime. Re-run with
// `npm run icons` if the mark changes.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'public', 'icons');
fs.mkdirSync(OUT_DIR, { recursive: true });

function compassSvg({ size, bg, includeBg = true, scale = 1 }) {
  const cx = size / 2;
  const r = size * 0.34 * scale;
  const needle = size * 0.24 * scale;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    ${includeBg ? `<rect width="${size}" height="${size}" fill="${bg}" />` : ''}
    <circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="#b8985c" stroke-width="${size * 0.02}" />
    <polygon points="${cx},${cx - needle} ${cx + needle * 0.28},${cx} ${cx},${cx + needle} ${cx - needle * 0.28},${cx}" fill="#5f4b8b" />
    <circle cx="${cx}" cy="${cx}" r="${size * 0.02}" fill="#f3f1f8" />
  </svg>`;
}

async function render(name, size, opts) {
  const svg = compassSvg({ size, ...opts });
  await sharp(Buffer.from(svg)).png().toFile(path.join(OUT_DIR, name));
  console.log(`icons: wrote ${name} (${size}x${size})`);
}

await render('icon192.png', 192, { bg: '#f3f1f8' });
await render('icon512.png', 512, { bg: '#f3f1f8' });
await render('iconMaskable512.png', 512, { bg: '#f3f1f8', scale: 0.62 });
await render('apple-touch-icon.png', 180, { bg: '#f3f1f8' });
await sharp(Buffer.from(compassSvg({ size: 64, bg: '#f3f1f8' })))
  .png()
  .toFile(path.join(OUT_DIR, 'favicon.ico').replace('.ico', '.png'));
// Simple fallback: ship a PNG at the .ico path — every modern browser
// accepts a PNG served via <link rel="icon">; a true multi-res .ico isn't
// needed here.
fs.copyFileSync(path.join(OUT_DIR, 'favicon.png'), path.join(OUT_DIR, 'favicon.ico'));

console.log('\nicons: done.');
