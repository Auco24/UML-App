
/* ================= ÜBEN: DIAGRAMMEDITOR ================= */
const DT={uc:'Anwendungsfall',cl:'Klassen',st:'Zustand',ac:'Aktivität',sq:'Sequenz'};
const PAL={
 uc:{nodes:[['actor','Akteur'],['usecase','Use Case'],['system','Systemgrenze'],['note','Notiz']],
     edges:[['assoc','Assoziation ——'],['include','«include»'],['extend','«extend»'],['gen','Generalisierung ▷']]},
 cl:{nodes:[['class','Klasse'],['iface','Interface'],['note','Notiz']],
     edges:[['assoc','Assoziation ——'],['agg','Aggregation ◇'],['comp','Komposition ◆'],['gen','Generalisierung ▷'],['real','Realisierung ⇢▷'],['dep','Abhängigkeit ⇢']]},
 st:{nodes:[['state','Zustand'],['initial','Start ●'],['final','Ende ◉'],['choice','Entscheidung ◇']],
     edges:[['trans','Transition →']]},
 ac:{nodes:[['action','Aktion'],['initial','Start ●'],['final','Aktivitätsende ◉'],['flowfinal','Ablaufende ⊗'],['diamond','Decision / Merge ◇'],['bar','Fork / Join ▬'],['object','Objektknoten'],['lane','Swimlane']],
     edges:[['flow','Kontrollfluss →']]}
};
const EK={assoc:{n:'Assoziation'},include:{d:1,e:'aOpen',st:'«include»',n:'«include»'},extend:{d:1,e:'aOpen',st:'«extend»',n:'«extend»'},gen:{e:'tri',n:'Generalisierung'},
 agg:{s:'dia',n:'Aggregation'},comp:{s:'diaF',n:'Komposition'},real:{d:1,e:'tri',n:'Realisierung'},dep:{d:1,e:'aOpen',n:'Abhängigkeit'},trans:{e:'aOpen',n:'Transition'},flow:{e:'aOpen',n:'Kontrollfluss'}};
const KN={actor:'Akteur',usecase:'Use Case',system:'Systemgrenze',note:'Notiz',class:'Klasse',state:'Zustand',initial:'Startknoten',final:'Endknoten',flowfinal:'Ablaufendknoten',choice:'Entscheidungsknoten',diamond:'Raute',bar:'Balken',action:'Aktion',object:'Objektknoten',lane:'Swimlane'};
const DEFTXT={actor:'Akteur',usecase:'Use Case',system:'System',note:'Condition:\n{…}',class:'Klasse',state:'Zustand',action:'Aktion',object:'Objekt',lane:'Bereich'};
const CONT=k=>k==='system'||k==='lane';

let Pz={type:'uc',task:null,doc:null,sel:null,mode:{t:'select'},undo:[],drag:null,find:null,fb:null,ai:{turns:[],busy:false,ctl:null,out:''}};
if(!store.draw)store.draw={};if(!store.drawBest)store.drawBest={};if(!store.custom)store.custom={};

