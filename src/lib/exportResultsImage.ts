import { BEARINGS, type Bearing, type BearingId, type BearingMixItem } from '../data/bearings';
import type { Localized } from '../i18n/types';

export interface ResultsExportPayload {
  appName: string;
  dateLabel: string;
  stageName: string;
  stageLabel: string;
  feedback?: string;
  description: string;
  encouragement?: string;
  bearingTitle: string;
  primaryLine: string;
  mix: BearingMixItem[];
  primaryIds: BearingId[];
  tendId: BearingId;
  synthesisTitle?: string;
  synthesisBody?: string;
  animalBlocks: Array<{
    title: string;
    stack: string;
    blurb: string;
    label1: string;
    body1: string;
    label2: string;
    body2: string;
  }>;
  heartTitle?: string;
  feelingsLabel?: string;
  feelings?: string;
  improveLabel?: string;
  improve?: string;
  mirrorNote: string;
}

/** Same relative layout as BearingCompass (percent of the compass square). */
const COMPASS_POS: Record<BearingId, { x: number; y: number }> = {
  water: { x: 0.5, y: 0.035 },
  wood: { x: 0.965, y: 0.5 },
  fire: { x: 0.5, y: 0.965 },
  metal: { x: 0.035, y: 0.5 },
  earth: { x: 0.5, y: 0.565 },
};

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [''];
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  if (!text) return [];
  if (!/[\u3000-\u9fff]/.test(text)) return wrap(ctx, text, maxWidth);
  const lines: string[] = [];
  let line = '';
  for (const ch of text) {
    const test = line + ch;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = ch;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export async function exportResultsImage(payload: ResultsExportPayload): Promise<Blob> {
  const width = 720;
  const pad = 40;
  const contentW = width - pad * 2;
  const headerH = 72;
  const compassPad = 28;
  const compassOuter = Math.min(contentW, 420);
  const compassInner = compassOuter - compassPad * 2;

  const [logo, compassArt] = await Promise.all([
    loadImage('/icons/app-logo.png'),
    loadImage('/images/five-animals-compass.png'),
  ]);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  const ctx = canvas.getContext('2d')!;

  let y = pad + headerH + 16;
  const blocks: Array<{ fn: () => void; h: number }> = [];

  function addGap(h: number) {
    blocks.push({ h, fn: () => { y += h; } });
  }

  function addText(
    text: string,
    opts: {
      size?: number;
      color?: string;
      weight?: string;
      italic?: boolean;
      gap?: number;
      align?: CanvasTextAlign;
    } = {},
  ) {
    const size = opts.size ?? 16;
    const font = `${opts.italic ? 'italic ' : ''}${opts.weight ?? '400'} ${size}px Georgia, "Noto Serif TC", "Noto Serif SC", serif`;
    ctx.font = font;
    const lines = wrapText(ctx, text, contentW);
    const lineH = size * 1.45;
    const h = Math.max(lines.length, 1) * lineH + (opts.gap ?? 10);
    const align = opts.align ?? 'left';
    blocks.push({
      h,
      fn: () => {
        ctx.fillStyle = opts.color ?? '#241f33';
        ctx.font = font;
        ctx.textAlign = align;
        const x = align === 'center' ? width / 2 : pad;
        for (const line of lines) {
          ctx.fillText(line, x, y + size);
          y += lineH;
        }
        y += opts.gap ?? 10;
        ctx.textAlign = 'left';
      },
    });
  }

  function addCompass() {
    const h = compassOuter + 20;
    blocks.push({
      h,
      fn: () => {
        const left = (width - compassOuter) / 2;
        const top = y;

        // Outer square (matches CSS padding ring)
        ctx.save();
        // Clip art to circle inside padding
        const artX = left + compassPad;
        const artY = top + compassPad;
        ctx.beginPath();
        ctx.arc(artX + compassInner / 2, artY + compassInner / 2, compassInner / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(compassArt, artX, artY, compassInner, compassInner);
        ctx.restore();

        // Soft ring shadow
        ctx.beginPath();
        ctx.arc(artX + compassInner / 2, artY + compassInner / 2, compassInner / 2, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(36, 31, 51, 0.12)';
        ctx.lineWidth = 2;
        ctx.stroke();

        const byId = Object.fromEntries(payload.mix.map((m) => [m.bearingId, m])) as Record<
          BearingId,
          BearingMixItem
        >;

        for (const b of BEARINGS) {
          const pos = COMPASS_POS[b.id];
          const pct = byId[b.id]?.percent ?? 0;
          const hot = payload.primaryIds.includes(b.id);
          const thin = payload.tendId === b.id && !hot;
          const cx = left + pos.x * compassOuter;
          const cy = top + pos.y * compassOuter;
          const label = `${pct}%`;
          ctx.font = '700 14px system-ui, sans-serif';
          const tw = ctx.measureText(label).width;
          const bw = tw + 16;
          const bh = 24;
          roundRect(ctx, cx - bw / 2, cy - bh / 2, bw, bh, 12);
          if (hot) {
            ctx.fillStyle = '#5f4b8b';
            ctx.fill();
            ctx.fillStyle = '#f7f4ff';
          } else if (thin) {
            ctx.fillStyle = 'rgba(255, 252, 246, 0.96)';
            ctx.fill();
            ctx.setLineDash([3, 2]);
            ctx.strokeStyle = '#9a8bb8';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = '#241f33';
          } else {
            ctx.fillStyle = 'rgba(255, 252, 246, 0.94)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(26, 21, 36, 0.18)';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.fillStyle = '#241f33';
          }
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(label, cx, cy + 0.5);
          ctx.textAlign = 'left';
          ctx.textBaseline = 'alphabetic';
        }

        y += h;
      },
    });
  }

  addText(payload.bearingTitle, { size: 18, weight: '600', color: '#5f4b8b', gap: 6, align: 'center' });
  addText(payload.primaryLine, { size: 14, gap: 12, align: 'center' });
  addCompass();
  addGap(8);

  for (const a of payload.animalBlocks) {
    addText(a.title, { size: 17, weight: '600', color: '#5f4b8b', gap: 4 });
    addText(a.stack, { size: 12, color: '#7b7391', gap: 6 });
    addText(a.blurb, { size: 13, italic: true, color: '#574f6b', gap: 8 });
    addText(a.label1, { size: 12, color: '#7b7391', gap: 2 });
    addText(a.body1, { size: 14, gap: 8 });
    addText(a.label2, { size: 12, color: '#7b7391', gap: 2 });
    addText(a.body2, { size: 14, gap: 16 });
  }

  addText(payload.stageLabel, { size: 13, color: '#7b7391', gap: 4 });
  addText(payload.stageName, { size: 28, weight: '600', color: '#5f4b8b', gap: 12 });
  if (payload.feedback) addText(payload.feedback, { size: 15, color: '#5f4b8b', gap: 12 });
  addText(payload.description, { size: 15, gap: 12 });
  if (payload.encouragement) addText(payload.encouragement, { size: 14, italic: true, color: '#574f6b', gap: 16 });

  if (payload.feelings || payload.improve) {
    if (payload.heartTitle) addText(payload.heartTitle, { size: 17, weight: '600', color: '#5f4b8b', gap: 8 });
    if (payload.feelings && payload.feelingsLabel) {
      addText(payload.feelingsLabel, { size: 12, color: '#7b7391', gap: 2 });
      addText(payload.feelings, { size: 14, gap: 10 });
    }
    if (payload.improve && payload.improveLabel) {
      addText(payload.improveLabel, { size: 12, color: '#7b7391', gap: 2 });
      addText(payload.improve, { size: 14, gap: 12 });
    }
  }

  if (payload.synthesisTitle && payload.synthesisBody) {
    addGap(4);
    addText(payload.synthesisTitle, { size: 20, weight: '600', color: '#5f4b8b', gap: 8, align: 'center' });
    addText(payload.synthesisBody, { size: 15, gap: 16 });
  }

  addText(payload.mirrorNote, { size: 12, color: '#7b7391', gap: 0 });

  const height = pad + headerH + 16 + blocks.reduce((s, b) => s + b.h, 0) + pad;
  canvas.height = Math.ceil(height);

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#f7f5fb');
  grad.addColorStop(1, '#e7e3f0');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, canvas.height);

  ctx.fillStyle = '#fdfcff';
  roundRect(ctx, 16, 16, width - 32, canvas.height - 32, 16);
  ctx.fill();

  // Header: icon top-left; title + date centered
  const iconSize = 40;
  const iconX = pad;
  const iconY = pad + 8;
  ctx.save();
  ctx.beginPath();
  ctx.arc(iconX + iconSize / 2, iconY + iconSize / 2, iconSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(logo, iconX, iconY, iconSize, iconSize);
  ctx.restore();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#5f4b8b';
  ctx.font = '600 22px Georgia, "Noto Serif TC", serif';
  ctx.fillText(payload.appName, width / 2, pad + 28);
  ctx.fillStyle = '#7b7391';
  ctx.font = '400 13px Georgia, "Noto Serif TC", serif';
  ctx.fillText(payload.dateLabel, width / 2, pad + 50);
  ctx.textAlign = 'left';

  y = pad + headerH + 16;
  for (const b of blocks) b.fn();

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('toBlob failed'));
    }, 'image/png');
  });
}

