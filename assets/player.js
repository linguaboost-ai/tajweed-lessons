/* =======================================================================
   MASCHINERIE — wird von jeder Lektionsseite geladen, nachdem dort die
   Konstante LESSON definiert wurde. Erwartet im Dokument:
     #strip  Transkriptleiste     #stage  Bühne
     #bar    Fortschrittsbalken   #meta   Navigationszeile
   ======================================================================= */
(function(){
'use strict';

const strip = document.getElementById('strip');
const stage = document.getElementById('stage');
const bar   = document.querySelector('#bar span');
const meta  = document.getElementById('meta');
const store = 'qvl.fortschritt';

/* ---------- Transkriptleiste aufbauen ---------- */
strip.style.setProperty('--cols', LESSON.sections.length);
LESSON.sections.forEach((sec,i)=>{
  const d = document.createElement('div');
  d.className='box'; d.dataset.i=i;
  d.innerHTML = `<h4>${sec.label}</h4>${sec.html}`;
  d.addEventListener('click',()=>{ const t=LESSON.slides.findIndex(s=>s.s===i); if(t>=0) goto(t,0); });
  strip.appendChild(d);
});

/* ---------- Folien aufbauen ---------- */
LESSON.slides.forEach((sl,i)=>{
  const d=document.createElement('div');
  d.className='slide'; d.dataset.i=i; d.innerHTML=sl.html;
  stage.appendChild(d);
});

/* ---------- Navigationszeile ---------- */
const KURS = window.LESSONS || [];
const pos  = KURS.findIndex(l=>l.no===LESSON.no);
const vor  = pos>0 ? KURS[pos-1] : null;
const nach = pos>=0 && pos<KURS.length-1 ? KURS[pos+1] : null;
if(meta){
  const teile = ['<a href="../index.html" title="Zur Übersicht">⌂ Übersicht</a>'];
  if(KURS.length) teile.push(`<span class="sep">·</span><span>Lektion ${LESSON.no} von ${KURS.length}</span>`);
  if(vor)  teile.push(`<span class="sep">·</span><a href="${vor.file}" title="Lektion ${vor.no}: ${vor.thema}">‹ vorige</a>`);
  if(nach) teile.push(`<span class="sep">·</span><a href="${nach.file}" title="Lektion ${nach.no}: ${nach.thema}">nächste ›</a>`);
  meta.innerHTML = teile.join(' ');
}

/* ---------- Fortschritt merken (rein lokal, best effort) ---------- */
function merken(){
  try{
    const daten = JSON.parse(localStorage.getItem(store) || '{}');
    daten[LESSON.no] = Math.max(daten[LESSON.no]||0, Math.round(100*(idx+1)/LESSON.slides.length));
    localStorage.setItem(store, JSON.stringify(daten));
  }catch(e){/* privater Modus o. Ä. — kein Beinbruch */}
}

/* ---------- Steuerung ---------- */
let idx=0, step=0;

function maxStep(i){
  const el=stage.querySelector(`.slide[data-i="${i}"]`);
  const steps=[...el.querySelectorAll('.step')].map(e=>+e.dataset.step||1);
  return steps.length?Math.max(...steps):0;
}
function render(){
  stage.querySelectorAll('.slide').forEach(e=>e.classList.toggle('on',+e.dataset.i===idx));
  const el=stage.querySelector(`.slide[data-i="${idx}"]`);
  el.querySelectorAll('.step').forEach(e=>e.classList.toggle('shown',(+e.dataset.step||1)<=step));
  const sec=LESSON.slides[idx].s;
  strip.querySelectorAll('.box').forEach(b=>{
    const on=+b.dataset.i===sec; b.classList.toggle('on',on);
    if(on) b.scrollIntoView({block:'nearest',inline:'nearest'});
  });
  bar.style.width=(100*(idx+1)/LESSON.slides.length)+'%';
  location.hash = idx ? '#'+(idx+1) : '';
  merken();
}
function goto(i,s){ idx=Math.max(0,Math.min(LESSON.slides.length-1,i)); step=s??0; render(); }
function next(){
  if(step<maxStep(idx)) step++;
  else if(idx<LESSON.slides.length-1){idx++;step=0;}
  else if(nach){ location.href=nach.file; return; }
  render();
}
function prev(){ if(step>0) step--; else if(idx>0){ idx--; step=maxStep(idx);} render(); }

addEventListener('keydown',e=>{
  if(e.key==='ArrowRight'||e.key===' '||e.key==='PageDown'){e.preventDefault();next();}
  else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();prev();}
  else if(e.key==='Home')goto(0,0);
  else if(e.key==='End')goto(LESSON.slides.length-1,0);
  else if(e.key==='t'||e.key==='T')strip.classList.toggle('hidden');
  else if(e.key==='f'||e.key==='F'){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();}
  else if(e.key==='Escape'&&!document.fullscreenElement)location.href='../index.html';
  else if(e.key==='n'||e.key==='N'){ if(nach) location.href=nach.file; }
  else if(e.key==='p'||e.key==='P'){ if(vor) location.href=vor.file; }
});

stage.addEventListener('click',e=>{
  if(e.target.closest('a')) return;
  (e.clientX < innerWidth*0.25) ? prev() : next();
});

/* Wischen auf dem Telefon */
let tx=null,ty=null;
stage.addEventListener('touchstart',e=>{ tx=e.changedTouches[0].clientX; ty=e.changedTouches[0].clientY; },{passive:true});
stage.addEventListener('touchend',e=>{
  if(tx===null) return;
  const dx=e.changedTouches[0].clientX-tx, dy=e.changedTouches[0].clientY-ty;
  if(Math.abs(dx)>60 && Math.abs(dx)>Math.abs(dy)){ e.preventDefault(); dx<0 ? next() : prev(); }
  tx=ty=null;
});

/* Direkteinstieg über #7 in der Adresszeile */
const start = parseInt((location.hash||'').slice(1),10);
goto(Number.isFinite(start) && start>0 ? start-1 : 0, 0);

})();
