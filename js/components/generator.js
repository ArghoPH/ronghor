import { runGen } from '../actions.js';
import { clamp, hexHsl, hsl, normHex, onColor } from '../color/math.js';
import { toast } from './toast.js';
import { HARM } from '../data/harmonies.js';
import { $ } from '../dom.js';
import { commit } from '../history.js';
import { state } from '../state.js';

export function renderWheel(){
  const pos=hex=>{ const [h,s]=hexHsl(hex); const r=(0.14+0.8*clamp(s,0,100)/100)*50; const a=h*Math.PI/180; return [50+r*Math.sin(a),50-r*Math.cos(a)]; };
  let lines='';
  for(const k of ['primary','secondary','accent']){
    const c=state.p[k], [x,y]=pos(c), d=$(`.wdot[data-k="${k}"]`);
    d.style.left=x+'%'; d.style.top=y+'%'; d.style.background=c; d.style.color=onColor(c);
    lines+=`<line x1="50" y1="50" x2="${x.toFixed(2)}" y2="${y.toFixed(2)}"/>`;
  }
  $('#wheelLines').innerHTML=lines+'<circle cx="50" cy="50" r="1.6"/>';
  $('#wheel').setAttribute('aria-valuenow',Math.round(hexHsl(state.gen.base)[0]));
}
$('#harmOpts').innerHTML=HARM.map(h=>`<button type="button" class="opt" data-v="${h[0]}">${h[1]}</button>`).join('');
$('#harmOpts').addEventListener('click',e=>{ const b=e.target.closest('.opt'); if(!b) return; state.gen.harmony=b.dataset.v; runGen(true); });
$('#styleSeg').addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; state.gen.style=b.dataset.v; runGen(true); });
$('#genExact').addEventListener('change',e=>{ state.gen.exact=e.target.checked; runGen(true); });
$('#genBtn').addEventListener('click',()=>runGen(true));
$('#genColor').addEventListener('input',e=>{ state.gen.base=normHex(e.target.value); runGen(false); });
$('#genColor').addEventListener('change',()=>commit());
$('#genHex').addEventListener('change',e=>{ const v=normHex(e.target.value); if(!v){ toast('That hex code isn\'t valid. Use a format like #1F4FD1'); e.target.value=state.gen.base; return; } state.gen.base=v; runGen(true); });
$('#genHex').addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); e.target.blur(); } });
export const wheel=$('#wheel');
export let dragging=false;
export function wheelPick(e){
  const r=wheel.getBoundingClientRect(), x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2;
  const h=(Math.atan2(x,-y)*180/Math.PI+360)%360, d=Math.min(1,Math.hypot(x,y)/(r.width/2));
  const s=clamp((d-0.14)/0.8*100,18,100), [, ,l]=hexHsl(state.gen.base);
  state.gen.base=hsl(h,s,clamp(l,34,54)); runGen(false);
}
wheel.addEventListener('pointerdown',e=>{ dragging=true; wheel.setPointerCapture(e.pointerId); wheelPick(e); });
wheel.addEventListener('pointermove',e=>{ if(dragging) wheelPick(e); });
export const endDrag=()=>{ if(dragging){ dragging=false; commit(); } };
wheel.addEventListener('pointerup',endDrag);
wheel.addEventListener('pointercancel',endDrag);
wheel.addEventListener('keydown',e=>{ if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight') return; e.preventDefault(); const [h,s,l]=hexHsl(state.gen.base); state.gen.base=hsl(h+(e.key==='ArrowRight'?6:-6),s,l); runGen(true); });
