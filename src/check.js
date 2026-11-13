
/* ================= PRÜF-BOT ================= */
const norm=s=>String(s||'').toLowerCase().replace(/ä/g,'a').replace(/ö/g,'o').replace(/ü/g,'u').replace(/ß/g,'ss').replace(/ae/g,'a').replace(/oe/g,'o').replace(/ue/g,'u').replace(/\s+/g,' ').trim();
const SYN=[['pruf','kontroll','validier','check','verifizier','test'],['anzeig','zeig','darstell','ausgeb','einblend','meld'],['anleg','erstell','erzeug','hinzufug','erfass','registrier','neu'],['losch','entfern','vernicht'],['ander','bearbeit','aktualisier','editier','korrigier','pfleg'],['such','find','recherchier','filter'],['send','schick','ubermittl','verschick','versand'],['anmeld','einlogg','login','authentifizier','authentisier'],['abmeld','auslogg','logout'],['bezahl','zahl','begleich'],['storn','abbrech','cancel','annullier'],['kunde','kaufer','besteller'],['benutzer','nutzer','user','anwender'],['mitarbeiter','angestellt','personal','sachbearbeiter','beschaftigt'],['admin','verwalter'],['datenbank','database','db','datastore'],['bestatig','quittier','ok'],['ablehn','verweiger','abweis','zuruckweis'],['genehmig','freigeb','bewillig','akzeptier'],['wahl','aussuch','selektier'],['eingeb','eingabe','eintrag','erfass'],['lief','zustell','versend','verschick'],['start','beginn','einschalt','aktivier'],['beend','stopp','ausschalt','abschalt','deaktivier'],['fehler','error','storung'],['bereit','idle','standby','wartend'],['nachricht','meldung','mitteilung','benachrichtig','info'],['berechn','ermittl','kalkulier'],['speicher','sicher','persistier','ableg']];
function kwOk(text,s,syn){const t=norm(text);const has=a=>{const na=norm(a);if(t.includes(na))return true;if(syn===false||na.length<3)return false;const g=SYN.find(g=>g.some(x=>na.includes(x)||(na.length>=4&&x.includes(na))));return !!g&&g.some(x=>t.includes(x));};
 if(s.kw&&!s.kw.every(k=>[].concat(k).some(has)))return false;if(s.not&&s.not.some(a=>t.includes(norm(a))))return false;return true;}
function simTxt(a,b){a=norm(a).replace(/[^a-z0-9]/g,'');b=norm(b).replace(/[^a-z0-9]/g,'');if(!a||!b)return 0;if(a===b)return 1;const bg=x=>{const m={};for(let i=0;i<x.length-1;i++){const k=x.slice(i,i+2);m[k]=(m[k]||0)+1;}return m;};const A=bg(a),B=bg(b);let n=0;Object.keys(A).forEach(k=>{if(B[k])n+=Math.min(A[k],B[k]);});return 2*n/Math.max(1,a.length-1+b.length-1);}
function G(doc){const by={};doc.nodes.forEach(n=>by[n.id]=n);
 return {by,out:id=>doc.edges.filter(e=>e.from===id),inn:id=>doc.edges.filter(e=>e.to===id),K:k=>doc.nodes.filter(n=>[].concat(k).includes(n.kind)),
  inside:(n,c)=>{const b=box(n),B=box(c);return b.cx>B.x&&b.cx<B.x+B.w&&b.cy>B.y&&b.cy<B.y+B.h;}};}
const nm=n=>'„'+(refName(n)||'ohne Namen')+'“';
function dupNames(list,what,add){const seen={};list.forEach(n=>{const k=norm(n.text);if(!k)return;if(seen[k])add('warn',`${what} ${nm(n)} kommt doppelt vor.`,n.id,seen[k]);else seen[k]=n.id;});}
function reachable(doc,g,starts){const seen=new Set(starts.map(n=>n.id)),q=[...seen];while(q.length){const id=q.shift();g.out(id).forEach(e=>{if(!seen.has(e.to)){seen.add(e.to);q.push(e.to);}});}return seen;}
const hasGuard=l=>/\[[^\]]+\]/.test(l||'');

function rulesUC(doc){const g=G(doc),F=[],add=(lv,t,...ids)=>F.push({lv,t,ids});
 const sys=g.K('system'),act=g.K('actor'),ucs=g.K('usecase');
 if(!sys.length)add('warn','Keine Systemgrenze: Füge ein Rechteck mit dem Systemnamen hinzu und setze die Use Cases hinein.');
 sys.forEach(s=>{if(!(s.text||'').trim()||s.text==='System')add('tip','Gib der Systemgrenze den Namen des Systems (oben im Rahmen).',s.id);});
 if(!act.length)add('err','Kein einziger Akteur vorhanden.');
 if(!ucs.length)add('err','Kein einziger Use Case vorhanden.');
 act.forEach(a=>{if(sys.some(s=>g.inside(a,s)))add('err',`Akteur ${nm(a)} steht innerhalb der Systemgrenze. Akteure stehen immer außerhalb.`,a.id);
  if(!(a.text||'').trim()||a.text==='Akteur')add('warn','Der Akteur hat keinen Rollennamen (zum Beispiel „Kunde“).',a.id);
  if(!doc.edges.some(e=>e.from===a.id||e.to===a.id))add('warn',`Akteur ${nm(a)} ist mit nichts verbunden.`,a.id);});
 ucs.forEach(u=>{if(sys.length&&!sys.some(s=>g.inside(u,s)))add('err',`Use Case ${nm(u)} liegt außerhalb der Systemgrenze. Alle Use Cases gehören in den Rahmen.`,u.id);
  const t=(u.text||'').trim();if(!t||t==='Use Case')add('err','Use Case ohne Namen.',u.id);
  else if(!/(en|rn|ln|ung)$/i.test(t.split(/\s+/).pop().replace(/[^a-zäöüß]/gi,'')))add('tip',`${nm(u)}: Den Namen besser als Substantiv + Verb im Infinitiv bilden (zum Beispiel „Gerät reservieren“).`,u.id);
  if(!doc.edges.some(e=>e.from===u.id||e.to===u.id))add('warn',`Use Case ${nm(u)} ist mit nichts verbunden.`,u.id);});
 doc.edges.forEach(e=>{const a=g.by[e.from],b=g.by[e.to];if(!a||!b)return;const ka=a.kind,kb=b.kind;
  if(e.kind==='assoc'){if(ka==='actor'&&kb==='actor')add('err','Eine einfache Assoziation zwischen zwei Akteuren ist nicht zulässig. Zwischen Akteuren ist nur eine Generalisierung möglich.',e.id);
   else if(ka==='usecase'&&kb==='usecase')add('err',`Einfache Linie zwischen den Use Cases ${nm(a)} und ${nm(b)}. Zwischen Use Cases verwendet man «include», «extend» oder Generalisierung. Und denk daran: Das Diagramm zeigt keine Reihenfolge von Schritten.`,e.id);}
  if(e.kind==='include'||e.kind==='extend'){if(ka!=='usecase'||kb!=='usecase')add('err',`«${e.kind}» ist nur zwischen zwei Use Cases möglich, nicht mit einem Akteur.`,e.id);
   else if(e.from===e.to)add('err','Ein Use Case kann sich nicht selbst einbinden oder erweitern.',e.id);}
  if(e.kind==='gen'){if(ka!==kb)add('err','Eine Generalisierung verbindet gleichartige Elemente: Akteur mit Akteur oder Use Case mit Use Case.',e.id);else if(e.from===e.to)add('err','Generalisierung auf sich selbst.',e.id);}
 });
 doc.edges.filter(e=>e.kind==='include').forEach(e=>{if(e.from<e.to&&doc.edges.some(o=>o.kind==='include'&&o.from===e.to&&o.to===e.from))add('err','Gegenseitiges «include»: A bindet B ein und B bindet A ein.',e.id);});
 ucs.forEach(u=>{const st=reachBackToActor(doc,g,u);if(!st&&doc.edges.some(e=>e.from===u.id||e.to===u.id))add('tip',`Zum Use Case ${nm(u)} führt kein Akteur (weder direkt noch über include/extend/Generalisierung).`,u.id);});
 dupNames(ucs,'Use Case',add);dupNames(act,'Akteur',add);
 if(doc.edges.some(e=>e.kind==='extend')&&!g.K('note').length)add('tip','Bei «extend» kann die Bedingung als Notiz angegeben werden: Condition: {…}.');
 return F;}
function reachBackToActor(doc,g,u){const seen=new Set([u.id]),q=[u.id];while(q.length){const id=q.shift();for(const e of doc.edges){let o=null;
   if(e.kind==='assoc'&&(e.from===id||e.to===id))o=e.from===id?e.to:e.from;
   else if(e.kind==='include'&&e.to===id)o=e.from; else if(e.kind==='extend'&&e.from===id)o=e.to; else if(e.kind==='gen'&&(e.from===id||e.to===id))o=e.from===id?e.to:e.from;
   if(!o||seen.has(o))continue;if(g.by[o]&&g.by[o].kind==='actor')return true;seen.add(o);q.push(o);}}return false;}

