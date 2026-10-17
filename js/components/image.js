import { keepLocks, setColor } from '../actions.js';
import { extractColors, paletteFromImage } from '../color/extract.js';
import { darkOf, onColor } from '../color/math.js';
import { toast } from './toast.js';
import { RN, ROLES } from '../data/roles.js';
import { $ } from '../dom.js';
import { commit } from '../history.js';
import { render } from '../render.js';
import { nativeMode, state } from '../state.js';

export function renderImage(){
  const out=$('#imgOut'); if(!state.img){ out.hidden=true; return; }
  out.hidden=false; $('#imgThumb').src=state.img.url;
  $('#extract').innerHTML=state.img.cols.map(c=>`<button type="button" class="ex" data-hex="${c.hex}" title="Apply ${c.hex}"><i style="background:${c.hex}"></i><span>${c.hex}</span><small>${Math.max(1,Math.round(c.pct*100))}%</small></button>`).join('');
}
export function processImage(src,url){
  let cols; try{ cols=extractColors(src); }catch(err){ toast('Couldn\'t read colors from this image. Try a PNG or JPG.'); return; }
  if(!cols.length){ toast('No usable colors found in this image'); return; }
  state.img={url,cols}; renderImage(); toast(`Found ${cols.length} main colors`);
}
export function handleFile(file){
  if(!file) return; if(!/^image\//.test(file.type)){ toast('Please use an image file: PNG, JPG or WEBP'); return; }
  const fr=new FileReader(); fr.onload=()=>{ const img=new Image(); img.onload=()=>processImage(img,fr.result); img.onerror=()=>toast('Couldn\'t open that image. Try another file.'); img.src=fr.result; }; fr.readAsDataURL(file);
}
$('#imgFile').addEventListener('change',e=>{ handleFile(e.target.files[0]); e.target.value=''; });
export const drop=$('#drop');
['dragenter','dragover'].forEach(ev=>drop.addEventListener(ev,e=>{ e.preventDefault(); drop.classList.add('is-over'); }));
['dragleave','drop'].forEach(ev=>drop.addEventListener(ev,()=>drop.classList.remove('is-over')));
drop.addEventListener('drop',e=>{ e.preventDefault(); handleFile(e.dataTransfer&&e.dataTransfer.files[0]); });
$('#sampleImg').addEventListener('click',()=>{
  const cv=document.createElement('canvas'); cv.width=cv.height=180; const x=cv.getContext('2d');
  x.fillStyle='#FFFFFF'; x.fillRect(0,0,180,180);
  x.fillStyle='#0E7C66'; x.beginPath(); x.arc(90,76,56,0,Math.PI*2); x.fill();
  x.fillStyle='#F2B134'; x.beginPath(); x.moveTo(90,36); x.lineTo(124,100); x.lineTo(56,100); x.closePath(); x.fill();
  x.fillStyle='#E4572E'; x.beginPath(); x.arc(90,82,12,0,Math.PI*2); x.fill();
  x.fillStyle='#1D2B36'; x.fillRect(36,146,108,16);
  processImage(cv,cv.toDataURL('image/png'));
});
$('#assignRole').innerHTML=ROLES.map(r=>`<option value="${r.k}">${r.name}</option>`).join('');
$('#assignRole').addEventListener('change',e=>{ state.assign=e.target.value; });
$('#extract').addEventListener('click',e=>{ const b=e.target.closest('.ex'); if(!b) return; setColor(state.assign,b.dataset.hex,true); toast(`${RN[state.assign].name} is now ${b.dataset.hex}`); });
$('#imgAuto').addEventListener('click',()=>{ if(!state.img) return; const p=keepLocks(paletteFromImage(state.img.cols)); if(!state.locks.has('onPrimary')) p.onPrimary=onColor(p.primary,darkOf(p)); state.p=p; state.presetId=null; state.name='From your image'; state.why='The most vivid color in your image became the primary, a contrasting color became the accent and a dark one became the secondary. The neutrals are tinted from the primary.'; state.mode=nativeMode(); state.gen.base=p.primary; render(); commit(); toast('Palette built from your image'); });