const linesOf=s=>String(s||'').split('\n').map(x=>x.trim()).filter(Boolean);
function wrapT(t,max=20){const out=[];String(t||'').split('\n').forEach(par=>{let line='';par.split(/\s+/).forEach(w=>{if(line&&(line+' '+w).length>max){out.push(line);line=w;}else line=(line+' '+w).trim();});out.push(line);});return out;}
const tw=(arr,fs=13)=>Math.max(0,...arr.map(l=>l.length))*fs*0.57;
function size(n){
 switch(n.kind){
  case 'actor':return [44,58];
  case 'usecase':{const l=wrapT(n.text);return [Math.max(124,tw(l)+48),Math.max(50,30+l.length*16)];}
  case 'system':return [n.w||460,n.h||420];
  case 'lane':return [n.w||230,n.h||540];
  case 'note':{const l=String(n.text||'').split('\n');return [Math.max(120,tw(l,12)+30),Math.max(44,22+l.length*15)];}
  case 'class':{const a=linesOf(n.attrs),m=linesOf(n.methods);const w=Math.max(140,tw([n.text||'',...a,...m,n.stereo?'«'+n.stereo+'»':''],12.5)+26);return [w,30+(n.stereo?14:0)+Math.max(1,a.length)*16+10+Math.max(1,m.length)*16+10];}
  case 'state':case 'action':{const l=wrapT(n.text);return [Math.max(112,tw(l)+36),Math.max(40,24+l.length*16)];}
  case 'object':{const l=wrapT(n.text);return [Math.max(100,tw(l)+30),Math.max(36,22+l.length*16)];}
  case 'initial':return [20,20];
  case 'final':case 'flowfinal':return [24,24];
  case 'choice':case 'diamond':return [32,32];
  case 'bar':return n.vert?[7,n.len||130]:[n.len||130,7];
 }
 return [80,40];
}
function box(n){const [w,h]=size(n);return {x:n.x,y:n.y,w,h,cx:n.x+w/2,cy:n.y+h/2};}
function anchor(n,px,py){const b=box(n);if(n.kind==='actor'){b.h+=20;b.cy+=10;b.w+=8;b.x-=4;}let dx=px-b.cx,dy=py-b.cy;if(!dx&&!dy)dy=-1;const k=n.kind;
 if(k==='usecase'){const t=1/Math.sqrt(dx*dx/((b.w/2)**2)+dy*dy/((b.h/2)**2));return [b.cx+dx*t,b.cy+dy*t];}
 if(k==='initial'||k==='final'||k==='flowfinal'){const l=Math.hypot(dx,dy);return [b.cx+dx/l*b.w/2,b.cy+dy/l*b.w/2];}
 if(k==='choice'||k==='diamond'){const t=1/(Math.abs(dx)/(b.w/2)+Math.abs(dy)/(b.h/2));return [b.cx+dx*t,b.cy+dy*t];}
 if(k==='bar'){if(n.vert)return [px<b.cx?b.x:b.x+b.w,Math.min(b.y+b.h-8,Math.max(b.y+8,py))];return [Math.min(b.x+b.w-8,Math.max(b.x+8,px)),py<b.cy?b.y:b.y+b.h];}
 const t=Math.min((b.w/2)/Math.abs(dx||1e-9),(b.h/2)/Math.abs(dy||1e-9));return [b.cx+dx*t,b.cy+dy*t];
}
function edgeGeom(e,doc){const a=doc.nodes.find(n=>n.id===e.from),b=doc.nodes.find(n=>n.id===e.to);if(!a||!b)return null;const A=box(a),B=box(b);
 if(e.from===e.to){const loops=doc.edges.filter(o=>o.from===o.to&&o.from===e.from),k=loops.indexOf(e);const x=A.cx+(k-(loops.length-1)/2)*60,y=A.y;
  return {d:`M${x-14},${y} C${x-34},${y-46} ${x+34},${y-46} ${x+14},${y}`,lx:x,ly:y-40,p1:[x-14,y],p2:[x+14,y],u:[1,0]};}
 const sib=doc.edges.filter(o=>(o.from===e.from&&o.to===e.to)||(o.from===e.to&&o.to===e.from));
 const off=(sib.indexOf(e)-(sib.length-1)/2)*44;
 const [s,t]=e.from<e.to?[A,B]:[B,A];const dx=t.cx-s.cx,dy=t.cy-s.cy,l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l;
 const mx=(A.cx+B.cx)/2,my=(A.cy+B.cy)/2,qx=mx+nx*off*2,qy=my+ny*off*2;
 const p1=anchor(a,off?qx:B.cx,off?qy:B.cy),p2=anchor(b,off?qx:A.cx,off?qy:A.cy);
 const r=v=>Math.round(v*10)/10;
 const d=off?`M${r(p1[0])},${r(p1[1])} Q${r(qx)},${r(qy)} ${r(p2[0])},${r(p2[1])}`:`M${r(p1[0])},${r(p1[1])} L${r(p2[0])},${r(p2[1])}`;
 const lx=off?(p1[0]+2*qx+p2[0])/4:(p1[0]+p2[0])/2,ly=off?(p1[1]+2*qy+p2[1])/4:(p1[1]+p2[1])/2;
 const ul=Math.hypot(p2[0]-p1[0],p2[1]-p1[1])||1;
 return {d,lx,ly,p1,p2,u:[(p2[0]-p1[0])/ul,(p2[1]-p1[1])/ul],side:off?lx-(p1[0]+p2[0])/2:0};
}
const mtext=(cx,cy,lines,fs=13,o={})=>lines.map((l,i)=>T(cx,cy+(i-(lines.length-1)/2)*16+fs*0.35,esc(l),{fs,...o})).join('');

