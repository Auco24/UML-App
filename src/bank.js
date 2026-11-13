
/* ================= AUFGABENSAMMLUNG + PRÜFUNGSMODUS ================= */
['bank','openAns','stat'].forEach(k=>{if(!store[k]||typeof store[k]!=='object')store[k]={};});
if(!Array.isArray(store.examHist))store.examHist=[];
const KINDS=[['draw','✏️','Zeichnen','Diagramm nach Text zeichnen'],['erg','🧩','Ergänzen','Vorhandenes Diagramm ergänzen'],['read','👓','Diagramm lesen','Aussagen: richtig oder falsch'],
 ['find','🔎','Fehler finden','Fehler im Diagramm finden'],['open','✍️','Offene Fragen','Erläutern, nennen, vergleichen'],['quiz','☑️','Test','Multiple-Choice-Fragen']];
const KNAME={mc:'Auswahlfrage',open:'Offene Frage',read:'Diagramm lesen',find:'Fehler finden',draw:'Diagramm erstellen'};
const BTYPES=Object.assign({},DTF,{gen:'Allgemein (UML)'});
let Bk={type:'uc',kind:'draw',id:null,ans:{}};
const baseOf=id=>DRAW_TASKS.find(x=>x.id===id);
const FD={};const fDoc=ft=>FD[ft.id]||(FD[ft.id]=findDoc(ft));const fSpots=ft=>FD['s:'+ft.id]||(FD['s:'+ft.id]=findSpots(ft,fDoc(ft)));
function bankItems(type,kind){
 if(kind==='draw')return DRAW_TASKS.filter(t=>t.type===type&&!t.erg);
 if(kind==='erg')return DRAW_TASKS.filter(t=>t.type===type&&t.erg);
 if(kind==='read')return READ_TASKS.filter(t=>t.type===type);
 if(kind==='find')return FIND_TASKS.filter(t=>t.type===type);
 if(kind==='open')return OPEN_Q.filter(t=>t.type===type);
 if(kind==='quiz'){const m=MODULES.find(x=>x.id===type);return m?m.quiz:WHICH;}
 return [];}
const bankBest=(kind,x)=>kind==='draw'||kind==='erg'?store.drawBest[x.id]:store.bank[x.id];
const pBadge=p=>p==null?'':`<span class="badge" style="${p>=85?'':p>=50?'background:var(--warn-soft);color:var(--warn)':'background:var(--bad-soft);color:var(--bad)'}">${p}%</span>`;
const bankTotal=()=>DRAW_TASKS.length+READ_TASKS.length+FIND_TASKS.length+OPEN_Q.length;
function statAdd(type,ok,total){if(!type||!total)return;const s=store.stat[type]||(store.stat[type]=[0,0]);s[0]+=ok;s[1]+=total;}
function setBest(id,pct){store.bank[id]=Math.max(store.bank[id]||0,pct);save();}
function leavePage(){if((route.page==='draw'||route.page==='exam')&&typeof flushDoc==='function')flushDoc();if(Pz.key){Pz.key=null;Pz.doc=null;Pz.task=null;}exStopTimer();}
function goBank(type,kind,id){leavePage();if(type)Bk.type=type;if(kind)Bk.kind=kind;Bk.id=id||null;if(id)delete Bk.ans['b:'+id];route={page:'bank'};render();window.scrollTo(0,0);}

/* ---------- Antworten: in der Aufgabensammlung nur im Arbeitsspeicher, in der Prüfung im gespeicherten Durchlauf ---------- */
function ansOf(key){if(key[0]==='x'){const r=store.examRun;return r.ans[key]||(r.ans[key]={});}
 if(!Bk.ans[key]){Bk.ans[key]={};if(key[0]==='o')Bk.ans[key].t=store.openAns[key.slice(2)]||'';}return Bk.ans[key];}
let ansT=null;function ansSaved(key){clearTimeout(ansT);ansT=setTimeout(save,400);if(key[0]==='x')exChips();}

/* ---------- Darstellung der Aufgaben (mode: 'do' = bearbeiten | 'rev' = auswerten) ---------- */
function mcHTML(it,key,mode){const q=MODULES.find(m=>m.id===it.m).quiz[it.i],a=ansOf(key),rev=mode==='rev';
 return `<div class="qtext">${q.q}</div><div class="opts">${it.ord.map(k=>`<button class="opt ${rev?(k===q.a?'ok':(a.c===k?'bad':'')):(a.c===k?'sel':'')}" ${rev?'disabled':''} onclick="mcSet('${key}',${k},this)">${q.o[k]}</button>`).join('')}</div>${rev?`<div class="expl">${a.c===q.a?'✅ Richtig. ':a.c==null?'Keine Antwort. ':'❌ Falsch. '}${q.e||''}</div>`:''}`;}
function mcSet(key,k,btn){ansOf(key).c=k;btn.parentNode.querySelectorAll('.opt').forEach(b=>b.classList.remove('sel'));btn.classList.add('sel');ansSaved(key);}

