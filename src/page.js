
/* ================= ÜBUNGSSEITE ================= */
const DTF={uc:'Anwendungsfalldiagramm',cl:'Klassendiagramm',st:'Zustandsdiagramm',ac:'Aktivitätsdiagramm',sq:'Sequenzdiagramm'};
const LVL={leicht:'leicht',mittel:'mittel',schwer:'schwer'};
if(!store.lastTask)store.lastTask={};
const AI={fn:null,ready:false,off:false,gen:false,genErr:''};
const tasksOf=type=>DRAW_TASKS.filter(t=>t.type===type);
const customOf=type=>store.custom&&store.custom[type]||null;
function findTask(type,id){if(id==='free')return null;const c=customOf(type);if(c&&c.id===id)return c;return tasksOf(type).find(t=>t.id===id)||null;}
function flushDoc(){if(!Pz.doc)return;clearTimeout(saveT);store.draw[taskKey()]=Pz.doc;save();}
function stopAI(){const a=Pz.ai;if(a&&a.ctl){try{a.ctl.abort();}catch(e){}}}
function openTask(type,id){flushDoc();stopAI();Pz.type=type;
 if(id===undefined)id=store.lastTask[type];
 Pz.task=id==='free'?null:(findTask(type,id)||(id===undefined?tasksOf(type)[0]:null));
 store.lastTask[type]=Pz.task?Pz.task.id:'free';store.lastType=type;loadDoc();Pz.sol=false;save();}
function goDraw(type,id){if(typeof leavePage==='function')leavePage();openTask(type||Pz.type,id);route={page:'draw'};render();window.scrollTo(0,0);}
function pickTask(type,id){openTask(type,id);renderDraw();}

function renderDraw(){
 if(!Pz.doc)openTask(DTF[store.lastType]?store.lastType:Pz.type);
 const t=Pz.task,ty=Pz.type,sq=ty==='sq';const c=customOf(ty);
 const best=id=>store.drawBest[id]!=null?` · bestes Ergebnis ${store.drawBest[id]}%`:'';
 let h=`<h1>Praxis: Diagramme zeichnen</h1><p class="sub">Wähle Typ und Aufgabe, zeichne deine Lösung und lass sie prüfen. Alle Aufgaben nach Formaten findest du im <a href="#" onclick="go('bank');return false">Aufgabenpool</a>. Die Zeichnung wird für jede Aufgabe automatisch gespeichert.</p>`;
 h+=`<div class="seg" role="tablist">${Object.keys(DTF).map(k=>`<button class="${k===ty?'on':''}" onclick="pickTask('${k}')">${DTF[k]}</button>`).join('')}</div>`;
 h+=`<div class="card"><div class="row"><label for="tsel"><b>Aufgabe</b></label><select id="tsel" onchange="pickTask('${ty}',this.value)" style="flex:1;min-width:200px">`+
  [['Zeichnen: nach Text zeichnen',x=>!x.erg],['Ergänzen: ein vorhandenes Diagramm ergänzen',x=>x.erg]].map(([lab,f])=>{const l=tasksOf(ty).filter(f);return l.length?`<optgroup label="${lab}">`+l.map(x=>`<option value="${x.id}" ${t&&t.id===x.id?'selected':''}>${esc(x.t)} · ${LVL[x.lvl]||x.lvl}${best(x.id)}</option>`).join('')+`</optgroup>`:'';}).join('')+
  (c?`<option value="${c.id}" ${t&&t.id===c.id?'selected':''}>🎲 Von der KI: ${esc(c.t)}</option>`:'')+
  `<option value="free" ${!t?'selected':''}>Freies Zeichnen (ohne Aufgabe)</option></select><span id="genbtn"></span></div>`;
 h+=t?`<div style="margin-top:10px">${t.text}</div>`:`<p class="hint" style="margin-top:10px">Zeichne, was du möchtest. Der Bot prüft nur die Notationsregeln, der KI-Tutor bewertet das ganze Diagramm.</p>`;
 h+=`</div>`;
 h+=edHTML(sq);
 h+=`<div class="row"><button class="btn primary" onclick="runCheck()">✔ Mit dem Bot prüfen</button>${t?`<button class="btn" id="solbtn" onclick="toggleSol()">Lösung anzeigen</button>`:''}<button class="btn" onclick="saveImage()">🖼 Als Bild speichern</button><span class="lvl" id="imgmsg" aria-live="polite"></span></div><div id="imgbox"></div>`;
 h+=`<div id="fb"></div><div id="solbox"></div><div id="aibox"></div>`;
 $('#main').innerHTML=h;
 refreshEd();bindCanvas();renderFb();renderSol();renderAI();renderGen();
}

