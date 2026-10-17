import { closePop, site } from './preview.js';
import { toast } from './toast.js';
import { HN } from '../data/harmonies.js';
import { $, $$ } from '../dom.js';
import { commit } from '../history.js';
import { render } from '../render.js';
import { state } from '../state.js';

export function syncControls(){
  $$('#modeSeg button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===state.mode)));
  $$('#devSeg button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===state.device)));
  $$('#styleSeg button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===state.gen.style)));
  $$('#fmtSeg button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===state.fmt)));
  $$('#harmOpts .opt').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===state.gen.harmony)));
  $('#harmHint').textContent=HN[state.gen.harmony][2];
  const g=state.gen.base, gc=$('#genColor'), gh=$('#genHex');
  if(document.activeElement!==gc) gc.value=g.toLowerCase();
  if(document.activeElement!==gh) gh.value=g;
  $('#genSw').style.background=g;
  $('#genExact').checked=state.gen.exact;
  $('#frame').classList.toggle('is-mobile',state.device==='mobile');
  site.style.filter=state.vision==='none'?'':`url(#cb-${state.vision})`;
}
export function setTab(t){ state.tab=t; $$('.tab').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.tab===t))); $$('.pane').forEach(p=>p.hidden=p.id!=='pane-'+t); }
$$('.tab').forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.tab)));
$('.tabs').addEventListener('keydown',e=>{ if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft') return; const tabs=$$('.tab'); const i=tabs.findIndex(b=>b.dataset.tab===state.tab); const n=tabs[(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length]; setTab(n.dataset.tab); n.focus(); });
$('#modeSeg').addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; state.mode=b.dataset.v; closePop(); render(); commit(); });
$('#devSeg').addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; state.device=b.dataset.v; closePop(); syncControls(); });
$('#vision').addEventListener('change',e=>{ state.vision=e.target.value; syncControls(); if(state.vision!=='none') toast('Preview now simulates '+e.target.selectedOptions[0].textContent.split(':')[0].toLowerCase()); });