function drawNode(n){const b=box(n),k=n.kind;const st=(Pz.sel===n.id||(Pz.mode.t==='edge'&&Pz.mode.from===n.id)?' selx':'')+(Pz.find&&Pz.find.includes(n.id)?' hl':'');let s='';
 if(k==='system'){s=`<rect class="hit" x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}"/><rect class="s${st}" x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" style="pointer-events:none"/><rect x="${b.x}" y="${b.y}" width="${b.w}" height="32" fill="transparent"/>${T(b.x+12,b.y+22,esc(n.text||''),{a:'start',b:1,fs:14})}`;}
 else if(k==='lane'){s=`<rect class="hit" x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}"/><rect class="s${st}" x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" style="pointer-events:none"/><rect class="lanehead${st}" x="${b.x}" y="${b.y}" width="${b.w}" height="30"/>${T(b.cx,b.y+20,esc(n.text||''),{b:1,fs:13})}`;}
 else if(k==='actor'){s=`<rect x="${b.x-18}" y="${b.y}" width="${b.w+36}" height="${b.h+20}" fill="transparent"/><g class="${st}"><circle class="w${st}" cx="${b.cx}" cy="${b.y+9}" r="8"/>${P(`M${b.cx},${b.y+17} V${b.y+38} M${b.cx-15},${b.y+25} H${b.cx+15} M${b.cx},${b.y+38} L${b.cx-12},${b.y+56} M${b.cx},${b.y+38} L${b.cx+12},${b.y+56}`,{cls:'s'+st})}</g>${T(b.cx,b.y+b.h+16,esc(n.text||''),{fs:13})}`;}
 else if(k==='usecase'){s=`<ellipse class="w${st}" cx="${b.cx}" cy="${b.cy}" rx="${b.w/2}" ry="${b.h/2}"/>${mtext(b.cx,b.cy,wrapT(n.text))}`;}
 else if(k==='note'){const f=12;s=`<path class="w${st}" d="M${b.x},${b.y} H${b.x+b.w-f} L${b.x+b.w},${b.y+f} V${b.y+b.h} H${b.x} Z"/>${P(`M${b.x+b.w-f},${b.y} V${b.y+f} H${b.x+b.w}`)}`+String(n.text||'').split('\n').map((l,i)=>T(b.x+9,b.y+19+i*15,esc(l),{a:'start',fs:12})).join('');}
 else if(k==='class'){const a=linesOf(n.attrs),m=linesOf(n.methods);let y=b.y;s=`<rect class="w${st}" x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}"/>`;
  if(n.stereo){s+=T(b.cx,y+14,'«'+n.stereo+'»',{fs:11});y+=14;}
  s+=T(b.cx,y+19,esc(n.text||''),{b:1,fs:13.5,i:n.stereo==='abstract'});y+=30;s+=L(b.x,y,b.x+b.w,y);
  (a.length?a:['']).forEach((l,i)=>{s+=T(b.x+8,y+15+i*16,esc(l),{a:'start',fs:12});});y+=Math.max(1,a.length)*16+10;s+=L(b.x,y,b.x+b.w,y);
  (m.length?m:['']).forEach((l,i)=>{s+=T(b.x+8,y+15+i*16,esc(l),{a:'start',fs:12});});}
 else if(k==='state'||k==='action'){s=`<rect class="w${st}" x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="12"/>${mtext(b.cx,b.cy,wrapT(n.text))}`;}
 else if(k==='object'){s=`<rect class="w${st}" x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}"/>${mtext(b.cx,b.cy,wrapT(n.text))}`;}
 else if(k==='initial'){s=`<circle cx="${b.cx}" cy="${b.cy}" r="16" fill="transparent"/><circle class="f${st}" cx="${b.cx}" cy="${b.cy}" r="10"/>`;}
 else if(k==='final'){s=`<circle class="w${st}" cx="${b.cx}" cy="${b.cy}" r="12"/><circle class="f" cx="${b.cx}" cy="${b.cy}" r="7"/>`;}
 else if(k==='flowfinal'){s=`<circle class="w${st}" cx="${b.cx}" cy="${b.cy}" r="12"/>${L(b.cx-8,b.cy-8,b.cx+8,b.cy+8)}${L(b.cx+8,b.cy-8,b.cx-8,b.cy+8)}`;}
 else if(k==='choice'||k==='diamond'){s=`<path class="w${st}" d="M${b.cx},${b.y} L${b.x+b.w},${b.cy} L${b.cx},${b.y+b.h} L${b.x},${b.cy} Z"/>`;}
 else if(k==='bar'){s=`<rect x="${b.x-6}" y="${b.y-6}" width="${b.w+12}" height="${b.h+12}" fill="transparent"/><rect class="f${st}" x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}"/>`;}
 let h='';
 if(Pz.sel===n.id&&(CONT(k)||k==='bar'))h=`<rect class="handle" data-h="${n.id}" x="${b.x+b.w-7}" y="${b.y+b.h-7}" width="14" height="14" rx="3"/>`;
 return `<g class="nd" data-id="${n.id}">${s}</g>${h}`;
}
function drawEdge(e,doc){const g=edgeGeom(e,doc);if(!g)return '';const k=EK[e.kind]||{};const st=(Pz.sel===e.id?' selx':'')+(Pz.find&&Pz.find.includes(e.id)?' hl':'');
 let s=`<path class="hit" d="${g.d}"/><path class="s${k.d?' d':''}${st}" d="${g.d}" ${k.e?`marker-end="url(#${k.e})"`:''} ${k.s?`marker-start="url(#${k.s})"`:''}/>`;
 const lab=[k.st,e.label].filter(Boolean).join(' ');
 const nx=-g.u[1],ny=g.u[0];
 const vs=g.side&&Math.abs(g.u[0])<0.5?(g.side>0?1:-1):0;
 if(lab)s+=`<text class="lbl" x="${g.lx+vs*8}" y="${g.ly-(vs?-4:7)}" font-size="12.5" text-anchor="${vs>0?'start':vs<0?'end':'middle'}">${esc(lab)}</text>`;
 if(e.m1)s+=`<text class="lbl" x="${g.p1[0]+g.u[0]*20+nx*11}" y="${g.p1[1]+g.u[1]*20+ny*11+4}" font-size="12" text-anchor="middle">${esc(e.m1)}</text>`;
 if(e.m2)s+=`<text class="lbl" x="${g.p2[0]-g.u[0]*26+nx*11}" y="${g.p2[1]-g.u[1]*26+ny*11+4}" font-size="12" text-anchor="middle">${esc(e.m2)}</text>`;
 return `<g class="eg" data-eid="${e.id}">${s}</g>`;
}
function drawCanvas(){const svg=$('#cv');if(!svg)return;const d=Pz.doc;
 if(d.type==='sq'){const r=drawSQ(d);Pz.sq=r;svg.setAttribute('width',Math.max(r.w,900));svg.setAttribute('height',Math.max(r.h+90,520));svg.classList.toggle('adding',Pz.mode.t!=='select');svg.innerHTML=r.svg;return;}
 let mx=0,my=0;d.nodes.forEach(n=>{const b=box(n);mx=Math.max(mx,b.x+b.w);my=Math.max(my,b.y+b.h);});
 svg.setAttribute('width',Math.max(980,mx+260));svg.setAttribute('height',Math.max(620,my+220));
 svg.classList.toggle('adding',Pz.mode.t!=='select');
 svg.innerHTML=d.nodes.filter(n=>CONT(n.kind)).map(drawNode).join('')+d.edges.map(e=>drawEdge(e,d)).join('')+d.nodes.filter(n=>!CONT(n.kind)).map(drawNode).join('');
}

