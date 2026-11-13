import base64,glob,os,re,json,sys
D=os.path.dirname(os.path.abspath(__file__))
R=lambda f:open(os.path.join(D,f),encoding='utf-8').read()
t=R('template.html')
def rep(a,b,cnt=1):
    global t
    assert t.count(a)>=1,('missing',a[:80])
    t=t.replace(a,b) if cnt==0 else t.replace(a,b,cnt)
# --- Navigation / Routing
rep("h+=b('which','🧭 Welches Diagramm?');","h+=b('draw','✏️ Praxis: zeichnen');\n  h+=b('bank','📚 Aufgabenpool');\n  h+=b('which','🧭 Welches Diagramm?');")
rep("h+=b('exam','📝 Probeprüfung');","h+=b('exam','📝 Prüfung mit Timer');")
rep("if(r.page==='cards')return renderCards();","if(r.page==='cards')return renderCards();\n  if(r.page==='draw')return renderDraw();\n  if(r.page==='bank')return renderBank();")
rep("if(r.page==='exam')return renderExam();","if(r.page==='exam')return renderExam2();")
rep("h+=b('cards','🃏 Lernkarten (Glossar)');","h+=b('cards','🃏 Lernkarten (Wiederholung)');\n  h+=b('weak','🎯 Schwachstellen');\n  h+=`<div class=\"navgroup\">Daten</div>`;\n  h+=b('data','💾 Sicherung');")
rep("if(r.page==='cards')return renderCards();","if(r.page==='cards')return renderLeit();\n  if(r.page==='weak')return renderWeak();\n  if(r.page==='data')return renderData();")
rep("document.addEventListener('keydown',e=>{if(route.page==='cards'){","document.addEventListener('keydown',e=>{if(route.page==='cards-old'){")
rep("      if(o.ok)score++;else{b.classList.add('bad');","      if(typeof qStat==='function')qStat(q,o.ok);\n      if(o.ok)score++;else{b.classList.add('bad');")
rep("  h+=`<div class=\"grid\">`+MODULES.map(m=>`<div class=\"tile\"","  h+=todayCard();\n  h+=`<div class=\"grid\">`+MODULES.map(m=>`<div class=\"tile\"")
rep("function render(){\n  renderNav();","function render(){\n  renderNav();\n  $('#main').style.maxWidth=route.page==='draw'?'1440px':'';")
rep("  route=m?{page:'mod',mod:p,tab:tab||'theory'}:{page:p};","  if(typeof leavePage==='function')leavePage();\n  route=m?{page:'mod',mod:p,tab:tab||'theory'}:{page:p};")
# --- Startseite
rep("  h+=`<h2>Spickzettel: Welches Diagramm für welche Frage</h2>","  h+=`<div class=\"card\" style=\"border-left:4px solid var(--accent)\"><h3 style=\"margin-top:0\">✏️ Praxis: Zeichne das Diagramm selbst</h3><p>Editor für alle fünf Diagrammtypen und ${DRAW_TASKS.length} Aufgaben: aus deinen Arbeitsblättern und neue im Prüfungsstil. Der Prüf-Bot findet Notationsfehler und vergleicht deine Zeichnung mit der Lösung, der KI-Tutor erklärt die Fehler.</p><p style=\"margin:0\"><button class=\"btn primary\" onclick=\"go('draw')\">Praxis öffnen</button></p></div>`;\n  h+=`<div class=\"card\" style=\"border-left:4px solid var(--ac)\"><h3 style=\"margin-top:0\">📚 Aufgabenpool und Prüfung</h3><p>${bankTotal()} Aufgaben in den Formaten von Klassenarbeiten und AP2: zeichnen, ergänzen, Diagramm lesen, Fehler finden, schriftlich antworten. In jedem Thema gibt es die Reiter <b>Vertiefung</b> und <b>In der Prüfung</b> mit Lösungsplan und fertigen Formulierungen.</p><p class=\"row\" style=\"margin:0\"><button class=\"btn primary\" onclick=\"go('bank')\">Aufgabenpool</button><button class=\"btn\" onclick=\"go('exam')\">Prüfung mit Timer</button></p></div>`;\n  h+=`<h2>Spickzettel: Welches Diagramm für welche Frage</h2>")
rep("löse die <b>Aufgabe</b> auf Papier, öffne danach die Lösung.","löse die <b>Aufgabe</b>: Zeichne sie im Bereich <b>Praxis</b> und lass sie vom Prüf-Bot kontrollieren.")
rep("""<button class="btn" onclick="if(confirm('Gesamten Fortschritt zurücksetzen?')){store={best:{},comp:{},seen:{}};save();render();}">Fortschritt zurücksetzen</button>""",
    """<button class="btn" onclick="resetAll(this)">Fortschritt zurücksetzen</button>""")
