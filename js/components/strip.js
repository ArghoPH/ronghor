import { setColor } from '../actions.js';
import { normHex, onColor } from '../color/math.js';
import { colorName } from '../color/names.js';
import { svg } from './icons.js';
import { clearHl, highlightRole, pop } from './preview.js';
import { copyText, toast } from './toast.js';
import { RN, ROLES } from '../data/roles.js';
import { $ } from '../dom.js';
import { persist, state } from '../state.js';

export const strip=$('#strip');
export function buildStrip(){
  strip.innerHTML=ROLES.map(r=>`
  <div class="sw${r.status?' is-status':''}" data-role="${r.k}" id="sw-${r.k}">
    <label class="sw-color" for="pick-${r.k}" title="${r.name}: pick a color">
      <input type="color" id="pick-${r.k}" data-role="${r.k}" aria-label="Pick ${r.name} color">
      <span class="sw-cname"></span>
    </label>
    <button class="sw-lock" type="button" data-role="${r.k}" aria-pressed="false" aria-label="Lock ${r.name}" title="Lock: stays the same when shuffling or switching presets"></button>
    <div class="sw-meta">
      <span class="sw-name">${r.name}</span>
      <span class="sw-hexrow"><input class="sw-hex" id="hex-${r.k}" data-role="${r.k}" spellcheck="false" autocomplete="off" maxlength="7" aria-label="${r.name} hex code"><button class="sw-copy" type="button" data-role="${r.k}" aria-label="Copy ${r.name}" title="Copy">${svg('copy')}</button></span>
      <span class="sw-where">${r.where}</span>
    </div>
  </div>`).join('');
}
export function updateStrip(){
  for(const r of ROLES){
    const c=state.p[r.k], el=$('#sw-'+r.k), lab=$('.sw-color',el), on=onColor(c);
    lab.style.background=c; lab.style.color=on;
    const pick=$('input[type=color]',el); if(document.activeElement!==pick) pick.value=c.toLowerCase();
    const hx=$('.sw-hex',el); if(document.activeElement!==hx) hx.value=c;
    $('.sw-cname',el).textContent=colorName(c);
    const lk=$('.sw-lock',el), locked=state.locks.has(r.k);
    lk.setAttribute('aria-pressed',String(locked)); lk.setAttribute('aria-label',`${locked?'Unlock':'Lock'} ${r.name}`);
    lk.innerHTML=svg(locked?'lock':'unlock'); lk.style.color=on;
    el.classList.toggle('is-sel',state.sel===r.k);
  }
}
document.addEventListener('input',e=>{
  const t=e.target;
  if(t.type==='color'&&t.dataset.role){ setColor(t.dataset.role,t.value,false); }
});
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.type==='color'&&t.dataset.role){ setColor(t.dataset.role,t.value,true); }
  else if(t.classList.contains('sw-hex')){ applyHex(t); }
});
export function applyHex(t){ const v=normHex(t.value); if(!v){ toast('That hex code isn\'t valid. Use a format like #1F4FD1'); t.value=state.p[t.dataset.role]; return; } if(v!==state.p[t.dataset.role]) setColor(t.dataset.role,v,true); else t.value=v; }
strip.addEventListener('keydown',e=>{ if(e.target.classList.contains('sw-hex')&&e.key==='Enter'){ e.preventDefault(); applyHex(e.target); e.target.blur(); } });
strip.addEventListener('click',e=>{
  const lk=e.target.closest('.sw-lock'); if(lk){ const k=lk.dataset.role; state.locks.has(k)?state.locks.delete(k):state.locks.add(k); updateStrip(); persist(); toast(`${RN[k].name} ${state.locks.has(k)?'locked':'unlocked'}`); return; }
  const cp=e.target.closest('.sw-copy'); if(cp){ const c=state.p[cp.dataset.role]; copyText(c,'Copied '+c); }
});
strip.addEventListener('pointerover',e=>{ const sw=e.target.closest('.sw'); if(sw&&pop.hidden) highlightRole(sw.dataset.role); });
strip.addEventListener('pointerleave',()=>{ if(pop.hidden) clearHl(); });
strip.addEventListener('focusin',e=>{ const sw=e.target.closest('.sw'); if(sw&&pop.hidden) highlightRole(sw.dataset.role); });
strip.addEventListener('focusout',()=>{ if(pop.hidden) clearHl(); });