function readScore(t,a){const v=a.v||[];let ok=0;t.st.forEach((s,i)=>{if(v[i]===s[1])ok++;});return {pts:ok,max:t.st.length};}
function readHTML(t,key,mode){const a=ansOf(key);a.v=a.v||[];const rev=mode==='rev';
 let h=`<p><b>Prüfen Sie anhand des Diagramms, ob die folgenden Aussagen zutreffen.</b> <span class="lvl">Markiere jede Aussage: richtig oder falsch.</span></p>`+figOf(docFromSpec(baseOf(t.base)));
 return h+t.st.map((s,i)=>{const v=a.v[i],ok=v===s[1];
  return `<div class="stmt ${rev?(ok?'ok':'bad'):''}"><span class="tx"><b>${i+1}.</b> ${esc(s[0])}${rev?`<span class="why">${ok?'✓':(v==null?'Keine Antwort.':'✗')} Richtig ist: <b>${s[1]?'richtig':'falsch'}</b>. ${s[2]}</span>`:''}</span><span class="tf"><button class="${v===true?'on':''}" ${rev?'disabled':''} onclick="rdSet('${key}',${i},true,this)">richtig</button><button class="${v===false?'on':''}" ${rev?'disabled':''} onclick="rdSet('${key}',${i},false,this)">falsch</button></span></div>`;}).join('');}
function rdSet(key,i,v,btn){const a=ansOf(key);a.v=a.v||[];a.v[i]=v;btn.parentNode.querySelectorAll('button').forEach(b=>b.classList.remove('on'));btn.classList.add('on');ansSaved(key);}

function findScore(ft,a){const sp=fSpots(ft),m=a.m||[];let hit=0;sp.forEach(s=>{if(s.ids.some(i=>m.includes(i)))hit++;});const fp=m.filter(i=>!sp.some(s=>s.ids.includes(i))).length;
 return {pts:Math.max(0,hit-fp*0.5),max:sp.length,hit,fp};}
const findWhy=w=>w.replace(/\s*\(klicke[^)]*\)/g,'').replace(/ hast du /g,' ist ').replace(/ Und denk daran: /,' ');
function findFig(ft,a,rev){const sp=fSpots(ft);return svgOf(fDoc(ft),{pick:!rev,hl:rev?[].concat(...sp.map(s=>s.ids)):(a.m||[])});}
function findHTML(ft,key,mode){const a=ansOf(key);a.m=a.m||[];const sp=fSpots(ft),rev=mode==='rev';
 let h=`<p><b>Das Diagramm enthält ${sp.length} Fehler. Finden Sie die fehlerhaften Stellen.</b> <span class="lvl">${rev?'Rot markiert sind alle Stellen mit Fehlern.':'Klicke auf die Formen und Linien, an denen du einen Fehler siehst. Ein erneuter Klick hebt die Markierung auf.'}</span></p>`;
 h+=`<div class="bigsvg dg findfig" data-key="${key}" data-ft="${ft.id}" ${rev?'data-rev="1"':''}>${findFig(ft,a,rev)}</div>`;
 if(!rev)return h+`<p class="lvl">Markiert: <b class="fcount">${a.m.length}</b> von ${sp.length}. Für jede überflüssige Markierung wird ein halber Punkt abgezogen.</p>`;
 const sc=findScore(ft,a);
 h+=`<ul class="clean">`+sp.map(s=>{const hit=s.ids.some(i=>a.m.includes(i));return `<li>${hit?'<b style="color:var(--ok)">✓ Gefunden.</b>':'<b style="color:var(--bad)">✗ Übersehen.</b>'} ${s.why.map(w=>esc(findWhy(w))).join(' ')}</li>`;}).join('')+`</ul>`;
 if(sc.fp)h+=`<p class="lvl">Überflüssige Markierungen: ${sc.fp}.</p>`;
 return h+`<details><summary>Diagramm ohne Fehler anzeigen</summary>${figOf(docFromSpec(baseOf(ft.base)))}</details>`;}
document.addEventListener('click',e=>{const f=e.target.closest&&e.target.closest('.findfig');if(!f||f.dataset.rev)return;const g=e.target.closest('[data-id],[data-eid],[data-pid]');if(!g)return;
 const id=g.dataset.id||g.dataset.eid||g.dataset.pid,ft=FIND_TASKS.find(x=>x.id===f.dataset.ft),a=ansOf(f.dataset.key);a.m=a.m||[];const i=a.m.indexOf(id);if(i>=0)a.m.splice(i,1);else a.m.push(id);
 f.innerHTML=findFig(ft,a,false);const c=f.parentNode.querySelector('.fcount');if(c)c.textContent=a.m.length;ansSaved(f.dataset.key);});

const openPts=(q,a)=>a.self!=null?a.self:scoreOpen(q,a.t||'').pts;
function openHTML(q,key,mode){const a=ansOf(key),rev=mode==='rev';
 let h=`<div class="q-box" style="margin-top:0"><b>${esc(q.q)}</b> <span class="pill">${q.pts} P.</span><br><span class="lvl">${q.ru} Antworte in ganzen Sätzen.</span></div>`;
 h+=`<textarea rows="5" class="oans" ${rev?'readonly':''} oninput="opSet('${key}',this.value)" placeholder="Antwort auf Deutsch …" aria-label="Antwort">${esc(a.t||'')}</textarea>`;
 return h+(rev?openRev(q,key):'');}
