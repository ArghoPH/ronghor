import { fixRole } from '../actions.js';
import { contrast } from '../color/math.js';
import { svg } from './icons.js';
import { PAIRS } from '../data/pairs.js';
import { RN } from '../data/roles.js';
import { $ } from '../dom.js';
import { nativeMode, state } from '../state.js';

export function badgeFor(r,need){
  const ok=r>=need;
  let label; if(r>=7) label='AAA'; else if(r>=4.5) label='AA'; else if(r>=3) label=need<=3?'Icons OK':'Large text only'; else label='Fail';
  return {cls:ok?'pass':(r>=3?'warn':'fail'),label,ok};
}
export function renderContrast(f){
  const derived=state.mode!==nativeMode(); let pass=0;
  const rows=PAIRS.map(x=>{
    const fg=f[x.fg], bg=f[x.bg], r=contrast(fg,bg), b=badgeFor(r,x.need); if(b.ok) pass++;
    const fix=b.ok?'':(derived?`<span class="hint c-fix">Fix this in the base palette and it follows here</span>`:`<button class="btn sm c-fix" type="button" data-fix="${x.fix}">${svg('wand')} Fix ${RN[x.fix].name.toLowerCase()}</button>`);
    return `<div class="crow"><span class="c-sample" style="background:${bg};color:${fg}">Aa</span><span class="c-label"><b>${x.label}</b><small>${x.on}</small></span><span class="c-val"><span class="c-ratio">${r.toFixed(2)}:1</span><span class="badge ${b.cls}">${b.ok?svg('check'):''}${b.label}</span></span>${fix}</div>`;
  }).join('');
  $('#clist').innerHTML=rows;
  const sc=$('#cScore'), all=pass===PAIRS.length;
  sc.className='badge c-score '+(all?'pass':pass>=PAIRS.length-2?'warn':'fail');
  sc.innerHTML=(all?svg('check'):'')+`${pass}/${PAIRS.length} pass`;
}
$('#clist').addEventListener('click',e=>{ const b=e.target.closest('[data-fix]'); if(b) fixRole(b.dataset.fix); });
