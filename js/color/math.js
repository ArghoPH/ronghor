export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export function normHex(h) {
  if (h == null) return null;
  h = String(h).trim().replace(/^#/, '');
  if (/^[0-9a-f]{3}$/i.test(h)) h = h.split('').map(c => c + c).join('');
  if (!/^[0-9a-f]{6}$/i.test(h))
    return null;
  return '#' + h.toUpperCase();
}
export function hexToRgb(h) { h = normHex(h) || '#000000'; const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
export function rgbHex(rgb) { return '#' + rgb.map(v => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('').toUpperCase(); }
export function rgbToHsl([r, g, b]) { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0; const l = (mx + mn) / 2; if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); if (mx === r) h = (g - b) / d + (g < b ? 6 : 0); else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h *= 60; } return [h, s * 100, l * 100]; }
export function hslToRgb(h, s, l) { h = ((h % 360) + 360) % 360; s = clamp(s, 0, 100) / 100; l = clamp(l, 0, 100) / 100; const k = n => (n + h / 30) % 12; const a = s * Math.min(l, 1 - l); const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); return [f(0) * 255, f(8) * 255, f(4) * 255]; }
export const hsl = (h, s, l) => rgbHex(hslToRgb(h, s, l));
export const hexHsl = h => rgbToHsl(hexToRgb(h));

export const toLin = c => {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
};

export const fromLin = c => 255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

export function lum(h) {
  const [r, g, b] = hexToRgb(h).map(toLin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a, b) {
  const A = lum(a),
    B = lum(b);
  return (Math.max(A, B) + 0.05) / (Math.min(A, B) + 0.05);
}

export function mix(a, b, t) {
  const A = hexToRgb(a),
    B = hexToRgb(b);
  return rgbHex(A.map((v, i) => v * t + B[i] * (1 - t)));
}

export function ensureContrast(fg, bg, ratio) {
  if (contrast(fg, bg) >= ratio)
    return normHex(fg);
  const [h, s, l] = hexHsl(fg);
  for (let i = 1; i <= 100; i++) {
    for (const d of [-1, 1]) {
      const L = l + d * i;
      if (L < 0 || L > 100)
        continue;
      const c = hsl(h, s, L);
      if (contrast(c, bg) >= ratio)
        return c;
    }
  }
  return contrast('#000000', bg) > contrast('#FFFFFF', bg) ? '#000000' : '#FFFFFF';
}

export function readableBg(c, dark) {
  dark = dark || '#111111';
  const ok = x => Math.max(contrast('#FFFFFF', x), contrast(dark, x)) >= 4.6; if (ok(c))
    return normHex(c);
  const [h, s, l] = hexHsl(c);
  for (let i = 1; i <= 50; i++) {
    for (const d of [1, -1]) {
      const L = l + d * i;
      if (L < 0 || L > 100)
        continue;
      const x = hsl(h, s, L);
      if (ok(x))
        return x;
    }
  }
  return normHex(c);
}

export function onColor(bg, dark) {
  dark = dark || '#111111'; return contrast('#FFFFFF', bg) >= contrast(dark, bg) ? '#FFFFFF' : dark;
}

export const isDark = p => lum(p.bg) < 0.2;

export const darkOf = p => lum(p.text) < lum(p.bg) ? p.text : p.bg;

export const hueDist = (a, b) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d
};