function openRev(q,key){const a=ansOf(key),s=scoreOpen(q,a.t||''),n=s.hit.filter(Boolean).length;
 return `<div class="orev"><p style="margin:10px 0 6px"><b>Punkte: <span class="opn">${openPts(q,a)}</span> von ${q.pts}</b> <button class="mini" onclick="opAdj('${key}','${q.id}',-0.5,this)" aria-label="weniger Punkte">−</button> <button class="mini" onclick="opAdj('${key}','${q.id}',0.5,this)" aria-label="mehr Punkte">+</button><br><span class="lvl">Der Bot hat ${n} von ${q.kw.length} Kernpunkten gefunden${q.max?` (für die volle Punktzahl genügen ${q.max})`:''}. Er sucht nur nach Schlüsselwörtern; vergleiche deine Antwort deshalb mit der Musterantwort und korrigiere die Punkte mit den Schaltflächen, falls der Bot sich irrt.</span></p>
 <p class="lvl" style="margin:6px 0">${q.kw.map((g,i)=>`<span class="kwp ${s.hit[i]?'ok':'no'}">${s.hit[i]?'✓':'✗'} ${esc(g[0])}</span>`).join(' ')}</p>
 <p style="margin:8px 0 2px"><b>Musterantwort:</b></p><div class="q-box" style="margin-top:4px">${esc(q.a)}</div></div>`;}
function opSet(key,v){ansOf(key).t=v;if(key[0]==='o')store.openAns[key.slice(2)]=v;ansSaved(key);}
function opAdj(key,qid,d,btn){const q=OPEN_Q.find(x=>x.id===qid),a=ansOf(key);a.self=Math.max(0,Math.min(q.pts,openPts(q,a)+d));const el=btn.parentNode.querySelector('.opn');if(el)el.textContent=a.self;
 if(key[0]==='x'){save();exSummary();}else setBest(qid,Math.round(a.self/q.pts*100));}
async function aiOpen(qid){const q=OPEN_Q.find(x=>x.id===qid),a=ansOf('o:'+qid);const box=()=>$('#oai-'+qid);if(!box()||!AI.fn||AI.off||a.busy)return;a.busy=true;box().innerHTML='<div class="aimsg">Ich denke nach… Die erste Antwort kann bis zu einer Minute dauern.</div>';
 const p=`Du bist Prüfer in der IHK-Prüfung AP2 (Fachinformatiker Anwendungsentwicklung), Thema UML. Bewerte die schriftliche Antwort des Prüflings.

Aufgabe (${q.pts} Punkte): ${q.q}

Musterantwort: ${q.a}

Antwort des Prüflings:
${(a.t||'').trim()||'(leer)'}

Antworte auf Deutsch in einfachen, klaren Sätzen. Format der Antwort:
1. Erste Zeile: «Punkte: X von ${q.pts}».
2. Als kurze Liste: was richtig ist, was fehlt und was inhaltlich falsch ist.
3. Falls der Text sprachliche Fehler enthält, nenne die 1–2 wichtigsten.
4. Am Ende eine korrigierte Fassung der Antwort des Prüflings in einem Absatz.
Andere Formulierungen als in der Musterantwort sind zulässig, wenn der Sinn stimmt. Verwende als Auszeichnung nur **fett** und Listen.`;
 try{const r=await AI.fn(p,{cache:false,onText:({text})=>{const o=box();if(o)o.innerHTML=`<div class="aimsg">${md(text)}</div>`;}});const o=box();if(o)o.innerHTML=`<div class="aimsg">${md(r.text)}</div>`;}
 catch(e){const m=aiFail(e),o=box();if(o)o.innerHTML=m?`<div class="find warn" style="cursor:default"><b>!</b><span>${m}</span></div>`:'';}
 a.busy=false;}

/* ---------- Bewertung einer Zeichnung (gemeinsam mit der Übungsseite) ---------- */
function gradeDoc(d,t){let rules=RULES[d.type](d),R=null;if(t&&t.spec)R=d.type==='sq'?checkSpecSQ(d,t.spec):checkSpec(d,t.spec);
 if(R){const hit=new Set();R.iss.forEach(f=>(f.ids||[]).forEach(i=>hit.add(i)));rules=rules.filter(f=>!(f.lv==='tip'&&f.ids&&f.ids.length&&f.ids.every(i=>hit.has(i))));}
 const ord={err:0,warn:1,tip:2};const all=(R?R.iss:[]).concat(rules).sort((a,b)=>ord[a.lv]-ord[b.lv]);let pct=null;
 if(R&&R.total){const e=all.filter(f=>f.lv==='err').length,w=rules.filter(f=>f.lv==='warn').length;pct=Math.max(0,Math.round(R.ok/R.total*100-e*4-w*2));if(pct===100&&(R.miss.length||e))pct=99;}
 return {all,R,pct};}
function solFig(t){if(t.img&&IMG[t.img])return `<div class="figure"><img src="${IMG[t.img]}" alt="Musterlösung ${esc(t.t)}"></div>`;if(t.big&&BIG[t.big])return `<div class="bigsvg">${BIG[t.big]}</div>`;
 if(canRender(t)){const d=docFromSpec(t);if(d)return figOf(d);}return '';}
const edHTML=sq=>`<div class="ed"><div class="ed-tools" id="tools"></div><div class="ed-hint" id="edhint"></div>
  <div class="ed-main"><div class="ed-canvas"><svg id="cv" class="sym" xmlns="http://www.w3.org/2000/svg"></svg></div><div class="ed-side" id="props"></div></div>
  ${sq?`<details class="sqd" ${store.sqForm?'open':''} ontoggle="store.sqForm=this.open;save()"><summary>Als Liste bearbeiten (Formular statt Maus)</summary><div class="sqb" id="sqb"></div></details>`:''}</div>`;