/* ----- Prüfung durch den Bot ----- */
function docEmpty(d){return d.type==='sq'?!d.parts.length:!d.nodes.length;}
function runCheck(){const d=Pz.doc,t=Pz.task;
 if(docEmpty(d)){Pz.fb={empty:true};renderFb();return;}
 const g=gradeDoc(d,t),all=g.all,R=g.R,pct=g.pct;
 if(pct!=null){store.drawBest[t.id]=Math.max(store.drawBest[t.id]||0,pct);if(typeof statAdd==='function')statAdd(t.type,pct,100);save();}
 Pz.fb={all,R,pct,at:Date.now()};Pz.find=null;drawCanvas();if(d.type==='sq')renderSQB();renderFb();
 const fb=$('#fb');if(fb)fb.scrollIntoView({behavior:'smooth',block:'nearest'});
 const sel=$('#tsel');if(sel&&t&&pct!=null){const o=sel.querySelector(`option[value="${t.id}"]`);if(o&&!t.ai)o.textContent=`${t.t} · ${LVL[t.lvl]||t.lvl} · bestes Ergebnis ${store.drawBest[t.id]}%`;}
}
function renderFb(){const el=$('#fb');if(!el)return;const f=Pz.fb;
 if(!f){el.innerHTML='';return;}
 if(f.empty){el.innerHTML=`<div class="card"><b>Das Feld ist leer.</b> Zeichne zuerst ein Diagramm und starte dann die Prüfung.</div>`;return;}
 const ic={err:'✗',warn:'!',tip:'i'},nmv={err:'Ein Fehler',warn:'Hinweis',tip:'Tipp'};const R=f.R;
 let h=`<div class="card"><h3 style="margin-top:0">🤖 Prüf-Bot</h3>`;
 if(f.pct!=null){const col=f.pct>=85?'var(--ok)':f.pct>=55?'var(--warn)':'var(--bad)';
  const msg=f.pct>=90?'Sehr gut, das ist Prüfungsniveau.':f.pct>=70?'Gut. Es fehlen nur noch Details.':f.pct>=40?'Die Grundlage steht, aber ein Teil der Lösung fehlt oder es gibt Fehler.':'Noch weit von der Lösung entfernt. Lies die Aufgabe noch einmal und öffne den Hinweis unten.';
  h+=`<div class="score"><div class="num" style="color:${col}">${f.pct}%</div><div><b>${msg}</b><br><span class="lvl">Übereinstimmung mit der Musterlösung: ${R.ok} von ${R.total} Punkten. Für Notationsfehler gibt es Abzug.</span></div></div>`;}
 else h+=`<p class="hint" style="margin-bottom:8px">${Pz.task?'Für diese Aufgabe gibt es keine eingebaute Musterlösung. Der Bot hat die Notationsregeln geprüft; ob die Aufgabe erfüllt ist, bewertet der KI-Tutor.':'Freies Zeichnen: Es wurden nur die Notationsregeln geprüft.'}</p>`;
 if(!f.all.length)h+=`<div class="find ok"><b>✓</b><span>Keine Verstöße gegen die Notationsregeln gefunden.</span></div>`;
 f.all.forEach((x,i)=>{const cl=x.ids&&x.ids.filter(Boolean).length;h+=`<div class="find ${x.lv}" ${cl?`onclick="focusFind(${i})" title="Im Feld anzeigen"`:'style="cursor:default"'}><b>${ic[x.lv]}</b><span><b>${nmv[x.lv]}.</b> ${esc(x.t)}${cl?' <span class="lvl">anzeigen ↑</span>':''}</span></div>`;});
 if(R&&R.miss.length)h+=`<details style="margin-top:10px"><summary><b>Laut Aufgabe fehlt noch: ${R.miss.length}</b> (klicken, wenn du einen Hinweis brauchst)</summary><ul class="clean">${R.miss.map(m=>`<li>${esc(m)}</li>`).join('')}</ul></details>`;
 if(R&&R.struct&&R.struct.length)h+=`<p class="hint" style="margin-top:10px">Am Sinn oder an den Beziehungen erkannt, obwohl der Name anders lautet: ${R.struct.map(x=>'„'+esc(x[0])+'“ = „'+esc(x[1])+'“').join(', ')}.</p>`;
 if(R&&R.extra.length)h+=`<p class="hint" style="margin-top:10px">Der Bot hat in der Musterlösung nicht gefunden: ${R.extra.map(x=>'„'+esc(x)+'“').join(', ')}. Das muss kein Fehler sein: Vielleicht hast du das Element anders benannt oder etwas Zusätzliches ergänzt.</p>`;
 if(R)h+=`<p class="hint" style="margin-top:10px">Der Bot vergleicht anhand von Schlüsselwörtern und Beziehungen mit der Musterlösung. Eine andere korrekte Lösung kann er niedriger bewerten. Frag in Zweifelsfällen den KI-Tutor.</p>`;
 el.innerHTML=h+`</div>`;
}
function focusFind(i){const f=Pz.fb&&Pz.fb.all&&Pz.fb.all[i];if(!f||!f.ids)return;Pz.find=f.ids.filter(Boolean);Pz.sel=null;drawCanvas();renderProps();if(Pz.doc.type==='sq')renderSQB();
 const el=$('#cv .hl'),cv=$('.ed-canvas');
 if(el&&cv){const r=el.getBoundingClientRect(),c=cv.getBoundingClientRect();if(r.left<c.left+10||r.right>c.right-10)cv.scrollLeft+=r.left-c.left-c.width/2+r.width/2;if(r.top<c.top+10||r.bottom>c.bottom-10)cv.scrollTop+=r.top-c.top-c.height/2+r.height/2;}
 const ed=$('.ed');if(ed)ed.scrollIntoView({behavior:'smooth',block:'start'});
}

