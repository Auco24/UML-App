
/* ================= SEQUENZDIAGRAMM MIT DER MAUS ================= */
const SQX=i=>110+i*185;
function sqPart(x){const n=Pz.doc.parts.length;if(!n)return -1;const i=Math.max(0,Math.min(n-1,Math.round((x-110)/185)));return Math.abs(x-SQX(i))<=92?i:-1;}
function sqIndexAt(y){const L=Pz.sq||{rowY:{}},R=Pz.doc.rows;for(let i=0;i<R.length;i++){const ry=L.rowY[R[i].id];if(ry!=null&&ry>y)return i;}return R.length;}
/* Pfeilart, die beim Ziehen von Lebenslinie zu Lebenslinie entsteht */
const sqKind=()=>Pz.mk||'sync';
function sqTools(el){const m=Pz.mode,d=Pz.doc,mk=sqKind();const on=(t,k)=>m.t===t&&m.op===k?' on':'';
 const MB=[['sync','→ synchron'],['async','→ asynchron'],['reply','⇠ Antwort'],['create','«create»'],['destroy','«destroy»']];
 el.innerHTML=`<button class="tool pal" data-pal="sqp:obj" title="Auf die Zeichenfläche ziehen oder anklicken">＋ Objekt</button><button class="tool pal" data-pal="sqp:actor" title="Auf die Zeichenfläche ziehen oder anklicken">＋ Akteur</button><span class="sep"></span>`+
 MB.map(([k,l])=>`<button class="tool edge pal${mk===k?' on':''}" data-pal="sqm:${k}" aria-pressed="${mk===k}" title="Pfeilart für die nächste Nachricht">${l}</button>`).join('')+`<span class="sep"></span>`+
 ['alt','opt','loop'].map(o=>`<button class="tool pal${on('sqfrag',o)}" data-pal="sqf:${o}" title="Auf eine Nachricht ziehen, oder anklicken und über mehrere Nachrichten ziehen">▭ ${o}</button>`).join('')+
 `<button class="tool pal${m.t==='sqelse'?' on':''}" data-pal="sqe:else" title="In einen alt-Rahmen ziehen">┄ [else]</button><span class="sep"></span>${cancelBtn()}<button class="tool" onclick="undo()">↶ Rückgängig</button><button class="tool" id="clr" onclick="clearDoc(this)">🗑 Leeren</button>`;
 const h=$('#edhint');if(!h)return;
 h.textContent=!d.parts.length?'Beginne mit den Beteiligten: Ziehe «＋ Akteur» und «＋ Objekt» von oben auf die Zeichenfläche. Ein Klick hängt sie rechts an.':
  m.t==='sqmsg'?'Klicke jetzt auf die Linie des Empfängers. Ein Klick auf dieselbe Linie ergibt einen Selbstaufruf. Esc bricht ab.':
  m.t==='sqfrag'?`Rahmen ${m.op}: Ziehe mit der Maus von oben nach unten über die Nachrichten, die hineingehören. Ein Klick auf eine einzelne Nachricht rahmt nur diese ein.`:
  m.t==='sqelse'?'Klicke im alt-Rahmen auf die Höhe, an der der nächste Bereich beginnt.':
  d.parts.length<2?'Ziehe weitere Beteiligte auf die Fläche. Für eine Nachricht ziehst du danach von der Lebenslinie des Senders zur Lebenslinie des Empfängers.':
  'Nachricht: Ziehe von der Lebenslinie des Senders zur Lebenslinie des Empfängers. Es gilt die oben markierte Pfeilart. Rahmen und [else] ziehst du von oben auf die gewünschte Nachricht. Entf löscht.';}
/* Baustein aus der Palette wurde auf der Fläche losgelassen */
function sqDrop(t,k,x,y){const d=Pz.doc,n=d.parts.length;
 if(t==='sqp'){sqAddPart(k==='actor',Math.max(0,Math.min(n,Math.ceil((x-110)/185))));return;}
 if(t==='sqm'){Pz.mk=k;const i=sqPart(x);setMode(i>=0?{t:'sqmsg',kind:k,from:i,y}:{t:'select'});return;}
 if(t==='sqf'){const L=Pz.sq||{rowY:{}};let best=-1,bd=26;d.rows.forEach((r,i)=>{const ry=L.rowY[r.id];if(r.kind==='msg'&&ry!=null&&Math.abs(ry-y)<bd){bd=Math.abs(ry-y);best=i;}});
  if(best>=0)sqAddFrag(k,best,best);else{const i=sqIndexAt(y);sqAddFrag(k,i,i-1);}return;}
 if(t==='sqe')sqAddElse(y);}