const ID='[\\p{L}_][\\p{L}\\d_]*',TY='[\\p{L}_][\\p{L}\\d_<>\\[\\], .]*';
const RE_ATTR=new RegExp(`^([+\\-#~])\\s*(${ID})\\s*:\\s*(${TY}?)(\\s*\\[[^\\]]+\\])?(\\s*=\\s*.+)?$`,'u');
const RE_ATTR_J=new RegExp(`^([+\\-#~])\\s*([\\p{L}_][\\p{L}\\d_<>\\[\\]]*)\\s+(${ID})(\\s*=\\s*.+)?$`,'u');
const RE_METH=new RegExp(`^([+\\-#~])\\s*(${ID})\\s*\\(([^)]*)\\)\\s*(:\\s*${TY})?$`,'u');
const RE_MULT=/^(\*|\d+|\d+\.\.(\*|\d+))$/;
function rulesCL(doc){const g=G(doc),F=[],add=(lv,t,...ids)=>F.push({lv,t,ids});const cls=g.K('class');
 if(!cls.length){add('err','Keine einzige Klasse vorhanden.');return F;}
 let jTip=false;
 cls.forEach(c=>{const t=(c.text||'').trim();if(!t||t==='Klasse'||t==='Interface')add('err','Klasse ohne Namen.',c.id);else if(/^[a-zäöü]/.test(t))add('tip',`Der Klassenname ${nm(c)} wird großgeschrieben.`,c.id);
  linesOf(c.attrs).forEach(l=>{if(l.includes('('))add('warn',`${nm(c)}: „${l}“ sieht nach einer Methode aus. Methoden stehen im unteren Bereich.`,c.id);
   else if(!/^[+\-#~]/.test(l))add('warn',`${nm(c)}: Das Attribut „${l}“ hat keine Sichtbarkeit (+, -, #, ~).`,c.id);
   else if(RE_ATTR.test(l)){if(l.trim()[0]==='+')add('tip',`${nm(c)}: Das Attribut „${l}“ ist public. Attribute sind üblicherweise private (-), der Zugriff läuft über Methoden (Kapselung).`,c.id);}
   else if(RE_ATTR_J.test(l)){if(!jTip){jTip=true;add('tip',`„${l}“: Im Informationsblatt lautet die Syntax: Sichtbarkeit name : Datentyp. Die Schreibweise „Typ name“ kommt in Lösungen vor, in der Prüfung ist die erste Variante aber sicherer.`,c.id);}}
   else add('warn',`${nm(c)}: Das Attribut „${l}“ entspricht nicht der Syntax. Richtig: Sichtbarkeit name : Datentyp, zum Beispiel „- name : String“.`,c.id);});
  linesOf(c.methods).forEach(l=>{if(!l.includes('('))add('warn',`${nm(c)}: „${l}“ steht im Methodenbereich ohne Klammern (). Attribute stehen im mittleren Bereich.`,c.id);
   else if(!/^[+\-#~]/.test(l))add('warn',`${nm(c)}: Die Methode „${l}“ hat keine Sichtbarkeit.`,c.id);
   else if(!RE_METH.test(l))add('warn',`${nm(c)}: Die Methode „${l}“ entspricht nicht der Syntax. Richtig: Sichtbarkeit name(param : Typ) : Rückgabetyp.`,c.id);});
  if(c.stereo==='interface'&&linesOf(c.attrs).length)add('warn',`Interface ${nm(c)} enthält Attribute. Ein Interface legt nur Methodensignaturen fest.`,c.id);
  if(cls.length>1&&!doc.edges.some(e=>e.from===c.id||e.to===c.id))add('tip',`Die Klasse ${nm(c)} ist mit keiner anderen Klasse verbunden.`,c.id);
  if(g.out(c.id).filter(e=>e.kind==='gen').length>1)add('tip',`${nm(c)} erbt von mehreren Klassen gleichzeitig. In Java und C# geht das nicht, denk über ein Interface nach.`,c.id);});
 doc.edges.forEach(e=>{const a=g.by[e.from],b=g.by[e.to];if(!a||!b||a.kind!=='class'||b.kind!=='class')return;
  if(e.kind==='gen'){if(e.from===e.to)add('err','Die Klasse erbt von sich selbst.',e.id);
   else if(b.stereo==='interface'&&a.stereo!=='interface')add('warn',`${nm(a)} → ${nm(b)}: Zu einem Interface führt eine Realisierung (gestrichelt mit Dreieck), keine Generalisierung.`,e.id);
   else if(a.stereo==='interface'&&b.stereo!=='interface')add('err',`Interface ${nm(a)} kann nicht erben von der Klasse ${nm(b)}. Prüfe die Richtung.`,e.id);}
  if(e.kind==='real'){if(b.stereo!=='interface')add('err',`Eine Realisierung muss auf ein Interface zeigen, aber ${nm(b)} ist nicht als «interface» gekennzeichnet.`,e.id);}
  if(['assoc','agg','comp'].includes(e.kind)){
   [e.m1,e.m2].forEach(m=>{if(m&&!RE_MULT.test(m.trim()))add('err',`Die Multiplizität „${m}“ ist falsch notiert. Zulässig: 1, 0..1, 0..*, *, 1..*, 2..5.`,e.id);});
   if(!e.m1&&!e.m2)add('tip',`An der Beziehung zwischen ${nm(a)} und ${nm(b)} fehlen die Multiplizitäten.`,e.id);
   if((e.kind==='agg'||e.kind==='comp')&&e.from===e.to)add('tip','Die Klasse ist Teil von sich selbst. Ist das so gewollt?',e.id);}
 });
 const gen=doc.edges.filter(e=>e.kind==='gen');cls.forEach(c=>{const seen=new Set(),st=[c.id];while(st.length){const id=st.pop();gen.filter(e=>e.from===id).forEach(e=>{if(e.to===c.id&&!F.some(f=>f.cyc))F.push({lv:'err',t:'Zyklische Vererbung: Die Klasse erbt über eine Kette von sich selbst.',ids:[e.id],cyc:1});if(!seen.has(e.to)){seen.add(e.to);st.push(e.to);}});}});
 dupNames(cls,'Die Klasse',add);
 return F;}

function labelSyntax(l,add,id){if(!l)return;const o=(l.match(/\[/g)||[]).length,c=(l.match(/\]/g)||[]).length;if(o!==c)add('err',`In der Beschriftung „${l}“ sind die eckigen Klammern des Guards nicht geschlossen.`,id);if(/[{}]/.test(l))add('tip',`„${l}“: Ein Guard steht in eckigen Klammern [ ], nicht in geschweiften.`,id);}
function rulesST(doc){const g=G(doc),F=[],add=(lv,t,...ids)=>F.push({lv,t,ids});const ini=g.K('initial'),fin=g.K('final'),sts=g.K('state'),ch=g.K('choice');
 if(!sts.length){add('err','Kein einziger Zustand vorhanden.');}
 if(!ini.length)add('err','Kein Startzustand (gefüllter Kreis).');if(ini.length>1)add('err','Mehrere Startzustände. Auf einer Ebene braucht man genau einen.',...ini.map(n=>n.id));
 ini.forEach(n=>{if(g.inn(n.id).length)add('err','In den Startzustand führt ein Übergang. Er ist nur der Anfang und hat keine eingehenden Pfeile.',n.id);const o=g.out(n.id);if(!o.length)add('err','Aus dem Startzustand führt kein Übergang in den ersten Zustand.',n.id);if(o.length>1)add('warn','Aus dem Startzustand führen mehrere Übergänge. Üblich ist genau einer.',n.id);});
 fin.forEach(n=>{if(g.out(n.id).length)add('err','Aus dem Endzustand führt ein Übergang heraus. Er hat keine ausgehenden Pfeile.',n.id);if(!g.inn(n.id).length)add('warn','In den Endzustand führt nichts.',n.id);});
 sts.forEach(s=>{const t=(s.text||'').trim();if(!t||t==='Zustand')add('err','Zustand ohne Namen.',s.id);
  else if(/\?/.test(t))add('warn',`${nm(s)} sieht nach einer Prüfung aus. Prüfungen notiert man als Guard am Übergang: [Bedingung].`,s.id);
  else if(/\(\)/.test(t)||/ieren$/i.test(t)||(t.split(/\s+/).length>1&&/^[a-zäöü]+en$/.test(t.split(/\s+/).pop())&&!/^(ge|ver|be|er|zer|ent)/.test(t.split(/\s+/).pop())))add('tip',`${nm(s)} klingt nach einer Aktion. Ein Zustand benennt eine stabile Situation („fahrbereit“, „in Wartung“), die Aktion steht am Übergang.`,s.id);
  if(!g.out(s.id).length&&!fin.length&&sts.length>1)add('tip',`Aus dem Zustand ${nm(s)} führt kein Übergang heraus. Ist das so gewollt?`,s.id);
  const by={};g.out(s.id).forEach(e=>{const k=norm(e.label);if(!k)return;if(by[k])add('err',`Aus ${nm(s)} führen zwei Übergänge mit derselben Beschriftung „${e.label}“. Unklar, welcher schaltet. Unterscheide sie durch Guards.`,e.id,by[k]);else by[k]=e.id;});});
 doc.edges.forEach(e=>{const a=g.by[e.from],b=g.by[e.to];if(!a||!b)return;labelSyntax(e.label,add,e.id);
  if(a.kind==='state'&&!(e.label||'').trim()&&b.kind!=='final')add('warn',`Übergang ${nm(a)} → ${nm(b)} ohne Ereignis. Notiere: Ereignis [Guard] / Effekt.`,e.id);
  if(a.kind==='choice'&&!hasGuard(e.label))add('err',`Ausgang des Entscheidungsknotens zu ${nm(b)} ohne Guard in eckigen Klammern.`,e.id);
  if(a.kind==='final')return;});
 ch.forEach(c=>{if(g.out(c.id).length<2)add('warn','Der Entscheidungsknoten hat weniger als zwei Ausgänge.',c.id);if(!g.inn(c.id).length)add('warn','In den Entscheidungsknoten führt nichts hinein.',c.id);});
 if(ini.length){const seen=reachable(doc,g,ini);sts.concat(fin).forEach(n=>{if(!seen.has(n.id))add('warn',`${nm(n)} ist vom Startzustand aus nicht erreichbar.`,n.id);});}
 dupNames(sts,'Zustand',add);
 return F;}

function acRoles(doc,g){const dec=[],mer=[],fork=[],join=[];g.K('diamond').forEach(n=>{const i=g.inn(n.id).length,o=g.out(n.id).length;if(o>=2)dec.push(n);if(i>=2)mer.push(n);});g.K('bar').forEach(n=>{const i=g.inn(n.id).length,o=g.out(n.id).length;if(o>=2)fork.push(n);if(i>=2)join.push(n);});return {dec,mer,fork,join};}
function rulesAC(doc){const g=G(doc),F=[],add=(lv,t,...ids)=>F.push({lv,t,ids});const ini=g.K('initial'),fin=g.K('final'),ff=g.K('flowfinal'),acts=g.K('action'),lanes=g.K('lane');const R=acRoles(doc,g);
 if(!acts.length)add('err','Keine einzige Aktion vorhanden.');
 if(!ini.length)add('err','Kein Initialknoten (gefüllter Kreis).');if(ini.length>1)add('warn','Mehrere Initialknoten. Üblicherweise hat eine Aktivität einen Start.',...ini.map(n=>n.id));
 ini.forEach(n=>{if(g.inn(n.id).length)add('err','In den Initialknoten führt ein Pfeil. Er hat keine eingehenden Kanten.',n.id);if(!g.out(n.id).length)add('err','Aus dem Initialknoten führt kein Kontrollfluss heraus.',n.id);});
 if(!fin.length&&!ff.length)add('warn','Kein Endknoten. Die Aktivität muss irgendwo enden.');
 fin.concat(ff).forEach(n=>{if(g.out(n.id).length)add('err','Aus dem Endknoten führt ein Pfeil heraus.',n.id);if(!g.inn(n.id).length)add('warn','In den Endknoten führt nichts.',n.id);});
 acts.forEach(a=>{const t=(a.text||'').trim(),i=g.inn(a.id).length,o=g.out(a.id).length;
  if(!t||t==='Aktion')add('err','Aktion ohne Namen.',a.id);else if(t.split(/\s+/).length<2)add('tip',`${nm(a)}: Den Aktionsnamen besser als Verb + Objekt bilden („Verfügbarkeit prüfen“).`,a.id);
  if(!o)add('warn',`Nach der Aktion ${nm(a)} bricht der Ablauf ab: kein ausgehender Pfeil.`,a.id);
  if(o>1)add('err',`Aus der Aktion ${nm(a)} gehen ${o} Pfeile ab. Für Alternativen setze eine Decision (Raute mit Guards), für parallele Pfade einen Fork (Balken).`,a.id);
  if(i>1)add('warn',`In die Aktion ${nm(a)} führen ${i} Pfeile. Alternative Pfade zuerst über einen Merge (Raute) zusammenführen, parallele über einen Join.`,a.id);
  if(lanes.length&&!lanes.some(l=>g.inside(a,l)))add('warn',`Die Aktion ${nm(a)} steht außerhalb der Swimlanes.`,a.id);});
 g.K('diamond').forEach(n=>{const i=g.inn(n.id),o=g.out(n.id);
  if(i.length<=1&&o.length<=1)add('warn','Raute ohne Verzweigung: Eine Decision hat mehrere Ausgänge, ein Merge mehrere Eingänge.',n.id);
  if(o.length>=2){o.forEach(e=>{if(!hasGuard(e.label))add('err',`Ausgang der Decision zu ${nm(g.by[e.to])} ohne Guard. Schreibe die Bedingung in eckige Klammern.`,e.id);});
   const gs=o.map(e=>norm(e.label)).filter(Boolean);if(new Set(gs).size<gs.length)add('err','Die Decision hat zwei Ausgänge mit demselben Guard.',n.id);}
  if(i.length>=2&&o.length>=2)add('tip','Eine Raute arbeitet zugleich als Merge und als Decision. Übersichtlicher sind zwei getrennte Rauten.',n.id);});
 g.K('bar').forEach(n=>{const i=g.inn(n.id),o=g.out(n.id);
  if(i.length<=1&&o.length<=1)add('warn','Balken ohne Aufteilung: Ein Fork hat mehrere Ausgänge, ein Join mehrere Eingänge.',n.id);
  o.forEach(e=>{if(o.length>=2&&hasGuard(e.label))add('err','An den Ausgängen eines Forks stehen keine Bedingungen: Alle Pfade starten gleichzeitig. Für Bedingungen braucht man eine Decision.',e.id);});
  if(!o.length)add('warn','Nach dem Balken bricht der Ablauf ab.',n.id);});
 if(R.fork.length&&!R.join.length&&!ff.length)add('warn','Es gibt einen Fork, aber die parallelen Pfade laufen nirgends über einen Join zusammen und enden auch nicht mit einem Ablaufendknoten.');
 if(R.join.length&&!R.fork.length)add('warn','Es gibt einen Join, aber keinen Fork. Ein Join wartet auf alle eingehenden Pfade. Sind die Pfade alternativ, braucht man einen Merge.',...R.join.map(n=>n.id));
 doc.edges.forEach(e=>{const a=g.by[e.from];if(!a)return;labelSyntax(e.label,add,e.id);
  if((e.label||'').trim()&&!hasGuard(e.label)&&a.kind!=='object')add('tip',`Beschriftung „${e.label}“ am Pfeil: Bedingungen notiert man als Guard in eckigen Klammern.`,e.id);
  if(hasGuard(e.label)&&a.kind==='action')add('warn',`Der Guard „${e.label}“ steht an einem Pfeil, der aus einer Aktion kommt. Bedingungen gehören an die Ausgänge einer Decision.`,e.id);});
 if(ini.length){const seen=reachable(doc,g,ini);doc.nodes.filter(n=>!CONT(n.kind)&&n.kind!=='note'&&n.kind!=='initial').forEach(n=>{if(!seen.has(n.id))add('warn',`${nm(n)} ist vom Initialknoten aus nicht erreichbar.`,n.id);});}
 lanes.forEach(l=>{if(!(l.text||'').trim()||l.text==='Bereich')add('tip','Gib der Swimlane den Namen des Verantwortlichen (Frontend, Backend, …).',l.id);});
 return F;}

function rulesSQ(doc){const F=[],add=(lv,t,...ids)=>F.push({lv,t,ids});const pn={};doc.parts.forEach(p=>pn[p.id]=p);
 if(doc.parts.length<2)add('err','Es werden mindestens zwei Lebenslinien benötigt.');
 const seen={};doc.parts.forEach(p=>{const k=norm(p.name);if(!k)add('err','Lebenslinie ohne Namen.');else if(seen[k])add('err',`Der Name „${p.name}“ kommt bei zwei Lebenslinien vor.`);seen[k]=1;
  if(!p.actor&&p.name&&!p.name.includes(':'))add('tip',`„${p.name}“: Objekte notiert man als „:Klasse“ oder „name:Klasse“ (unterstrichen), zum Beispiel „:Backend“.`);});
 const msgs=doc.rows.filter(r=>r.kind==='msg');if(!msgs.length)add('err','Keine einzige Nachricht vorhanden.');
 const pend=[],stack=[];let created={},destroyed={};
 doc.rows.forEach(r=>{
  if(r.kind==='msg'){const a=pn[r.from],b=pn[r.to];if(!a||!b)return;const self=r.from===r.to;const q='„'+(r.text||MT[r.mtype])+'“';
   stack.forEach(f=>f.n++);
   if(destroyed[r.from]||destroyed[r.to])add('err',`Die Nachricht ${q} verwendet eine Lebenslinie, die bereits zerstört ist.`,r.id);
   if(!(r.text||'').trim()&&!['reply','create','destroy'].includes(r.mtype))add('warn',`Nachricht ${a.name} → ${b.name} ohne Namen. Meist ist das der Aufruf einer Operation des Empfängers.`,r.id);
   if(r.mtype==='reply'){if(self)add('err','Eine Antwort an sich selbst ergibt keinen Sinn.',r.id);
    else{const i=pend.map(p=>p.from+'>'+p.to).lastIndexOf(r.to+'>'+r.from);if(i<0)add('warn',`Antwort ${q} von ${a.name} an ${b.name}, aber davor gibt es keinen Aufruf ${b.name} → ${a.name}. Eine Antwort geht zurück zum Aufrufer.`,r.id);else pend.splice(i,1);}}
   if(r.mtype==='sync'&&!self)pend.push({from:r.from,to:r.to,id:r.id});
   if(r.mtype==='create'){if(self)add('err','«create» an sich selbst.',r.id);if(created[r.to])add('warn',`${b.name} wird zweimal erzeugt.`,r.id);created[r.to]=1;}
   if(r.mtype==='destroy')destroyed[r.to]=1;
   if(b.actor&&r.mtype==='create')add('err','Ein Akteur kann nicht mit einer «create»-Nachricht erzeugt werden.',r.id);}
  else if(r.kind==='frag'){stack.push({r,n:0,els:0,pend:pend.slice()});if(['alt','opt','loop'].includes(r.op)&&!(r.guard||'').trim())add('warn',`Das Fragment ${r.op} hat keine Bedingung in [ ].`,r.id);}
  else if(r.kind==='else'){const f=stack[stack.length-1];if(!f)add('err','Operand / [else] außerhalb eines Fragments.',r.id);else{f.els++;pend.length=0;pend.push(...f.pend);if(f.r.op==='opt')add('err','Ein opt hat nur einen Zweig. Für zwei Zweige braucht man alt.',r.id);if(f.r.op==='loop'||f.r.op==='break')add('err',`Bei ${f.r.op} fehlt der zweite Operand.`,r.id);}}
  else if(r.kind==='end'){const f=stack.pop();if(!f)add('err','«Ende Fragment» ohne Beginn eines Fragments.',r.id);else{if(!f.n)add('warn',`Das Fragment ${f.r.op} ist leer: Es enthält keine Nachrichten.`,f.r.id);if(f.r.op==='alt'&&!f.els)add('warn','alt mit nur einem Zweig. Für einen einzelnen bedingten Zweig nimmt man opt, für zwei ergänze den Operanden [else].',f.r.id);if(f.r.op==='par'&&!f.els)add('warn','par mit nur einem Operanden. Trenne die parallelen Teile mit einer Zeile «Operand».',f.r.id);}}
 });
 stack.forEach(f=>add('err',`Das Fragment ${f.r.op} ist nicht geschlossen. Ergänze «Ende Fragment».`,f.r.id));
 return F;}
const RULES={uc:rulesUC,cl:rulesCL,st:rulesST,ac:rulesAC,sq:rulesSQ};

/* ----- Vergleich mit der Musterlösung ----- */
const normM=m=>{m=String(m||'').replace(/\s/g,'').toLowerCase();if(m==='*'||m==='n'||m==='0..n')return '0..*';if(m==='1..n')return '1..*';if(m==='1..1')return '1';return m;};
function reach(doc,g,a,targets,pass){const res=[],seenE=new Set();
 (function go(id,labs,eds,depth){if(depth>10)return;g.out(id).forEach(e=>{const t=g.by[e.to];if(!t||seenE.has(e.id))return;const l=labs.concat(e.label||''),ee=eds.concat(e);
  if(targets.includes(t.id)){res.push({labs:l,edges:ee});return;}
  if(pass(t)){seenE.add(e.id);go(t.id,l,ee,depth+1);}});})(a.id,[],[],0);return res;}
function checkSpec(doc,spec){const g=G(doc),R={ok:0,total:0,iss:[],miss:[],extra:[],struct:[]};const used=new Set(),map={},byk={};
 const add=(lv,t,...ids)=>R.iss.push({lv,t,ids});
 spec.nodes.forEach(s=>{byk[s.k]=s;if(!s.opt)R.total++;});
 const take=(s,c,how)=>{used.add(c.id);map[s.k]=c;if(!s.opt)R.ok++;if(how)R.struct.push([refName(c),s.name]);};
 const cand=s=>doc.nodes.filter(n=>!used.has(n.id)&&[].concat(s.kind).includes(n.kind));
 const notOk=(s,n)=>s.not&&s.not.some(a=>norm(n.text).includes(norm(a)));
 [false,true].forEach(syn=>spec.nodes.forEach(s=>{if(map[s.k])return;const c=cand(s).find(n=>kwOk(n.text,s,syn));if(c)take(s,c);}));
 spec.nodes.forEach(s=>{if(map[s.k])return;let best=null,bs=0;cand(s).forEach(n=>{const v=simTxt(n.text,s.name);if(v>bs){bs=v;best=n;}});if(best&&bs>=0.7&&!notOk(s,best))take(s,best);});
 const ctl=t=>['choice','diamond','bar'].includes(t.kind);
 const ends=k=>k[0]==='@'?doc.nodes.filter(n=>(k==='@final'?['final','flowfinal']:[k.slice(1)]).includes(n.kind)):(map[k]?[map[k]]:[]);
 const adj=(c,O)=>{const ids=O.map(o=>o.id);if(doc.edges.some(e=>(e.from===c.id&&ids.includes(e.to))||(e.to===c.id&&ids.includes(e.from))))return true;
  return reach(doc,g,c,ids,ctl).length>0||O.some(o=>reach(doc,g,o,[c.id],ctl).length>0);};
 for(let ch=true,guard=0;ch&&guard<30;guard++){ch=false;spec.nodes.forEach(s=>{if(map[s.k]||CONT([].concat(s.kind)[0]))return;
   const inc=(spec.edges||[]).filter(e=>(e.a===s.k||e.b===s.k)&&e.a!==e.b).map(e=>e.a===s.k?e.b:e.a).filter(o=>ends(o).length);if(!inc.length)return;
   let best=null,bc=0,tie=false;cand(s).forEach(n=>{if(notOk(s,n))return;const c=inc.filter(o=>adj(n,ends(o))).length;if(c>bc){bc=c;best=n;tie=false;}else if(c===bc&&c>0)tie=true;});
   if(best&&!tie&&bc===inc.length&&(bc>=2||simTxt(best.text,s.name)>=0.35)){take(s,best,true);ch=true;}});}
 spec.nodes.forEach(s=>{if(map[s.k]||[].concat(s.kind)[0]!=='lane')return;let best=null,bc=0;cand(s).forEach(l=>{const c=spec.nodes.filter(a=>a.lane===s.k&&map[a.k]&&g.inside(map[a.k],l)).length;if(c>bc){bc=c;best=l;}});if(best&&bc>=2)take(s,best,true);});
 spec.nodes.forEach(s=>{if(!map[s.k]&&!s.opt)R.miss.push(`${KN[[].concat(s.kind)[0]]} „${s.name}“`);});
 spec.nodes.forEach(s=>{const c=map[s.k];if(!c)return;
  [['attrs','Attribute',c.attrs],['meth','Methoden',c.methods]].forEach(([key,word,txt])=>{if(!s[key])return;R.total++;const t=norm(txt);const lack=s[key].filter(k=>![].concat(k).some(a=>t.includes(norm(a))));
   if(!lack.length)R.ok++;else{add('warn',`Bei der Klasse ${nm(c)} fehlen ${word}: gefunden ${s[key].length-lack.length} von ${s[key].length}.`,c.id);R.miss.push(`${nm(c)}: ${key==='attrs'?'Attribut':'Methode'} ${lack.map(k=>[].concat(k)[0]).join(', ')}`);}});
  if(s.st){R.total++;if(c.stereo===s.st)R.ok++;else add('warn',s.st==='interface'?`${nm(c)} muss als «interface» gekennzeichnet sein.`:`${nm(c)} ist laut Aufgabe abstrakt. Kennzeichne mit «abstract».`,c.id);}
  if(s.lane){R.total++;const l=map[s.lane];if(!l)return;if(g.inside(c,l))R.ok++;else add('warn',`Die Aktion ${nm(c)} steht in der falschen Swimlane. Wer führt sie aus?`,c.id);}
 });
 const nameOf=k=>k[0]==='@'?KN[k.slice(1)]:byk[k].name;
 (spec.edges||[]).forEach(s=>{R.total++;const kinds=[].concat(s.kind),flowish=kinds[0]==='trans'||kinds[0]==='flow';const an=nameOf(s.a),bn=nameOf(s.b);
  const pick=k=>k[0]==='@'?doc.nodes.filter(n=>(k==='@final'?['final','flowfinal']:[k.slice(1)]).includes(n.kind)):(map[k]?[map[k]]:[]);
  const As=pick(s.a),Bs=pick(s.b);
  if(flowish){const word=kinds[0]==='trans'?'Transition':'Kontrollfluss';if(!As.length||!Bs.length){R.miss.push(`${word} „${an}“ → „${bn}“`);return;}
   let paths=[];As.forEach(A=>{paths=paths.concat(reach(doc,g,A,Bs.map(b=>b.id),t=>['choice','diamond','bar'].includes(t.kind)||(!used.has(t.id)&&['action','object'].includes(t.kind))));});
   if(!paths.length){R.miss.push(`${word} „${an}“ → „${bn}“`);return;}
   R.ok++;if(s.lab){R.total++;if(paths.some(p=>kwOk(p.labs.join(' '),{kw:s.lab})))R.ok++;else add('warn',`Prüfe die Beschriftung auf dem Weg „${an}“ → „${bn}“ (${kinds[0]==='trans'?'Ereignis und Guard':'Guard'}).`,...paths[0].edges.map(e=>e.id));}
   return;}
  const A=As[0],B=Bs[0];if(!A||!B){R.miss.push(`${EK[kinds[0]].n}: „${an}“ und „${bn}“`);return;}
  const U=doc.edges.filter(e=>(e.from===A.id&&e.to===B.id)||(e.from===B.id&&e.to===A.id));
  if(!U.length){R.miss.push(`${EK[kinds[0]].n}: „${an}“ und „${bn}“`);return;}
  const hit=U.find(e=>kinds.includes(e.kind)&&(e.kind==='assoc'||e.from===A.id));
  if(hit){R.ok++;if(s.ma||s.mb){R.total++;const ua=normM(hit.from===A.id?hit.m1:hit.m2),ub=normM(hit.from===A.id?hit.m2:hit.m1);const okA=!s.ma||[].concat(s.ma).map(normM).includes(ua),okB=!s.mb||[].concat(s.mb).map(normM).includes(ub);
    if(okA&&okB)R.ok++;else if(!ua&&!ub)add('warn',`An der Beziehung zwischen „${an}“ und „${bn}“ fehlen die Multiplizitäten.`,hit.id);else add('warn',`Prüfe die Multiplizitäten an der Beziehung zwischen „${an}“ und „${bn}“. Die Zahl steht bei der gegenüberliegenden Klasse: wie viele Objekte dieser Klasse auf ein Objekt der anderen kommen.`,hit.id);}
   return;}
  const rev=U.find(e=>kinds.includes(e.kind));
  if(rev)add('err',(rev.kind==='agg'||rev.kind==='comp')?`${EK[rev.kind].n} zwischen „${an}“ und „${bn}“: Die Raute steht bei der falschen Klasse. Sie gehört zum Ganzen.`:`${EK[rev.kind].n} zwischen „${an}“ und „${bn}“ zeigt in die falsche Richtung.`,rev.id);
  else add('err',`Zwischen „${an}“ und „${bn}“ hast du ${EK[U[0].kind].n} gezeichnet. Hier passt eine andere Beziehungsart.`,U[0].id);
 });
 if(spec.need){const r=doc.type==='ac'?acRoles(doc,g):{};const cnt={decision:(r.dec||[]).length,merge:(r.mer||[]).length,fork:(r.fork||[]).length,join:(r.join||[]).length,final:g.K(['final','flowfinal']).length,initial:g.K('initial').length,lane:g.K('lane').length,note:g.K('note').length};
  const lab={decision:'Decision (Raute mit Guards)',merge:'Merge',fork:'Fork',join:'Join',final:'Endknoten',initial:'Startknoten',lane:'Swimlanes',note:'Notiz mit Condition'};
  Object.entries(spec.need).forEach(([k,v])=>{R.total++;if(cnt[k]>=v)R.ok++;else R.miss.push(`${lab[k]}: mindestens ${v} nötig, gefunden ${cnt[k]}`);});}
 R.extra=doc.nodes.filter(n=>!used.has(n.id)&&['usecase','actor','class','state','action'].includes(n.kind)).map(n=>refName(n));
 return R;}
function checkSpecSQ(doc,spec){const R={ok:0,total:0,iss:[],miss:[],extra:[],struct:[]},add=(lv,t,...ids)=>R.iss.push({lv,t,ids});const used=new Set(),map={},byk={};
 spec.parts.forEach(s=>{byk[s.k]=s;R.total++;});
 const takeP=(s,c,how)=>{used.add(c.id);map[s.k]=c;R.ok++;if(how)R.struct.push([c.name,s.name]);if(s.actor&&!c.actor)add('tip',`„${c.name}“ ist laut Aufgabe ein Mensch oder ein externes System. Kennzeichne ihn als Akteur.`);};
 [false,true].forEach(syn=>spec.parts.forEach(s=>{if(map[s.k])return;const c=doc.parts.find(p=>!used.has(p.id)&&kwOk(p.name,s,syn));if(c)takeP(s,c);}));
 spec.parts.forEach(s=>{if(map[s.k])return;const c=doc.parts.filter(p=>!used.has(p.id)).sort((x,y)=>simTxt(y.name,s.name)-simTxt(x.name,s.name))[0];if(c&&simTxt(c.name,s.name)>=0.7)takeP(s,c);});
 {const ls=spec.parts.filter(s=>!map[s.k]),lu=doc.parts.filter(p=>!used.has(p.id));if(ls.length===1&&lu.length===1)takeP(ls[0],lu[0],true);
  else if(ls.length>1&&ls.length===lu.length&&doc.parts.length===spec.parts.length){const si=ls.map(s=>spec.parts.indexOf(s)),ui=lu.map(p=>doc.parts.indexOf(p));if(si.every((v,i)=>v===ui[i]))ls.forEach((s,i)=>takeP(s,lu[i],true));}}
 spec.parts.forEach(s=>{if(!map[s.k])R.miss.push(`Lebenslinie „${s.name}“`);});
 const msgs=doc.rows.filter(r=>r.kind==='msg');let ptr=0;const taken=new Set();
 spec.msgs.forEach(s=>{R.total++;const A=map[s.a],Bs=[].concat(s.b).map(k=>map[k]).filter(Boolean);const desc=`Nachricht ${byk[s.a].name} → ${byk[[].concat(s.b)[0]].name}: ${s.name}`;
  if(!A||!Bs.length){R.miss.push(desc);return;}
  const m=r=>!taken.has(r.id)&&r.from===A.id&&Bs.some(b=>b.id===r.to)&&kwOk(r.text,s)&&(!s.strict||[].concat(s.type).includes(r.mtype));
  let i=msgs.findIndex((r,j)=>j>=ptr&&m(r)),late=false;if(i<0){i=msgs.findIndex(m);late=i>=0;}
  if(i<0&&s.kw){const later=spec.msgs.slice(spec.msgs.indexOf(s)+1);const free=r=>!taken.has(r.id)&&r.from===A.id&&Bs.some(b=>b.id===r.to)&&(!s.type||[].concat(s.type).includes(r.mtype))&&!later.some(o=>o.kw&&o.a===s.a&&kwOk(r.text,o));
   i=msgs.findIndex((r,j)=>j>=ptr&&free(r));if(i>=0)R.struct.push([msgs[i].text||MT[msgs[i].mtype],s.name]);}
  if(i<0){const j=s.kw?msgs.findIndex(r=>!taken.has(r.id)&&r.to===A.id&&Bs.some(b=>b.id===r.from)&&kwOk(r.text,s)):-1;
   if(j>=0)add('err',`Die Nachricht „${msgs[j].text}“ geht in die falsche Richtung. Der Pfeil zeigt auf den Empfänger.`,msgs[j].id);else R.miss.push(desc);return;}
  const r=msgs[i];taken.add(r.id);R.ok++;if(late)add('tip',`Die Nachricht „${r.text||MT[r.mtype]}“ steht an einer anderen Stelle als in der Musterlösung. Prüfe die Reihenfolge von oben nach unten.`,r.id);else ptr=i+1;
  if(s.type&&!s.strict){R.total++;if([].concat(s.type).includes(r.mtype))R.ok++;else add('err',`Prüfe die Pfeilart bei „${r.text||MT[r.mtype]}“ (${byk[s.a].name} → ${pnName(doc,r.to)}): synchron, asynchron, Antwort, «create» oder «destroy»?`,r.id);}
 });
 if(spec.frags){const cnt={};doc.rows.filter(r=>r.kind==='frag').forEach(r=>cnt[r.op]=(cnt[r.op]||0)+1);Object.entries(spec.frags).forEach(([k,v])=>{R.total++;if(k.split('|').reduce((n,x)=>n+(cnt[x]||0),0)>=v)R.ok++;else R.miss.push(`Fragment „${k}“`);});}
 return R;}
const pnName=(doc,id)=>(doc.parts.find(p=>p.id===id)||{}).name||'?';

/* ----- Textbeschreibungen (für den KI-Tutor und die Lösung in Textform) ----- */
function describe(doc){const L=[];
 if(doc.type==='sq'){L.push('Lebenslinien (von links nach rechts): '+(doc.parts.map(p=>(p.actor?'Akteur ':'')+'"'+p.name+'"').join(', ')||'keine'));L.push('Ablauf (von oben nach unten):');let dep=0,i=1;
  doc.rows.forEach(r=>{if(r.kind==='end'||r.kind==='else')dep=Math.max(0,dep-1);const pad='  '.repeat(dep);
   if(r.kind==='msg')L.push(`${pad}${i++}. ${pnName(doc,r.from)} -> ${pnName(doc,r.to)} [${({sync:'synchron',async:'asynchron',reply:'Antwort (gestrichelt)',create:'create',destroy:'destroy'})[r.mtype]}] "${r.text||''}"`);
   else if(r.kind==='frag')L.push(`${pad}Fragment ${r.op} ${gtxt(r.guard)} {`);else if(r.kind==='else')L.push(`${pad}--- Operand ${gtxt(r.guard)}`);else L.push(`${pad}}`);
   if(r.kind==='frag'||r.kind==='else')dep++;});
  return L.join('\n');}
 const g=G(doc),cont=g.K(['system','lane']);const where=n=>{const c=cont.find(c=>g.inside(n,c));return c?` (in ${KN[c.kind]} "${c.text}")`:(cont.length&&!CONT(n.kind)?' (außerhalb aller Rahmen)':'');};
 L.push('Elemente:');
 doc.nodes.forEach(n=>{let s=`- ${n.stereo?'«'+n.stereo+'» ':''}${KN[n.kind]} "${(n.text||'').replace(/\n/g,' / ')}"`;if(['initial','final','flowfinal','choice','diamond','bar'].includes(n.kind))s=`- ${KN[n.kind]} ${n.id} (Eingänge: ${g.inn(n.id).length}, Ausgänge: ${g.out(n.id).length})`;
  if(!CONT(n.kind))s+=where(n);if(n.kind==='class'){s+=`\n    Attribute: ${linesOf(n.attrs).join('; ')||'—'}\n    Methoden: ${linesOf(n.methods).join('; ')||'—'}`;}L.push(s);});
 L.push('Beziehungen / Kanten:');if(!doc.edges.length)L.push('- keine');
 doc.edges.forEach(e=>{const a=g.by[e.from],b=g.by[e.to];const k=e.kind;let s;
  if(k==='assoc')s=`- "${refName(a)}" —— "${refName(b)}" (Assoziation)`;else if(k==='agg'||k==='comp')s=`- "${refName(a)}" ${k==='agg'?'◇':'◆'}—— "${refName(b)}" (${EK[k].n}, Raute bei "${refName(a)}")`;
  else s=`- "${refName(a)}" --${EK[k].n}--> "${refName(b)}"`;
  if(e.label)s+=` Beschriftung: "${e.label}"`;if(e.m1||e.m2)s+=` Multiplizität: ${e.m1||'?'} bei "${refName(a)}", ${e.m2||'?'} bei "${refName(b)}"`;L.push(s);});
 return L.join('\n');}
function specText(spec,type){const L=[];if(type==='sq'){L.push('Lebenslinien: '+spec.parts.map(p=>(p.actor?'Akteur ':'')+p.name).join(', '));spec.msgs.forEach((m,i)=>L.push(`${i+1}. ${spec.parts.find(p=>p.k===m.a).name} → ${spec.parts.find(p=>p.k===[].concat(m.b)[0]).name}: ${m.name}${m.type?' ('+({sync:'synchron',async:'asynchron',reply:'Antwort',create:'create',destroy:'destroy'})[[].concat(m.type)[0]]+')':''}`));if(spec.frags)L.push('Fragmente: '+Object.keys(spec.frags).join(', '));if(spec.note)L.push(spec.note);return L.join('\n');}
 const by={};spec.nodes.forEach(n=>by[n.k]=n);const nn=k=>k[0]==='@'?({'@initial':'●','@final':'◉'})[k]:by[k].name;
 spec.nodes.forEach(n=>{let s=`${n.st?'«'+n.st+'» ':''}${KN[[].concat(n.kind)[0]]} „${n.name}“`;if(n.lane)s+=` (Swimlane ${by[n.lane].name})`;if(n.attrs)s+=` — Attribute: ${n.attrs.map(a=>[].concat(a)[0]).join(', ')}`;if(n.meth)s+=`; Methoden: ${n.meth.map(a=>[].concat(a)[0]).join(', ')}`;if(n.opt)s+=' (optional)';L.push(s);});
 (spec.edges||[]).forEach(e=>{const k=[].concat(e.kind)[0];let s=k==='assoc'?`${nn(e.a)} —— ${nn(e.b)} (Assoziation)`:(k==='agg'||k==='comp')?`${nn(e.a)} ${k==='agg'?'◇':'◆'}—— ${nn(e.b)} (${EK[k].n}, Raute bei ${nn(e.a)})`:`${nn(e.a)} —${k==='trans'||k==='flow'?'':EK[k].n}→ ${nn(e.b)}`;
  if(e.txt)s+=`: ${e.txt}`;if(e.ma||e.mb)s+=` [${[].concat(e.ma||'?')[0]} bei ${nn(e.a)}, ${[].concat(e.mb||'?')[0]} bei ${nn(e.b)}]`;L.push(s);});
 if(spec.note)L.push(spec.note);return L.join('\n');}

/* ----- Übungsaufgaben ----- */
const sn=(k,kind,name,kw,o)=>Object.assign({k,kind,name,kw},o||{});
const se=(kind,a,b,o)=>Object.assign({kind,a,b},o||{});
const sm=(a,b,name,kw,type,o)=>Object.assign({a,b,name,kw,type},o||{});
const DRAW_TASKS=[
{id:'uc1',type:'uc',lvl:'leicht',t:'Schlüsselsystem',img:'uc_schluessel',
 text:`<p>Für ein elektronisches <b>Schlüsselsystem</b> gilt: <b>Mitarbeiter</b> können Türen <b>öffnen</b> und <b>zuschließen</b>. Ein <b>Administrator</b> kann alles, was ein Mitarbeiter kann, und zusätzlich <b>Türschlösser programmieren</b>. Bei allen drei Vorgängen wird immer eine <b>Berechtigungsprüfung</b> durchgeführt.</p>`,
 spec:{nodes:[sn('sys','system','Schlüsselsystem',['schlüssel']),sn('ma','actor','Mitarbeiter',['mitarbeiter']),sn('ad','actor','Administrator',['admin']),sn('auf','usecase','Tür öffnen',[['öffn','aufschlie','aufsperr']]),sn('zu','usecase','Tür zuschließen',[['schließ','abschlie','verschlie','zusperr']]),sn('pr','usecase','Türschloss programmieren',['programm']),sn('be','usecase','Berechtigungsprüfung',['berechtig'])],
  edges:[se('assoc','ma','auf'),se('assoc','ma','zu'),se('assoc','ad','pr'),se('include','auf','be'),se('include','zu','be'),se('include','pr','be'),se('gen','ad','ma')]}},
{id:'uc2',type:'uc',lvl:'mittel',t:'Banking-App',img:'uc_banking',
 text:`<p>In einer <b>Banking-App</b> kann sich der <b>Kunde</b> anmelden. Dabei wird immer das <b>Passwort überprüft</b>; schlägt die Anmeldung fehl, wird ein <b>Anmeldefehler angezeigt</b>.</p><p>Der Kunde kann außerdem den <b>Saldo prüfen</b>, <b>Mittel übertragen</b> und eine <b>Zahlung leisten</b>. An diesen drei Funktionen ist auch das externe System der <b>Bank</b> beteiligt. Beim Übertragen und beim Zahlen wird immer geprüft, ob <b>ausreichende Mittel</b> vorhanden sind. Eine Zahlung erfolgt entweder <b>vom Girokonto</b> oder <b>vom Sparguthaben</b>.</p>`,
 spec:{nodes:[sn('sys','system','Banking-App',['bank']),sn('ku','actor','Kunde',['kunde']),sn('ba','actor','Bank',['bank']),sn('an','usecase','Anmelden',[['anmeld','login','einlogg']],{not:['fehler']}),sn('pw','usecase','Passwort überprüfen',['passwort']),sn('fe','usecase','Anmeldefehler anzeigen',['fehler']),sn('sa','usecase','Saldo prüfen',[['saldo','kontostand']]),sn('mi','usecase','Mittel übertragen',[['übertrag','überweis']]),sn('au','usecase','Ausreichende Mittel prüfen',[['ausreichend','deckung','genug']]),sn('za','usecase','Zahlung leisten',[['zahlung','zahlen']],{not:['giro','spar']}),sn('gi','usecase','Vom Girokonto bezahlen',['giro']),sn('sp','usecase','Vom Sparguthaben bezahlen',['spar'])],
  edges:[se('assoc','ku','an'),se('assoc','ku','sa'),se('assoc','ku','mi'),se('assoc','ku','za'),se('assoc','ba','sa'),se('assoc','ba','mi'),se('assoc','ba','za'),se('include','an','pw'),se('extend','fe','an'),se('include','mi','au'),se('include','za','au'),se('gen','gi','za'),se('gen','sp','za')]}},
{id:'uc3',type:'uc',lvl:'schwer',t:'TechRent – Geräteverleihsoftware',img:'uc_techrent',
 text:`<ul class="clean"><li>Kunden sollen sich <b>anmelden</b> und verfügbare Geräte <b>suchen</b> können. Gefundene Geräte sollen sie <b>reservieren</b> können (nur angemeldet).</li><li>Kunden können ihre <b>Reservierungen einsehen</b> (nur angemeldet) und, solange das Gerät noch nicht ausgegeben ist, <b>stornieren</b>.</li><li>Die <b>Ausgabe</b> erfolgt durch einen Mitarbeiter, der dabei immer die <b>Reservierung prüft</b>.</li><li>Die <b>Rückgabe</b> übernimmt ein Mitarbeiter; dabei wird immer der <b>Gerätezustand geprüft</b>. Ist das Gerät beschädigt, wird es <b>als defekt gekennzeichnet</b>.</li><li>Mitarbeiter können Geräte <b>anlegen</b> und <b>Gerätedaten bearbeiten</b>.</li></ul>`,
 spec:{nodes:[sn('sys','system','Geräteverleihsoftware',[['verleih','techrent','gerät']]),sn('ku','actor','Kunde',['kunde']),sn('ma','actor','Mitarbeiter',['mitarbeiter']),sn('su','usecase','Geräte suchen',['such']),sn('re','usecase','Gerät reservieren',['reservier'],{not:['storn','einseh','anseh','prüf','anzeig','verwalt']}),sn('ei','usecase','Reservierungen einsehen',['reservierung',['einseh','anseh','anzeig']]),sn('st','usecase','Reservierung stornieren',['storn']),sn('an','usecase','Anmelden',[['anmeld','login','einlogg']]),sn('al','usecase','Gerät anlegen',[['anleg','erfass','hinzufüg']]),sn('be','usecase','Gerätedaten bearbeiten',[['bearbeit','änder']]),sn('ag','usecase','Gerät ausgeben',[['ausgeb','ausgabe']]),sn('rp','usecase','Reservierung prüfen',['reservierung','prüf']),sn('zu','usecase','Gerät zurücknehmen',[['zurück','rückgabe','rücknahme']]),sn('gz','usecase','Gerätezustand prüfen',['zustand']),sn('de','usecase','Gerät als defekt kennzeichnen',[['defekt','schaden','beschädig']])],
  edges:[se('assoc','ku','su'),se('assoc','ku','re'),se('assoc','ku','ei'),se('include','re','an'),se('include','ei','an'),se('extend','st','ei'),se('assoc','ma','al'),se('assoc','ma','be'),se('assoc','ma','ag'),se('assoc','ma','zu'),se('include','ag','rp'),se('include','zu','gz'),se('extend','de','zu')],
  note:'Bei den beiden «extend»: Notiz mit Condition {nicht ausgegeben} bzw. {Gerät beschädigt}.'}},
{id:'cl1',type:'cl',lvl:'leicht',t:'Yachthafen – Einkaufslisten',img:'cl_yacht',
 text:`<p>Für den Yachthafen-Shop: Eine <b>Einkaufsliste</b> hat eine <code>ListenID</code> (long) und enthält beliebig viele <b>Artikel</b>. Artikel existieren auch ohne Einkaufsliste weiter. Ein Artikel hat <code>ArtikelID</code> (long), <code>Bezeichnung</code> (String) und <code>Preis</code> (double). <b>Kleidung</b> ist ein spezieller Artikel mit zusätzlicher <code>Größe</code> (String).</p>`,
 spec:{nodes:[sn('ek','class','Einkaufsliste',['einkauf'],{attrs:['id']}),sn('ar','class','Artikel',['artikel'],{attrs:['id','bezeichnung','preis']}),sn('kl','class','Kleidung',['kleidung'],{attrs:[['größe','size']]})],
  edges:[se('agg','ek','ar',{ma:['1','0..1','0..*'],mb:['0..*','1..*']}),se('gen','kl','ar')]}},
{id:'cl2',type:'cl',lvl:'mittel',t:'Fahrzeugvermietung (alle Beziehungstypen)',
 text:`<ul class="clean"><li>Ein <b>Fuhrpark</b> enthält mehrere <b>Fahrzeuge</b>. Wird der Fuhrpark aufgelöst, existieren die Fahrzeuge weiter.</li><li><b>Fahrzeug</b> ist abstrakt: Attribut <code>kennzeichen : String</code>, Methode <code>istVerfuegbar() : boolean</code>.</li><li><b>Auto</b> und <b>Motorrad</b> sind Fahrzeuge. Ein Auto hat zusätzlich <code>anzahlTueren : int</code>.</li><li>Das Interface <b>Mietbar</b> gibt <code>mieten() : void</code> vor. Die Klasse Auto setzt dieses Interface um.</li><li>Ein Auto besteht aus genau einem <b>Motor</b>; ohne Auto gibt es den Motor im Modell nicht.</li><li>Ein <b>Kunde</b> (<code>name : String</code>) leiht beliebig viele Fahrzeuge; ein Fahrzeug ist höchstens an einen Kunden verliehen.</li></ul>`,
 spec:{nodes:[sn('fp','class','Fuhrpark',['fuhrpark']),sn('fz','class','Fahrzeug',['fahrzeug'],{st:'abstract',attrs:['kennzeichen'],meth:['verf']}),sn('mr','class','Motorrad',['motorrad']),sn('au','class','Auto',['auto'],{attrs:['tür']}),sn('mi','class','Mietbar',['mietbar'],{st:'interface',meth:['mieten']}),sn('mo','class','Motor',['motor'],{not:['motorrad']}),sn('ku','class','Kunde',['kunde'],{attrs:['name']})],
  edges:[se('agg','fp','fz'),se('gen','au','fz'),se('gen','mr','fz'),se('real','au','mi'),se('comp','au','mo',{mb:['1']}),se('assoc','ku','fz',{ma:['0..1'],mb:['0..*']})]}},
{id:'cl3',type:'cl',lvl:'schwer',t:'TechRent – Klassendiagramm',img:'cl_techrent',
 text:`<ul class="clean"><li><b>Kunde</b>: eindeutige Kundennummer, Name, E-Mail; Kontaktdaten sollen geändert werden können.</li><li><b>Gerät</b>: Inventarnummer, Hersteller, Modell, Status; die Software soll prüfen können, ob ein Gerät verfügbar ist.</li><li><b>Laptop</b>: zusätzlich Arbeitsspeicher und Displaygröße. <b>Beamer</b>: Lichtstärke (Lumen) und Auflösung.</li><li><b>Reservierung</b>: Beginn und Ende; kann storniert werden.</li><li><b>Ausleihe</b>: Ausleihdatum, geplanter Rückgabetermin, tatsächliches Rückgabedatum.</li><li>Ein Kunde kann mehrere Reservierungen und Ausleihen haben; ein Gerät kann mehrfach reserviert und ausgeliehen werden. Eine Reservierung oder Ausleihe gehört zu genau einem Kunden und einem Gerät.</li></ul>`,
 spec:{nodes:[sn('ku','class','Kunde',['kunde'],{attrs:[['nummer','nr','id'],'name','mail'],meth:[['änder','kontakt','setz','set']]}),sn('ge','class','Gerät',['gerät'],{attrs:['inventar','hersteller','modell','status'],meth:['verf']}),sn('la','class','Laptop',[['laptop','notebook']],{attrs:[['arbeitsspeicher','ram'],'display']}),sn('bm','class','Beamer',['beamer'],{attrs:[['licht','lumen'],'auflösung']}),sn('re','class','Reservierung',['reservierung'],{attrs:[['beginn','start','von'],['ende','bis']],meth:['storn']}),sn('al','class','Ausleihe',['ausleihe'],{attrs:[['ausleihdatum','datum'],['rückgabe']]})],
  edges:[se('gen','la','ge'),se('gen','bm','ge'),se('assoc','ku','re',{ma:['1'],mb:['0..*']}),se('assoc','ge','re',{ma:['1'],mb:['0..*']}),se('assoc','ku','al',{ma:['1'],mb:['0..*']}),se('assoc','ge','al',{ma:['1'],mb:['0..*']})]}},
{id:'st1',type:'st',lvl:'leicht',t:'Auto (Informationsblatt)',
 text:`<p>Modelliere die Zustände eines <b>Autos</b>: Zu Beginn ist es <b>ausgeschaltet</b>. Durch <code>motorStarten()</code> wird es <b>fahrbereit</b>. Aus „fahrbereit“ kann man <code>losfahren</code>, aber nur wenn der Tankfüllstand größer 0 ist; dabei wird der Fahrtbeginn gespeichert. Das Auto ist dann <b>unterwegs</b>. Durch <code>anhalten</code> wird es wieder fahrbereit. Aus „fahrbereit“ kann der Motor ausgeschaltet werden.</p>`,
 spec:{nodes:[sn('a','state','ausgeschaltet',[['aus']]),sn('f','state','fahrbereit',[['bereit']]),sn('u','state','unterwegs',[['unterwegs','fahr']])],
  edges:[se('trans','@initial','a'),se('trans','a','f',{lab:[['start','ein']],txt:'motorStarten()'}),se('trans','f','u',{lab:[['fahr'],['tank']],txt:'losfahren [Tankfüllstand > 0] / Fahrtbeginn speichern'}),se('trans','u','f',{lab:[['halt','stop','brems']],txt:'anhalten'}),se('trans','f','a',{lab:[['aus','abstell','stopp']],txt:'motorAusschalten()'})]}},
{id:'st2',type:'st',lvl:'mittel',t:'TechRent – Zustände eines Geräts',big:'stGeraet',
 text:`<p>Herr Müller: „Ein neues Gerät ist nach der Freigabe <b>verfügbar</b>. Reserviert ein Kunde es, gilt es als <b>reserviert</b>; die Reservierung kann auch storniert werden. Wird es ausgegeben, ist es <b>ausgeliehen</b>. Wird es ordnungsgemäß zurückgegeben, ist es wieder verfügbar. Wird bei der Rückgabe ein Schaden festgestellt, ist es <b>defekt</b> und wird zur Reparatur gegeben; währenddessen ist es <b>in Wartung</b>. Erst nach abgeschlossener Reparatur und Prüfung ist es wieder verfügbar.“</p>`,
 spec:{nodes:[sn('v','state','verfügbar',['verfügbar']),sn('r','state','reserviert',['reserviert']),sn('a','state','ausgeliehen',[['ausgeliehen','verliehen','ausgegeben']]),sn('d','state','defekt',[['defekt','beschädigt']]),sn('w','state','in Wartung',[['wartung','reparatur']])],
  edges:[se('trans','@initial','v'),se('trans','v','r',{lab:[['reservier']],txt:'reservieren'}),se('trans','r','v',{lab:[['storn','aufheb','abbrech']],txt:'stornieren'}),se('trans','r','a',{lab:[['ausgeb','ausgabe','ausleih','abhol']],txt:'ausgeben'}),se('trans','a','v',{lab:[['zurück','rückgabe']],txt:'zurückgeben [kein Schaden]'}),se('trans','a','d',{lab:[['schaden','beschädig','defekt']],txt:'zurückgeben [Schaden festgestellt]'}),se('trans','d','w',{lab:[['repar','wartung']],txt:'zur Reparatur geben'}),se('trans','w','v',{lab:[['abgeschlossen','fertig','repar','freigeb','geprüft','prüf']],txt:'Reparatur abgeschlossen [geprüft]'})]}},
{id:'st3',type:'st',lvl:'mittel',t:'Roboter (05_LAB)',
 text:`<ul class="clean"><li>Nach dem Einschalten führt der Roboter eine <b>Initialisierung</b> durch.</li><li>Danach macht er einen Self-Check: Ist das Ergebnis „OK“, geht er in den <b>Stand-By</b>-Modus, ansonsten in den <b>Error</b>-Modus, in dem er bleibt, bis er abgeschaltet wird.</li><li>Im Stand-By bleibt er, bis er abgeschaltet wird oder einen Auftrag erhält. Mit Auftrag wechselt er in den Modus <b>In Arbeit</b>; danach wieder zurück in Stand-By.</li><li>Tritt bei der Abarbeitung ein Fehler auf, wechselt er in den Error-Modus.</li></ul>`,
 spec:{nodes:[sn('i','state','Initialisierung',['init']),sn('s','state','Stand-By',[['stand','bereit']]),sn('a','state','In Arbeit',[['arbeit','betrieb']]),sn('e','state','Error',[['error','fehler']])],
  edges:[se('trans','@initial','i',{txt:'einschalten'}),se('trans','i','s',{lab:[['ok']],txt:'Self-Check [OK]'}),se('trans','i','e',{lab:[['nicht','else','fehler','!','nok']],txt:'Self-Check [nicht OK]'}),se('trans','s','a',{lab:[['auftrag']],txt:'Auftrag erhalten'}),se('trans','a','s',{lab:[['fertig','erledigt','abgeschlossen','abgearbeitet','beendet']],txt:'Auftrag abgearbeitet'}),se('trans','a','e',{lab:[['fehler','error']],txt:'Fehler aufgetreten'}),se('trans','s','@final',{lab:[['abschalt','aus']],txt:'abschalten'}),se('trans','e','@final',{lab:[['abschalt','aus']],txt:'abschalten'})]}},
{id:'st4',type:'st',lvl:'schwer',t:'Datei (05_LAB, mit Selbsttransitionen)',
 text:`<p>„Nach dem <b>Anlegen</b> einer Datei muss diese zum Lesen bzw. Schreiben geöffnet werden. Soll in eine Datei etwas geschrieben werden, erhält sie den Status <b>entsperrt</b>. Beim Lesen gilt sie nur als <b>geöffnet</b>. Das Lesen und Schreiben kann so lange wiederholt werden, bis sie <b>geschlossen</b> wird; dabei bleibt ihr aktueller Status bestehen. Eine geschlossene Datei kann auch gelöscht werden.“</p>`,
 spec:{nodes:[sn('a','state','angelegt',[['angelegt','erstellt','neu']]),sn('o','state','geöffnet',['geöffnet']),sn('e','state','entsperrt',['entsperrt']),sn('g','state','geschlossen',['geschlossen'])],
  edges:[se('trans','@initial','a',{txt:'anlegen'}),se('trans','a','o',{lab:[['les','öffn']],txt:'öffnen [lesen]'}),se('trans','a','e',{lab:[['schreib','öffn']],txt:'öffnen [schreiben]'}),se('trans','o','o',{lab:[['les']],txt:'lesen (Selbsttransition)'}),se('trans','e','e',{lab:[['schreib']],txt:'schreiben (Selbsttransition)'}),se('trans','o','g',{lab:[['schlie','zu']],txt:'schließen'}),se('trans','e','g',{lab:[['schlie','zu']],txt:'schließen'}),se('trans','g','@final',{lab:[['lösch']],txt:'löschen'})]}},
{id:'ac1',type:'ac',lvl:'leicht',t:'Kaffeekochen mit Maschine',img:'ac_kaffee',
 text:`<ol><li>Start</li><li>Wasser einfüllen</li><li>Kaffeefilter einsetzen</li><li>Entscheidung: Ist genug Kaffee im Behälter? Ja → Maschine starten. Nein → Kaffee nachfüllen, danach Maschine starten.</li><li>Warten, bis die Maschine fertig ist</li><li>Kaffee genießen</li><li>Ende</li></ol>`,
 spec:{nodes:[sn('w','action','Wasser einfüllen',['wasser']),sn('f','action','Kaffeefilter einsetzen',['filter']),sn('n','action','Kaffee nachfüllen',['nachfüll']),sn('s','action','Maschine starten',[['start','einschalt']]),sn('wa','action','Warten bis fertig',['wart']),sn('g','action','Kaffee genießen',[['genie','trink']])],
  edges:[se('flow','@initial','w'),se('flow','w','f'),se('flow','f','s',{lab:[['genug','ja','ausreichend','vorhanden','else']],txt:'[genug Kaffee]'}),se('flow','f','n',{lab:[['nicht','nein','else','wenig','kein']],txt:'[nicht genug Kaffee]'}),se('flow','n','s'),se('flow','s','wa'),se('flow','wa','g'),se('flow','g','@final')],need:{decision:1,merge:1}}},
{id:'ac2',type:'ac',lvl:'mittel',t:'Flughafen – Check-in',img:'ac_flughafen',
 text:`<p>Ein <b>Fluggast</b> ist am Flughafen angekommen. Zur Überprüfung seines Tickets begibt er sich zum Schalter der Fluggesellschaft (<b>Passagierabfertigung</b>). Falls das Ticket in Ordnung ist, übergibt er am Schalter sein Gepäck. Falls mit dem Ticket etwas nicht stimmt, muss der Fluggast den Kundendienst konsultieren und kann nicht mitfliegen.</p><p>Das Gepäck wird zudem auf Übergewicht überprüft. Falls dem so ist, muss der Fluggast zusätzliche Kosten übernehmen. Falls das Gewicht in Ordnung ist, wird die Bordkarte ausgestellt.</p><p>Verwende zwei Swimlanes: Fluggast und Passagierabfertigung.</p>`,
 spec:{nodes:[sn('lf','lane','Fluggast',[['fluggast','passagier','gast']],{not:['abfertig']}),sn('lp','lane','Passagierabfertigung',[['abfertig','schalter','gesellschaft','airline']]),sn('tz','action','Ticket am Schalter zeigen',['ticket',['zeig','vorleg','geb','abgeb']],{lane:'lf'}),sn('tp','action','Ticket überprüfen',['ticket',['prüf','kontroll']],{lane:'lp'}),sn('kd','action','Kundendienst konsultieren',['kundendienst'],{lane:'lf'}),sn('gp','action','Gepäck überreichen',['gepäck'],{not:['gewicht','wieg'],lane:'lf'}),sn('gw','action','Gewicht überprüfen',[['gewicht','wieg']],{lane:'lp'}),sn('ko','action','Zusätzliche Kosten übernehmen',[['kosten','zahl','gebühr']],{lane:'lf'}),sn('bk','action','Bordkarte ausstellen',['bordkarte'],{lane:'lp'})],
  edges:[se('flow','@initial','tz'),se('flow','tz','tp'),se('flow','tp','kd',{lab:[['nicht','else','ungültig','fehler']],txt:'[Ticket nicht in Ordnung]'}),se('flow','tp','gp',{lab:[['ordnung','ok','gültig','else']],txt:'[Ticket in Ordnung]'}),se('flow','gp','gw'),se('flow','gw','ko',{lab:[['übergewicht','schwer','else','nicht']],txt:'[Übergewicht]'}),se('flow','gw','bk',{lab:[['ordnung','ok','kein','else','nicht']],txt:'[Gewicht in Ordnung]'}),se('flow','ko','bk'),se('flow','bk','@final'),se('flow','kd','@final')],need:{decision:2,merge:1}}},
{id:'ac3',type:'ac',lvl:'schwer',t:'TechRent – Aktivität „Gerät reservieren“',img:'ac_techrent',
 text:`<p>Der Kunde wählt im <b>Frontend</b> ein Gerät, gibt den Zeitraum ein und sendet die Reservierungsanfrage ab. Das <b>Backend</b> prüft die Eingaben: Fehlen Angaben oder ist der Zeitraum ungültig, zeigt das Frontend eine Fehlermeldung; der Kunde korrigiert die Angaben und sendet erneut.</p><p>Stimmen die Angaben, fragt das Backend die <b>Datenbank</b> nach der Verfügbarkeit. Ist das Gerät nicht verfügbar, zeigt das Frontend eine Meldung an und der Kunde wählt ein anderes Gerät. Ist es verfügbar, legt das Backend die Reservierung an und die Datenbank speichert sie.</p><p>Danach laufen <b>parallel</b>: Bestätigung im Frontend anzeigen und Bestätigungs-E-Mail über den <b>Benachrichtigungsdienst</b> versenden. Der Vorgang ist abgeschlossen, wenn beide Teilabläufe beendet sind.</p>`,
 spec:{nodes:[sn('lfe','lane','Frontend',['frontend']),sn('lbe','lane','Backend / API',[['backend','api']]),sn('ldb','lane','Datenbank',[['datenbank','db','database']]),sn('lbn','lane','Benachrichtigungsdienst',[['benachricht','mail','notif']]),
   sn('ga','action','Gerät auswählen',[['auswähl','wähl']],{lane:'lfe'}),sn('ze','action','Zeitraum eingeben',['zeitraum'],{lane:'lfe'}),sn('ab','action','Reservierungsanfrage absenden',[['absend','send']],{not:['mail','versand'],lane:'lfe'}),sn('ep','action','Eingaben prüfen',[['eingabe','angabe','anfrage'],['prüf','validier']],{lane:'lbe'}),sn('fm','action','Fehlermeldung anzeigen',['fehler'],{lane:'lfe'}),sn('ak','action','Angaben korrigieren',['korrigier'],{lane:'lfe'}),sn('vp','action','Verfügbarkeit abfragen',['verfügbar'],{not:['nicht','meldung','antwort','ermittel']}),sn('nv','action','Meldung „nicht verfügbar“ anzeigen',['nicht',['anzeig','zeig','meld','hinweis']],{lane:'lfe'}),sn('ra','action','Reservierung anlegen',['reservierung',['anleg','erstell','erzeug']],{lane:'lbe'}),sn('rs','action','Reservierung speichern',['speicher'],{lane:'ldb'}),sn('ba','action','Bestätigung anzeigen',['bestätigung'],{not:['mail'],lane:'lfe'}),sn('em','action','Bestätigungs-E-Mail versenden',['mail'],{lane:'lbn'})],
  edges:[se('flow','@initial','ga'),se('flow','ga','ze'),se('flow','ze','ab'),se('flow','ab','ep'),se('flow','ep','fm',{lab:[['fehl','ungültig','nicht','else']],txt:'[Angaben fehlen oder Zeitraum ungültig]'}),se('flow','fm','ak'),se('flow','ak','ab',{txt:'Schleife zurück (über Merge)'}),se('flow','ep','vp',{lab:[['vollständig','gültig','ok','else','korrekt']],txt:'[Angaben vollständig und gültig]'}),se('flow','vp','nv',{lab:[['nicht','else']],txt:'[Gerät nicht verfügbar]'}),se('flow','vp','ra',{lab:[['verfügbar','else']],txt:'[Gerät verfügbar]'}),se('flow','ra','rs'),se('flow','rs','ba',{txt:'über Fork'}),se('flow','rs','em',{txt:'über Fork'}),se('flow','ba','@final',{txt:'über Join'}),se('flow','em','@final',{txt:'über Join'})],need:{decision:2,merge:1,fork:1,join:1}}},
{id:'sq1',type:'sq',lvl:'leicht',t:'API-Abfrage (06_LAB)',
 text:`<p>Datenabfrage von einem API-Server: Der <b>Client</b> sendet einen <code>API-Request</code> mit Username und Password an den <b>API-Server</b> (synchron). Der Server lässt Username und Password von der <b>Database</b> validieren; die Database antwortet mit „Data OK“. Danach bearbeitet der Server die Anfrage intern (<code>handle request</code>) und schickt dem Client die <code>API-Response</code> zurück.</p>`,
 spec:{parts:[{k:'c',name:'Client',kw:['client']},{k:'s',name:':API-Server',kw:[['server','api']]},{k:'d',name:':Database',kw:[['database','datenbank','db']]}],
  msgs:[sm('c','s','API-Request(username, password)',[['request','anfrage']],['sync']),sm('s','d','validate(username, password)',[['valid','prüf','check']],['sync']),sm('d','s','Data OK',null,['reply']),sm('s','s','handle request',[['handle','bearbeit','verarbeit']],['sync']),sm('s','c','API-Response',[['response','antwort','result','ergebnis']],['reply'])]}},
{id:'sq2',type:'sq',lvl:'mittel',t:'Navigations-App (06_LAB)',
 text:`<ul class="clean"><li>Zunächst aktiviert der <b>Bootsführer</b> die <b>App</b> durch einen asynchronen Aufruf.</li><li>Die App sendet eine Anfrage an den Bootsführer nach dem Zielgewässer, welches dieser als Antwort eingibt.</li><li>Daraufhin fragt die App mögliche Routen bei der <b>Datenbank</b> ab.</li><li>Nach Erhalt der Routen zeigt die App diese dem Bootsführer an, welcher als Antwort eine Route auswählt.</li><li>Daraufhin fragt die App die Navigationsdaten der Route bei der Datenbank ab und zeigt diese dem Bootsführer an.</li></ul>`,
 spec:{parts:[{k:'b',name:'Bootsführer',kw:[['boot','führer','nutzer','user','benutzer']],actor:true},{k:'a',name:':App',kw:['app']},{k:'d',name:':Datenbank',kw:[['datenbank','db','database']]}],
  msgs:[sm('b','a','aktivieren',[['aktiv','start','öffn']],['async']),sm('a','b','Zielgewässer anfragen',[['ziel']],['sync']),sm('b','a','Zielgewässer',null,['reply'],{strict:true}),sm('a','d','Routen abfragen',[['route']],['sync']),sm('d','a','Routen',null,['reply'],{strict:true}),sm('a','b','Routen anzeigen',[['route']],['sync']),sm('b','a','ausgewählte Route',null,['reply'],{strict:true}),sm('a','d','Navigationsdaten abfragen',[['navi','daten']],['sync']),sm('d','a','Navigationsdaten',null,['reply'],{strict:true}),sm('a','b','Navigationsdaten anzeigen',[['navi','daten','anzeig']],['sync','async'])]}},
{id:'sq3',type:'sq',lvl:'mittel',t:'E-Mail erzeugen und senden (create / destroy)',
 text:`<p>Ein <b>Benutzer</b> legt mithilfe des <b>Programms</b> eine neue E-Mail-Datei an (das <b>E-Mail</b>-Objekt wird dabei erzeugt). Über diesen Vorgang erhält er vom Programm eine Nachricht. Danach schreibt er einen Text in die Mail und beauftragt das Programm, die E-Mail zu senden. Mit dem Versand wird das E-Mail-Objekt automatisch vom Programm gelöscht und der Benutzer über den Versand informiert.</p>`,
 spec:{parts:[{k:'b',name:'Benutzer',kw:[['benutzer','user','nutzer']],actor:true},{k:'p',name:':Programm',kw:[['programm','client','app']]},{k:'m',name:':EMail',kw:['mail']}],
  msgs:[sm('b','p','neue E-Mail anlegen',[['anleg','neu','erstell','erzeug']],['sync']),sm('p','m','«create»',null,['create'],{strict:true}),sm('p','b','Nachricht: angelegt',null,['reply'],{strict:true}),sm('b',['p','m'],'Text schreiben',[['schreib','text','eingab','inhalt']],['sync']),sm('b','p','E-Mail senden',[['send']],['sync']),sm('p','m','«destroy»',null,['destroy'],{strict:true}),sm('p','b','Versand-Info',null,['reply'],{strict:true})]}},
{id:'sq4',type:'sq',lvl:'schwer',t:'TechRent – Sequenz „Gerät reservieren“',img:'sq_techrent',
 text:`<p>Der <b>Kunde</b> wählt im <b>Frontend</b> Gerät und Zeitraum und klickt „Reservieren“. Das Frontend ruft <code>reservieren(geraetId, von, bis)</code> am <b>Backend</b> auf. Das Backend prüft die Angaben (intern) und fragt die <b>Datenbank</b> nach der Verfügbarkeit (Rückgabe Boolean).</p><ul class="clean"><li><b>Nicht verfügbar:</b> Antwort ans Frontend, Hinweis für den Kunden.</li><li><b>Verfügbar:</b> Die Datenbank speichert die Reservierung und bestätigt. Danach <b>unabhängig voneinander</b>: Erfolg ans Frontend und Bestätigung für den Kunden; und <b>falls</b> E-Mail-Benachrichtigung aktiviert ist, ein <b>asynchroner</b> Auftrag an den <b>Benachrichtigungsdienst</b>.</li></ul>`,
 spec:{parts:[{k:'k',name:'Kunde',kw:['kunde'],actor:true},{k:'f',name:':Frontend',kw:['frontend']},{k:'b',name:':Backend',kw:[['backend','api']]},{k:'d',name:':Datenbank',kw:[['datenbank','db','database']]},{k:'n',name:':Benachrichtigungsdienst',kw:[['benachricht','mail','notif']]}],
  msgs:[sm('k','f','Gerät + Zeitraum wählen, „Reservieren“ klicken',null,['sync','async']),sm('f','b','reservieren(geraetId, von, bis)',[['reservier']],['sync']),sm('b','b','angabenPruefen(...)',[['prüf','pruef','valid']],['sync']),sm('b','d','verfuegbarkeitPruefen(...)',[['verf']],['sync']),sm('d','b','verfuegbar: Boolean',null,['reply'],{strict:true}),sm('b','d','reservierungSpeichern(reservierung)',[['speicher']],['sync']),sm('d','b','gespeichert: Boolean',null,['reply'],{strict:true}),sm('b','f','Erfolg: reservierung',null,['reply'],{strict:true}),sm('f','k','Bestätigung anzeigen',[['bestätig','erfolg','anzeig']],['sync','reply','async']),sm('b','n','bestaetigungsmailSenden(reservierung)',null,['async']),sm('b','f','nicht verfügbar',[['nicht']],['reply']),sm('f','k','Hinweis: anderes Gerät oder Zeitraum',[['hinweis','nicht','ander','meld']],['sync','reply','async'])],
  frags:{alt:1,par:1,opt:1},note:'Struktur: alt [Gerät verfügbar] / [else]; darin par; im zweiten Operanden opt [E-Mail-Benachrichtigung aktiviert]. Vertiefung: loop(1,3) [Versand fehlgeschlagen].'}}
];