/* ----- Musterlösung ----- */
function toggleSol(){Pz.sol=!Pz.sol;renderSol();if(Pz.sol){const s=$('#solbox');if(s)s.scrollIntoView({behavior:'smooth',block:'nearest'});}}
function renderSol(){const el=$('#solbox'),b=$('#solbtn');if(b)b.textContent=Pz.sol?'Lösung ausblenden':'Lösung anzeigen';if(!el)return;const t=Pz.task;
 if(!Pz.sol||!t){el.innerHTML='';return;}
 let h=`<div class="card"><h3 style="margin-top:0">Lösung (Musterlösung)</h3>`;
 h+=solFig(t);if(t.img&&IMG[t.img])h+=`<div class="figcap">Klicke auf das Bild, um es zu vergrößern.</div>`;
 const txt=t.spec?specText(t.spec,t.type):(t.solText||'');
 h+=`<p style="margin-bottom:4px"><b>Dasselbe als Text:</b></p><pre style="white-space:pre-wrap;font-size:13px;background:var(--code);border-radius:10px;padding:12px;margin:0">${esc(txt)}</pre>`;
 h+=`<p class="hint" style="margin-top:8px">Anordnung und genaue Namen dürfen abweichen. Wichtig sind die Elemente, die Beziehungsarten und die Richtungen.</p></div>`;
 el.innerHTML=h;
 el.querySelectorAll('.figure img').forEach(img=>img.onclick=()=>{const z=$('#zoom');z.querySelector('img').src=img.src;z.style.display='flex';});
}