/* Baustein in der Palette wurde nur angeklickt */
function sqClick(t,k){const m=Pz.mode;
 if(t==='sqp')sqAddPart(k==='actor');
 else if(t==='sqm'){Pz.mk=k;setMode({t:'select'});}
 else if(t==='sqf')setMode(m.t==='sqfrag'&&m.op===k?{t:'select'}:{t:'sqfrag',op:k});
 else if(t==='sqe')setMode(m.t==='sqelse'?{t:'select'}:{t:'sqelse'});}
function sqFocus(id,sel){const el=$('#'+id);if(el&&finePtr()){el.focus();if(sel&&el.select)el.select();}}
function sqAddPart(actor,at){const d=Pz.doc;snap();const n=d.parts.length;if(at==null||at>n)at=n;const p={id:nid('p'),name:actor?(d.parts.some(x=>x.actor)?'Akteur':'Benutzer'):':Objekt'+(n+1),actor:!!actor};d.parts.splice(at,0,p);Pz.sel=p.id;Pz.mode={t:'select'};touchDoc();refreshEd();sqFocus('sp_name',true);
 const cv=$('.ed-canvas');if(cv&&at===n)cv.scrollLeft=Math.max(0,SQX(n)-cv.clientWidth+140);}
function sqAddMsg(kind,a,b,y){const d=Pz.doc;if(!d.parts[a]||!d.parts[b])return;snap();const r={id:nid('r'),kind:'msg',from:d.parts[a].id,to:d.parts[b].id,mtype:kind,text:''};d.rows.splice(sqIndexAt(y),0,r);Pz.sel=r.id;Pz.mode={t:'select'};touchDoc();refreshEd();sqFocus('sp_text');}
function sqBalance(i1,i2){const R=Pz.doc.rows;let dep=0;for(let i=i1;i<=i2;i++){const k=R[i].kind;if(k==='frag')dep++;else if(k==='end'){if(!dep)return [i1,i-1];dep--;}else if(k==='else'&&!dep)return [i1,i-1];}
 let j=i2;while(dep>0&&j+1<R.length){j++;if(R[j].kind==='frag')dep++;else if(R[j].kind==='end')dep--;}return [i1,j];}
function sqAddFrag(op,i1,i2){const d=Pz.doc;snap();[i1,i2]=sqBalance(i1,i2);const f={id:nid('r'),kind:'frag',op,guard:''};d.rows.splice(i2+1,0,{id:nid('r'),kind:'end'});d.rows.splice(i1,0,f);Pz.sel=f.id;Pz.mode={t:'select'};touchDoc();refreshEd();sqFocus('sp_guard');}
function sqEnclosing(idx){const R=Pz.doc.rows,st=[];for(let i=0;i<idx&&i<R.length;i++){if(R[i].kind==='frag')st.push(i);else if(R[i].kind==='end')st.pop();}return st.length?st[st.length-1]:-1;}
function sqAddElse(y,at){const d=Pz.doc;const idx=at!=null?at:sqIndexAt(y);const f=sqEnclosing(idx);const h=$('#edhint');
 if(f<0){if(h)h.textContent='Ein Bereich [else] ist nur innerhalb eines Rahmens möglich. Zeichne zuerst den alt-Rahmen und klicke dann hinein.';return;}
 snap();const r={id:nid('r'),kind:'else',guard:'else'};d.rows.splice(idx,0,r);Pz.sel=r.id;Pz.mode={t:'select'};touchDoc();refreshEd();sqFocus('sp_guard',true);}