rep("const TABS=[","function resetAll(b){if(b.dataset.sure){store={best:{},comp:{},seen:{},draw:{},drawBest:{},custom:{},lastTask:{},bank:{},openAns:{},stat:{},qs:{},leit:{},examHist:[]};Pz.doc=null;Pz.key=null;Bk.ans={};Lt.queue=null;save();render();}else{b.dataset.sure=1;b.textContent='Noch einmal klicken: Fortschritt und alle Zeichnungen werden gelöscht';setTimeout(()=>{if(b.isConnected){delete b.dataset.sure;b.textContent='Fortschritt zurücksetzen';}},4000);}}\nconst TABS=[")
rep("const TABS=[['theory','Theorie'],['notation','Notation'],","const TABS=[['theory','Theorie'],['deep','Vertiefung'],['notation','Notation'],")
rep("['mistakes','Fehler'],['quiz','Test'],","['mistakes','Fehler'],['examg','In der Prüfung'],['quiz','Test'],")
rep("  if(route.tab==='theory')c.innerHTML=`<div class=\"card\">${m.theory}</div>`;","  if(route.tab==='theory')c.innerHTML=`<div class=\"card\">${m.theory}</div><p class=\"hint\">Das ist die Kurzfassung. Die ausführliche Darstellung mit Tabellen und Beispielen findest du im Reiter <a href=\"#\" onclick=\"go('${m.id}','deep');return false\">Vertiefung</a>.</p>`;\n  if(route.tab==='deep')c.innerHTML=EXTRA[m.id].deep;\n  if(route.tab==='examg')c.innerHTML=modExamTab(m);")
# --- Reiter "Aufgaben" im Modul
rep("if(route.tab==='tasks')c.innerHTML=m.tasks.map(","if(route.tab==='tasks')c.innerHTML=`<div class=\"tip\" style=\"margin-top:14px\">Diese Aufgaben musst du nicht nur auf Papier lösen. <button class=\"btn primary\" style=\"margin-left:6px\" onclick=\"goDraw('${m.id}')\">✏️ ${m.de} im Editor zeichnen</button> <button class=\"btn\" onclick=\"goBank('${m.id}','draw')\">📚 Alle Aufgaben zum Thema</button></div>`+m.tasks.map(")
# --- Farb-Token für Text auf Akzentfarbe
assert t.count("--accent:#2f5bd3;")==1 and t.count("--accent:#7d9cff;")==2
t=t.replace("--accent:#2f5bd3;","--accent:#2f5bd3; --on-accent:#ffffff;").replace("--accent:#7d9cff;","--accent:#7d9cff; --on-accent:#10131c;")
rep(".btn.primary{background:var(--accent);color:#fff;",".btn.primary{background:var(--accent);color:var(--on-accent);")
# --- CSS
css=R('practice.css')+"""
.app{padding-left:env(safe-area-inset-left,0px);padding-right:env(safe-area-inset-right,0px)}
main{padding-left:max(36px,env(safe-area-inset-left,0px));padding-right:max(36px,env(safe-area-inset-right,0px));min-width:0}
details summary{cursor:pointer}
.lcard{max-width:680px;margin-left:auto;margin-right:auto}
.lfront{font-size:24px;font-weight:700;text-align:center;padding:26px 8px 10px;overflow-wrap:anywhere}
.lback{border-top:1px dashed var(--line);margin-top:14px;padding-top:14px;text-align:center}
.lback svg{max-width:100%;height:auto}
#imgbox .figure img{max-width:100%;height:auto;background:#fff;border-radius:8px}
textarea#exptext,textarea#imptext{width:100%;box-sizing:border-box;font:12px/1.4 ui-monospace,Consolas,monospace;background:var(--card);color:var(--ink);border:1px solid var(--line);border-radius:9px;padding:8px}
@media (max-width:820px){main{padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}nav.side{padding-left:16px;padding-right:16px}}
"""
rep("</style>",css+"</style>")
# --- JavaScript
import os as _o
js=''.join(R(f) for f in ['practice.js','sqmouse.js','check.js','engine2.js','tasks2.js','content2a.js','content2b.js','content2c.js','page.js','bank.js','review.js'] if _o.path.exists(_o.path.join(D,f)))
i=t.rindex("\nrender();\n</script>")
t=t[:i]+"\n"+js+t[i:]
# --- Bilder
imgs={}
for f in sorted(glob.glob(os.path.join(D,'..','img','*.png'))):
    imgs[os.path.splitext(os.path.basename(f))[0]]='data:image/png;base64,'+base64.b64encode(open(f,'rb').read()).decode()
assert '/*IMAGES*/{}' in t
t=t.replace('/*IMAGES*/{}',json.dumps(imgs))
ROOT=os.path.join(D,'..')
open(os.path.join(ROOT,'UML-Trainer.html'),'w',encoding='utf-8').write(t)
# --- Online-Variante (Artifact): nur der Inhalt von <body>
title=re.search(r'<title>.*?</title>',t,re.S).group(0)
style=re.search(r'<style>.*?</style>',t,re.S).group(0)
body=re.search(r'<body>(.*)</body>',t,re.S).group(1)
os.makedirs(os.path.join(ROOT,'build','artifact'),exist_ok=True)
open(os.path.join(ROOT,'build','artifact','UML-Trainer.html'),'w',encoding='utf-8').write(title+'\n<meta name="claude:viewport-fit-sides" content="cover">\n'+style+'\n'+body)
print('local',len(t),'images',list(imgs))
