
/* ================= ENGINE 2: Musterdiagramme, statische Darstellung ================= */
const GRIDS={uc:[200,86,150,70],cl:[290,200,150,40],st:[230,125,150,70]};
/* Erzeugt aus der Spezifikation einer Aufgabe ein zeichenbares Dokument. Graph-Diagramme brauchen spec.pos = {key:[Spalte,Zeile]}; das Sequenzdiagramm braucht nichts. */
function docFromSpec(t,drop){const sp=t.spec,type=t.type;drop=drop||[];
 if(t.doc){const d=JSON.parse(JSON.stringify(t.doc));if(drop.length){const rm=drop.map(k=>d.ids[k]);d.nodes=d.nodes.filter(n=>!rm.includes(n.id));d.edges=d.edges.filter(e=>!rm.includes(e.from)&&!rm.includes(e.to));}return d;}
 if(type==='sq'){const d={type:'sq',parts:[],rows:[],n:1},id={};
  sp.parts.forEach(p=>{const o={id:'p'+d.n++,name:p.name,actor:!!p.actor};id[p.k]=o.id;d.parts.push(o);});
  (sp.sol||sp.msgs.map((_,i)=>i)).forEach((x,ix)=>{const rid='r'+d.n++;
   if(typeof x==='number'){if(drop.includes(x))return;const m=sp.msgs[x],ty=[].concat(m.type)[0];d.rows.push({id:rid,kind:'msg',from:id[m.a],to:id[[].concat(m.b)[0]],mtype:ty,text:m.sol!=null?m.sol:(/^«/.test(m.name)?'':m.name),k:x});}
   else if(x==='end')d.rows.push({id:rid,kind:'end'});else if(x[0]==='else')d.rows.push({id:rid,kind:'else',guard:x[1]||''});else d.rows.push({id:rid,kind:'frag',op:x[0],guard:x[1]||''});});
  d.ids=id;return d;}
 if(!sp.pos)return null;
 const [dx,dy,ox,oy]=GRIDS[type]||GRIDS.st;const d={type,nodes:[],edges:[],n:1},id={};
 const at=(n,k)=>{const p=sp.pos[k];const [w,h]=size(n);n.x=Math.round(ox+p[0]*dx-w/2);n.y=Math.round(oy+p[1]*dy-h/2);};
 let sys=null;
 sp.nodes.forEach(s=>{if(drop.includes(s.k))return;const k=[].concat(s.kind)[0];const n={id:'n'+d.n++,kind:k,x:0,y:0,text:s.name};
  if(k==='class'){n.attrs=s.as!=null?s.as:(s.attrs||[]).map(a=>'- '+[].concat(a)[0]+' : String').join('\n');n.methods=s.ms!=null?s.ms:(s.meth||[]).map(a=>'+ '+[].concat(a)[0]+'() : void').join('\n');if(s.st)n.stereo=s.st;}
  id[s.k]=n.id;d.nodes.push(n);if(k==='system'){sys=n;return;}if(sp.pos[s.k])at(n,s.k);});
 (sp.notes||[]).forEach(([k,txt])=>{if(!sp.pos[k])return;const n={id:'n'+d.n++,kind:'note',x:0,y:0,text:txt};at(n,k);d.nodes.push(n);});
 if(sys){let x1=1e9,y1=1e9,x2=0,y2=0;d.nodes.filter(n=>n.kind==='usecase'||n.kind==='note').forEach(n=>{const b=box(n);x1=Math.min(x1,b.x);y1=Math.min(y1,b.y);x2=Math.max(x2,b.x+b.w);y2=Math.max(y2,b.y+b.h);});
  if(x2){sys.x=x1-30;sys.y=y1-50;sys.w=x2-x1+60;sys.h=y2-y1+80;}}
 const special={};const end=k=>{if(k[0]!=='@')return id[k];if(!special[k]){const n={id:'n'+d.n++,kind:k.slice(1),x:0,y:0,text:''};if(sp.pos[k])at(n,k);d.nodes.push(n);special[k]=n.id;}return special[k];};
 (sp.edges||[]).forEach(e=>{if(drop.includes(e.a)||drop.includes(e.b))return;const k=[].concat(e.kind)[0];const a=end(e.a),b=end(e.b);if(!a||!b)return;
  d.edges.push({id:'e'+d.n++,kind:k,from:a,to:b,label:(k==='trans'||k==='flow')?(e.txt||''):'',m1:e.ma?[].concat(e.ma)[0]:'',m2:e.mb?[].concat(e.mb)[0]:''});});
 const minY=Math.min(...d.nodes.map(n=>n.y)),minX=Math.min(...d.nodes.map(n=>n.x-(n.kind==='actor'?24:0)));
 const top=d.edges.some(e=>e.from===e.to)?74:16,left=type==='st'?30:16;const sx=minX<left?left-minX:0,sy=minY<top?top-minY:0;if(sx||sy)d.nodes.forEach(n=>{n.x+=sx;n.y+=sy;});
 d.ids=Object.assign({},id,special);return d;}
const canRender=t=>!!(t&&(t.doc||(t.spec&&(t.type==='sq'||t.spec.pos))));