/* ----- Umgang mit dem Dokument ----- */
const taskKey=()=>Pz.key||(Pz.task?Pz.task.id:'free-'+Pz.type);
function newDoc(type){return type==='sq'?{type,parts:[],rows:[],n:1}:{type,nodes:[],edges:[],n:1};}
function loadDoc(){const s=store.draw[taskKey()];Pz.doc=s?JSON.parse(JSON.stringify(s)):(Pz.task&&Pz.task.start&&typeof starterDoc==='function'?starterDoc(Pz.task):newDoc(Pz.type));Pz.sel=null;Pz.mode={t:'select'};Pz.undo=[];Pz.find=null;Pz.fb=null;Pz.ai={turns:[],busy:false,ctl:null,out:''};}
let saveT=null;
function touchDoc(){clearTimeout(saveT);saveT=setTimeout(()=>{store.draw[taskKey()]=Pz.doc;save();},300);}
function snap(){Pz.undo.push(JSON.stringify(Pz.doc));if(Pz.undo.length>60)Pz.undo.shift();}
function undo(){const s=Pz.undo.pop();if(!s)return;Pz.doc=JSON.parse(s);Pz.sel=null;touchDoc();refreshEd();}
const nid=p=>p+(Pz.doc.n++);
function addNode(kind,x,y){snap();const d=Pz.doc;const n={id:nid('n'),kind:kind==='iface'?'class':kind,x:0,y:0,text:DEFTXT[kind]||''};
 if(kind==='iface'){n.stereo='interface';n.text='Interface';}
 if(n.kind==='class'){n.attrs='';n.methods='';}
 const [w,h]=size(n);n.x=Math.max(4,Math.round(x-(CONT(kind)?20:w/2)));n.y=Math.max(4,Math.round(y-(CONT(kind)?16:h/2)));
 d.nodes.push(n);Pz.sel=n.id;Pz.mode={t:'select'};touchDoc();refreshEd();
 const f=$('#p_text');if(f){f.focus();f.select&&f.select();}
}
function addEdge(kind,from,to){snap();const e={id:nid('e'),kind,from,to,label:''};Pz.doc.edges.push(e);Pz.sel=e.id;Pz.mode={t:'select'};touchDoc();refreshEd();
 const f=$('#p_label');if(f&&(kind==='trans'||kind==='flow'))f.focus();}
function delSel(){const d=Pz.doc;if(!Pz.sel)return;if(d.type==='sq')return sqDel();snap();
 if(d.nodes.some(n=>n.id===Pz.sel)){d.nodes=d.nodes.filter(n=>n.id!==Pz.sel);d.edges=d.edges.filter(e=>e.from!==Pz.sel&&e.to!==Pz.sel);}
 else d.edges=d.edges.filter(e=>e.id!==Pz.sel);
 Pz.sel=null;touchDoc();refreshEd();}
function pset(k,v){const d=Pz.doc;const o=d.nodes.find(x=>x.id===Pz.sel)||d.edges.find(x=>x.id===Pz.sel);if(!o)return;o[k]=v;touchDoc();drawCanvas();}
function prev(){const e=Pz.doc.edges.find(x=>x.id===Pz.sel);if(!e)return;snap();[e.from,e.to]=[e.to,e.from];[e.m1,e.m2]=[e.m2,e.m1];touchDoc();refreshEd();}
function setMode(m){Pz.mode=m;renderTools();drawCanvas();renderProps();}