/* ================= SEITE AUFGABENSAMMLUNG ================= */
function renderBank(){const ty=Bk.type;if(ty==='gen'&&!['open','quiz'].includes(Bk.kind))Bk.kind='open';
 const kinds=KINDS.filter(k=>ty!=='gen'||['open','quiz'].includes(k[0]));
 let h=`<h1>Aufgabenpool</h1><p class="sub">Alle Formate, die in Klassenarbeiten und in der AP2 vorkommen: Diagramm zeichnen, ein vorhandenes ergänzen, lesen, Fehler finden, schriftlich antworten. Insgesamt ${bankTotal()} Aufgaben und ${MODULES.reduce((s,m)=>s+m.quiz.length,0)} Testfragen.</p>`;
 h+=`<div class="seg">${Object.keys(BTYPES).map(k=>`<button class="${k===ty?'on':''}" onclick="goBank('${k}')">${BTYPES[k]}</button>`).join('')}</div>`;
 h+=`<div class="kinds">`+kinds.map(([k,ic,de,ru])=>{const it=bankItems(ty,k),done=it.filter(x=>bankBest(k,x)!=null).length;
  return `<button class="kind ${k===Bk.kind?'on':''}" onclick="goBank('${ty}','${k}')"><span class="ic">${ic}</span><b>${de}</b><span class="lvl">${ru}</span><span class="lvl">${k==='quiz'?it.length+' Fragen':'erledigt '+done+' von '+it.length}</span></button>`;}).join('')+`</div><div id="bankc"></div>`;
 $('#main').innerHTML=h;renderBankC();}
function renderBankC(){const el=$('#bankc');if(!el)return;const ty=Bk.type,k=Bk.kind,items=bankItems(ty,k);let h='';
 if(k==='draw'||k==='erg'){h+=`<p class="hint" style="margin:6px 0 10px">${k==='erg'?'„Ergänzen Sie das Diagramm …“: Ein Teil des Diagramms ist bereits gezeichnet, das Fehlende ist zu ergänzen.':'„Erstellen Sie ein … für …“: Du zeichnest im Editor, der Bot vergleicht mit der Musterlösung.'}</p><div class="tlist">`+
   items.map(t=>`<div class="titem"><div class="grow"><b>${esc(t.t)}</b> <span class="lvl">· ${LVL[t.lvl]||t.lvl}</span>${pBadge(store.drawBest[t.id])}<details><summary class="lvl">Aufgabentext anzeigen</summary><div style="margin-top:6px">${t.text}</div></details></div><button class="btn primary" onclick="goDraw('${t.type}','${t.id}')">Zeichnen</button></div>`).join('')+`</div>`;
  if(!items.length)h+=`<p class="hint">Zu diesem Thema gibt es keine solchen Aufgaben.</p>`;}
 else if(k==='read'||k==='find'){if(Bk.id&&items.some(x=>x.id===Bk.id)){el.innerHTML=bankTaskView();return;}
  h+=`<p class="hint" style="margin:6px 0 10px">${k==='read'?'„Welche Aussagen lassen sich aus dem Diagramm ableiten?“: Gegeben sind ein fertiges Diagramm und Aussagen.':'„Das Diagramm enthält Fehler. Finden und korrigieren Sie diese.“: In das Diagramm sind typische Fehler eingebaut.'}</p><div class="tlist">`+
   items.map(t=>`<div class="titem"><div class="grow"><b>${esc(t.t)}</b> <span class="lvl">· ${k==='read'?t.st.length+' Aussagen':fSpots(t).length+' Fehler'}</span>${pBadge(store.bank[t.id])}</div><button class="btn primary" onclick="goBank('${ty}','${k}','${t.id}')">Öffnen</button></div>`).join('')+`</div>`;}
 else if(k==='open'){h+=`<p class="hint" style="margin:6px 0 10px">Schriftliche Fragen wie in der Prüfung. Schreibe deine Antwort und vergleiche sie dann mit der Musterantwort.${AI.fn&&!AI.off?' Der KI-Tutor kann die Antwort inhaltlich bewerten.':''}</p>`+items.map(q=>`<div class="card" id="oq-${q.id}">${oqInner(q)}</div>`).join('');}
 else if(k==='quiz'){const m=MODULES.find(x=>x.id===ty);
  h+=m?`<div class="card"><h3 style="margin-top:0">Test: ${m.de}</h3><p>${m.quiz.length} Multiple-Choice-Fragen in zufälliger Reihenfolge. Bestes Ergebnis: ${Math.round((store.best[m.id]||0)*100)}%.</p><p style="margin:0"><button class="btn primary" onclick="go('${m.id}','quiz')">Test starten</button></p></div>`
   :`<div class="card"><h3 style="margin-top:0">Welches Diagramm passt?</h3><p>${WHICH.length} Situationen: „Welches UML-Diagramm eignet sich …?“</p><p style="margin:0"><button class="btn primary" onclick="go('which')">Starten</button></p></div>`;}
 el.innerHTML=h;}
function oqInner(q){const key='o:'+q.id,a=ansOf(key),rev=!!a.done;
 return openHTML(q,key,rev?'rev':'do')+`<p class="row" style="margin:10px 0 0">${rev?`<button class="btn" onclick="oqRedo('${q.id}')">Antwort ändern</button>`:`<button class="btn primary" onclick="oqCheck('${q.id}')">Prüfen</button>`}${AI.fn&&!AI.off?`<button class="btn" onclick="aiOpen('${q.id}')">🧑‍🏫 Mit KI bewerten</button>`:''}${pBadge(store.bank[q.id])}</p><div id="oai-${q.id}"></div>`;}