function sqEndOf(i){const R=Pz.doc.rows;let dep=0;for(let j=i+1;j<R.length;j++){if(R[j].kind==='frag')dep++;else if(R[j].kind==='end'){if(!dep)return j;dep--;}}return -1;}
function sqDel(){const d=Pz.doc,id=Pz.sel;if(!id)return;const pi=d.parts.findIndex(p=>p.id===id),ri=d.rows.findIndex(r=>r.id===id);if(pi<0&&ri<0)return;snap();
 if(pi>=0){d.parts.splice(pi,1);d.rows=d.rows.filter(r=>r.kind!=='msg'||(r.from!==id&&r.to!==id));}
 else if(d.rows[ri].kind==='frag'){const e=sqEndOf(ri);const kill=new Set([ri]);if(e>=0){kill.add(e);let dep=0;for(let j=ri+1;j<e;j++){const k=d.rows[j].kind;if(k==='frag')dep++;else if(k==='end')dep--;else if(k==='else'&&!dep)kill.add(j);}}d.rows=d.rows.filter((_,j)=>!kill.has(j));}
 else d.rows.splice(ri,1);
 Pz.sel=null;touchDoc();refreshEd();}
function sqEdit(k,v){const d=Pz.doc,o=d.parts.find(p=>p.id===Pz.sel)||d.rows.find(r=>r.id===Pz.sel);if(!o)return;o[k]=v;touchDoc();drawCanvas();const f=$('#sqb');if(f&&!f.contains(document.activeElement))renderSQB();}
function sqShift(dir){const d=Pz.doc;let i=d.parts.findIndex(p=>p.id===Pz.sel);snap();
 if(i>=0){const j=i+dir;if(j<0||j>=d.parts.length)return;[d.parts[i],d.parts[j]]=[d.parts[j],d.parts[i]];}
 else{i=d.rows.findIndex(r=>r.id===Pz.sel);const j=i+dir;if(i<0||j<0||j>=d.rows.length)return;[d.rows[i],d.rows[j]]=[d.rows[j],d.rows[i]];}
 touchDoc();refreshEd();}
/* Unteren Rand eines Rahmens um eine Nachricht (oder einen ganzen inneren Rahmen) verschieben */
function sqGrow(dir){const R=Pz.doc.rows,i=R.findIndex(r=>r.id===Pz.sel);if(i<0||R[i].kind!=='frag')return;const e=sqEndOf(i);if(e<0)return;let j;
 if(dir>0){j=e+1;if(j>=R.length)return;if(R[j].kind==='frag'){j=sqEndOf(j);if(j<0)return;}else if(R[j].kind!=='msg')return;}
 else{j=e-1;if(j<=i)return;if(R[j].kind==='end'){let dep=0;for(j=e-2;j>i;j--){if(R[j].kind==='end')dep++;else if(R[j].kind==='frag'){if(!dep)break;dep--;}}if(j<=i)return;}else if(R[j].kind!=='msg')return;}
 snap();const [end]=R.splice(e,1);R.splice(j,0,end);touchDoc();refreshEd();}
