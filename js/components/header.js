import { randomize, savePalette } from '../actions.js';
import { svg } from './icons.js';
import { $, $$ } from '../dom.js';
import { redo, undo } from '../history.js';
import { nativeMode, state } from '../state.js';

export function renderHead(){
  $('#palName').textContent=state.name;
  $('#palWhy').textContent=state.why;
  const nat=nativeMode(), mn=$('#modeNote');
  if(state.mode!==nat){
    mn.hidden=false;
    mn.innerHTML=svg('info')+`<span>The preview is showing an auto-generated ${state.mode} version. The cards below are the base ${nat} palette; change them and the ${state.mode} version updates too.</span>`;
  } else mn.hidden=true;
}
export function renderLogo(){ const f=state.p; const c=[f.primary,f.accent,f.secondary,f.text]; $$('#logo i').forEach((i,n)=>i.style.background=c[n]); }
$('#undoBtn').addEventListener('click',undo);
$('#redoBtn').addEventListener('click',redo);
$('#randomBtn').addEventListener('click',randomize);
$('#saveBtn').addEventListener('click',savePalette);
