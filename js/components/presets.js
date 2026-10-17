import { applyPreset } from '../actions.js';
import { isDark } from '../color/math.js';
import { svg } from './icons.js';
import { toast } from './toast.js';
import { CATS, PRESETS } from '../data/presets.js';
import { $, $$ } from '../dom.js';
import { persist, state } from '../state.js';

export function renderPresets(){
  $('#cats').innerHTML=CATS.map(([k,n])=>`<button type="button" class="chip" data-cat="${k}" aria-pressed="${state.cat===k}">${n}</button>`).join('');
  const list=PRESETS.filter(p=>state.cat==='all'||(state.cat==='dark'?isDark(p.c):p.cat===state.cat));
  $('#presetList').innerHTML=list.map(p=>presetCard(p,false)).join('');
  $('#savedWrap').hidden=!state.saved.length;
  $('#savedList').innerHTML=state.saved.map(p=>presetCard(p,true)).join('');
}
export function presetCard(p,saved){
  const c=p.c;
  return `<div class="pwrap"><button class="pcard${state.presetId===p.id?' is-on':''}" type="button" data-id="${p.id}" style="--b:${c.bg};--s:${c.surface};--t:${c.text};--m:${c.muted};--p:${c.primary};--a:${c.accent};--sec:${c.secondary};--bd:${c.border}">
    <span class="pthumb" aria-hidden="true"><i class="pt-nav"></i><i class="pt-logo"></i><i class="pt-h"></i><i class="pt-l"></i><i class="pt-btn"></i><i class="pt-acc"></i><i class="pt-band"></i></span>
    <span class="pc-body"><b>${p.name}</b><small>${p.tags}</small></span></button>${saved?`<button class="pdel" type="button" data-del="${p.id}" aria-label="Delete ${p.name}">${svg('trash')}</button>`:''}</div>`;
}
export function markPresets(){ $$('.pcard').forEach(b=>b.classList.toggle('is-on',b.dataset.id===state.presetId)); }
$('#cats').addEventListener('click',e=>{ const c=e.target.closest('.chip'); if(!c) return; state.cat=c.dataset.cat; renderPresets(); });
$('.side').addEventListener('click',e=>{
  const del=e.target.closest('.pdel');
  if(del){ if(!del.classList.contains('is-confirm')){ del.classList.add('is-confirm'); del.innerHTML=svg('trash')+'Delete?'; setTimeout(()=>{ if(del.isConnected){ del.classList.remove('is-confirm'); del.innerHTML=svg('trash'); } },3000); return; }
    state.saved=state.saved.filter(s=>s.id!==del.dataset.del); if(state.presetId===del.dataset.del) state.presetId=null; persist(); renderPresets(); toast('Palette deleted'); return; }
  const pc=e.target.closest('.pcard'); if(!pc) return;
  const pr=PRESETS.find(p=>p.id===pc.dataset.id)||state.saved.find(p=>p.id===pc.dataset.id); if(pr) applyPreset(pr);
});