/* Aktivitätsaufgaben werden als Musterzeichnung geschrieben; die Vergleichsspezifikation wird daraus abgeleitet.
   ref = {lanes:[[key,name,kw,not?]], n:[[key,kind,col,row,text,kw?,opts?]], e:[[from,to,label?,lab?]]} */
function acDoc(ref){const LW=ref.lw||250,RH=ref.rh||78;const d={type:'ac',nodes:[],edges:[],n:1},id={};const lanes=ref.lanes||[];
 let maxRow=0;ref.n.forEach(x=>{maxRow=Math.max(maxRow,x[3]);});
 lanes.forEach((l,i)=>{const n={id:'n'+d.n++,kind:'lane',x:16+i*LW,y:16,w:LW,h:(maxRow+1)*RH+70,text:l[1]};id[l[0]]=n.id;d.nodes.push(n);});
 ref.n.forEach(([k,kind,c,r,text,kw,o])=>{const n={id:'n'+d.n++,kind,x:0,y:0,text:text||''};if(o&&o.vert)n.vert=true;if(o&&o.len)n.len=o.len;const [w,h]=size(n);
  n.x=Math.round(16+(lanes.length?LW*(c+0.5):110+c*220)-w/2);n.y=Math.round(16+(lanes.length?52:20)+r*RH+RH/2-h/2);id[k]=n.id;d.nodes.push(n);});
 ref.e.forEach(([a,b,label])=>{d.edges.push({id:'e'+d.n++,kind:'flow',from:id[a],to:id[b],label:label||''});});
 d.ids=id;return d;}
function acSpec(ref,doc){const lanes=ref.lanes||[];const nodes=[],edges=[];const byK={};ref.n.forEach(x=>byK[x[0]]=x);
 lanes.forEach(l=>nodes.push({k:l[0],kind:'lane',name:l[1],kw:l[2],not:l[3]}));
 ref.n.forEach(([k,kind,c,r,text,kw,o])=>{if(kind!=='action')return;const s={k,kind:'action',name:text.replace(/\n/g,' '),kw:kw||[text.split(/\s+/)[0].toLowerCase().slice(0,6)]};if(o&&o.not)s.not=o.not;if(o&&o.opt)s.opt=true;
  if(lanes.length&&!(o&&o.nolane))s.lane=lanes[Math.max(0,Math.min(lanes.length-1,Math.floor(c)))][0];nodes.push(s);});
 const out=k=>ref.e.filter(e=>e[0]===k);const isCtl=k=>['diamond','bar'].includes(byK[k][1]);
 ref.n.forEach(([k,kind])=>{if(kind!=='action'&&kind!=='initial')return;
  (function go(cur,labs,lab,seen){out(cur).forEach(e=>{const b=e[1],kb=byK[b][1];const l2=e[2]?labs.concat(e[2]):labs,lb2=e[3]?lab.concat(e[3]):lab;
    if(kb==='action'||kb==='final'||kb==='flowfinal'){const o={kind:'flow',a:kind==='initial'?'@initial':k,b:kb==='action'?b:'@final'};if(lb2.length)o.lab=lb2;if(l2.length)o.txt=l2.join(' ');
     if(!edges.some(x=>x.a===o.a&&x.b===o.b))edges.push(o);}
    else if(isCtl(b)&&!seen.includes(b))go(b,l2,lb2,seen.concat(b));});})(k,[],[],[]);});
 const g=G(doc),R=acRoles(doc,g),need={};if(R.dec.length)need.decision=R.dec.length;if(R.mer.length)need.merge=R.mer.length;if(R.fork.length)need.fork=R.fork.length;if(R.join.length)need.join=R.join.length;
 return {nodes,edges,need,note:ref.note};}

/* Statisches SVG eines beliebigen Dokuments (Lösungen, Leseaufgaben, Fehlersuchaufgaben). */
function svgOf(doc,o){o=o||{};const keep=[Pz.sel,Pz.find,Pz.mode];Pz.sel=null;Pz.find=o.hl||null;Pz.mode={t:'select'};let inner,w,h;
 try{if(doc.type==='sq'){const r=drawSQ(doc);inner=r.svg;w=r.w;h=r.h;}
  else{let mx=0,my=0;doc.nodes.forEach(n=>{const b=box(n);mx=Math.max(mx,b.x+b.w+(n.kind==='actor'?26:0));my=Math.max(my,b.y+b.h+(n.kind==='actor'?24:0));});w=mx+24;h=my+24;
   inner=doc.nodes.filter(n=>CONT(n.kind)).map(drawNode).join('')+doc.edges.map(e=>drawEdge(e,doc)).join('')+doc.nodes.filter(n=>!CONT(n.kind)).map(drawNode).join('');}}
 finally{Pz.sel=keep[0];Pz.find=keep[1];Pz.mode=keep[2];}
 w=Math.round(w);h=Math.round(h);return `<svg class="sym${o.pick?' pick':''}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="min-width:${Math.min(w,700)}px">${inner}</svg>`;}
const figOf=(doc,o)=>`<div class="bigsvg dg">${svgOf(doc,o)}</div>`;

/* abgeleitete Aufgaben vorbereiten */
function prepTasks(list){list.forEach(t=>{if(t.ref&&!t.spec){t.doc=acDoc(t.ref);const ids=t.doc.ids;delete t.doc.ids;t.spec=acSpec(t.ref,t.doc);t.doc.ids=ids;}});}