function oqCheck(id){const q=OPEN_Q.find(x=>x.id===id),a=ansOf('o:'+id);if(!(a.t||'').trim()){const t=$('#oq-'+id+' textarea');if(t)t.focus();return;}a.done=true;a.self=null;const s=scoreOpen(q,a.t);statAdd(q.type,s.pts,q.pts);setBest(id,Math.round(s.pts/q.pts*100));$('#oq-'+id).innerHTML=oqInner(q);}
function oqRedo(id){const a=ansOf('o:'+id);a.done=false;a.self=null;$('#oq-'+id).innerHTML=oqInner(OPEN_Q.find(x=>x.id===id));}
function bankTaskView(){const k=Bk.kind,list=k==='read'?READ_TASKS:FIND_TASKS,t=list.find(x=>x.id===Bk.id),key='b:'+t.id,a=ansOf(key),rev=!!a.done;
 let h=`<p><button class="btn" onclick="goBank('${t.type}','${k}')">← Zur Liste</button></p><div class="card"><h3 style="margin-top:0">${esc(t.t)} <span class="pill">${DTF[t.type]}</span></h3>`;
 h+=k==='read'?readHTML(t,key,rev?'rev':'do'):findHTML(t,key,rev?'rev':'do');
 if(rev){const s=k==='read'?readScore(t,a):findScore(t,a),pct=Math.round(s.pts/s.max*100);const same=bankItems(t.type,k),nx=same[(same.indexOf(t)+1)%same.length];
  h+=`<div class="score"><div class="num" style="color:${pct>=85?'var(--ok)':pct>=50?'var(--warn)':'var(--bad)'}">${s.pts} / ${s.max}</div><div><b>${pct>=85?'Sehr gut.':pct>=50?'Nicht schlecht, geh die Fehler oben durch.':'Lies die Theorie zu diesem Diagramm noch einmal und versuche es erneut.'}</b></div></div>
  <p class="row" style="margin:0"><button class="btn" onclick="goBank('${t.type}','${k}','${t.id}')">Noch einmal</button>${nx&&nx!==t?`<button class="btn primary" onclick="goBank('${t.type}','${k}','${nx.id}')">Nächste Aufgabe →</button>`:''}</p>`;}
 else h+=`<p style="margin:12px 0 0"><button class="btn primary" onclick="bankCheck()">Prüfen</button></p>`;
 return h+`</div>`;}
function bankCheck(){const k=Bk.kind,t=(k==='read'?READ_TASKS:FIND_TASKS).find(x=>x.id===Bk.id),a=ansOf('b:'+t.id);a.done=true;const s=k==='read'?readScore(t,a):findScore(t,a);
 statAdd(t.type,s.pts,s.max);setBest(t.id,Math.round(s.pts/s.max*100));renderBank();window.scrollTo(0,0);}
function modExamTab(m){const ty=m.id,c=k=>bankItems(ty,k).length;
 return EXTRA[ty].exam+`<div class="card"><h3 style="margin-top:0">Operatoren: was das Verb in der Aufgabe bedeutet</h3><div style="overflow-x:auto">${OPERATOREN}</div></div>
 <div class="card" style="border-left:4px solid ${m.color}"><h3 style="margin-top:0">An Aufgaben üben</h3><p>Zum Thema „${m.de}“ gibt es im Pool: ${c('draw')} Zeichenaufgaben, ${c('erg')} zum Ergänzen, ${c('read')} zum Lesen, ${c('find')} zur Fehlersuche und ${c('open')} schriftliche Fragen.</p><p class="row" style="margin:0"><button class="btn primary" onclick="goBank('${ty}','draw')">Aufgabenpool öffnen</button><button class="btn" onclick="exTopic('${ty}')">Prüfung zu diesem Thema</button></p></div>`;}