/* ----- Oberfläche ----- */
function renderTools(){const el=$('#tools');if(!el)return;if(Pz.type==='sq')return sqTools(el);const p=PAL[Pz.type];if(!p){el.innerHTML='';return;}
 const on=(t,k)=>Pz.mode.t===t&&Pz.mode.kind===k?' on':'';
 el.innerHTML=`<button class="tool${Pz.mode.t==='select'?' on':''}" onclick="setMode({t:'select'})">🖱 Auswahl</button><span class="sep"></span>`+
  p.nodes.map(([k,l])=>`<button class="tool${on('add',k)}" onclick="setMode({t:'add',kind:'${k}'})">＋ ${l}</button>`).join('')+`<span class="sep"></span>`+
  p.edges.map(([k,l])=>`<button class="tool edge${on('edge',k)}" onclick="setMode({t:'edge',kind:'${k}',from:null})">${l}</button>`).join('')+
  `<span class="sep"></span><button class="tool" onclick="undo()">↶ Rückgängig</button><button class="tool" id="clr" onclick="clearDoc(this)">🗑 Leeren</button>`;
 const h=$('#edhint');if(h){const m=Pz.mode;
  h.textContent=m.t==='add'?`Klicke ins Feld, um zu setzen: ${KN[m.kind==='iface'?'class':m.kind]||m.kind}. Esc bricht ab.`:
   m.t==='edge'?(m.from?'Klicke jetzt auf das Element, zu dem die Linie führt (an diesem Ende sitzt die Pfeilspitze).':(m.kind==='agg'||m.kind==='comp'?'Klicke zuerst auf die Klasse, an der die Raute stehen soll, dann auf die zweite Klasse.':'Klicke auf das Element, an dem die Linie beginnt, dann auf das zweite Element.')):
   'Ziehe Elemente mit der Maus. Klicke auf ein Element oder eine Linie, um den Text rechts zu ändern. Entf löscht.';}
}
function clearDoc(btn){if(btn.dataset.sure){snap();Pz.doc=newDoc(Pz.type);Pz.sel=null;Pz.fb=null;touchDoc();refreshEd();renderFb();}else{btn.dataset.sure=1;btn.textContent='Wirklich leeren?';setTimeout(()=>{if(btn.isConnected){delete btn.dataset.sure;btn.textContent='🗑 Leeren';}},3000);}}
function renderProps(){const el=$('#props');if(!el)return;const d=Pz.doc;if(d.type==='sq')return sqProps(el);
 const n=d.nodes.find(x=>x.id===Pz.sel),e=d.edges.find(x=>x.id===Pz.sel);
 const inp=(id,key,val,ph='')=>`<input type="text" id="${id}" value="${esc(val||'').replace(/"/g,'&quot;')}" placeholder="${ph}" onfocus="snap()" oninput="pset('${key}',this.value)">`;
 if(n){let h=`<b>${n.stereo==='interface'?'Interface':KN[n.kind]}</b>`;
  if(n.kind==='class'){h+=`<label for="p_text">Name</label>${inp('p_text','text',n.text)}<label for="p_st">Stereotyp</label><select id="p_st" onchange="snap();pset('stereo',this.value)">${[['','– normale Klasse'],['abstract','«abstract»'],['interface','«interface»']].map(([v,l])=>`<option value="${v}" ${n.stereo===v||(!n.stereo&&!v)?'selected':''}>${l}</option>`).join('')}</select>
   <label for="p_at">Attribute (eines pro Zeile)</label><textarea id="p_at" rows="4" placeholder="- name : String" onfocus="snap()" oninput="pset('attrs',this.value)">${esc(n.attrs||'')}</textarea>
   <label for="p_me">Methoden (eine pro Zeile)</label><textarea id="p_me" rows="3" placeholder="+ stornieren() : void" onfocus="snap()" oninput="pset('methods',this.value)">${esc(n.methods||'')}</textarea>`;}
  else if(n.kind==='note'){h+=`<label for="p_text">Text</label><textarea id="p_text" rows="3" onfocus="snap()" oninput="pset('text',this.value)">${esc(n.text||'')}</textarea>`;}
  else if(['initial','final','flowfinal','choice','diamond'].includes(n.kind)){h+=`<p class="hint" style="margin-top:8px">Dieses Element hat keinen Text. Bedingungen (Guards) schreibst du an die ausgehenden Linien.</p>`;}
  else if(n.kind==='bar'){h+=`<p style="margin:8px 0"><button class="tool" onclick="snap();pset('vert',!${!!n.vert});renderProps()">⟳ Drehen</button></p><p class="hint">Die Länge änderst du am blauen Griff.</p>`;}
  else h+=`<label for="p_text">${n.kind==='actor'?'Rolle':n.kind==='system'?'Systemname':'Name'}</label>${inp('p_text','text',n.text)}`;
  if(CONT(n.kind))h+=`<p class="hint" style="margin-top:8px">Die Größe änderst du am blauen Griff. Beim Ziehen bewegt sich der Inhalt mit dem Rahmen mit.</p>`;
  h+=`<p style="margin-top:12px"><button class="tool" onclick="delSel()">✕ Löschen</button></p>`;el.innerHTML=h;return;}
 if(e){const a=d.nodes.find(x=>x.id===e.from),b=d.nodes.find(x=>x.id===e.to);const kinds=PAL[Pz.type].edges;
  let h=`<b>Linie</b><p class="hint">${esc(refName(a))} → ${esc(refName(b))}</p><label for="p_kind">Art</label><select id="p_kind" onchange="snap();pset('kind',this.value);renderProps()">${kinds.map(([k])=>`<option value="${k}" ${e.kind===k?'selected':''}>${EK[k].n}</option>`).join('')}</select>`;
  const ph=e.kind==='trans'?'Ereignis [Guard] / Effekt':e.kind==='flow'?'[Guard]':'';
  if(!['include','extend','gen','real'].includes(e.kind))h+=`<label for="p_label">${e.kind==='trans'?'Beschriftung':e.kind==='flow'?'Guard (nur nach einer Decision)':'Name (optional)'}</label>${inp('p_label','label',e.label,ph)}`;
  if(['assoc','agg','comp'].includes(e.kind)&&Pz.type==='cl')h+=`<label for="p_m1">Multiplizität bei „${esc(refName(a))}“</label>${inp('p_m1','m1',e.m1,'1, 0..1, 0..*, 1..*')}<label for="p_m2">Multiplizität bei „${esc(refName(b))}“</label>${inp('p_m2','m2',e.m2,'1, 0..1, 0..*, 1..*')}`;
  h+=`<p style="margin-top:12px;display:flex;gap:6px;flex-wrap:wrap"><button class="tool" onclick="prev()">⇄ Umdrehen</button><button class="tool" onclick="delSel()">✕ Löschen</button></p>`;el.innerHTML=h;return;}
 el.innerHTML=`<p class="hint">Nichts ausgewählt.<br><br><b>So zeichnest du</b><br>1. Schaltfläche «＋ …» und Klick ins Feld setzt ein Element.<br>2. Linien-Schaltfläche, dann Klick auf zwei Elemente.<br>3. Klick auf ein Element: Bearbeiten hier.<br>4. «Prüfen» unter dem Feld startet den Bot.</p>`;
}
const refName=n=>!n?'?':(n.text&&!['initial','final','flowfinal','choice','diamond','bar'].includes(n.kind)?n.text.replace(/\n/g,' '):KN[n.kind]+' '+n.id);
function refreshEd(){renderTools();drawCanvas();renderProps();if(Pz.doc.type==='sq')renderSQB();}