function sqFlip(){const r=Pz.doc.rows.find(x=>x.id===Pz.sel);if(!r)return;snap();[r.from,r.to]=[r.to,r.from];touchDoc();refreshEd();}
function sqProps(el){const d=Pz.doc,p=d.parts.find(x=>x.id===Pz.sel),r=d.rows.find(x=>x.id===Pz.sel);const q=s=>esc(s||'').replace(/"/g,'&quot;');
 const inp=(id,k,v,ph)=>`<input type="text" id="${id}" value="${q(v)}" placeholder="${ph||''}" onfocus="snap()" oninput="sqEdit('${k}',this.value)" onkeydown="if(event.key==='Enter')this.blur()">`;
 const opt=sel=>d.parts.map(x=>`<option value="${x.id}" ${x.id===sel?'selected':''}>${esc(x.name||'?')}</option>`).join('');
 const btns=x=>`<p style="margin-top:12px;display:flex;gap:6px;flex-wrap:wrap">${x}<button class="tool" onclick="delSel()">✕ Löschen</button></p>`;
 if(p){el.innerHTML=`<b>Lebenslinie</b><label for="sp_name">Name (zum Beispiel „:Warenkorb“)</label>${inp('sp_name','name',p.name,':Klasse')}
  <label style="display:flex;gap:6px;align-items:center;font-size:14px;color:var(--ink)"><input type="checkbox" ${p.actor?'checked':''} onchange="snap();sqEdit('actor',this.checked)"> Akteur (Strichmännchen)</label>`+btns(`<button class="tool" onclick="sqShift(-1)">← Nach links</button><button class="tool" onclick="sqShift(1)">Nach rechts →</button>`);return;}
 if(r&&r.kind==='msg'){el.innerHTML=`<b>Nachricht</b><label for="sp_text">Beschriftung</label>${inp('sp_text','text',r.text,'nachricht(parameter)')}
  <label for="sp_type">Art</label><select id="sp_type" onchange="snap();sqEdit('mtype',this.value)">${Object.entries(MT).map(([k,l])=>`<option value="${k}" ${r.mtype===k?'selected':''}>${l}</option>`).join('')}</select>
  <label for="sp_from">Von</label><select id="sp_from" onchange="snap();sqEdit('from',this.value)">${opt(r.from)}</select><label for="sp_to">An</label><select id="sp_to" onchange="snap();sqEdit('to',this.value)">${opt(r.to)}</select>`+
  btns(`<button class="tool" onclick="sqShift(-1)">↑ Höher</button><button class="tool" onclick="sqShift(1)">↓ Tiefer</button><button class="tool" onclick="sqFlip()">⇄ Umdrehen</button>`);return;}
 if(r&&r.kind==='frag'){const i=d.rows.indexOf(r),e=sqEndOf(i);el.innerHTML=`<b>Fragment</b><label for="sp_op">Operator</label><select id="sp_op" onchange="snap();sqEdit('op',this.value);renderProps()">${['alt','opt','loop','par','break'].map(o=>`<option ${r.op===o?'selected':''}>${o}</option>`).join('')}</select>
  <label for="sp_guard">Bedingung (Guard)</label>${inp('sp_guard','guard',r.guard,r.op==='loop'?'für jede Position':'Bedingung')}
  <p class="hint" style="margin-top:8px">${r.op==='alt'?'Ein alt hat mindestens zwei Bereiche. Den zweiten fügt die Schaltfläche unten oder das Werkzeug «[else]» hinzu.':r.op==='opt'?'opt ist ein einzelner Bereich: Er wird nur unter der Bedingung ausgeführt.':r.op==='loop'?'loop: Die Nachrichten im Rahmen werden wiederholt.':''}</p>`+
  `<label>Rahmen oben</label><p style="display:flex;gap:6px;flex-wrap:wrap;margin:0"><button class="tool" onclick="sqShift(-1)">↑ größer</button><button class="tool" onclick="sqShift(1)">↓ kleiner</button></p>
  <label>Rahmen unten</label><p style="display:flex;gap:6px;flex-wrap:wrap;margin:0"><button class="tool" onclick="sqGrow(1)">↓ größer</button><button class="tool" onclick="sqGrow(-1)">↑ kleiner</button></p>`+
  btns(r.op==='alt'&&e>=0?`<button class="tool" onclick="sqAddElse(0,${e})">＋ Bereich [else]</button>`:'')+`<p class="hint">Löschen entfernt nur den Rahmen, die Nachrichten bleiben.</p>`;return;}
 if(r&&r.kind==='else'){el.innerHTML=`<b>Bereich des Fragments</b><label for="sp_guard">Bedingung (Guard)</label>${inp('sp_guard','guard',r.guard,'else')}`+btns(`<button class="tool" onclick="sqShift(-1)">↑ Höher</button><button class="tool" onclick="sqShift(1)">↓ Tiefer</button>`);return;}
 el.innerHTML=`<p class="hint">Nichts ausgewählt.<br><br><b>So zeichnest du</b><br>1. «＋ Akteur» und «＋ Objekt» von oben auf die Fläche ziehen.<br>2. Nachricht: von der Lebenslinie des Senders zur Lebenslinie des Empfängers ziehen. Es gilt die oben markierte Pfeilart.<br>3. «▭ alt / opt / loop» auf eine Nachricht ziehen. Die Größe des Rahmens änderst du danach hier.<br>4. Klicke auf ein beliebiges Element, um den Text hier zu ändern.<br>5. «Prüfen» unter dem Feld startet den Bot.</p>`;}
function sqPreview(svg,dstr){let el=svg.querySelector('#sqprev');if(!el){el=document.createElementNS('http://www.w3.org/2000/svg','path');el.id='sqprev';svg.appendChild(el);}el.setAttribute('d',dstr);}
function sqPt(e,svg){const r=svg.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top];}
function sqDown(e,svg){const d=Pz.doc,m=Pz.mode,[x,y]=sqPt(e,svg);
 const grab=g=>{Pz.drag=Object.assign({x,y,moved:false},g);try{svg.setPointerCapture(e.pointerId);}catch(_){}e.preventDefault();};
 if(m.t==='sqmsg'){const i=sqPart(x);if(i<0||m.from==null){setMode({t:'select'});return;}grab({sq:'msg2',to:i});return;}
 if(m.t==='sqfrag'){const eEl=e.target.closest('[data-eid]');grab({sq:'frag',hit:eEl?eEl.dataset.eid:null});return;}
 if(m.t==='sqelse'){grab({sq:'else'});return;}
 const pEl=e.target.closest('[data-pid]'),eEl=e.target.closest('[data-eid]'),lEl=e.target.closest('[data-ll]');
 /* Auf einer Lebenslinie beginnt eine neue Nachricht */
 if(lEl&&!pEl&&!eEl){const had=Pz.sel||Pz.find;Pz.sel=null;Pz.find=null;grab({sq:'msg',from:+lEl.dataset.ll});if(had){drawCanvas();renderProps();}return;}
 if(pEl||eEl){const id=pEl?pEl.dataset.pid:eEl.dataset.eid,ch=Pz.sel!==id;Pz.sel=id;Pz.find=null;const row=d.rows.find(r=>r.id===id);
  if(pEl)grab({sq:'part',id});else if(row&&row.kind==='msg')grab({sq:'row',id});
  drawCanvas();if(ch)renderProps();return;}
 if(Pz.sel||Pz.find){Pz.sel=null;Pz.find=null;drawCanvas();renderProps();}}