export function buildAnimalExportBlocks(
  bearings: Bearing[],
  resolve: (loc: Localized<string>) => string,
  labels: {
    primary: (animal: string) => string;
    tend: (animal: string) => string;
    strengths: string;
    workOn: string;
    cultivate: string;
    whenThin: string;
  },
  primaryIds: string[],
  tendId: string,
): ResultsExportPayload['animalBlocks'] {
  const blocks: ResultsExportPayload['animalBlocks'] = [];
  for (const id of primaryIds) {
    const b = bearings.find((x) => x.id === id);
    if (!b) continue;
    blocks.push({
      title: labels.primary(resolve(b.animal)),
      stack: [b.direction, b.element, b.animal, b.virtue].map(resolve).join(' · '),
      blurb: resolve(b.blurb),
      label1: labels.strengths,
      body1: resolve(b.strengths),
      label2: labels.workOn,
      body2: resolve(b.toWorkOn),
    });
  }
  if (!primaryIds.includes(tendId)) {
    const b = bearings.find((x) => x.id === tendId);
    if (b) {
      blocks.push({
        title: labels.tend(resolve(b.animal)),
        stack: [b.direction, b.element, b.animal, b.virtue].map(resolve).join(' · '),
        blurb: resolve(b.blurb),
        label1: labels.cultivate,
        body1: resolve(b.strengths),
        label2: labels.whenThin,
        body2: resolve(b.whenThin),
      });
    }
  }
  return blocks;
}
