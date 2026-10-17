import { darkOf, hexHsl, hueDist, onColor, rgbHex } from './math.js';
import { hexToOklab } from './oklch.js';
import { generate } from './palette.js';

export function extractColors(src) {
  const W = src.naturalWidth || src.width,
    H = src.naturalHeight || src.height;

  const sc = Math.min(1, 150 / Math.max(W, H));
  const w = Math.max(1, Math.round(W * sc)),
    h = Math.max(1, Math.round(H * sc));

  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(src, 0, 0, w, h);

  const d = ctx.getImageData(0, 0, w, h).data;

  const B = new Map(); let total = 0;
  for (let i = 0;
    i < d.length;
    i += 4) {
    if (d[i + 3] < 125)
      continue;

    const r = d[i],
      g = d[i + 1],
      b = d[i + 2];
    const k = (r >> 4) << 8 | (g >> 4) << 4 | (b >> 4);

    let o = B.get(k);

    if (!o) {
      o = { n: 0, r: 0, g: 0, b: 0 };
      B.set(k, o);
    }
    o.n++;
    o.r += r;
    o.g += g;
    o.b += b;
    total++;
  }
  const arr = [...B.values()].map(o => ({
    hex: rgbHex([o.r / o.n, o.g / o.n, o.b / o.n]), n: o.n
  })).sort((a, b) => b.n - a.n);
  const picked = [];
  for (const c of arr) {
    const lab = hexToOklab(c.hex);
    const near = picked.find(p => Math.hypot(p.lab[0] - lab[0], p.lab[1] - lab[1], p.lab[2] - lab[2]) < 0.085);
    if (near) { near.n += c.n; continue; }
    if (picked.length < 8) picked.push({ hex: c.hex, n: c.n, lab });
  }
  return picked.map(p => ({ hex: p.hex, pct: total ? p.n / total : 0 })).sort((a, b) => b.pct - a.pct);
}

export function paletteFromImage(cols) {
  const sc = cols.map(c => { const [h, s, l] = hexHsl(c.hex); return { ...c, h, s, l, ch: s * (1 - Math.abs(2 * l / 100 - 1)) }; });
  const colorful = sc.filter(c => c.ch > 18).sort((a, b) => b.ch * (0.35 + b.pct) - a.ch * (0.35 + a.pct));
  const prim = colorful[0] || sc.slice().sort((a, b) => a.l - b.l)[0];
  const accent = colorful.find(c => c !== prim && hueDist(c.h, prim.h) > 35);
  const deep = sc.filter(c => c !== prim && c.l < 32).sort((a, b) => b.pct - a.pct)[0];
  const p = generate(prim.hex, accent ? 'comp' : 'mono', 'vivid', true);
  if (accent) p.accent = accent.hex;
  if (deep) p.secondary = deep.hex;
  p.onPrimary = onColor(p.primary, darkOf(p));
  return p;
}
