import { isDark, normHex } from './color/math.js';
import { deriveDark, deriveLight, full } from './color/palette.js';
import { RK } from './data/roles.js';

export const LS = 'ronghor.en.v1';
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const state = {
  p: null, name: '', presetId: null, why: '', content: 'corporate', mode: 'light', device: 'desktop', vision: 'none', tab: 'presets', cat: 'all',
  locks: new Set(), saved: [], gen: { base: '#1F4FD1', harmony: 'comp', style: 'vivid', exact: true }, fmt: 'css', optDark: true, optShades: true, img: null, assign: 'primary', sel: null
};
export function validPal(p) {
  return p && RK.every(k => normHex(p[k]));
}

export function cleanPal(p) {
  const o = {};
  for (const k of RK) o[k] = normHex(p[k]);
  return o;
}
export const nativeMode = () => isDark(state.p) ? 'dark' : 'light';

export function modePalette(mode) {
  const b = state.p;
  const nat = isDark(b) ? 'dark' : 'light';
  if (mode === nat) return { ...b };
  return mode === 'dark' ? deriveDark(b) : deriveLight(b);
}

export const activePalette = () => full(modePalette(state.mode));

export function persist() {
  try {
    localStorage.setItem(LS, JSON.stringify({
      cur: {
        p: state.p,
        name: state.name,
        presetId: state.presetId,
        content: state.content,
        why: state.why,
        mode: state.mode
      },
      locks: [...state.locks], saved: state.saved
    }));
  }
  catch (e) { }
}

export function loadStore() {
  try {
    return JSON.parse(localStorage.getItem(LS) || 'null');
  } catch (e) { return null; }
}
