import { randomize } from './actions.js';
import { setTab } from './components/controls.js';
import { renderTips } from './components/guide.js';
import { svg } from './components/icons.js';
import { renderPresets } from './components/presets.js';
import { closePop, pop, renderSiteContent } from './components/preview.js';
import { buildStrip } from './components/strip.js';
import { CONTENT } from './data/content.js';
import { PRESETS } from './data/presets.js';
import { RN } from './data/roles.js';
import { $$ } from './dom.js';
import { commit, redo, undo } from './history.js';
import { render } from './render.js';
import { cleanPal, loadStore, state, validPal } from './state.js';
import './components/header.js';
import './components/contrast.js';
import './components/generator.js';
import './components/export.js';
import './components/image.js';

document.addEventListener('keydown',e=>{
  const t=e.target, typing=t&&t.closest&&t.closest('input,textarea,select,[contenteditable="true"]');
  if(e.key==='Escape'&&!pop.hidden){ closePop(); return; }
  if((e.ctrlKey||e.metaKey)&&!e.altKey&&!typing){
    const k=e.key.toLowerCase();
    if(k==='z'){ e.preventDefault(); e.shiftKey?redo():undo(); return; }
    if(k==='y'){ e.preventDefault(); redo(); return; }
  }
  if(e.code==='Space'&&!typing&&!(t.closest&&t.closest('button,a,[role="slider"],[role="tab"],label'))){ e.preventDefault(); randomize(); }
});
$$('[data-ic]').forEach(el=>el.insertAdjacentHTML('afterbegin',svg(el.dataset.ic)));
buildStrip();
renderTips();
(function init(){
  const st=loadStore();
  if(st&&Array.isArray(st.saved)) state.saved=st.saved.filter(s=>s&&s.id&&validPal(s.c)).map(s=>({...s,c:cleanPal(s.c)}));
  if(st&&Array.isArray(st.locks)) st.locks.filter(k=>RN[k]).forEach(k=>state.locks.add(k));
  if(st&&st.cur&&validPal(st.cur.p)){
    const c=st.cur; state.p=cleanPal(c.p); state.name=String(c.name||'Previous palette'); state.presetId=c.presetId||null; state.why=String(c.why||''); state.content=CONTENT[c.content]?c.content:'corporate'; state.mode=c.mode==='dark'?'dark':'light'; state.gen.base=state.p.primary;
  } else {
    const pr=PRESETS[0]; state.p=cleanPal(pr.c); state.name=pr.name; state.presetId=pr.id; state.why=pr.why; state.content=pr.content; state.mode='light'; state.gen.base=pr.c.primary;
  }
  renderSiteContent(); renderPresets(); setTab('presets'); render(); commit();
})();
