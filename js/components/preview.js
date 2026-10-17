import { clamp } from '../color/math.js';
import { svg } from './icons.js';
import { updateStrip } from './strip.js';
import { CONTENT } from '../data/content.js';
import { RN } from '../data/roles.js';
import { $, $$ } from '../dom.js';
import { activePalette, nativeMode, state } from '../state.js';

export const site=$('#site');
export const SITE_VARS={bg:'bg',surface:'surface',text:'text',muted:'muted',border:'border',primary:'primary','on-primary':'onPrimary',secondary:'secondary','on-secondary':'onSecondary',accent:'accent','on-accent':'onAccent',success:'success',warning:'warning',danger:'danger','primary-tint':'primaryTint','primary-soft':'primarySoft','primary-ring':'primaryRing','success-tint':'successTint','warning-tint':'warningTint','danger-tint':'dangerTint','footer-bg':'footerBg','footer-fg':'footerFg','footer-muted':'footerMuted'};
export function applySiteVars(f){ for(const [k,v] of Object.entries(SITE_VARS)) site.style.setProperty('--c-'+k,f[v]); }
export function siteHTML(c){
  const nav=c.nav.map((n,i)=>`<li><a class="${i===0?'on':''}" data-r="${i===0?'primary':'text'}">${n}</a></li>`).join('');
  const bars=[[38,'soft'],[52,'soft'],[46,'p'],[64,'soft'],[72,'p'],[84,'p'],[97,'a']].map(([h,t])=>`<i class="b-${t}" style="height:${h}%" data-r="${t==='a'?'accent':'primary'}"></i>`).join('');
  const ics=['shield','zap','spark'];
  const feats=c.features.map((f,i)=>`<article class="s-card" data-r="surface border"><span class="s-ico" data-r="primary">${svg(ics[i])}</span><h4 data-r="text">${f[0]}</h4><p data-r="muted">${f[1]}</p><a class="s-link" data-r="primary">Learn more →</a></article>`).join('');
  const stats=c.stats.map(s=>`<div><b>${s[0]}</b><span>${s[1]}</span></div>`).join('');
  const items=c.card.items.map(i=>`<li data-r="text"><span class="s-check" data-r="success">${svg('check')}</span>${i}</li>`).join('');
  return `
  <nav class="s-nav" data-r="surface border">
    <span class="s-logo" data-r="text"><span class="s-mark" data-r="primary"></span>${c.brand}</span>
    <ul class="s-links">${nav}</ul>
    <a class="s-btn s-btn-sm" data-r="primary onPrimary">${c.navCta}</a>
    <span class="s-burger" data-r="text">${svg('menu')}</span>
  </nav>
  <header class="s-hero" data-r="bg">
    <div>
      <span class="s-badge" data-r="accent">${c.badge}</span>
      <h2 data-r="text">${c.h1}</h2>
      <p data-r="muted">${c.sub}</p>
      <div class="s-ctas"><a class="s-btn" data-r="primary onPrimary">${c.cta1}</a><a class="s-btn s-btn-ghost" data-r="text border">${c.cta2}</a></div>
      <div class="s-trust" data-r="muted"><span class="s-stars" data-r="accent">★★★★★</span><span>${c.trust}</span></div>
    </div>
    <div class="s-art" aria-hidden="true">
      <div class="s-art-card" data-r="surface border">
        <div class="s-art-top"><span class="s-art-label" data-r="muted">${c.art[0]}</span><span class="s-pill" data-r="success">${c.art[2]}</span></div>
        <div class="s-art-val" data-r="text">${c.art[1]}</div>
        <div class="s-bars" data-r="border">${bars}</div>
      </div>
      <div class="s-float" data-r="secondary">${svg('star')}${c.art[3]}</div>
    </div>
  </header>
  <section class="s-features" data-r="bg">
    <h3 class="s-sec-h" data-r="text">${c.featH}</h3>
    <p class="s-sec-sub" data-r="muted">${c.featP}</p>
    <div class="s-grid">${feats}</div>
  </section>
  <section class="s-band" data-r="secondary">${stats}</section>
  <section class="s-split" data-r="bg">
    <article class="s-offer" data-r="surface border">
      <span class="s-tag" data-r="accent">${c.card.tag}</span>
      <h4 data-r="text">${c.card.title}</h4>
      <div class="s-price" data-r="text"><b>${c.card.price}</b>${c.card.old?`<s data-r="muted">${c.card.old}</s>`:''}${c.card.unit?`<span data-r="muted">${c.card.unit}</span>`:''}</div>
      <ul>${items}</ul>
      <a class="s-btn s-btn-block" data-r="primary onPrimary">${c.card.btn}</a>
    </article>
    <div class="s-form" data-r="surface border">
      <h4 data-r="text">${c.form.title}</h4>
      <div class="s-field" data-r="text">Your name<div class="s-input focus" data-r="primary">Tania Islam</div></div>
      <div class="s-field" data-r="text">Mobile number<div class="s-input err" data-r="danger">01712-34567</div><span class="s-err" data-r="danger">${svg('alert')}The number must be 11 digits</span></div>
      <div class="s-alert ok" data-r="success">${svg('check')}<span>${c.form.ok}</span></div>
      <div class="s-alert warn" data-r="warning">${svg('alert')}<span>${c.form.warn}</span></div>
      <a class="s-btn s-btn-block" data-r="primary onPrimary">${c.form.btn}</a>
    </div>
  </section>
  <footer class="s-foot" data-r="text">
    <span class="s-logo"><span class="s-mark"></span>${c.brand}</span>
    <nav><a>About</a><a>Terms</a><a>Contact</a></nav>
    <small>© 2026 ${c.brand}. All rights reserved.</small>
  </footer>`;
}
export function renderSiteContent(){ const c=CONTENT[state.content]||CONTENT.corporate; site.innerHTML=siteHTML(c); $('#url').textContent=`https://www.${c.domain}.com.bd`; closePop(); }
export let hlEls=[];
export function clearHl(){ hlEls.forEach(e=>e.classList.remove('is-hl')); hlEls=[]; }
export function highlightRole(role){ clearHl(); if(!role) return; hlEls=$$(`[data-r~="${role}"]`,site); hlEls.forEach(e=>e.classList.add('is-hl')); }
export const tip=$('#tip'), pop=$('#pop'), wrap=$('#frameWrap');
export let hoverEl=null;
export function rolesOf(el){ return (el.dataset.r||'').split(/\s+/).filter(k=>RN[k]); }
site.addEventListener('pointermove',e=>{
  if(e.pointerType==='touch'||!pop.hidden) return;
  const el=e.target.closest('[data-r]');
  if(hoverEl&&hoverEl!==el) hoverEl.classList.remove('is-hover');
  hoverEl=el;
  if(!el){ tip.hidden=true; return; }
  el.classList.add('is-hover');
  const f=activePalette(), rs=rolesOf(el);
  tip.innerHTML=rs.map(k=>`<div><i style="background:${f[k]}"></i>${RN[k].name} <span class="mono">${f[k]}</span></div>`).join('')+`<small>Click to change</small>`;
  tip.hidden=false;
  const r=wrap.getBoundingClientRect(); let x=e.clientX-r.left+14, y=e.clientY-r.top+16;
  const tw=tip.offsetWidth, th=tip.offsetHeight;
  if(x+tw>r.width-4) x=e.clientX-r.left-tw-12; if(y+th>r.height-4) y=e.clientY-r.top-th-12;
  tip.style.left=Math.max(4,x)+'px'; tip.style.top=Math.max(4,y)+'px';
});
site.addEventListener('pointerleave',()=>{ tip.hidden=true; if(hoverEl){hoverEl.classList.remove('is-hover'); hoverEl=null;} });
site.addEventListener('click',e=>{
  const el=e.target.closest('[data-r]'); if(!el) return; e.preventDefault();
  const rs=rolesOf(el); if(!rs.length) return;
  openPop(rs,e);
});
export let popRoles=[];
export function openPop(rs,e){
  popRoles=rs; tip.hidden=true; if(hoverEl){hoverEl.classList.remove('is-hover');hoverEl=null;}
  state.sel=rs[0]; updateStrip(); highlightRole(rs[0]);
  $('#popList').innerHTML=rs.map(k=>`<div class="pop-row" data-role="${k}"><label class="pop-sw" for="pop-pick-${k}"><input type="color" id="pop-pick-${k}" data-role="${k}" aria-label="Pick ${RN[k].name} color"></label><div><b>${RN[k].name}</b><small>${RN[k].where}</small></div><span class="mono"></span></div>`).join('');
  const derived=state.mode!==nativeMode(), note=$('#popNote');
  note.hidden=!derived; note.textContent=derived?`These are colors from the base ${nativeMode()} palette. The preview's ${state.mode} version is generated from them.`:'';
  pop.hidden=false; updatePop();
  const r=wrap.getBoundingClientRect(), pw=pop.offsetWidth, ph=pop.offsetHeight;
  let x=e.clientX-r.left-pw/2, y=e.clientY-r.top+14;
  x=clamp(x,6,Math.max(6,r.width-pw-6)); if(y+ph>r.height-6) y=Math.max(6,e.clientY-r.top-ph-14);
  pop.style.left=x+'px'; pop.style.top=y+'px';
  const first=$('input',pop); if(first) first.focus({preventScroll:true});
}
export function updatePop(){ if(pop.hidden) return; for(const k of popRoles){ const row=$(`.pop-row[data-role="${k}"]`,pop); if(!row) continue; const c=state.p[k]; $('.pop-sw',row).style.background=c; const inp=$('input',row); if(document.activeElement!==inp) inp.value=c.toLowerCase(); $('.mono',row).textContent=c; } }
export function closePop(){ if(pop.hidden) return; pop.hidden=true; popRoles=[]; state.sel=null; clearHl(); updateStrip(); }
$('#popX').addEventListener('click',closePop);
document.addEventListener('pointerdown',e=>{ if(!pop.hidden&&!pop.contains(e.target)&&!site.contains(e.target)) closePop(); });
