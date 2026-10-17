import { clamp, fromLin, hexToRgb, rgbHex, toLin } from './math.js';

export function hexToOklab(hex) {
  const [r, g, b] = hexToRgb(hex).map(toLin);

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b),
    m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b),
    s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  return [
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
  ];
}

export function hexToOklch(hex) {
  const [L, a, b] = hexToOklab(hex);
  return [
    L, Math.hypot(a, b),
    (Math.atan2(b, a) * 180 / Math.PI + 360) % 360];
}

export function oklchLin(L, C, H) {
  const a = C * Math.cos(H * Math.PI / 180), b = C * Math.sin(H * Math.PI / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3, m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3, s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
  ];
}

export function oklchHex(L, C, H) {
  let c = C;
  for (let i = 0; i < 60; i++) {
    const v = oklchLin(L, c, H);
    if (v.every(x => x >= -0.0008 && x <= 1.0008))
      return rgbHex(v.map(x => fromLin(clamp(x, 0, 1)))); c *= 0.92;
  }
  return rgbHex(oklchLin(L, 0, H).map(x => fromLin(clamp(x, 0, 1))));
}

export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

export const SL = { 50: .975, 100: .945, 200: .89, 300: .82, 400: .73, 500: .645, 600: .56, 700: .48, 800: .405, 900: .335, 950: .245 };

export const SC = { 50: .12, 100: .25, 200: .45, 300: .7, 400: .9, 500: 1, 600: 1, 700: .92, 800: .8, 900: .66, 950: .52 };

export function shades(hex) { const [L, C, H] = hexToOklch(hex); const out = {}; let near = 500, bd = 9; for (const s of STEPS) { out[s] = oklchHex(SL[s], C * SC[s], H); const d = Math.abs(SL[s] - L); if (d < bd) { bd = d; near = s; } } return { out, near }; }