/* ================= PRÜFUNGSMODUS ================= */
const EXLEN={kurz:{min:25,mc:6,open:2,read:1,find:1,draw:1,dpts:16,name:'Kurz'},voll:{min:60,mc:10,open:4,read:2,find:2,draw:2,dpts:25,name:'Voll'}};
const EXTOP=Object.assign({mix:'Alle Diagramme (AP2-Mix)'},DTF);
let Ex={topic:'mix',len:'kurz'},exTick=null;
const ihk=p=>p>=92?[1,'sehr gut']:p>=81?[2,'gut']:p>=67?[3,'befriedigend']:p>=50?[4,'ausreichend']:p>=30?[5,'mangelhaft']:[6,'ungenügend'];
const fmtT=ms=>{const s=Math.max(0,Math.round(ms/1000));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');};
function exStopTimer(){clearInterval(exTick);exTick=null;}
function exTopic(t){Ex.topic=t;go('exam');}
function exBuild(topic,len){const L=EXLEN[len],types=topic==='mix'?Object.keys(DTF):[topic],pick=(arr,n)=>shuffle(arr.slice()).slice(0,n),items=[];
 const pool=[];MODULES.filter(m=>types.includes(m.id)).forEach(m=>m.quiz.forEach((q,i)=>pool.push([m.id,i])));
 pick(pool,L.mc).forEach(([m,i])=>{const q=MODULES.find(x=>x.id===m).quiz[i];items.push({k:'mc',m,i,ord:shuffle(q.o.map((_,k)=>k)),max:1});});
 pick(OPEN_Q.filter(q=>types.includes(q.type)||(topic==='mix'&&q.type==='gen')),L.open).forEach(q=>items.push({k:'open',id:q.id,max:q.pts}));
 const rd=pick(READ_TASKS.filter(t=>types.includes(t.type)),L.read),fd=pick(FIND_TASKS.filter(t=>types.includes(t.type)&&!rd.some(r=>r.base===t.base)),L.find);
 rd.forEach(t=>items.push({k:'read',id:t.id,max:t.st.length}));fd.forEach(t=>items.push({k:'find',id:t.id,max:fSpots(t).length*2}));
 const used=rd.concat(fd).map(t=>t.base),ch=[];
 shuffle(DRAW_TASKS.filter(t=>types.includes(t.type)&&t.spec&&!t.erg&&!used.includes(t.id))).forEach(t=>{if(ch.length<L.draw&&!(topic==='mix'&&ch.some(c=>c.type===t.type)))ch.push(t);});
 ch.forEach(t=>items.push({k:'draw',id:t.id,max:L.dpts}));return items;}
function exStart(){Object.keys(store.draw).forEach(k=>{if(k.indexOf('exam-')===0)delete store.draw[k];});const L=EXLEN[Ex.len];
 store.examRun={topic:Ex.topic,len:Ex.len,items:exBuild(Ex.topic,Ex.len),ans:{},start:Date.now(),end:Date.now()+L.min*60000,step:0,done:false};save();renderExam2();window.scrollTo(0,0);}
function exDiscard(b){if(!b.dataset.sure){b.dataset.sure=1;b.textContent='Noch einmal klicken: Das Ergebnis wird gelöscht';setTimeout(()=>{if(b.isConnected){delete b.dataset.sure;b.textContent=b.dataset.label;}},4000);return;}
 leavePage();delete store.examRun;save();renderExam2();window.scrollTo(0,0);}
function quickExam(){$('#main').innerHTML=`<h1>Schnelltest</h1><p class="sub">20 zufällige Fragen aus allen Themen: Theorie, Symbole und Diagrammwahl. <button class="btn" onclick="go('exam')">← Zur Prüfung</button></p><div id="qz"></div>`;
 let pool=[];MODULES.forEach(m=>pool.push(...m.quiz.map(q=>({...q,tag:m.de}))));pool=shuffle(pool).slice(0,13).concat(shuffle(symbolQuestions()).slice(0,4),shuffle(whichQuestions()).slice(0,3));startQuiz($('#qz'),pool,'exam','var(--accent)');}
function renderExam2(){exStopTimer();const r=store.examRun;if(!r||!Array.isArray(r.items))return exSetup();if(r.done)return exReview();if(Date.now()>=r.end)return exFinish();exRun();}
function exSetup(){const L=EXLEN[Ex.len];
 let h=`<h1>Prüfung</h1><p class="sub">Variante im AP2-Stil: Multiple-Choice-Fragen, schriftliche Antworten, Diagramm lesen, Fehlersuche und Zeichnen. Mit Timer, Punkten und Note nach IHK-Notenschlüssel.</p>`;
 h+=`<div class="card"><h3 style="margin-top:0">Thema</h3><div class="seg">${Object.keys(EXTOP).map(k=>`<button class="${k===Ex.topic?'on':''}" onclick="Ex.topic='${k}';exSetup()">${EXTOP[k]}</button>`).join('')}</div>
 <h3>Umfang</h3><div class="seg">${Object.keys(EXLEN).map(k=>`<button class="${k===Ex.len?'on':''}" onclick="Ex.len='${k}';exSetup()">${EXLEN[k].name} · ${EXLEN[k].min} Minuten</button>`).join('')}</div>
 <p>In dieser Variante: ${L.mc} Multiple-Choice-Fragen, ${L.open} schriftliche Fragen, ${L.read} zum Diagrammlesen, ${L.find} zur Fehlersuche und ${L.draw} zum Zeichnen. Das Zeichnen bringt die meisten Punkte, wie in der echten Prüfung.</p>
 <p class="hint" style="margin-bottom:12px">Während der Prüfung sind Lösungen und Bot-Hinweise ausgeblendet. Der Timer läuft weiter, auch wenn du die Seite schließt. Zeichnungen aus dem Bereich «Praxis» bleiben von der Prüfung unberührt.</p>
 <p style="margin:0"><button class="btn primary" onclick="exStart()">Prüfung starten</button></p></div>`;
 h+=`<div class="card"><h3 style="margin-top:0">Schnelltest ohne Timer</h3><p>20 zufällige Multiple-Choice-Fragen aus allen Themen.</p><p style="margin:0"><button class="btn" onclick="quickExam()">Schnelltest starten</button></p></div>`;
 if(store.examHist.length)h+=`<div class="card"><h3 style="margin-top:0">Bisherige Ergebnisse</h3><div style="overflow-x:auto"><table><tr><th>Datum</th><th>Thema</th><th>Umfang</th><th>Punkte</th><th>Note</th></tr>${store.examHist.slice().reverse().map(x=>`<tr><td>${new Date(x.at).toLocaleDateString('de-DE')}</td><td>${EXTOP[x.topic]||x.topic}</td><td>${(EXLEN[x.len]||{}).name||''}</td><td>${x.pts} / ${x.max} (${x.pct}%)</td><td>${x.grade}</td></tr>`).join('')}</table></div></div>`;
 $('#main').innerHTML=h;}
function exAnswered(it,i){const r=store.examRun,a=r.ans['x:'+i]||{};
 if(it.k==='mc')return a.c!=null;if(it.k==='open')return !!(a.t||'').trim();if(it.k==='read')return (a.v||[]).filter(v=>v!=null).length===READ_TASKS.find(t=>t.id===it.id).st.length;
 if(it.k==='find')return !!(a.m&&a.m.length);const d=Pz.key==='exam-'+i&&Pz.doc?Pz.doc:store.draw['exam-'+i];return !!d&&!docEmpty(d);}
function exChips(){const el=$('#exchips'),r=store.examRun;if(!el||!r)return;const ic={mc:'',open:'✍',read:'👓',find:'🔎',draw:'✏️'};
 el.innerHTML=r.items.map((it,i)=>`<button class="chip ${i===r.step?'cur':''} ${exAnswered(it,i)?'done':''}" onclick="exGo(${i})" title="${KNAME[it.k]}">${i+1}${ic[it.k]?' '+ic[it.k]:''}</button>`).join('');}
function exLeaveStep(){if(Pz.key){flushDoc();Pz.key=null;Pz.doc=null;Pz.task=null;}}
function exGo(i){const r=store.examRun;exLeaveStep();r.step=Math.max(0,Math.min(r.items.length-1,i));save();exRun();window.scrollTo(0,0);}
function exRun(){const r=store.examRun,i=r.step,it=r.items[i],key='x:'+i,n=r.items.length;exLeaveStep();
 let h=`<div class="exbar"><b>Prüfung</b><span class="lvl">${EXTOP[r.topic]}</span><span class="timer" id="extimer" aria-label="Verbleibende Zeit">${fmtT(r.end-Date.now())}</span><span style="flex:1"></span><button class="btn" id="exfin" data-label="Abgeben" onclick="exAskFinish(this)">Abgeben</button></div>`;
 h+=`<div class="chips" id="exchips"></div><div class="card"><div class="qhead"><span>Aufgabe ${i+1} von ${n} · ${KNAME[it.k]}</span><span>${it.max} P.</span></div>`;
 let t=null;
 if(it.k==='mc')h+=mcHTML(it,key,'do');
 else if(it.k==='open')h+=`<div style="margin-top:10px">`+openHTML(OPEN_Q.find(q=>q.id===it.id),key,'do')+`</div>`;
 else if(it.k==='read')h+=readHTML(READ_TASKS.find(x=>x.id===it.id),key,'do');
 else if(it.k==='find')h+=findHTML(FIND_TASKS.find(x=>x.id===it.id),key,'do');
 else{t=baseOf(it.id);h+=`<p style="margin:8px 0 0"><b>Erstellen Sie ein ${DTF[t.type]}.</b></p><div>${t.text}</div></div>`+edHTML(t.type==='sq')+`<div>`;}
 h+=`</div><p class="row"><button class="btn" onclick="exGo(${i-1})" ${i?'':'disabled'}>← Zurück</button><button class="btn primary" onclick="exGo(${i+1})" ${i<n-1?'':'disabled'}>Weiter →</button></p>`;
 $('#main').innerHTML=h;
 if(t){Pz.key='exam-'+i;Pz.type=t.type;Pz.task=t;loadDoc();refreshEd();bindCanvas();}
 exChips();exStopTimer();exTick=setInterval(()=>{const el=$('#extimer'),left=r.end-Date.now();if(left<=0){exFinish();return;}if(el){el.textContent=fmtT(left);el.classList.toggle('low',left<300000);}if(t)exChips();},1000);}
function exAskFinish(b){const r=store.examRun,open=r.items.filter((it,i)=>!exAnswered(it,i)).length;
 if(!b.dataset.sure){b.dataset.sure=1;b.textContent=open?`Ohne Antwort: ${open}. Noch einmal klicken, um abzugeben`:'Noch einmal klicken, um abzugeben';setTimeout(()=>{if(b.isConnected){delete b.dataset.sure;b.textContent=b.dataset.label;}},4000);return;}exFinish();}
function exGrade(r){let pts=0,max=0;const part={};const res=r.items.map((it,i)=>{const a=r.ans['x:'+i]||{};let p=0,info=null,ty=null;
  if(it.k==='mc'){p=a.c===MODULES.find(m=>m.id===it.m).quiz[it.i].a?1:0;ty=it.m;}
  else if(it.k==='open'){const q=OPEN_Q.find(x=>x.id===it.id);p=openPts(q,a);ty=q.type;}
  else if(it.k==='read'){const t=READ_TASKS.find(x=>x.id===it.id);p=readScore(t,a).pts;ty=t.type;}
  else if(it.k==='find'){const t=FIND_TASKS.find(x=>x.id===it.id),s=findScore(t,a);p=Math.round(s.pts/s.max*it.max*2)/2;ty=t.type;}
  else{const t=baseOf(it.id),d=store.draw['exam-'+i];info=d&&!docEmpty(d)?gradeDoc(d,t):null;p=info&&info.pct!=null?Math.round(info.pct/100*it.max*2)/2:0;ty=t.type;}
  pts+=p;max+=it.max;const g=part[it.k]||(part[it.k]=[0,0]);g[0]+=p;g[1]+=it.max;return {p,info,ty};});
 const pct=max?Math.round(pts/max*100):0;return {res,pts,max,pct,part,grade:ihk(pct)};}
function exFinish(){const r=store.examRun;if(!r||r.done)return;exStopTimer();exLeaveStep();r.done=true;r.used=Math.min(Date.now(),r.end)-r.start;const g=exGrade(r);
 g.res.forEach((x,i)=>{if(x.ty&&x.ty!=='gen')statAdd(x.ty,x.p,r.items[i].max);});
 r.items.forEach((it,i)=>{if(it.k!=='mc')return;const q=MODULES.find(m=>m.id===it.m).quiz[it.i],a=r.ans['x:'+i];if(a&&a.c!=null)qStat(q,a.c===q.a);});
 store.examHist.push({at:Date.now(),topic:r.topic,len:r.len,pts:g.pts,max:g.max,pct:g.pct,grade:g.grade[0]});if(store.examHist.length>12)store.examHist.shift();r.hist=true;
 store.best.exam=Math.max(store.best.exam||0,g.pct/100);save();if(route.page==='exam'){exReview();window.scrollTo(0,0);}}
function exSummary(){const el=$('#exsum'),r=store.examRun;if(!el||!r)return;const g=exGrade(r);
 if(r.hist&&store.examHist.length){const hst=store.examHist[store.examHist.length-1];hst.pts=g.pts;hst.pct=g.pct;hst.grade=g.grade[0];save();}
 const col=g.pct>=81?'var(--ok)':g.pct>=50?'var(--warn)':'var(--bad)';
 el.innerHTML=`<div class="result" style="padding:10px 0 4px"><div class="big" style="color:${col}">${g.pts} / ${g.max}</div><p style="margin:4px 0"><b>${g.pct}% · Note ${g.grade[0]} (${g.grade[1]})</b></p><p class="lvl">Zeit: ${fmtT(r.used||0)} von ${EXLEN[r.len].min}:00 · ${EXTOP[r.topic]}</p></div>
 <div style="overflow-x:auto"><table><tr><th>Teil</th><th>Punkte</th></tr>${Object.keys(g.part).map(k=>`<tr><td>${KNAME[k]}</td><td>${g.part[k][0]} von ${g.part[k][1]}</td></tr>`).join('')}</table></div>
 <p class="lvl" style="margin:10px 0 0">IHK-Notenschlüssel: 100–92% = 1, 91–81% = 2, 80–67% = 3, 66–50% = 4, 49–30% = 5, unter 30% = 6. Bestanden ist die Prüfung ab 50%.</p>`;
 r.items.forEach((it,i)=>{const b=$('#exp-'+i);if(b)b.textContent=g.res[i].p+' von '+it.max+' P.';});}
function exReview(){const r=store.examRun,g=exGrade(r);
 let h=`<h1>Prüfungsergebnis</h1><div class="card" id="exsum"></div><p class="row"><button class="btn primary" data-label="Neue Prüfung" onclick="exDiscard(this)">Neue Prüfung</button><button class="btn" onclick="go('bank')">Aufgabenpool</button></p><h2>Auswertung nach Aufgaben</h2>`;
 r.items.forEach((it,i)=>{const key='x:'+i;h+=`<div class="card"><div class="qhead"><span>Aufgabe ${i+1} · ${KNAME[it.k]}</span><b id="exp-${i}"></b></div>`;
  if(it.k==='mc')h+=mcHTML(it,key,'rev');
  else if(it.k==='open')h+=`<div style="margin-top:10px">`+openHTML(OPEN_Q.find(q=>q.id===it.id),key,'rev')+`</div>`;
  else if(it.k==='read')h+=readHTML(READ_TASKS.find(x=>x.id===it.id),key,'rev');
  else if(it.k==='find')h+=findHTML(FIND_TASKS.find(x=>x.id===it.id),key,'rev');
  else{const t=baseOf(it.id),d=store.draw['exam-'+i],info=g.res[i].info;
   h+=`<p style="margin:8px 0 0"><b>${esc(t.t)}</b> <span class="pill">${DTF[t.type]}</span></p><details><summary class="lvl">Aufgabentext anzeigen</summary>${t.text}</details>`;
   if(!info)h+=`<p><b>Keine Zeichnung vorhanden.</b> Für diese Aufgabe gibt es 0 Punkte.</p>`;
   else{h+=`<p style="margin:10px 0 4px"><b>Deine Zeichnung: ${info.pct}% Übereinstimmung mit der Musterlösung</b></p>`+figOf(d);
    if(info.all.length)h+=info.all.filter(f=>f.lv!=='tip').slice(0,12).map(f=>`<div class="find ${f.lv}" style="cursor:default"><b>${f.lv==='err'?'✗':'!'}</b><span>${esc(findWhy(f.t))}</span></div>`).join('');
    if(info.R&&info.R.miss.length)h+=`<p style="margin:8px 0 2px"><b>Es fehlt:</b></p><ul class="clean">${info.R.miss.map(m=>`<li>${esc(m)}</li>`).join('')}</ul>`;}
   const sf=solFig(t);h+=`<details ${info?'':'open'}><summary><b>Musterlösung</b></summary>${sf}${sf?'':`<pre style="white-space:pre-wrap;font-size:13px;background:var(--code);border-radius:10px;padding:12px">${esc(specText(t.spec,t.type))}</pre>`}</details>`;}
  h+=`</div>`;});
 $('#main').innerHTML=h;exSummary();
 document.querySelectorAll('#main .figure img').forEach(img=>img.onclick=()=>{const z=$('#zoom');z.querySelector('img').src=img.src;z.style.display='flex';});}

/* breite Tabellen scrollen im eigenen Container, statt die Seite zu verbreitern */
new MutationObserver(()=>{document.querySelectorAll('#main table').forEach(t=>{if(t.parentNode.classList.contains('tscroll')||t.closest('[style*="overflow-x"]'))return;const w=document.createElement('div');w.className='tscroll';t.parentNode.insertBefore(w,t);w.appendChild(t);});}).observe($('#main'),{childList:true,subtree:true});
