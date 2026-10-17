import { $ } from '../dom.js';

export let toastT;
export function toast(m){ const t=$('#toast'); t.textContent=m; t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'),2300); }
export function copyText(text,msg){
  try{ const pr=navigator.clipboard&&navigator.clipboard.writeText(text); if(!pr) throw 0; pr.then(()=>toast(msg||'Copied')).catch(()=>toast('Couldn\'t copy. Select the text and copy it yourself.')); return true; }
  catch(e){ toast('Couldn\'t copy. Select the text and copy it yourself.'); return false; }
}