/* ----- Mini-Markdown ----- */
function md(s){const inl=t=>t.replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>').replace(/(^|[\s(])\*([^*\s][^*]*)\*(?=[\s).,;:!?]|$)/g,'$1<i>$2</i>');
 let h='',list=null;const close=()=>{if(list){h+=`</${list}>`;list=null;}};
 esc(s).split('\n').forEach(l=>{let m;
  if((m=l.match(/^\s*[-*•]\s+(.*)/))){if(list!=='ul'){close();h+='<ul>';list='ul';}h+=`<li>${inl(m[1])}</li>`;}
  else if((m=l.match(/^\s*(\d+)[.)]\s+(.*)/))){if(list!=='ol'){close();h+=`<ol start="${m[1]}">`;list='ol';}h+=`<li>${inl(m[2])}</li>`;}
  else if((m=l.match(/^\s*#{1,6}\s+(.*)/))){close();h+=`<p><b>${inl(m[1])}</b></p>`;}
  else if(/^\s*([-*_])\1{2,}\s*$/.test(l)||!l.trim()){close();}
  else{close();h+=`<p>${inl(l)}</p>`;}});
 close();return h;}
const plain=h=>{const d=document.createElement('div');d.innerHTML=String(h||'').replace(/<\/(p|li|h\d)>/g,'\n').replace(/<li>/g,'- ');return d.textContent.replace(/\n{3,}/g,'\n\n').trim();};

/* ----- KI-Tutor ----- */
function reviewPrompt(desc){const t=Pz.task,d=Pz.doc;const fnd=RULES[d.type](d);let R=null;if(t&&t.spec)R=d.type==='sq'?checkSpecSQ(d,t.spec):checkSpec(d,t.spec);
 const lines=fnd.concat(R?R.iss:[]).map(f=>`- (${f.lv}) ${f.t}`);if(R)R.miss.forEach(m=>lines.push('- (fehlt laut Musterlösung) '+m));
 const ref=t?(t.spec?specText(t.spec,t.type):(t.solText||'')):'';
 return `Du bist UML-Tutor für einen Auszubildenden, der sich auf die IHK-Prüfung AP2 (Fachinformatiker Anwendungsentwicklung, Lernfeld 11) vorbereitet. Antworte auf Deutsch in einfachen, klaren Sätzen und verwende die UML-Fachbegriffe so wie in der Prüfung.

Der Auszubildende hat ein Diagramm in einem Lern-Editor gezeichnet. Unten steht die Textbeschreibung (das Bild selbst siehst du nicht, bewerte die Anordnung der Elemente nicht).

Das ist zu tun:
1. Nenne kurz, was gelungen ist (1–2 Punkte).
2. Zähle die Fehler nach Wichtigkeit auf: zuerst inhaltliche (das Diagramm passt nicht zur Aufgabe), dann Notationsfehler. Erkläre bei jedem, warum es ein Fehler ist und wie man ihn behebt.
3. Gib nicht die fertige Lösung als Ganzes heraus. Gib Denkanstöße, damit der Auszubildende selbst weiterzeichnet. Zeige die vollständige Lösung nur, wenn er ausdrücklich darum bittet.
4. Andere Elementnamen als in der Musterlösung gelten nicht als Fehler, wenn der Sinn derselbe ist. Auch eine andere korrekte Modellierung ist zulässig, sag das dann.
5. Der automatische Prüfer arbeitet mit Schlüsselwörtern und kann sich irren. Prüfe seine Hinweise selbst und wiederhole sie nicht blind.
6. Gib am Ende eine ungefähre Bewertung in Prozent und einen nächsten Schritt.
Schreibe knapp, in Listen, ohne Tabellen. Verwende als Auszeichnung nur **fett**, Listen und \`Code\`.

Diagrammtyp: ${DTF[d.type]}

${t?'Aufgabe „'+t.t+'“:\n'+plain(t.text):'Aufgabe: keine (freies Zeichnen). Beurteile, ob das Diagramm für sich genommen korrekt ist und was es ausdrückt.'}

Zeichnung des Schülers:
${docEmpty(d)?'(leer – noch nichts gezeichnet)':desc}

Befunde des automatischen Prüfers:
${lines.length?lines.join('\n'):'- keine'}
${ref?'\nMusterlösung (dem Auszubildenden nicht vollständig zeigen):\n'+ref:''}`;}
const AI_ERR={rate_limited:'Zu viele Anfragen oder das Claude-Limit ist erreicht. Versuche es später noch einmal.',session_expired:'Du musst dich bei Claude neu anmelden und es dann erneut versuchen.',refused:'Claude hat diese Anfrage abgelehnt. Formuliere die Frage anders.',prompt_too_large:'Das Diagramm ist für eine einzelne Anfrage zu groß.',empty_completion:'Claude hat keine Antwort gegeben. Versuche es noch einmal.',invalid_json:'Die Antwort kam in einem falschen Format. Versuche es noch einmal.'};
const AI_OFF=['not_granted','sampling_disabled','not_declared','capability_disabled','capability_removed'];
function aiFail(e){const code=e&&e.code;if(code==='cancelled')return '';if(AI_OFF.includes(code)){AI.off=true;return '';}return AI_ERR[code]||'Die Verbindung zu Claude hat nicht geklappt. Versuche es noch einmal.';}
async function aiSend(q){const a=Pz.ai;if(a.busy||!AI.fn||AI.off)return;q=(q||'').trim();const desc=describe(Pz.doc);
 if(!a.turns.length)a.turns.push({role:'user',content:reviewPrompt(desc)+(q?'\n\nFrage des Auszubildenden: '+q:''),show:q||'Analysiere mein Diagramm.'});
 else{const ch=desc!==a.lastDesc;a.turns.push({role:'user',content:(q||'Ich habe das Diagramm geändert. Prüfe es noch einmal.')+(ch?'\n\n[Aktueller Stand des Diagramms]\n'+desc:''),show:q||'Ich habe das Diagramm geändert. Prüfe es noch einmal.'});}
 a.lastDesc=desc;a.busy=true;a.err='';a.out='';a.ctl=new AbortController();renderAI();
 try{const r=await AI.fn(a.turns.map(t=>({role:t.role,content:t.content})),{cache:false,signal:a.ctl.signal,onText:({text})=>{a.out=text;if(Pz.ai!==a)return;const o=$('#aiout');if(o)o.innerHTML=md(text);}});
  a.turns.push({role:'assistant',content:r.text+(r.truncated?'\n\n(Die Antwort wurde wegen der Länge abgeschnitten.)':'')});}
 catch(e){a.err=aiFail(e);if(e&&e.text&&e.code!=='refused')a.turns.push({role:'assistant',content:e.text+'\n\n(Die Antwort wurde abgebrochen.)'});else a.turns.pop();}
 a.busy=false;a.ctl=null;if(Pz.ai===a&&route.page==='draw'){renderAI();renderGen();}
}
function aiAsk(){const b=$('#aiq');const q=b?b.value:'';aiSend(q);}
function aiReset(){stopAI();Pz.ai={turns:[],busy:false,ctl:null,out:''};renderAI();}
function copyPrompt(){const ta=$('#aiprompt');if(!ta)return;ta.value=reviewPrompt(describe(Pz.doc));ta.hidden=false;const done=ok=>{const s=$('#aicopied');if(s)s.textContent=ok?'Kopiert. Füge es in einen Chat mit Claude ein.':'Automatisches Kopieren hat nicht geklappt. Der Text ist unten markiert, drücke Strg+C.';};
 const sel=()=>{ta.focus();ta.select();};
 try{navigator.clipboard.writeText(ta.value).then(()=>done(true),()=>{sel();done(false);});}catch(e){sel();let ok=false;try{ok=document.execCommand('copy');}catch(_){}done(ok);}
}
function renderAI(){const el=$('#aibox');if(!el)return;const a=Pz.ai;
 if(!AI.ready){el.innerHTML=`<div class="aibox"><b>🧑‍🏫 KI-Tutor</b><p class="hint">Prüfe, ob Claude erreichbar ist…</p></div>`;return;}
 if(!AI.fn||AI.off){el.innerHTML=`<div class="aibox"><b>🧑‍🏫 KI-Tutor</b><p style="margin:6px 0">${AI.off?'In diesem Fenster ist der Zugriff auf Claude nicht erlaubt.':'In dieser Datei kann der KI-Tutor nicht selbst antworten: Er arbeitet in der Online-Version des Programms (den Link findest du im Chat mit Claude).'} Ausweichweg: Kopiere die fertige Anfrage mit der Beschreibung deines Diagramms und füge sie in einen Chat mit Claude ein.</p>
  <p class="row" style="margin:8px 0"><button class="btn" onclick="copyPrompt()">📋 Anfrage für Claude kopieren</button><span class="lvl" id="aicopied"></span></p><textarea id="aiprompt" rows="8" readonly hidden aria-label="Anfrage für Claude"></textarea></div>`;return;}
 let h=`<div class="aibox"><b>🧑‍🏫 KI-Tutor (Claude)</b><p class="hint" style="margin:4px 0 8px">Er analysiert genau dein Diagramm: was stimmt, was nicht und warum. Du kannst Fragen stellen. Die Anfrage läuft über dein Claude-Konto, beim ersten Klick erscheint ein Fenster mit der Freigabe.</p>`;
 a.turns.forEach(t=>{h+=t.role==='user'?`<div class="aimsg me">${esc(t.show||t.content)}</div>`:`<div class="aimsg">${md(t.content)}</div>`;});
 if(a.busy)h+=`<div class="aimsg" id="aiout" aria-live="polite">${a.out?md(a.out):'Ich denke nach… Die erste Antwort kann bis zu einer Minute dauern.'}</div>`;
 if(a.err)h+=`<div class="find warn" style="cursor:default"><b>!</b><span>${a.err}</span></div>`;
 if(a.busy)h+=`<p style="margin:8px 0 0"><button class="btn" onclick="stopAI()">■ Stoppen</button></p>`;
 else if(!a.turns.length)h+=`<p class="row" style="margin:8px 0 0"><button class="btn primary" onclick="aiSend()">Mein Diagramm analysieren</button></p>`;
 else h+=`<label for="aiq" class="lvl" style="display:block;margin-top:10px">Frage an den Tutor</label><textarea id="aiq" rows="2" placeholder="Zum Beispiel: Warum hier «extend» und nicht «include»?" style="font-family:inherit;font-size:14px"></textarea>
  <p class="row" style="margin:8px 0 0"><button class="btn primary" onclick="aiAsk()">Fragen</button><button class="btn" onclick="aiSend()">Noch einmal prüfen</button><button class="btn" onclick="aiReset()">Analyse neu starten</button></p>`;
 el.innerHTML=h+`</div>`;
 const q=$('#aiq');if(q)q.onkeydown=e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();aiAsk();}};
}