function bindCanvas(){const svg=$('#cv');if(!svg)return;
 const pt=e=>{const r=svg.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top];};
 svg.onpointerdown=e=>{const d=Pz.doc;if(d.type==='sq')return sqDown(e,svg);const [x,y]=pt(e);
  const hEl=e.target.closest('[data-h]'),nEl=e.target.closest('[data-id]'),eEl=e.target.closest('[data-eid]');
  if(Pz.mode.t==='add'){addNode(Pz.mode.kind,x,y);return;}
  if(Pz.mode.t==='edge'){const n=nEl&&d.nodes.find(q=>q.id===nEl.dataset.id);
   if(n&&!CONT(n.kind)&&n.kind!=='note'){if(!Pz.mode.from){Pz.mode.from=n.id;renderTools();drawCanvas();}else addEdge(Pz.mode.kind,Pz.mode.from,n.id);}
   else{Pz.mode.from=null;renderTools();drawCanvas();}return;}
  if(hEl){const n=d.nodes.find(q=>q.id===hEl.dataset.h);snap();const [w,h]=size(n);Pz.drag={rs:n,sx:x,sy:y,w,h};svg.setPointerCapture(e.pointerId);e.preventDefault();return;}
  if(nEl){const n=d.nodes.find(q=>q.id===nEl.dataset.id);const ch=Pz.sel!==n.id;Pz.sel=n.id;Pz.find=null;
   let ids=[n];if(CONT(n.kind)){const B=box(n);ids=ids.concat(d.nodes.filter(q=>q!==n&&!(n.kind==='system'&&q.kind==='system')&&(()=>{const b=box(q);return b.cx>B.x&&b.cx<B.x+B.w&&b.cy>B.y&&b.cy<B.y+B.h;})()));}
   Pz.drag={ids,sx:x,sy:y,o:ids.map(q=>[q.x,q.y]),moved:false,pre:JSON.stringify(d)};svg.setPointerCapture(e.pointerId);e.preventDefault();
   drawCanvas();if(ch)renderProps();return;}
  if(eEl){Pz.sel=eEl.dataset.eid;Pz.find=null;drawCanvas();renderProps();return;}
  if(Pz.sel||Pz.find){Pz.sel=null;Pz.find=null;drawCanvas();renderProps();}
 };
 svg.onpointermove=e=>{const g=Pz.drag;if(!g)return;if(g.sq)return sqMove(e,svg);const [x,y]=pt(e);const dx=x-g.sx,dy=y-g.sy;
  if(g.rs){const n=g.rs;if(n.kind==='bar'){n.len=Math.max(50,Math.round((n.vert?g.h+dy:g.w+dx)));}else{n.w=Math.max(140,Math.round(g.w+dx));n.h=Math.max(100,Math.round(g.h+dy));}drawCanvas();return;}
  if(!g.moved&&Math.hypot(dx,dy)<3)return;if(!g.moved){g.moved=true;Pz.undo.push(g.pre);}
  g.ids.forEach((n,i)=>{n.x=Math.max(2,Math.round(g.o[i][0]+dx));n.y=Math.max(2,Math.round(g.o[i][1]+dy));});drawCanvas();};
 svg.onpointerup=svg.onpointercancel=e=>{if(Pz.drag&&Pz.drag.sq)return sqUp(e,svg);if(Pz.drag){touchDoc();Pz.drag=null;}};
}
document.addEventListener('keydown',e=>{if(!$('#cv')||!Pz.doc)return;const tg=e.target.tagName;const typing=tg==='INPUT'||tg==='TEXTAREA'||tg==='SELECT';
 if(e.key==='Escape'){setMode({t:'select'});if(typing)e.target.blur();}
 if(typing)return;
 if(e.key==='Delete'||e.key==='Backspace'){if(Pz.sel){e.preventDefault();delSel();}}
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();undo();}
});

