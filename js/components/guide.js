import { darkOf, onColor } from '../color/math.js';
import { psych } from '../color/names.js';
import { svg } from './icons.js';
import { ROLES } from '../data/roles.js';
import { TIPS } from '../data/tips.js';
import { $ } from '../dom.js';
import { state } from '../state.js';

export function renderGuide(f){
  const segs=[[60,f.bg,'60%'],[30,f.secondary,'30%'],[7,f.primary,'10%'],[3,f.accent,'']];
  $('#ratioBar').innerHTML=segs.map(([w,c,t])=>`<span style="flex:${w};background:${c};color:${onColor(c,darkOf(f))}">${t}</span>`).join('');
  const ps=psych(state.p.primary);
  $('#psy').innerHTML=`<span class="psy-dot" style="background:${state.p.primary}"></span><div><b>${ps.n}</b><p>${ps.feel}</p><dl><dt>Suits</dt><dd>${ps.fit}</dd><dt>Watch out</dt><dd>${ps.care}</dd></dl></div>`;
  $('#gRoles').innerHTML=ROLES.map(r=>`<li><i style="background:${f[r.k]}"></i><div><b>${r.name}<small>${r.css}</small></b><span class="w">${r.where}</span><p>${r.tip}</p></div></li>`).join('');
}
export function renderTips(){ $('#tips').innerHTML=TIPS.map(([ok,t])=>`<li class="${ok?'':'no'}">${svg(ok?'check':'x')}<span>${t}</span></li>`).join(''); }
