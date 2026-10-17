import { clamp, darkOf, ensureContrast, hexHsl, hsl, hueDist, isDark, mix, normHex, onColor, readableBg } from './math.js';

export function deriveDark(p) {
  const [ph, ps] = hexHsl(p.primary), [bh, bs] = hexHsl(p.bg);

  const h = bs > 8 ? bh : ph, s = clamp((bs > 8 ? bs : ps) * 0.35, 6, 24);

  const bg = hsl(h, s, 8),
    surface = hsl(h, s, 12),
    border = hsl(h, clamp(s, 6, 18), 22),
    text = hsl(h, Math.min(s, 14), 92);

  const muted = ensureContrast(hsl(h, Math.min(s, 12), 68), surface, 4.6);

  const primary = ensureContrast(ensureContrast(p.primary, bg, 4.6), surface, 4.6);

  const [sh, ss, sl] = hexHsl(p.secondary);

  const secondary = readableBg(hsl(sh, ss * 0.85, clamp(sl, 18, 58)), bg);

  const accent = readableBg(ensureContrast(p.accent, bg, 3), bg);
  const q = {
    bg, surface, text, muted, border, primary, secondary, accent,
    success: ensureContrast(p.success, surface, 4.6),
    warning: ensureContrast(p.warning, surface, 4.6),
    danger: ensureContrast(p.danger, surface, 4.6)
  };

  q.onPrimary = onColor(primary, bg);

  return q;
}

export function deriveLight(p) {
  const [ph, ps] = hexHsl(p.primary), [bh, bs] = hexHsl(p.bg);
  const h = bs > 8 ? bh : ph, s = clamp((bs > 8 ? bs : ps) * 0.6, 4, 30);
  const bg = hsl(h, s, 98), surface = '#FFFFFF', border = hsl(h, clamp(s * 0.7, 6, 22), 88), text = hsl(h, clamp(s * 1.3, 8, 40), 11);
  const muted = ensureContrast(hsl(h, clamp(s * 0.5, 6, 16), 40), bg, 4.6);
  const primary = ensureContrast(ensureContrast(p.primary, bg, 4.6), surface, 4.6);
  const [sh, ss, sl] = hexHsl(p.secondary);
  const secondary = readableBg(hsl(sh, ss, clamp(sl, 15, 62)), text);
  const q = {
    bg, surface, text, muted, border, primary, secondary, accent: readableBg(p.accent, text),
    success: ensureContrast(p.success, surface, 4.6), warning: ensureContrast(p.warning, surface, 4.6), danger: ensureContrast(p.danger, surface, 4.6)
  };
  q.onPrimary = onColor(primary, text);
  return q;
}
export function full(p) {
  const dk = darkOf(p), D = isDark(p);
  return {
    ...p,
    onSecondary: onColor(p.secondary, dk), onAccent: onColor(p.accent, dk),
    primaryTint: mix(p.primary, p.surface, D ? 0.22 : 0.12), primarySoft: mix(p.primary, p.surface, D ? 0.45 : 0.32), primaryRing: mix(p.primary, p.surface, 0.3),
    successTint: mix(p.success, p.surface, D ? 0.18 : 0.12), warningTint: mix(p.warning, p.surface, D ? 0.18 : 0.12), dangerTint: mix(p.danger, p.surface, D ? 0.18 : 0.12),
    footerBg: D ? mix('#000000', p.bg, 0.35) : p.text, footerFg: D ? p.text : p.bg, footerMuted: D ? mix(p.text, mix('#000000', p.bg, 0.35), 0.7) : mix(p.bg, p.text, 0.72)
  };
}
export function generate(base, harmony, style, exact) {
  base = normHex(base) || '#1F4FD1';
  const [h, s, l] = hexHsl(base);
  const soft = style === 'soft', dark = style === 'dark';
  const sat = soft ? clamp(s * 0.85, 28, 64) : clamp(Math.max(s, 58), 58, 92);
  const off = { mono: [0, 0], analog: [32, -32], comp: [0, 180], split: [150, 210], triad: [120, 240] }[harmony] || [0, 180];
  const h2 = (h + off[0] + 360) % 360, h3 = (h + off[1] + 360) % 360;
  const ns = clamp(s * 0.35, 4, soft ? 20 : 28);
  const p = {};

  if (!dark) {
    p.bg = hsl(h, ns, soft ? 97.5 : 98); p.surface = '#FFFFFF'; p.border = hsl(h, clamp(ns, 6, 22), 88);
    p.text = hsl(h, clamp(ns * 1.6, 8, 40), 11);
    p.muted = ensureContrast(hsl(h, clamp(ns, 6, 16), 41), p.bg, 4.6);

    if (exact) p.primary = base;
    else {
      let pr = hsl(h, sat, clamp(l, 32, 50));
      const pd = ensureContrast(pr, '#FFFFFF', 4.6);
      if (hexHsl(pd)[2] >= hexHsl(pr)[2] - 16) pr = pd;
      p.primary = ensureContrast(pr, p.bg, 4.6);
    }

    p.secondary = harmony === 'mono' ? (soft ? hsl(h, sat * 0.5, 90) : hsl(h, sat * 0.75, 20)) : (soft ? hsl(h2, sat * 0.55, 88) : hsl(h2, clamp(sat * 0.7, 30, 75), 24));
    p.accent = harmony === 'mono' ? hsl(h, clamp(sat + 12, 50, 95), soft ? 70 : 58) : hsl(h3, clamp(sat + 8, 50, 95), soft ? 70 : 55);
    const sm = soft ? 0.8 : 1;
    p.success = ensureContrast(hsl(145, 60 * sm, 34), '#FFFFFF', 4.6);
    p.warning = ensureContrast(hsl(32, 90 * sm, 38), '#FFFFFF', 4.6);
    p.danger = ensureContrast(hsl(hueDist(h, 356) < 22 ? 342 : 356, 72 * sm, 45), '#FFFFFF', 4.6);

  } else {
    p.bg = hsl(h, clamp(ns, 6, 24), 7); p.surface = hsl(h, clamp(ns, 6, 22), 11); p.border = hsl(h, clamp(ns, 6, 18), 20);
    p.text = hsl(h, clamp(ns, 4, 14), 93);
    p.muted = ensureContrast(hsl(h, 10, 66), p.surface, 4.6);
    p.primary = exact ? base : ensureContrast(ensureContrast(hsl(h, sat, clamp(l, 55, 68)), p.bg, 4.6), p.surface, 4.6);
    p.secondary = harmony === 'mono' ? hsl(h, sat * 0.5, 18) : hsl(h2, sat * 0.55, 20);
    p.accent = hsl(harmony === 'mono' ? h : h3, clamp(sat + 5, 50, 95), 62);
    p.success = ensureContrast(hsl(145, 55, 50), p.surface, 4.6);
    p.warning = ensureContrast(hsl(40, 90, 55), p.surface, 4.6);
    p.danger = ensureContrast(hsl(hueDist(h, 356) < 22 ? 342 : 356, 85, 68), p.surface, 4.6);
  }
  p.secondary = readableBg(p.secondary, darkOf(p)); p.accent = readableBg(p.accent, darkOf(p));
  p.onPrimary = onColor(p.primary, darkOf(p));
  return p;
}
