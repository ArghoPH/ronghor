import { contrast, darkOf, hexHsl, hsl, normHex, onColor } from './color/math.js';
import { full, generate } from './color/palette.js';
import { renderHead } from './components/header.js';
import { renderPresets } from './components/presets.js';
import { renderSiteContent } from './components/preview.js';
import { toast } from './components/toast.js';
import { HARM, HN } from './data/harmonies.js';
import { PAIRS } from './data/pairs.js';
import { RN } from './data/roles.js';
import { commit } from './history.js';
import { render } from './render.js';
import { MONTHS, cleanPal, nativeMode, persist, state } from './state.js';

export function markEdited(){ if(state.presetId){ state.presetId=null; if(!/\(edited\)$/.test(state.name)) state.name=state.name+' (edited)'; } }
export function setColor(role,hex,doCommit){
  hex=normHex(hex); if(!hex||!RN[role]) return false;
  state.p[role]=hex;
  if(role==='primary'&&!state.locks.has('onPrimary')) state.p.onPrimary=onColor(hex,darkOf(state.p));
  markEdited(); render(); if(doCommit) commit(); return true;
}
export function keepLocks(p){ for(const k of state.locks) p[k]=state.p[k]; if(!state.locks.has('onPrimary')&&state.locks.has('primary')) p.onPrimary=onColor(p.primary,darkOf(p)); return p; }
export function applyPreset(pr){
  const p=keepLocks(cleanPal(pr.c));
  const changedContent=(pr.content||state.content)!==state.content;
  state.p=p; state.presetId=pr.id; state.name=pr.name+(state.locks.size?' + your locked colors':''); state.why=pr.why||'Your saved palette.';
  state.content=pr.content||state.content; state.mode=nativeMode(); state.gen.base=p.primary;
  if(changedContent) renderSiteContent();
  render(); commit();
  if(state.locks.size) toast(`Kept your ${state.locks.size} locked color${state.locks.size>1?'s':''}`);
}
export function runGen(doCommit){
  const g=state.gen;
  const p=keepLocks(generate(g.base,g.harmony,g.style,g.exact));
  if(!state.locks.has('onPrimary')) p.onPrimary=onColor(p.primary,darkOf(p));
  state.p=p; state.presetId=null; state.name='Generated: '+HN[g.harmony][1];
  state.why=`Built from base color ${g.base} using the ${HN[g.harmony][1].toLowerCase()} rule. ${HN[g.harmony][2]}`;
  state.mode=nativeMode(); render(); if(doCommit) commit();
}
export function randomize(){
  const g=state.gen;
  g.base=state.locks.has('primary')?state.p.primary:hsl(Math.random()*360,55+Math.random()*35,36+Math.random()*16);
  g.harmony=HARM[Math.floor(Math.random()*HARM.length)][0];
  const r=Math.random(); g.style=r<0.14?'dark':(r<0.55?'soft':'vivid');
  g.exact=false; runGen(false); state.name='Random: '+HN[g.harmony][1];
  renderHead(); commit();
}
export function fixRole(role){
  const involved=PAIRS.filter(x=>x.fix===role);
  const score=c=>{ const q={...state.p,[role]:c}; if(role==='primary'&&!state.locks.has('onPrimary')) q.onPrimary=onColor(c,darkOf(q)); const f=full(q); return Math.min(...involved.map(x=>contrast(f[x.fg],f[x.bg])/x.need)); };
  const cur=state.p[role]; if(score(cur)>=1) return;
  const [h,s,l]=hexHsl(cur); let best=cur, bs=score(cur), found=null;
  outer: for(let i=1;i<=100;i++){ for(const d of [-1,1]){ const L=l+d*i; if(L<0||L>100) continue; const c=hsl(h,s,L); const sc=score(c); if(sc>=1){found=c;break outer;} if(sc>bs){bs=sc;best=c;} } }
  const v=found||best;
  setColor(role,v,true);
  toast(`${RN[role].name} changed from ${cur} to ${v}`);
}
export function savePalette(){
  const base=state.name.replace(/ \(edited\)$/,'').replace(/ \+ your locked colors$/,'');
  const nm=state.presetId||!base?`My palette ${state.saved.length+1}`:base;
  const d=new Date(); const dt=d.getDate()+' '+MONTHS[d.getMonth()];
  const item={id:'s'+Date.now(),name:nm,tags:'Saved · '+dt,c:{...state.p},content:state.content,why:state.why};
  state.saved.unshift(item); state.presetId=item.id; state.name=nm;
  persist(); renderPresets(); renderHead(); commit();
  toast('Saved: '+nm);
}
