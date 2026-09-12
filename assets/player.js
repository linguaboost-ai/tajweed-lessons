/* =======================================================================
   MASCHINERIE — wird von jeder Lektionsseite geladen, nachdem dort die
   Konstante LESSON definiert wurde. Erwartet im Dokument:
     #strip  Notizleiste         #stage  Bühne
     #bar    Fortschrittsbalken  #meta   Navigationszeile

   Die Notizleiste zeigt immer genau eine Seite von fünf Boxen. Erreicht
   man die sechste Box, rutscht die Schiene eine Seite weiter, sodass
   diese Box vorne steht — und umgekehrt beim Zurückgehen. Keine Box
   scrollt: passt ihr Text nicht, wird er so weit verkleinert, bis er passt.
   ======================================================================= */
(function(){
'use strict';

const strip = document.getElementById('strip');
const stage = document.getElementById('stage');
const bar   = document.querySelector('#bar span');
const meta  = document.getElementById('meta');
const store = 'qvl.fortschritt';

/* ---------- Notizleiste aufbauen ---------- */
const track = document.createElement('div');
track.id = 'track';
strip.replaceChildren(track);

/* Aufeinanderfolgende Boxen mit gleicher Überschrift durchnummerieren:
   „Lektion (3/7)" — damit man beim Vortragen weiß, wo man steht. */
function beschriftungen(sections){
  const out = new Array(sections.length);
  let i = 0;
  while(i < sections.length){
    let j = i;
    while(j+1 < sections.length && sections[j+1].label === sections[i].label) j++;
    const anzahl = j - i + 1;
    for(let k = i; k <= j; k++)
      out[k] = anzahl > 1 ? `${sections[k].label} (${k-i+1}/${anzahl})` : sections[k].label;
    i = j + 1;
  }
  return out;
}

const titel = beschriftungen(LESSON.sections);
const boxen = LESSON.sections.map((sec,i)=>{
  const d = document.createElement('div');
  d.className = 'box'; d.dataset.i = i;
  d.innerHTML = `<h4>${titel[i]}</h4>${sec.html}`;
  d.addEventListener('click',()=>{
    const t = LESSON.slides.findIndex(s=>s.s===i);
    if(t >= 0) goto(t,0);
    else {                                   // Box ohne eigene Folie: zur nächstgelegenen
      let best = 0, dist = Infinity;
      LESSON.slides.forEach((s,k)=>{ const d2 = Math.abs(s.s-i); if(d2 < dist){ dist = d2; best = k; } });
      goto(best,0);
    }
  });
  track.appendChild(d);
  return d;
});

/* ---------- Folien aufbauen ---------- */
LESSON.slides.forEach((sl,i)=>{
  const d = document.createElement('div');
  d.className = 'slide'; d.dataset.i = i; d.innerHTML = sl.html;
  stage.appendChild(d);
});

/* ---------- Home-Button, oben links unter den Notizen ---------- */
const heim = document.createElement('a');
heim.id = 'home';
heim.href = '../index.html';
heim.title = 'Zur Lektionsübersicht (Esc)';
heim.setAttribute('aria-label','Zur Lektionsübersicht');
heim.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor"
  stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 10.6 12 3.2l9 7.4"/><path d="M5.6 9.6V20.3h12.8V9.6"/><path d="M9.9 20.3v-5.4h4.2v5.4"/></svg>`;
stage.appendChild(heim);

/* ---------- Navigationszeile ---------- */
const KURS = window.LESSONS || [];
const pos  = KURS.findIndex(l=>l.no===LESSON.no);
const vor  = pos>0 ? KURS[pos-1] : null;
const nach = pos>=0 && pos<KURS.length-1 ? KURS[pos+1] : null;
if(meta){
  const teile = [];
  if(KURS.length) teile.push(`<span>Lektion ${LESSON.no} von ${KURS.length}</span>`);
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

/* ---------- Layout der Notizleiste ---------- */
const BASIS = .78, MINIMUM = .58;   // rem
let proSeite = 5, seiten = 1;

function boxenProSeite(){
  const b = innerWidth;
  return b <= 760 ? 1 : b <= 1100 ? 3 : 5;
}

/* Schiene so breit machen, dass eine Seite genau die Leiste füllt. */
function schieneLegen(){
  proSeite = boxenProSeite();
  seiten   = Math.ceil(boxen.length / proSeite);
  const spalten = seiten * proSeite;              // mit Leerplätzen aufgefüllt
  track.style.width = (seiten * 100) + '%';
  track.style.gridTemplateColumns = `repeat(${spalten}, calc(100% / ${spalten}))`;

  // Leerboxen am Ende, damit die letzte Seite nicht halb dunkel bleibt
  track.querySelectorAll('.box.leer').forEach(e=>e.remove());
  for(let i = boxen.length; i < spalten; i++){
    const d = document.createElement('div');
    d.className = 'box leer';
    track.appendChild(d);
  }
}

/* Keine Box scrollt: notfalls Schrift verkleinern, bis der Text hineinpasst. */
function boxEinpassen(el){
  el.style.fontSize = BASIS + 'rem';
  let groesse = BASIS;
  while(el.scrollHeight > el.clientHeight + 1 && groesse > MINIMUM){
    groesse = Math.round((groesse - .02) * 100) / 100;
    el.style.fontSize = groesse + 'rem';
  }
}
const alleBoxenEinpassen = () => boxen.forEach(boxEinpassen);

/* Zu hohe Folien werden verkleinert, statt in die Notizen zu ragen. */
function folieEinpassen(el){
  if(!el) return;
  el.style.transform = 'none';
  const cs = getComputedStyle(stage);
  const h = stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  const b = stage.clientWidth  - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  if(h <= 0 || b <= 0) return;
  const k = Math.min(1, h / el.offsetHeight, b / el.offsetWidth);
  el.style.transform = k < .995 ? `scale(${k})` : '';
}

/* ---------- Steuerung ---------- */
let idx = 0, step = 0;

function maxStep(i){
  const el = stage.querySelector(`.slide[data-i="${i}"]`);
  const steps = [...el.querySelectorAll('.step')].map(e=>+e.dataset.step||1);
  return steps.length ? Math.max(...steps) : 0;
}
function render(){
  stage.querySelectorAll('.slide').forEach(e=>e.classList.toggle('on',+e.dataset.i===idx));
  const el = stage.querySelector(`.slide[data-i="${idx}"]`);
  el.querySelectorAll('.step').forEach(e=>e.classList.toggle('shown',(+e.dataset.step||1)<=step));
  folieEinpassen(el);

  const aktiv = LESSON.slides[idx].s;
  boxen.forEach((b,i)=>b.classList.toggle('on', i===aktiv));
  const seite = Math.floor(aktiv / proSeite);
  track.style.transform = `translateX(-${seite * 100 / seiten}%)`;

  bar.style.width = (100*(idx+1)/LESSON.slides.length)+'%';
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

/* ---------- Start und Größenänderungen ---------- */
function neuAufbauen(){ schieneLegen(); alleBoxenEinpassen(); render(); }

schieneLegen();
const start = parseInt((location.hash||'').slice(1),10);
goto(Number.isFinite(start) && start>0 ? start-1 : 0, 0);
alleBoxenEinpassen();
render();

/* Schriften kommen später an und ändern die Höhen — dann noch einmal messen. */
if(document.fonts && document.fonts.ready) document.fonts.ready.then(neuAufbauen);

let timer = null;
addEventListener('resize',()=>{ clearTimeout(timer); timer = setTimeout(neuAufbauen,120); });

})();
