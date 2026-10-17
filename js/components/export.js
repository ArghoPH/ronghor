import { onColor } from '../color/math.js';
import { STEPS, shades } from '../color/oklch.js';
import { full } from '../color/palette.js';
import { syncControls } from './controls.js';
import { copyText } from './toast.js';
import { $ } from '../dom.js';
import { modePalette, state } from '../state.js';

export const EXP=[['bg','bg','background'],['surface','surface','surface'],['text','text','foreground'],['muted','muted','muted'],['border','border','border'],['primary','primary','primary'],['onPrimary','on-primary','primary-foreground'],['secondary','secondary','secondary'],['onSecondary','on-secondary','secondary-foreground'],['accent','accent','accent'],['onAccent','on-accent','accent-foreground'],['success','success','success'],['warning','warning','warning'],['danger','danger','danger']];
export const pad=(s,n)=>s+' '.repeat(Math.max(1,n-s.length));
export function exportCode(){
  const L=full(modePalette('light')), D=full(modePalette('dark'));
  const SH={primary:shades(L.primary).out,secondary:shades(L.secondary).out,accent:shades(L.accent).out};
  const nm=state.name, wd=state.optDark, ws=state.optShades;
  const vars=(P,ind,pre,idx)=>EXP.map(e=>`${ind}${pad(pre+e[idx]+':',30)}${P[e[0]]};`).join('\n');
  const shadeVars=(ind,pre)=>Object.entries(SH).map(([r,o])=>STEPS.map(s=>`${ind}${pad(pre+r+'-'+s+':',30)}${o[s]};`).join('\n')).join('\n');
  switch(state.fmt){
  case 'css':{
    let s=`/* Ronghor palette: ${nm} */\n:root {\n${vars(L,'  ','--color-',1)}`;
    if(ws) s+=`\n\n  /* Shade scale */\n${shadeVars('  ','--color-')}`;
    s+='\n}';
    if(wd) s+=`\n\n/* Dark mode */\n@media (prefers-color-scheme: dark) {\n  :root {\n${vars(D,'    ','--color-',1)}\n  }\n}`;
    return s+`\n\n/* Usage:\n   body   { background: var(--color-bg); color: var(--color-text); }\n   .btn   { background: var(--color-primary); color: var(--color-on-primary); }\n   .card  { background: var(--color-surface); border: 1px solid var(--color-border); } */`;
  }
  case 'scss':{
    let s=`// Ronghor palette: ${nm}\n`+EXP.map(e=>`${pad('$color-'+e[1]+':',28)}${L[e[0]]};`).join('\n');
    if(wd) s+=`\n\n// Dark mode\n`+EXP.map(e=>`${pad('$color-'+e[1]+'-dark:',28)}${D[e[0]]};`).join('\n');
    if(ws) s+=`\n\n// Shade scale\n`+Object.entries(SH).map(([r,o])=>STEPS.map(st=>`${pad('$'+r+'-'+st+':',28)}${o[st]};`).join('\n')).join('\n');
    return s;
  }
  case 'tw4':{
    let s=`@import "tailwindcss";\n\n/* Ronghor palette: ${nm} */\n@theme {\n${vars(L,'  ','--color-',2)}`;
    if(ws) s+=`\n\n${shadeVars('  ','--color-')}`;
    s+='\n}';
    if(wd) s+=`\n\n/* Dark mode */\n@media (prefers-color-scheme: dark) {\n  :root {\n${vars(D,'    ','--color-',2)}\n  }\n}`;
    return s+`\n\n/* Usage: bg-background text-foreground, buttons: bg-primary text-primary-foreground */`;
  }
  case 'tw3':{
    const val=(e,P)=>wd?`'var(--color-${e[1]})'`:`'${P[e[0]]}'`;
    const grp=(k,fk)=>{ const e=EXP.find(x=>x[0]===k), ef=EXP.find(x=>x[0]===fk); const sh=ws?',\n'+STEPS.map(st=>`          ${st}: '${SH[k][st]}'`).join(',\n'):''; return `        ${k}: {\n          DEFAULT: ${val(e,L)},\n          foreground: ${val(ef,L)}${sh}\n        }`; };
    const single=k=>{ const e=EXP.find(x=>x[0]===k); return `        ${pad(e[2]+':',13)}${val(e,L)}`; };
    let s='';
    if(wd) s+=`/* globals.css */\n:root {\n${vars(L,'  ','--color-',1)}\n}\n.dark {\n${vars(D,'  ','--color-',1)}\n}\n\n`;
    s+=`// tailwind.config.js (Ronghor palette: ${nm})\nmodule.exports = {\n${wd?"  darkMode: 'class',\n":''}  theme: {\n    extend: {\n      colors: {\n${['bg','surface','text','muted','border'].map(single).join(',\n')},\n${grp('primary','onPrimary')},\n${grp('secondary','onSecondary')},\n${grp('accent','onAccent')},\n${['success','warning','danger'].map(single).join(',\n')},\n      },\n    },\n  },\n};`;
    return s;
  }
  default:{
    const o=P=>Object.fromEntries(EXP.map(e=>[e[1],P[e[0]]]));
    const out={name:nm,light:o(L)}; if(wd) out.dark=o(D); if(ws) out.shades=SH;
    return JSON.stringify(out,null,2);
  }}
}
export function renderExport(){
  $('#code').textContent=exportCode();
  const L=full(modePalette('light'));
  $('#shadeRows').innerHTML=[['primary','Primary'],['secondary','Secondary'],['accent','Accent']].map(([k,n])=>{
    const {out,near}=shades(L[k]);
    return `<div class="shade-row"><span class="flabel">${n} <span class="mono" style="font-weight:500;color:var(--ink-3)">${L[k]}</span></span><div class="shades">${STEPS.map(s=>`<button type="button" class="shade${s===near?' near':''}" data-hex="${out[s]}" title="${k}-${s}: ${out[s]}" aria-label="${n} ${s}: ${out[s]}" style="background:${out[s]};color:${onColor(out[s])}">${s}</button>`).join('')}</div></div>`;
  }).join('');
}
$('#fmtSeg').addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; state.fmt=b.dataset.v; syncControls(); renderExport(); });
$('#optDark').addEventListener('change',e=>{ state.optDark=e.target.checked; renderExport(); });
$('#optShades').addEventListener('change',e=>{ state.optShades=e.target.checked; renderExport(); });
$('#copyCode').addEventListener('click',()=>{ const ok=copyText($('#code').textContent,'Code copied'); if(!ok){ const r=document.createRange(); r.selectNodeContents($('#code')); const s=getSelection(); s.removeAllRanges(); s.addRange(r); } });
$('#shadeRows').addEventListener('click',e=>{ const b=e.target.closest('.shade'); if(b) copyText(b.dataset.hex,'Copied '+b.dataset.hex); });