/* ================= SEQUENZDIAGRAMM-EDITOR ================= */
const MT={sync:'synchron ▶',async:'asynchron >',reply:'Antwort ⇠',create:'«create»',destroy:'«destroy» ✕'};
function sqAct(a,i,v){const d=Pz.doc;snap();
 if(a==='addp'){d.parts.push({id:nid('p'),name:d.parts.length?':Objekt'+(d.parts.length+1):'Benutzer',actor:!d.parts.length});}
 if(a==='delp'){const id=d.parts[i].id;d.parts.splice(i,1);d.rows=d.rows.filter(r=>r.kind!=='msg'||(r.from!==id&&r.to!==id));}
 if(a==='mvp'){const j=i+v;if(j<0||j>=d.parts.length)return;[d.parts[i],d.parts[j]]=[d.parts[j],d.parts[i]];}
 if(a==='addm'){if(d.parts.length<2)return;const last=[...d.rows].reverse().find(r=>r.kind==='msg');d.rows.push({id:nid('r'),kind:'msg',from:last?last.to:d.parts[0].id,to:last?last.from:d.parts[1].id,mtype:last&&last.mtype==='sync'&&last.from!==last.to?'reply':'sync',text:''});}
 if(a==='addf')d.rows.push({id:nid('r'),kind:'frag',op:'alt',guard:''});
 if(a==='adde')d.rows.push({id:nid('r'),kind:'else',guard:'else'});
 if(a==='addx')d.rows.push({id:nid('r'),kind:'end'});
 if(a==='delr')d.rows.splice(i,1);
 if(a==='mvr'){const j=i+v;if(j<0||j>=d.rows.length)return;[d.rows[i],d.rows[j]]=[d.rows[j],d.rows[i]];}
 if(Pz.sel&&!d.parts.some(p=>p.id===Pz.sel)&&!d.rows.some(r=>r.id===Pz.sel))Pz.sel=null;touchDoc();drawCanvas();renderSQB();renderProps();
}
function sqSet(kind,i,k,v){const d=Pz.doc;const o=kind==='p'?d.parts[i]:d.rows[i];if(!o)return;o[k]=v;if(kind==='p'&&k==='name')document.querySelectorAll('#sqb option[value="'+o.id+'"]').forEach(x=>x.textContent=v||'?');touchDoc();drawCanvas();const pr=$('#props');if(pr&&!pr.contains(document.activeElement))renderProps();}
function renderSQB(){const el=$('#sqb');if(!el)return;const d=Pz.doc;const q=s=>esc(s||'').replace(/"/g,'&quot;');
 let h=`<h3 style="margin-top:0">1. Teilnehmer (Lebenslinien, von links nach rechts)</h3>`;
 d.parts.forEach((p,i)=>{h+=`<div class="sqrow"><label style="font-size:13px"><input type="checkbox" id="sq_a${i}" ${p.actor?'checked':''} onchange="snap();sqSet('p',${i},'actor',this.checked)"> Akteur</label><input type="text" id="sq_p${i}" value="${q(p.name)}" placeholder=":Backend" onfocus="snap()" oninput="sqSet('p',${i},'name',this.value)"><button class="mini" onclick="sqAct('mvp',${i},-1)">←</button><button class="mini" onclick="sqAct('mvp',${i},1)">→</button><button class="mini" onclick="sqAct('delp',${i})">✕</button></div>`;});
 h+=`<p><button class="tool" onclick="sqAct('addp')">＋ Lebenslinie</button></p><h3>2. Ablauf (von oben nach unten)</h3>`;
 const opt=(sel)=>d.parts.map(p=>`<option value="${p.id}" ${p.id===sel?'selected':''}>${esc(p.name||'?')}</option>`).join('');
 let depth=0;
 d.rows.forEach((r,i)=>{if(r.kind==='end'||r.kind==='else')depth=Math.max(0,depth-1);
  const pad=`style="padding-left:${depth*18}px"`;const hl=Pz.find&&Pz.find.includes(r.id)?' hlrow':'';const mv=`<button class="mini" onclick="sqAct('mvr',${i},-1)">↑</button><button class="mini" onclick="sqAct('mvr',${i},1)">↓</button><button class="mini" onclick="sqAct('delr',${i})">✕</button>`;
  if(r.kind==='msg')h+=`<div class="sqrow${hl}" ${pad}><select id="sq_f${i}" onchange="snap();sqSet('r',${i},'from',this.value)">${opt(r.from)}</select>→<select id="sq_t${i}" onchange="snap();sqSet('r',${i},'to',this.value)">${opt(r.to)}</select><select id="sq_m${i}" onchange="snap();sqSet('r',${i},'mtype',this.value)">${Object.entries(MT).map(([k,l])=>`<option value="${k}" ${r.mtype===k?'selected':''}>${l}</option>`).join('')}</select><input type="text" id="sq_x${i}" value="${q(r.text)}" placeholder="nachricht(parameter)" onfocus="snap()" oninput="sqSet('r',${i},'text',this.value)">${mv}</div>`;
  else if(r.kind==='frag')h+=`<div class="sqrow${hl}" ${pad}><span class="tag">Fragment</span><select id="sq_o${i}" onchange="snap();sqSet('r',${i},'op',this.value)">${['alt','opt','loop','par','break'].map(o=>`<option ${r.op===o?'selected':''}>${o}</option>`).join('')}</select><input type="text" id="sq_g${i}" value="${q(r.guard)}" placeholder="[Bedingung]" onfocus="snap()" oninput="sqSet('r',${i},'guard',this.value)">${mv}</div>`;
  else if(r.kind==='else')h+=`<div class="sqrow${hl}" ${pad}><span class="tag">- - Operand</span><input type="text" id="sq_g${i}" value="${q(r.guard)}" placeholder="[else]" onfocus="snap()" oninput="sqSet('r',${i},'guard',this.value)">${mv}</div>`;
  else h+=`<div class="sqrow${hl}" ${pad}><span class="tag">Ende Fragment</span><span style="flex:1"></span>${mv}</div>`;
  if(r.kind==='frag'||r.kind==='else')depth++;});
 h+=`<p style="display:flex;gap:6px;flex-wrap:wrap"><button class="tool" onclick="sqAct('addm')" ${d.parts.length<2?'disabled':''}>＋ Nachricht</button><button class="tool" onclick="sqAct('addf')">＋ Fragment (alt/opt/loop/par)</button><button class="tool" onclick="sqAct('adde')">＋ Operand / [else]</button><button class="tool" onclick="sqAct('addx')">＋ Ende Fragment</button><button class="tool" onclick="undo()">↶ Rückgängig</button><button class="tool" onclick="clearDoc(this)">🗑 Leeren</button></p>
 <p class="hint">Lege zuerst mindestens zwei Lebenslinien an. Eine Nachricht an dieselbe Linie ist ein Selbstaufruf. Alles zwischen «Fragment» und «Ende Fragment» landet im Rahmen.</p>`;
 el.innerHTML=h;
}
const gtxt=g=>{g=String(g||'').trim();return !g?'':(/^[\[(]/.test(g)?g:'['+g+']');};
function drawSQ(d){const X=i=>110+i*185,idx={};d.parts.forEach((p,i)=>idx[p.id]=i);
 let y=100,msgs='',stack=[],frags=[],acts=[],open={},created={},destroyed={};const rowY={};
 const touch=(i,self)=>stack.forEach(f=>{f.lo=Math.min(f.lo,i);f.hi=Math.max(f.hi,i);if(self)f.selfHi=Math.max(f.selfHi,i);});
 d.rows.forEach(r=>{const hl=(Pz.find&&Pz.find.includes(r.id)?' hl':'')+(Pz.sel===r.id?' selx':'');
  if(r.kind==='msg'){const a=idx[r.from],b=idx[r.to];if(a==null||b==null)return;
   if(a===b){touch(a,true);y+=30;const x=X(a);msgs+=`<g class="eg" data-eid="${r.id}"><path class="hit" d="M${x},${y-12} H${x+46} V${y+10} H${x+7}"/>`+P(`M${x},${y-12} H${x+46} V${y+10} H${x+7}`,{cls:'s'+hl,e:r.mtype==='async'?'aOpen':'aFill',d:r.mtype==='reply'})+`<text class="lbl" x="${x+54}" y="${y+3}" font-size="12.5" text-anchor="start">${esc(r.text||'')}</text></g>`;rowY[r.id]=y;y+=24;}
   else{touch(a);touch(b);y+=40;let x1=X(a),x2=X(b);const dir=x2>x1?1:-1;const k=r.mtype;
    if(k==='create'&&created[r.to]==null){created[r.to]=y;x2-=dir*62;}
    if(k==='destroy'){destroyed[r.to]=y;}
    rowY[r.id]=y;msgs+=`<g class="eg" data-eid="${r.id}"><line class="hit" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}"/><line class="s${k==='reply'||k==='create'?' d':''}${hl}" x1="${x1}" y1="${y}" x2="${x2-(k==='destroy'?dir*9:0)}" y2="${y}" marker-end="url(#${k==='sync'||k==='destroy'?'aFill':'aOpen'})"/>`;
    const lab=(k==='create'?'«create» ':k==='destroy'?'«destroy» ':'')+(r.text||'');
    msgs+=`<text class="lbl" x="${(X(a)+X(b))/2}" y="${y-7}" font-size="12.5" text-anchor="middle">${esc(lab)}</text></g>`;
    if(k==='sync'){(open[r.to]=open[r.to]||[]).push(y);}
    if(k==='reply'){const s=(open[r.from]||[]).pop();if(s!=null)acts.push([a,s,y]);}
   }}
  else if(r.kind==='frag'){y+=18;rowY[r.id]=y;stack.push({id:r.id,op:r.op,guard:r.guard,top:y,lo:99,hi:-1,selfHi:-1,seps:[],depth:stack.length,hl,open:JSON.stringify(open)});y+=20;}
  else if(r.kind==='else'){const f=stack[stack.length-1];y+=16;rowY[r.id]=y;if(f){f.seps.push([y,r.guard,r.id,hl]);open=JSON.parse(f.open);}y+=18;}
  else if(r.kind==='end'){const f=stack.pop();y+=16;rowY[r.id]=y;if(f){f.bot=y;frags.push(f);}y+=6;}
 });
 while(stack.length){const f=stack.pop();y+=16;f.bot=y;frags.push(f);}
 const bottom=y+46;Object.keys(open).forEach(id=>open[id].forEach(s=>acts.push([idx[id],s,Math.min(bottom-20,y+10)])));
 let s='';
 d.parts.forEach((p,i)=>{const x=X(i),top=created[p.id]!=null?created[p.id]:44,end=destroyed[p.id]!=null?destroyed[p.id]:bottom;
  s+=L(x,top+(p.actor?40:16),x,end,{d:1});
  if(destroyed[p.id]!=null)s+=L(x-9,end-9,x+9,end+9)+L(x+9,end-9,x-9,end+9);});
 acts.forEach(([i,a,b])=>{if(i!=null)s+=`<rect class="w" x="${X(i)-6}" y="${a}" width="12" height="${Math.max(10,b-a)}"/>`;});
 frags.sort((a,b)=>a.depth-b.depth).forEach(f=>{const all=f.hi<0;const lo=all?0:f.lo,hi=all?Math.max(0,d.parts.length-1):f.hi;const x1=X(lo)-78+f.depth*8,x2=X(hi)+(f.selfHi===hi?150:78)-f.depth*8;
  s+=`<g class="eg" data-eid="${f.id}"><rect class="s${f.hl}" x="${x1}" y="${f.top}" width="${x2-x1}" height="${f.bot-f.top}" style="pointer-events:none"/><path class="w${f.hl}" d="M${x1},${f.top} h44 v12 l-7,7 h-37 Z"/>${T(x1+19,f.top+14,f.op,{fs:12,b:1})}<text class="lbl" x="${x1+52}" y="${f.top+14}" font-size="12" text-anchor="start" style="fill:var(--accent)">${esc(gtxt(f.guard))}</text></g>`;
  f.seps.forEach(([sy,g,sid,shl])=>{s+=`<g class="eg" data-eid="${sid}"><line class="hit" x1="${x1}" y1="${sy}" x2="${x2}" y2="${sy}"/><line class="s d${shl||''}" x1="${x1}" y1="${sy}" x2="${x2}" y2="${sy}"/><text class="lbl" x="${x1+8}" y="${sy+14}" font-size="12" text-anchor="start" style="fill:var(--accent)">${esc(gtxt(g))}</text></g>`;});});
 s+=msgs;
 d.parts.forEach((p,i)=>{const x=X(i),top=created[p.id]!=null?created[p.id]-14:30;
  const sx=Pz.sel===p.id||(Pz.mode.t==='sqmsg'&&Pz.mode.from===i)?' selx':'';s+=`<g class="ph" data-pid="${p.id}">`;
  if(p.actor)s+=`<rect x="${x-40}" y="${top-16}" width="80" height="66" fill="transparent"/><circle class="w${sx}" cx="${x}" cy="${top-6}" r="7"/>${P(`M${x},${top+1} V${top+17} M${x-11},${top+7} H${x+11} M${x},${top+17} L${x-9},${top+30} M${x},${top+17} L${x+9},${top+30}`)}<text class="lbl" x="${x}" y="${top+45}" font-size="12.5" text-anchor="middle">${esc(p.name||'')}</text>`;
  else{const w=Math.max(96,tw([p.name||''],12.5)+22);s+=`<rect class="w${sx}" x="${x-w/2}" y="${top}" width="${w}" height="28"/>${T(x,top+18,esc(p.name||''),{fs:12.5,u:1})}`;}s+='</g>';});
 if(!d.parts.length)s+=T(300,140,'Klicke über dem Feld auf «＋ Objekt» oder «＋ Akteur»',{fs:15});
 return {svg:s,w:Math.max(760,X(Math.max(0,d.parts.length-1))+220),h:Math.max(360,bottom+30),rowY,bottom,X};
}