/* ----- KI-generierte Aufgaben ----- */
const GEN_HINT={uc:'mindestens zwei Akteure, eine «include»- und eine «extend»-Beziehung oder eine Generalisierung',cl:'Vererbung, eine Aggregation oder Komposition, Assoziationen mit Multiplizitäten, Attribute mit Datentypen und einzelne Methoden',st:'4–6 Zustände eines Objekts, Ereignisse an allen Transitionen, mindestens ein Guard',ac:'Decision mit Guards und Merge; wenn es passt, Fork/Join und zwei Swimlanes',sq:'3–4 Lebenslinien, synchrone Aufrufe mit Antworten und ein Fragment (alt, opt oder loop)'};
function renderGen(){const el=$('#genbtn');if(!el)return;if(!AI.ready||!AI.fn||AI.off){el.innerHTML='';return;}
 el.innerHTML=`<button class="btn" onclick="aiTask()" ${AI.gen?'disabled':''}>${AI.gen?'Ich denke mir eine Aufgabe aus…':'🎲 Neue Aufgabe von der KI'}</button>${AI.genErr?` <span class="lvl">${AI.genErr}</span>`:''}`;}
async function aiTask(){if(AI.gen||!AI.fn)return;const ty=Pz.type,old=customOf(ty);AI.gen=true;AI.genErr='';renderGen();
 const p=`Denke dir eine neue Übungsaufgabe zu einem UML-Diagramm vom Typ «${DTF[ty]}» aus, zur Vorbereitung auf die IHK-Prüfung AP2 (Fachinformatiker Anwendungsentwicklung).
Anforderungen:
- Aufgabentext auf Deutsch wie in der Prüfung: eine kurze Handlungssituation aus 4–8 Sätzen in einem realen IT- oder Geschäftskontext, aus der sich die Diagrammelemente eindeutig ableiten lassen.
- Verwende nicht die Themen: Geräteverleih, Banking, Yachthafen, Kaffeemaschine, Flughafen, Schlüsselsystem, Fahrzeugvermietung${old?', '+old.t:''}.
- Mittlerer Schwierigkeitsgrad: 5–9 Hauptelemente, in 15 Minuten lösbar.
- Benötigt werden soll: ${GEN_HINT[ty]}.
Antworte nur mit einem einzigen JSON-Objekt ohne Erläuterungen:
{"title":"kurzer Titel","text":"Aufgabentext auf Deutsch","solution":"Musterlösung als kompakte Textliste: je Zeile ein Element oder eine Beziehung"}`;
 try{const r=await AI.fn.json(p,{cache:false});
  if(!r||typeof r.text!=='string'||!r.text.trim())throw {code:'invalid_json'};
  const sol=Array.isArray(r.solution)?r.solution.join('\n'):String(r.solution||'');
  if(route.page==='draw')flushDoc();
  store.custom[ty]={id:'ai-'+ty,type:ty,lvl:'KI',ai:true,t:String(r.title||'KI-Aufgabe').slice(0,80),text:r.text.split(/\n{2,}/).map(x=>`<p>${esc(x.trim())}</p>`).join(''),solText:sol};
  delete store.draw['ai-'+ty];delete store.drawBest['ai-'+ty];save();AI.gen=false;
  if(route.page==='draw'&&Pz.type===ty){clearTimeout(saveT);stopAI();Pz.task=store.custom[ty];store.lastTask[ty]=Pz.task.id;loadDoc();Pz.sol=false;save();renderDraw();}
  return;}
 catch(e){AI.genErr=aiFail(e);}
 AI.gen=false;if(route.page==='draw'){renderGen();if(AI.off)renderAI();}
}

(async()=>{try{if(window.claude&&typeof window.claude.use==='function')AI.fn=await window.claude.use('sample');}catch(e){}
 AI.ready=true;if(route.page==='draw'){renderAI();renderGen();}})();