function sqMove(e,svg){const g=Pz.drag,[x,y]=sqPt(e,svg);if(g.sq==='msg2'||g.sq==='else')return;if(!g.moved&&Math.hypot(x-g.x,y-g.y)<6)return;g.moved=true;const W=+svg.getAttribute('width')||800;
 if(g.sq==='msg')sqPreview(svg,`M${SQX(g.from)},${g.y} L${x},${g.y}`);
 else if(g.sq==='frag')sqPreview(svg,`M30,${Math.min(g.y,y)} H${W-30} V${Math.max(g.y,y)} H30 Z`);
 else if(g.sq==='row')sqPreview(svg,`M30,${y} H${W-30}`);
 else if(g.sq==='part')sqPreview(svg,`M${x},20 V${(Pz.sq&&Pz.sq.bottom)||300}`);}
function sqUp(e,svg){const g=Pz.drag,d=Pz.doc,m=Pz.mode;Pz.drag=null;if(!g||e.type==='pointercancel'){drawCanvas();return;}const [x,y]=sqPt(e,svg);
 if(g.sq==='msg2'){sqAddMsg(m.kind,m.from,g.to,m.y);return;}
 if(g.sq==='else'){sqAddElse(g.y);return;}
 if(g.sq==='msg'){const j=sqPart(x);if(g.moved&&j>=0&&(j!==g.from||Math.hypot(x-g.x,y-g.y)>=16)){sqAddMsg(sqKind(),g.from,j,g.y);return;}drawCanvas();return;}
 if(g.sq==='frag'){const R=d.rows;let i1,i2;
  if(!g.moved||Math.abs(y-g.y)<10){const i=g.hit?R.findIndex(r=>r.id===g.hit&&r.kind==='msg'):-1;if(i>=0){i1=i2=i;}else{i1=sqIndexAt(g.y);i2=i1-1;}}
  else{i1=sqIndexAt(Math.min(g.y,y)-1);i2=sqIndexAt(Math.max(g.y,y))-1;}
  sqAddFrag(m.op,i1,i2);return;}
 if(g.sq==='row'&&g.moved&&Math.abs(y-g.y)>14){const i=d.rows.findIndex(r=>r.id===g.id);let t=sqIndexAt(y);if(i>=0&&t!==i&&t!==i+1){snap();const [r]=d.rows.splice(i,1);if(t>i)t--;d.rows.splice(t,0,r);touchDoc();refreshEd();return;}}
 if(g.sq==='part'&&g.moved&&Math.abs(x-g.x)>50){const i=d.parts.findIndex(p=>p.id===g.id),t=Math.max(0,Math.min(d.parts.length-1,Math.round((x-110)/185)));if(i>=0&&t!==i){snap();const [p]=d.parts.splice(i,1);d.parts.splice(t,0,p);touchDoc();refreshEd();return;}}
 drawCanvas();}
window.addEventListener('pagehide',()=>{if(Pz.doc&&$('#cv')&&typeof flushDoc==='function')flushDoc();});
