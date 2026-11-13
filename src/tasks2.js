
/* ================= MEHR ZEICHENAUFGABEN (im Stil von Klassenarbeit / AP2) ================= */
const CODE=s=>`<pre class="code">${esc(s)}</pre>`;
DRAW_TASKS.push(
/* ---------- Anwendungsfall ---------- */
{id:'uc4',type:'uc',lvl:'mittel',t:'Online-Shop',
 text:`<p>Für einen <b>Online-Shop</b> gilt: Ein <b>Gast</b> kann Artikel suchen und sich registrieren. Ein <b>Kunde</b> kann alles, was ein Gast kann, und zusätzlich Artikel bestellen. Beim Bestellen muss der Kunde immer angemeldet sein, und die Bestellung wird immer bezahlt. An der Bezahlung ist der externe <b>Zahlungsdienst</b> beteiligt. Beim Bestellen kann der Kunde bei Bedarf einen Gutschein einlösen. Ein <b>Administrator</b> verwaltet die Artikel.</p><p>Erstellen Sie das Anwendungsfalldiagramm.</p>`,
 spec:{nodes:[sn('sys','system','Online-Shop',[['shop','store']]),sn('ga','actor','Gast',[['gast','besucher']]),sn('ku','actor','Kunde',['kunde']),sn('zd','actor','Zahlungsdienst',[['zahlung','payment','paypal','bezahl']]),sn('ad','actor','Administrator',['admin']),
   sn('su','usecase','Artikel suchen',['such']),sn('rg','usecase','Registrieren',['registr']),sn('be','usecase','Artikel bestellen',['bestell'],{not:['zahl']}),sn('an','usecase','Anmelden',[['anmeld','login','einlogg']]),sn('bz','usecase','Bestellung bezahlen',['zahl']),sn('gu','usecase','Gutschein einlösen',['gutschein']),sn('vw','usecase','Artikel verwalten',[['verwalt','pfleg','sortiment']])],
  edges:[se('assoc','ga','su'),se('assoc','ga','rg'),se('assoc','ku','be'),se('gen','ku','ga'),se('include','be','an'),se('include','be','bz'),se('assoc','zd','bz'),se('extend','gu','be'),se('assoc','ad','vw')],
  pos:{ga:[-1.25,0.5],ku:[-1.25,2.6],su:[0,0],rg:[0,1],be:[0,2.6],an:[1.4,1.8],bz:[1.4,2.9],gu:[1.4,4],vw:[0,4.6],ad:[-1.25,4.6],zd:[2.7,2.9]},
  note:'Bei «extend»: Notiz Condition {Gutschein vorhanden}. Kunde erbt „suchen“ und „registrieren“ vom Gast.'}},
{id:'uc5',type:'uc',lvl:'leicht',t:'Stadtbibliothek',
 text:`<p>Die <b>Stadtbibliothek</b> plant ein Ausleihsystem. <b>Leser</b> können Medien suchen, Medien ausleihen und Medien zurückgeben. Beim Ausleihen wird immer der Leserausweis geprüft. Ist bei der Rückgabe die Leihfrist überschritten, wird zusätzlich eine Mahngebühr berechnet. <b>Bibliothekare</b> können neue Medien erfassen und Leser registrieren.</p><p>Erstellen Sie das Anwendungsfalldiagramm.</p>`,
 spec:{nodes:[sn('sys','system','Ausleihsystem',[['ausleih','bibliothek','system']]),sn('le','actor','Leser',[['leser','mitglied','kunde','nutzer']]),sn('bi','actor','Bibliothekar',[['bibliothekar','mitarbeiter','personal']]),
   sn('su','usecase','Medium suchen',['such']),sn('al','usecase','Medium ausleihen',[['ausleih','leih','entleih']],{not:['zurück','frist','einseh']}),sn('zu','usecase','Medium zurückgeben',[['zurück','rückgabe']]),sn('ap','usecase','Leserausweis prüfen',['ausweis']),sn('mg','usecase','Mahngebühr berechnen',[['mahn','gebühr']]),sn('er','usecase','Medium erfassen',[['erfass','anleg','aufnehm','hinzufüg']],{not:['leser','mitglied']}),sn('lr','usecase','Leser registrieren',[['leser','mitglied','kunde'],['registr','anleg','aufnehm','erfass']])],
  edges:[se('assoc','le','su'),se('assoc','le','al'),se('assoc','le','zu'),se('include','al','ap'),se('extend','mg','zu'),se('assoc','bi','er'),se('assoc','bi','lr')],
  pos:{le:[-1.25,1],su:[0,0],al:[0,1],zu:[0,2],ap:[1.4,1],mg:[1.4,2],er:[0,3.3],lr:[0,4.3],bi:[-1.25,3.8]},
  note:'Bei «extend»: Notiz Condition {Leihfrist überschritten}.'}},
{id:'uc6',type:'uc',lvl:'mittel',t:'Geldautomat',
 text:`<p>An einem <b>Geldautomaten</b> kann ein <b>Bankkunde</b> Geld abheben, den Kontostand abfragen und Geld einzahlen. Vor jeder dieser Funktionen muss sich der Kunde mit Karte und PIN authentifizieren. An der Authentifizierung ist das externe <b>Banksystem</b> beteiligt. Nach dem Abheben kann der Kunde auf Wunsch einen Beleg drucken lassen. Ein <b>Servicetechniker</b> kann den Automaten warten und Bargeld auffüllen.</p><p>Erstellen Sie das Anwendungsfalldiagramm.</p>`,
 spec:{nodes:[sn('sys','system','Geldautomat',[['automat','atm']]),sn('ku','actor','Bankkunde',['kunde']),sn('bs','actor','Banksystem',[['banksystem','bank','server']],{not:['kunde']}),sn('te','actor','Servicetechniker',[['technik','service']]),
   sn('ab','usecase','Geld abheben',[['abheb','auszahl']]),sn('ks','usecase','Kontostand abfragen',[['kontostand','saldo']]),sn('ez','usecase','Geld einzahlen',['einzahl']),sn('au','usecase','Authentifizieren',[['authentifiz','pin','anmeld','identifiz','legitim']]),sn('bl','usecase','Beleg drucken',[['beleg','quittung']]),sn('wa','usecase','Automat warten',['wart']),sn('af','usecase','Bargeld auffüllen',[['auffüll','befüll','nachfüll']])],
  edges:[se('assoc','ku','ab'),se('assoc','ku','ks'),se('assoc','ku','ez'),se('include','ab','au'),se('include','ks','au'),se('include','ez','au'),se('assoc','bs','au'),se('extend','bl','ab'),se('assoc','te','wa'),se('assoc','te','af')],
  pos:{ku:[-1.25,1],ab:[0,0],ks:[0,1],ez:[0,2],au:[1.45,1],bl:[1.45,-0.05],bs:[2.75,1],wa:[0,3.3],af:[0,4.3],te:[-1.25,3.8]},
  note:'Bei «extend»: Notiz Condition {Beleg gewünscht}.'}},
{id:'uc7',type:'uc',lvl:'schwer',t:'IT-Helpdesk',
 text:`<p>Ein <b>Helpdesk-System</b> soll folgende Anforderungen erfüllen:</p><ul class="clean"><li><b>Benutzer</b> können Tickets erstellen und den Status eigener Tickets einsehen; beides ist nur nach Anmeldung möglich.</li><li><b>Supporter</b> können Tickets bearbeiten; dabei wird immer die Lösung dokumentiert. Kann ein Supporter das Problem nicht lösen, eskaliert er das Ticket.</li><li>Ein <b>Teamleiter</b> kann alles, was ein Supporter kann, und zusätzlich Auswertungen erstellen.</li><li>Am Bearbeiten eines Tickets ist das externe <b>E-Mail-System</b> beteiligt (Benachrichtigung des Benutzers).</li></ul><p>Erstellen Sie das Anwendungsfalldiagramm.</p>`,
 spec:{nodes:[sn('sys','system','Helpdesk-System',[['helpdesk','ticket','support']]),sn('be','actor','Benutzer',[['benutzer','user','anwender','kunde']]),sn('su','actor','Supporter',['support']),sn('tl','actor','Teamleiter',[['leiter','lead']]),sn('ms','actor','E-Mail-System',[['mail','benachricht']]),
   sn('te','usecase','Ticket erstellen',['ticket',['erstell','anleg','eröffn','meld','erfass']]),sn('se','usecase','Ticketstatus einsehen',[['status','einseh','verfolg']]),sn('an','usecase','Anmelden',[['anmeld','login','einlogg']]),sn('tb','usecase','Ticket bearbeiten',[['bearbeit']],{not:['dokument']}),sn('ld','usecase','Lösung dokumentieren',['dokument']),sn('es','usecase','Ticket eskalieren',[['eskal','weiterleit']]),sn('aw','usecase','Auswertung erstellen',[['auswert','statistik','bericht','report']])],
  edges:[se('assoc','be','te'),se('assoc','be','se'),se('include','te','an'),se('include','se','an'),se('assoc','su','tb'),se('include','tb','ld'),se('extend','es','tb'),se('gen','tl','su'),se('assoc','tl','aw'),se('assoc','ms','tb')],
  pos:{be:[-1.25,0.5],te:[0,0],se:[0,1],an:[1.45,0.5],su:[-1.25,2.7],tb:[0,2.7],ld:[1.45,1.9],es:[1.45,3.5],tl:[-1.25,4.6],aw:[0,4.6],ms:[2.75,2.7]},
  note:'Bei «extend»: Notiz Condition {Problem nicht lösbar}.'}},
/* ---------- Klassen ---------- */
{id:'cl4',type:'cl',lvl:'mittel',t:'Online-Shop: Bestellung',
 text:`<p>Ein <b>Kunde</b> (<code>kundenNr : int</code>, <code>name : String</code>) kann beliebig viele <b>Bestellungen</b> aufgeben; jede Bestellung gehört zu genau einem Kunden. Eine Bestellung (<code>bestellNr : int</code>, <code>datum : Date</code>) besteht aus mindestens einer <b>Bestellposition</b> (<code>menge : int</code>); Positionen existieren nicht ohne ihre Bestellung. Jede Position verweist auf genau einen <b>Artikel</b> (<code>artikelNr : int</code>, <code>bezeichnung : String</code>, <code>preis : double</code>); ein Artikel kann in beliebig vielen Positionen vorkommen. Die Bestellung kann ihre Gesamtsumme berechnen.</p><p>Erstellen Sie das Klassendiagramm mit Attributen, Methoden, Beziehungen und Multiplizitäten.</p>`,
 spec:{nodes:[sn('ku','class','Kunde',['kunde'],{attrs:[['nr','nummer','id'],'name'],as:'- kundenNr : int\n- name : String',ms:''}),sn('be','class','Bestellung',['bestell'],{not:['position','posten'],attrs:[['nr','nummer','id'],'datum'],meth:[['summe','gesamt','berechn']],as:'- bestellNr : int\n- datum : Date',ms:'+ berechneGesamtsumme() : double'}),sn('po','class','Bestellposition',[['position','posten']],{attrs:['menge'],as:'- menge : int',ms:''}),sn('ar','class','Artikel',['artikel'],{attrs:[['nr','nummer','id'],'bezeichnung','preis'],as:'- artikelNr : int\n- bezeichnung : String\n- preis : double',ms:''})],
  edges:[se('assoc','ku','be',{ma:['1'],mb:['0..*']}),se('comp','be','po',{ma:['1'],mb:['1..*']}),se('assoc','po','ar',{ma:['0..*'],mb:['1']})],
  pos:{ku:[0,0],be:[1.1,0],po:[1.1,1],ar:[2.3,1]}}},
{id:'cl5',type:'cl',lvl:'mittel',t:'Bibliothek: Medien und Ausleihe',
 text:`<p><b>Medium</b> ist eine abstrakte Klasse (<code>titel : String</code>, <code>signatur : String</code>, Methode <code>istVerfuegbar() : boolean</code>). <b>Buch</b> (<code>isbn : String</code>, <code>seiten : int</code>) und <b>DVD</b> (<code>laufzeit : int</code>) sind Medien. Ein <b>Leser</b> (<code>ausweisNr : int</code>, <code>name : String</code>) kann beliebig viele <b>Ausleihen</b> haben. Eine Ausleihe (<code>ausleihdatum : Date</code>, <code>rueckgabedatum : Date</code>) gehört zu genau einem Leser und genau einem Medium; ein Medium kann im Laufe der Zeit beliebig oft ausgeliehen werden. Eine Ausleihe kann verlängert werden.</p><p>Erstellen Sie das Klassendiagramm.</p>`,
 spec:{nodes:[sn('me','class','Medium',['medium'],{st:'abstract',attrs:['titel','signatur'],meth:['verf'],as:'- titel : String\n- signatur : String',ms:'+ istVerfuegbar() : boolean'}),sn('bu','class','Buch',['buch'],{attrs:['isbn','seiten'],as:'- isbn : String\n- seiten : int',ms:''}),sn('dv','class','DVD',[['dvd','film']],{attrs:['laufzeit'],as:'- laufzeit : int',ms:''}),sn('le','class','Leser',[['leser','mitglied','kunde']],{attrs:[['ausweis','nr','nummer'],'name'],as:'- ausweisNr : int\n- name : String',ms:''}),sn('al','class','Ausleihe',['ausleihe'],{attrs:[['ausleihdatum','datum','beginn'],['rückgabe','rueckgabe','ende']],meth:[['verläng','verlaeng']],as:'- ausleihdatum : Date\n- rueckgabedatum : Date',ms:'+ verlaengern() : void'})],
  edges:[se('gen','bu','me'),se('gen','dv','me'),se('assoc','le','al',{ma:['1'],mb:['0..*']}),se('assoc','me','al',{ma:['1'],mb:['0..*']})],
  pos:{me:[0.5,0],bu:[0,1.1],dv:[1,1.1],al:[1.7,0],le:[2.9,0]}}},
{id:'cl6',type:'cl',lvl:'schwer',t:'Firma, Abteilungen, Projekte',
 text:`<ul class="clean"><li>Eine <b>Firma</b> (<code>name : String</code>) besteht aus mindestens einer <b>Abteilung</b> (<code>bezeichnung : String</code>). Ohne Firma gibt es keine Abteilungen.</li><li>Einer Abteilung sind beliebig viele <b>Mitarbeiter</b> (<code>personalNr : int</code>, <code>name : String</code>, <code>gehalt : double</code>) zugeordnet. Mitarbeiter bleiben bestehen, wenn die Abteilung aufgelöst wird; ein Mitarbeiter gehört zu höchstens einer Abteilung.</li><li>Ein <b>Manager</b> ist ein Mitarbeiter mit dem zusätzlichen Attribut <code>bonus : double</code>.</li><li>Mitarbeiter arbeiten an beliebig vielen <b>Projekten</b> (<code>titel : String</code>, <code>budget : double</code>); an einem Projekt arbeitet mindestens ein Mitarbeiter.</li></ul><p>Erstellen Sie das Klassendiagramm.</p>`,
 spec:{nodes:[sn('fi','class','Firma',[['firma','unternehmen']],{attrs:['name'],as:'- name : String',ms:''}),sn('ab','class','Abteilung',['abteilung'],{attrs:['bezeichnung'],as:'- bezeichnung : String',ms:''}),sn('mi','class','Mitarbeiter',[['mitarbeiter','angestellt']],{attrs:[['personal','nr','nummer'],'name','gehalt'],as:'- personalNr : int\n- name : String\n- gehalt : double',ms:''}),sn('mg','class','Manager',['manager'],{attrs:['bonus'],as:'- bonus : double',ms:''}),sn('pr','class','Projekt',['projekt'],{attrs:['titel','budget'],as:'- titel : String\n- budget : double',ms:''})],
  edges:[se('comp','fi','ab',{ma:['1'],mb:['1..*']}),se('agg','ab','mi',{ma:['0..1'],mb:['0..*']}),se('gen','mg','mi'),se('assoc','mi','pr',{ma:['1..*'],mb:['0..*']})],
  pos:{fi:[0,0],ab:[1,0],mi:[2.05,0],pr:[3.15,0],mg:[2.05,1]}}},
{id:'cl7',type:'cl',lvl:'schwer',t:'Aus Java-Code: Zahlungsarten',
 text:`<p>Gegeben ist folgender Java-Code. Erstellen Sie daraus das Klassendiagramm (Klassen, Interface, Attribute, Methoden, Beziehungen).</p>`+CODE(`public interface Bezahlbar {
    boolean bezahlen(double betrag);
}
public abstract class Zahlungsart implements Bezahlbar {
    protected String inhaber;
}
public class Kreditkarte extends Zahlungsart {
    private String kartenNr;
    public boolean bezahlen(double betrag) { /* ... */ }
}
public class PayPal extends Zahlungsart {
    private String email;
    public boolean bezahlen(double betrag) { /* ... */ }
}
public class Bestellung {
    private double summe;
    private Bezahlbar zahlung;          // genau eine
    public void abschliessen() { zahlung.bezahlen(summe); }
}`),
 spec:{nodes:[sn('bz','class','Bezahlbar',['bezahlbar'],{st:'interface',meth:['bezahlen'],as:'',ms:'+ bezahlen(betrag : double) : boolean'}),sn('za','class','Zahlungsart',['zahlungsart'],{st:'abstract',attrs:['inhaber'],as:'# inhaber : String',ms:''}),sn('kk','class','Kreditkarte',[['kreditkarte','karte']],{attrs:[['karten','nr']],as:'- kartenNr : String',ms:'+ bezahlen(betrag : double) : boolean'}),sn('pp','class','PayPal',['paypal'],{attrs:['mail'],as:'- email : String',ms:'+ bezahlen(betrag : double) : boolean'}),sn('bs','class','Bestellung',['bestell'],{attrs:['summe'],meth:['abschlie'],as:'- summe : double',ms:'+ abschliessen() : void'})],
  edges:[se('real','za','bz'),se('gen','kk','za'),se('gen','pp','za'),se(['assoc','agg'],'bs','bz',{mb:['1']})],
  pos:{bz:[1,0],za:[1,1],kk:[0.35,2],pp:[1.65,2],bs:[2.25,0]},
  note:'„implements“ wird zur Realisierung (gestrichelt), „extends“ zur Generalisierung. Das Attribut „zahlung“ vom Typ Bezahlbar wird als Assoziation gezeichnet, nicht zusätzlich als Attribut.'}},
/* ---------- Zustand ---------- */
{id:'st5',type:'st',lvl:'leicht',t:'Bestellung im Online-Shop',
 text:`<p>Eine <b>Bestellung</b> ist nach dem Anlegen <b>offen</b>. Geht die Zahlung ein, ist sie <b>bezahlt</b>. Eine bezahlte Bestellung wird versendet und ist dann <b>versendet</b>; nach der Zustellung ist sie <b>zugestellt</b>, und der Lebenszyklus endet. Eine offene Bestellung kann storniert werden. Geht innerhalb von 14 Tagen keine Zahlung ein, wird sie automatisch storniert. Mit dem Zustand <b>storniert</b> endet der Lebenszyklus ebenfalls.</p><p>Erstellen Sie das Zustandsdiagramm.</p>`,
 spec:{nodes:[sn('o','state','offen',[['offen','neu','angelegt']]),sn('b','state','bezahlt',['bezahlt']),sn('v','state','versendet',[['versendet','versand','unterwegs']]),sn('z','state','zugestellt',[['zugestellt','geliefert','abgeschlossen']]),sn('s','state','storniert',['storn'])],
  edges:[se('trans','@initial','o',{txt:'anlegen'}),se('trans','o','b',{lab:[['zahl']],txt:'Zahlung eingegangen'}),se('trans','b','v',{lab:[['versend','versand','verschick']],txt:'versenden'}),se('trans','v','z',{lab:[['zustell','liefer','zugestellt']],txt:'zustellen'}),se('trans','o','s',{lab:[['storn']],txt:'stornieren'}),se('trans','o','s',{lab:[['after','14','tag','frist','zeit']],txt:'after(14 Tage)'}),se('trans','z','@final'),se('trans','s','@final')],
  pos:{'@initial':[-0.8,0],o:[0,0],b:[1.25,0],v:[2.5,0],z:[3.75,0],s:[0,1.4],'@final':[3.75,1.4]}}},
{id:'st6',type:'st',lvl:'mittel',t:'Ampel mit Zeitereignissen',
 text:`<p>Eine <b>Verkehrsampel</b> zeigt nach dem Einschalten <b>Rot</b>. Nach 30 Sekunden wechselt sie auf <b>Rot-Gelb</b>, nach weiteren 2 Sekunden auf <b>Grün</b>. Grün dauert 25 Sekunden, danach folgt für 3 Sekunden <b>Gelb</b>, dann wieder Rot. Die Ampel kann nur in der Rotphase ausgeschaltet werden; damit endet der Ablauf.</p><p>Erstellen Sie das Zustandsdiagramm. Verwenden Sie Zeitereignisse der Form <code>after(…)</code>.</p>`,
 spec:{nodes:[sn('r','state','Rot',['rot'],{not:['gelb']}),sn('rg','state','Rot-Gelb',['rot','gelb']),sn('g','state','Grün',[['grün','gruen']]),sn('y','state','Gelb',['gelb'],{not:['rot']})],
  edges:[se('trans','@initial','r',{txt:'einschalten'}),se('trans','r','rg',{lab:[['after','30','zeit']],txt:'after(30 s)'}),se('trans','rg','g',{lab:[['after','2','zeit']],txt:'after(2 s)'}),se('trans','g','y',{lab:[['after','25','zeit']],txt:'after(25 s)'}),se('trans','y','r',{lab:[['after','3','zeit']],txt:'after(3 s)'}),se('trans','r','@final',{lab:[['ausschalt','abschalt','aus']],txt:'ausschalten'})],
  pos:{'@initial':[-0.85,-0.2],r:[0,0],rg:[1.4,0],g:[1.4,1.4],y:[0,1.4],'@final':[-0.85,0.7]}}},
{id:'st7',type:'st',lvl:'mittel',t:'Support-Ticket',
 text:`<p>Ein <b>Ticket</b> ist nach dem Erstellen <b>offen</b>. Übernimmt ein Supporter das Ticket, ist es <b>in Bearbeitung</b>. Fehlen Informationen, stellt der Supporter eine Rückfrage; das Ticket ist dann <b>wartend</b>, bis der Kunde antwortet (danach wieder in Bearbeitung). Wird das Problem gelöst, ist das Ticket <b>gelöst</b>. Der Kunde prüft die Lösung: Bestätigt er sie, wird das Ticket <b>geschlossen</b>; lehnt er sie ab, geht es zurück in Bearbeitung. Mit dem Schließen endet der Lebenszyklus.</p><p>Erstellen Sie das Zustandsdiagramm mit Ereignissen und Guards.</p>`,
 spec:{nodes:[sn('o','state','offen',[['offen','neu']]),sn('b','state','in Bearbeitung',[['bearbeitung','arbeit']]),sn('w','state','wartend',[['wart','rückfrage']]),sn('g','state','gelöst',[['gelöst','geloest','erledigt']]),sn('c','state','geschlossen',[['geschlossen','abgeschlossen']])],
  edges:[se('trans','@initial','o',{txt:'erstellen'}),se('trans','o','b',{lab:[['übern','zuweis','annehm','start','bearbeit']],txt:'übernehmen'}),se('trans','b','w',{lab:[['rückfrage','info','fehl']],txt:'Rückfrage stellen'}),se('trans','w','b',{lab:[['antwort','info','eingang']],txt:'Kunde antwortet'}),se('trans','b','g',{lab:[['lös','loes','behob']],txt:'lösen'}),se('trans','g','c',{lab:[['bestätig','akzept','ok']],txt:'prüfen [bestätigt]'}),se('trans','g','b',{lab:[['ablehn','abgelehnt','nicht','else']],txt:'prüfen [abgelehnt]'}),se('trans','c','@final')],
  pos:{'@initial':[-0.8,0],o:[0,0],b:[1.3,0],w:[1.3,1.4],g:[2.6,0],c:[3.8,0],'@final':[4.5,0]}}},
{id:'st8',type:'st',lvl:'schwer',t:'Benutzerkonto mit Sperre',
 text:`<p>Ein <b>Benutzerkonto</b> ist nach der Registrierung <b>unbestätigt</b>. Klickt der Benutzer auf den Bestätigungslink, ist das Konto <b>aktiv</b>. Bei einer Fehlanmeldung wird ein Zähler erhöht; solange weniger als drei Fehlversuche vorliegen, bleibt das Konto aktiv. Beim dritten Fehlversuch wird das Konto <b>gesperrt</b>. Nach 30 Minuten oder durch einen Administrator wird es wieder aktiv; dabei wird der Zähler zurückgesetzt. Ein aktives Konto kann gelöscht werden; damit endet der Lebenszyklus.</p><p>Erstellen Sie das Zustandsdiagramm. Achten Sie auf Guards, Effekte und die Selbsttransition.</p>`,
 spec:{nodes:[sn('u','state','unbestätigt',[['unbestätigt','unbestaetigt','registriert','neu']]),sn('a','state','aktiv',['aktiv'],{not:['inaktiv','deaktiv']}),sn('g','state','gesperrt',[['gesperrt','blockiert','sperr']])],
  edges:[se('trans','@initial','u',{txt:'registrieren'}),se('trans','u','a',{lab:[['bestätig','bestaetig','link','aktivier']],txt:'Link bestätigen'}),se('trans','a','a',{lab:[['fehl','falsch']],txt:'Fehlanmeldung [zaehler < 2] / zaehler++'}),se('trans','a','g',{lab:[['fehl','falsch','3','dritt']],txt:'Fehlanmeldung [zaehler = 2]'}),se('trans','g','a',{lab:[['after','30','admin','entsperr','freischalt']],txt:'after(30 min) / zaehler = 0'}),se('trans','a','@final',{lab:[['lösch','loesch']],txt:'löschen'})],
  pos:{'@initial':[-0.8,0],u:[0,0],a:[1.5,0],g:[3.3,0],'@final':[1.5,1.3]},
  note:'Auch gesperrt → aktiv durch „entsperren (Administrator)“ als zweite Transition möglich.'}},
/* ---------- Aktivität (als Musterzeichnungen) ---------- */
{id:'ac4',type:'ac',lvl:'mittel',t:'Login mit drei Versuchen (Schleife)',
 text:`<p>Ein Benutzer meldet sich an einem System an: Er gibt Benutzername und Passwort ein. Das System prüft die Zugangsdaten. Sind sie korrekt, wird die Startseite angezeigt. Sind sie falsch, wird der Fehlversuchszähler erhöht. Nach dem dritten Fehlversuch wird das Konto gesperrt, und der Vorgang endet. Andernfalls wird eine Fehlermeldung angezeigt, und der Benutzer gibt die Daten erneut ein.</p><p>Erstellen Sie das Aktivitätsdiagramm (ohne Swimlanes).</p>`,
 ref:{n:[['i','initial',0,0],['m1','diamond',0,1],['ein','action',0,2,'Zugangsdaten eingeben',[['eingeb','eingabe']]],['pr','action',0,3,'Zugangsdaten prüfen',[['prüf','pruef','validier','kontroll']]],['d1','diamond',0,4],['st','action',0,5.2,'Startseite anzeigen',[['startseite','start','weiterleit','erfolg','dashboard']]],['f','final',0,6.3],
   ['za','action',1.35,4,'Fehlversuchszähler erhöhen',[['zähler','zaehler','erhöh','versuch']]],['d2','diamond',1.35,2.5],['fm','action',1.35,1,'Fehlermeldung anzeigen',[['fehler','meldung','hinweis']]],['ks','action',2.6,2.5,'Konto sperren',['sperr']],['f2','final',2.6,3.7]],
  e:[['i','m1'],['m1','ein'],['ein','pr'],['pr','d1'],['d1','st','[Daten korrekt]',[['korrekt','richtig','ok','gültig','else']]],['st','f'],['d1','za','[Daten falsch]',[['falsch','nicht','ungültig','fehler','else']]],['za','d2'],['d2','fm','[Fehlversuche < 3]',[['<','weniger','kleiner','nicht','else']]],['fm','m1'],['d2','ks','[Fehlversuche = 3]',[['3','dritt','>','zu viele','else']]],['ks','f2']]}},
{id:'ac5',type:'ac',lvl:'mittel',t:'Bestellabwicklung (Fork und Join)',
 text:`<p>Nach Eingang einer Bestellung wird zuerst die Zahlung geprüft. Ist die Zahlung nicht eingegangen, wird die Bestellung storniert, und der Vorgang endet. Ist sie eingegangen, werden gleichzeitig die Ware verpackt und die Rechnung erstellt. Erst wenn beides erledigt ist, wird das Paket versendet. Anschließend erhält der Kunde eine Versandbestätigung.</p><p>Erstellen Sie das Aktivitätsdiagramm.</p>`,
 ref:{n:[['i','initial',1,0],['zp','action',1,1,'Zahlung prüfen',[['zahl'],['prüf','pruef','kontroll','eingang']]],['d','diamond',1,2],['sto','action',2.4,2,'Bestellung stornieren',['storn']],['f2','final',2.4,3.1],['fork','bar',1,3,'',null,{len:280}],['wv','action',0.45,4,'Ware verpacken',[['verpack','pack','kommission']]],['re','action',1.55,4,'Rechnung erstellen',['rechnung']],['join','bar',1,5,'',null,{len:280}],['ve','action',1,6,'Paket versenden',[['versend','versand','verschick']],{not:['bestätig','bestaetig']}],['vb','action',1,7,'Versandbestätigung senden',[['bestätig','bestaetig','benachricht','info','mail']]],['f','final',1,8]],
  e:[['i','zp'],['zp','d'],['d','sto','[Zahlung nicht eingegangen]',[['nicht','kein','nein','else']]],['sto','f2'],['d','fork','[Zahlung eingegangen]',[['eingegangen','ok','bezahlt','ja','else']]],['fork','wv'],['fork','re'],['wv','join'],['re','join'],['join','ve'],['ve','vb'],['vb','f']]}},
{id:'ac6',type:'ac',lvl:'mittel',t:'Urlaubsantrag (Swimlanes)',
 text:`<p>Ein <b>Mitarbeiter</b> stellt einen Urlaubsantrag. Der <b>Vorgesetzte</b> prüft den Antrag. Lehnt er ab, nimmt der Mitarbeiter die Ablehnung zur Kenntnis, und der Vorgang endet. Genehmigt er, trägt die <b>Personalabteilung</b> den Urlaub im System ein und aktualisiert das Urlaubskonto. Anschließend erhält der Mitarbeiter die Genehmigung.</p><p>Erstellen Sie das Aktivitätsdiagramm mit drei Swimlanes.</p>`,
 ref:{lanes:[['lm','Mitarbeiter',[['mitarbeiter','antragsteller','angestellt']]],['lv','Vorgesetzter',[['vorgesetzt','chef','leiter','manager']]],['lp','Personalabteilung',[['personal','hr']]]],
  n:[['i','initial',0,0],['as','action',0,1,'Urlaubsantrag stellen',[['antrag'],['stell','einreich','erstell','ausfüll']]],['ap','action',1,2,'Antrag prüfen',[['prüf','pruef','entscheid','bearbeit']]],['d','diamond',1,3],['ab','action',0,3,'Ablehnung zur Kenntnis nehmen',[['ablehn','absage']]],['f2','final',0,4.1],['ue','action',2,4,'Urlaub eintragen',[['eintrag','erfass','buch']]],['uk','action',2,5,'Urlaubskonto aktualisieren',[['konto','aktualis','resturlaub']]],['ge','action',0,6,'Genehmigung erhalten',[['genehmig','bestätig','zusage']]],['f','final',0,7.1]],
  e:[['i','as'],['as','ap'],['ap','d'],['d','ab','[abgelehnt]',[['ablehn','abgelehnt','nicht','nein','else']]],['ab','f2'],['d','ue','[genehmigt]',[['genehmig','ok','ja','else']]],['ue','uk'],['uk','ge'],['ge','f']]}},
{id:'ac7',type:'ac',lvl:'schwer',t:'Aus Pseudocode: Summe mit Rabatt',
 text:`<p>Stellen Sie den folgenden Algorithmus als Aktivitätsdiagramm dar.</p>`+CODE(`summe = 0
i = 0
solange i < anzahl(positionen):
    summe = summe + positionen[i].preis
    i = i + 1
wenn summe > 100:
    summe = summe - summe * 0.1
gib summe aus`),
 ref:{n:[['i','initial',0,0],['init','action',0,1,'summe = 0, i = 0',[['= 0','=0','initial','null','setz']]],['m1','diamond',0,2],['d1','diamond',0,3],['add','action',1.4,3,'Preis zu summe addieren',[['preis','addier','+ pos','summe +']]],['inc','action',1.4,2,'i um 1 erhöhen',[['i +','i+','i um','erhöh','inkrement','zähler','nächst']]],['d2','diamond',0,4.2],['rab','action',1.4,4.2,'Rabatt abziehen',[['rabatt','0.1','0,1','10']]],['m2','diamond',0,5.4],['out','action',0,6.4,'summe ausgeben',[['ausgeb','ausgabe','gib','zeig']]],['f','final',0,7.5]],
  e:[['i','init'],['init','m1'],['m1','d1'],['d1','add','[i < anzahl]',[['<','kleiner','weitere','noch','solange','else']]],['add','inc'],['inc','m1'],['d1','d2','[i >= anzahl]',[['>=','else','fertig','keine','alle','nicht','ende']]],['d2','rab','[summe > 100]',[['>','100','größer','groesser']]],['rab','m2'],['d2','m2','[else]',[['else','<=','nicht','sonst']]],['m2','out'],['out','f']],
  note:'Die Schleife entsteht durch den Rückfluss zum Merge vor der Bedingung (kopfgesteuert, wie while).'}},
/* ---------- Sequenz ---------- */
{id:'sq5',type:'sq',lvl:'mittel',t:'Login mit alt-Fragment',
 text:`<p>Ein <b>Benutzer</b> gibt im <b>Login-Formular</b> seine Zugangsdaten ein und klickt auf „Anmelden“. Das Formular ruft beim <b>AuthService</b> die Operation <code>login(name, passwort)</code> auf. Der AuthService lässt die Zugangsdaten von der <b>Datenbank</b> prüfen (<code>pruefeZugang(name, hash)</code>, Rückgabe Boolean). Sind die Daten gültig, liefert der AuthService ein Token zurück, und das Formular zeigt dem Benutzer die Startseite. Andernfalls liefert er einen Fehler, und das Formular zeigt eine Fehlermeldung.</p><p>Erstellen Sie das Sequenzdiagramm.</p>`,
 spec:{parts:[{k:'b',name:'Benutzer',kw:[['benutzer','user','nutzer','kunde']],actor:true},{k:'f',name:':LoginFormular',kw:[['formular','ui','frontend','login','maske','client']]},{k:'a',name:':AuthService',kw:[['auth','service','backend','server']]},{k:'d',name:':Datenbank',kw:[['datenbank','db','database']]}],
  msgs:[sm('b','f','Zugangsdaten eingeben, „Anmelden“ klicken',null,['sync','async']),sm('f','a','login(name, passwort)',[['login','anmeld','authent']],['sync']),sm('a','d','pruefeZugang(name, hash)',[['prüf','pruef','check','valid','such','find','select']],['sync']),sm('d','a','gueltig: Boolean',null,['reply'],{strict:true}),sm('a','f','token',null,['reply'],{strict:true}),sm('f','b','Startseite anzeigen',[['start','seite','erfolg','willkommen']],['sync','reply','async']),sm('a','f','Fehler',null,['reply'],{strict:true}),sm('f','b','Fehlermeldung anzeigen',[['fehler','meldung']],['sync','reply','async'])],
  sol:[0,1,2,3,['alt','Daten gültig'],4,5,['else','else'],6,7,'end'],frags:{alt:1}}},
{id:'sq6',type:'sq',lvl:'mittel',t:'Bestellung mit loop und create',
 text:`<p>Ein <b>Kunde</b> klickt im <b>Shop-Frontend</b> auf „Bestellen“. Das Frontend ruft <code>bestellen(warenkorb)</code> am <b>BestellService</b> auf. Der BestellService prüft <b>für jede Position</b> des Warenkorbs den Bestand beim <b>Lager</b> (<code>pruefeBestand(artikelNr, menge)</code>, Rückgabe Boolean). Danach erzeugt der BestellService ein neues <b>Bestellung</b>-Objekt und gibt die Bestellnummer an das Frontend zurück, das dem Kunden die Bestätigung anzeigt.</p><p>Erstellen Sie das Sequenzdiagramm.</p>`,
 spec:{parts:[{k:'k',name:'Kunde',kw:[['kunde','benutzer','user']],actor:true},{k:'f',name:':Frontend',kw:[['frontend','shop','ui','web']]},{k:'s',name:':BestellService',kw:[['service','backend','controller']]},{k:'l',name:':Lager',kw:[['lager','bestand']]},{k:'b',name:':Bestellung',kw:['bestellung'],not:['service']}],
  msgs:[sm('k','f','„Bestellen“ klicken',null,['sync','async']),sm('f','s','bestellen(warenkorb)',[['bestell']],['sync']),sm('s','l','pruefeBestand(artikelNr, menge)',[['bestand','prüf','pruef','verfügbar']],['sync']),sm('l','s','verfuegbar: Boolean',null,['reply'],{strict:true}),sm('s','b','«create»',null,['create'],{strict:true}),sm('s','f','bestellNr',null,['reply'],{strict:true}),sm('f','k','Bestätigung anzeigen',[['bestätig','bestaetig','anzeig','erfolg']],['sync','reply','async'])],
  sol:[0,1,['loop','für jede Position'],2,3,'end',4,5,6],frags:{loop:1}}},
{id:'sq7',type:'sq',lvl:'schwer',t:'Geldautomat mit alt und opt',
 text:`<p>Ein <b>Kunde</b> fordert am <b>Geldautomaten</b> eine Auszahlung an (<code>abheben(betrag)</code>). Der Automat fragt beim <b>Bankserver</b> die Deckung an (<code>pruefeDeckung(konto, betrag)</code>, Rückgabe Boolean). Ist das Konto gedeckt, bucht der Automat den Betrag beim Bankserver ab (<code>abbuchen(konto, betrag)</code>, mit Bestätigung) und gibt dem Kunden das Geld aus. Nur wenn der Kunde einen Beleg gewünscht hat, weist der Automat zusätzlich den <b>Drucker</b> asynchron an, den Beleg zu drucken. Ist das Konto nicht gedeckt, zeigt der Automat eine Ablehnung an.</p><p>Erstellen Sie das Sequenzdiagramm.</p>`,
 spec:{parts:[{k:'k',name:'Kunde',kw:[['kunde','benutzer','user']],actor:true},{k:'g',name:':Geldautomat',kw:[['automat','atm']]},{k:'b',name:':Bankserver',kw:[['bank','server']]},{k:'d',name:':Drucker',kw:[['druck','printer']]}],
  msgs:[sm('k','g','abheben(betrag)',[['abheb','auszahl','betrag']],['sync','async']),sm('g','b','pruefeDeckung(konto, betrag)',[['deckung','prüf','pruef','saldo','guthaben']],['sync']),sm('b','g','gedeckt: Boolean',null,['reply'],{strict:true}),sm('g','b','abbuchen(konto, betrag)',[['buch','belast']],['sync']),sm('b','g','ok',null,['reply'],{strict:true}),sm('g','k','Geld ausgeben',[['geld','ausgeb','auszahl']],['sync','reply','async']),sm('g','d','druckeBeleg()',null,['async']),sm('g','k','Ablehnung anzeigen',[['ablehn','nicht','fehler','meld']],['sync','reply','async'])],
  sol:[0,1,2,['alt','Konto gedeckt'],3,4,5,['opt','Beleg gewünscht'],6,'end',['else','else'],7,'end'],frags:{alt:1,opt:1}}},
{id:'sq8',type:'sq',lvl:'schwer',t:'Aus Java-Code: Bestellung abschließen',
 text:`<p>Ein Objekt <code>:Shop</code> ruft <code>abschliessen(b)</code> an einem Objekt <code>:Bestellverwaltung</code> auf. Stellen Sie den Ablauf der Methode als Sequenzdiagramm dar.</p>`+CODE(`public class Bestellverwaltung {
    private Lager lager;
    private Mailer mailer;

    public Rechnung abschliessen(Bestellung b) {
        Rechnung r = null;
        boolean ok = lager.reservieren(b);
        if (ok) {
            r = new Rechnung(b);
            double summe = r.berechneSumme();
            mailer.sendeBestaetigung(b);   // asynchron: es wird nicht gewartet
        }
        return r;
    }
}`),
 spec:{parts:[{k:'s',name:':Shop',kw:[['shop','client','aufrufer','ui','frontend']]},{k:'v',name:':Bestellverwaltung',kw:['verwaltung']},{k:'l',name:':Lager',kw:['lager']},{k:'r',name:':Rechnung',kw:['rechnung']},{k:'m',name:':Mailer',kw:['mail']}],
  msgs:[sm('s','v','abschliessen(b)',[['abschlie']],['sync']),sm('v','l','reservieren(b)',[['reservier']],['sync']),sm('l','v','ok: boolean',null,['reply'],{strict:true}),sm('v','r','«create»',null,['create'],{strict:true}),sm('v','r','berechneSumme()',[['summe','berechn']],['sync']),sm('r','v','summe: double',null,['reply'],{strict:true}),sm('v','m','sendeBestaetigung(b)',[['send','bestätig','bestaetig','mail']],['async']),sm('v','s','r: Rechnung',null,['reply'],{strict:true})],
  sol:[0,1,2,['opt','ok'],3,4,5,6,'end',7],frags:{'opt|alt':1},
  note:'Methodenaufruf = synchrone Nachricht, return = Antwort, new = «create», if ohne else = opt.'}}
);

/* Layout + lesbare Attribute für ältere Aufgaben, damit auch ihre Lösungen gezeichnet werden können */
(function(){const P={
 cl2:{pos:{fp:[0,0],fz:[1.15,0],ku:[2.3,0],mi:[-0.1,1.15],au:[0.9,1.15],mr:[1.9,1.15],mo:[0.9,2.2]},as:{fp:'',fz:'- kennzeichen : String',mr:'',au:'- anzahlTueren : int',mi:'',mo:'',ku:'- name : String'},ms:{fp:'',fz:'+ istVerfuegbar() : boolean',mr:'',au:'+ mieten() : void',mi:'+ mieten() : void',mo:'',ku:''}},
 cl1:{pos:{ek:[0,0],ar:[1.2,0],kl:[1.2,1.1]},as:{ek:'- listenID : long',ar:'- artikelID : long\n- bezeichnung : String\n- preis : double',kl:'- groesse : String'},ms:{ek:'',ar:'',kl:''}},
 st1:{pos:{'@initial':[-0.8,0],a:[0,0],f:[1.5,0],u:[3.2,0]}},
 st3:{pos:{'@initial':[-0.8,0],i:[0,0],s:[1.5,0],a:[3,0.9],e:[1.5,-1.3],'@final':[4.3,-1.3]}},
 st4:{pos:{'@initial':[-0.8,0.7],a:[0,0.7],o:[1.5,0],e:[1.5,1.4],g:[3,0.7],'@final':[3.9,0.7]}}};
 Object.keys(P).forEach(id=>{const t=DRAW_TASKS.find(x=>x.id===id);if(!t)return;t.spec.pos=P[id].pos;if(P[id].as)t.spec.nodes.forEach(n=>{if(P[id].as[n.k]!=null)n.as=P[id].as[n.k];if(P[id].ms[n.k]!=null)n.ms=P[id].ms[n.k];});});
 const s4=DRAW_TASKS.find(x=>x.id==='sq4');if(s4)s4.spec.sol=[0,1,2,3,4,['alt','Gerät verfügbar'],5,6,['par',''],7,8,['else',''],['opt','E-Mail-Benachrichtigung aktiviert'],9,'end','end',['else','else'],10,11,'end'];
})();
prepTasks(DRAW_TASKS);

/* Aufgaben vom Typ "Ergänzen": der Editor startet mit einem teilweise fertigen Diagramm */
(function(){const E=[
 ['uc5e','uc5','Ergänzen: Stadtbibliothek',{drop:['ap','mg','bi','er','lr']},'Im Editor ist bereits ein Teil des Diagramms vorhanden. Ergänze es anhand des Aufgabentexts.'],
 ['cl4e','cl4','Ergänzen: Bestellung',{drop:['po','ar']},'Die Klassen Kunde und Bestellung sind bereits gezeichnet. Ergänze das Diagramm.'],
 ['st7e','st7','Ergänzen: Support-Ticket',{drop:['w','g']},'Ein Teil der Zustände ist bereits vorhanden. Ergänze die fehlenden Zustände und Transitionen.'],
 ['ac5e','ac5','Ergänzen: Bestellabwicklung',{drop:['fork','wv','re','join','ve','vb','f']},'Der Anfang des Ablaufs ist bereits gezeichnet. Ergänze den parallelen Teil und das Ende.'],
 ['sq5e','sq5','Ergänzen: Login',{rows:[0,1,2,3]},'Die ersten Nachrichten sind bereits vorhanden. Ergänze das Fragment alt.']];
 E.forEach(([id,base,t,start,hint])=>{const b=DRAW_TASKS.find(x=>x.id===base);if(!b)return;DRAW_TASKS.push(Object.assign({},b,{id,t,lvl:b.lvl,start,erg:true,text:`<div class="tip">Ergänzen Sie das Diagramm. ${hint}</div>`+b.text}));});
})();
function starterDoc(t){let d;if(t.type==='sq')d=docFromSpec({type:'sq',spec:Object.assign({},t.spec,{sol:t.start.rows})});else d=docFromSpec(t,t.start.drop);
 if(!d)return newDoc(t.type);delete d.ids;if(d.rows)d.rows.forEach(r=>delete r.k);d.n=500;return d;}

/* ================= LESEAUFGABEN: "Diagramm lesen" ================= */
const READ_TASKS=[
{id:'r-uc4',type:'uc',base:'uc4',t:'Online-Shop lesen',st:[
 ['Ein Gast kann Artikel bestellen.',false,'„Artikel bestellen“ ist nur mit Kunde verbunden. Die Generalisierung geht von Kunde zu Gast: Kunde erbt von Gast, nicht umgekehrt.'],
 ['Ein Kunde kann Artikel suchen.',true,'Kunde erbt alle Use Cases von Gast (Generalisierung).'],
 ['Bei jeder Bestellung wird ein Gutschein eingelöst.',false,'«extend» bedeutet eine optionale Erweiterung unter einer Bedingung.'],
 ['Beim Bestellen wird immer bezahlt.',true,'«include» wird immer ausgeführt.'],
 ['Der Zahlungsdienst ist Teil des Systems „Online-Shop“.',false,'Akteure stehen außerhalb der Systemgrenze. Der Zahlungsdienst ist ein externes System.'],
 ['Das Diagramm zeigt, dass zuerst angemeldet und danach bezahlt wird.',false,'Ein Anwendungsfalldiagramm zeigt keine Reihenfolge.']]},
{id:'r-uc7',type:'uc',base:'uc7',t:'IT-Helpdesk lesen',st:[
 ['Ein Teamleiter kann Tickets bearbeiten.',true,'Teamleiter erbt von Supporter.'],
 ['Ein Supporter kann Auswertungen erstellen.',false,'Vererbung wirkt nur in eine Richtung: Der Teamleiter erhält die Rechte des Supporters, nicht umgekehrt.'],
 ['Jedes bearbeitete Ticket wird eskaliert.',false,'„Ticket eskalieren“ ist über «extend» angebunden, also nur unter einer Bedingung.'],
 ['Ohne Anmeldung kann kein Ticket erstellt werden.',true,'„Ticket erstellen“ «include» „Anmelden“.'],
 ['„Lösung dokumentieren“ wird nur in Ausnahmefällen ausgeführt.',false,'«include» wird bei jeder Ticketbearbeitung ausgeführt.'],
 ['Das E-Mail-System ist ein Akteur, obwohl es kein Mensch ist.',true,'Ein Akteur ist eine Rolle: Mensch, externes System oder Timer.']]},
{id:'r-cl4',type:'cl',base:'cl4',t:'Bestellung lesen',st:[
 ['Eine Bestellung kann ohne Bestellposition existieren.',false,'Bei Bestellposition steht 1..*: mindestens eine Position.'],
 ['Wird eine Bestellung gelöscht, werden auch ihre Positionen gelöscht.',true,'Komposition (◆): Das Teil existiert nicht ohne das Ganze.'],
 ['Ein Artikel kann in mehreren Bestellpositionen vorkommen.',true,'Bei Bestellposition steht auf der Seite von Artikel 0..*.'],
 ['Eine Bestellung kann mehreren Kunden gehören.',false,'Bei Kunde steht 1: genau ein Kunde.'],
 ['Wird eine Bestellposition gelöscht, wird auch der Artikel gelöscht.',false,'Zwischen Position und Artikel besteht eine einfache Assoziation ohne Existenzabhängigkeit.'],
 ['Ein Kunde muss mindestens eine Bestellung haben.',false,'0..* bedeutet: null oder beliebig viele.']]},
{id:'r-cl2',type:'cl',base:'cl2',t:'Fahrzeugvermietung lesen',st:[
 ['Von der Klasse Fahrzeug können Objekte erzeugt werden.',false,'Fahrzeug ist mit «abstract» gekennzeichnet: Objekte entstehen nur aus den Unterklassen.'],
 ['Die Klasse Auto muss die Methode mieten() implementieren.',true,'Auto realisiert das Interface Mietbar (Realisierung).'],
 ['Ein Motorrad besitzt das Attribut kennzeichen.',true,'Das Attribut wird von Fahrzeug geerbt.'],
 ['Wird der Fuhrpark gelöscht, werden auch die Fahrzeuge gelöscht.',false,'Aggregation (◇): Die Teile existieren eigenständig.'],
 ['Ein Motor kann im Modell ohne Auto existieren.',false,'Komposition (◆): Der Motor existiert nur zusammen mit dem Auto.'],
 ['Ein Fahrzeug kann gleichzeitig an zwei Kunden verliehen sein.',false,'Bei Kunde steht 0..1: höchstens ein Kunde.']]},
{id:'r-st7',type:'st',base:'st7',t:'Support-Ticket lesen',st:[
 ['Ein offenes Ticket kann direkt in den Zustand „gelöst“ wechseln.',false,'Aus „offen“ gibt es nur den Übergang nach „in Bearbeitung“.'],
 ['Ein gelöstes Ticket kann wieder „in Bearbeitung“ kommen.',true,'Übergang „prüfen [abgelehnt]“.'],
 ['Aus „wartend“ führt genau eine Transition heraus.',true,'Nur „Kunde antwortet“ führt zurück nach „in Bearbeitung“.'],
 ['Der Endzustand wird nur über „geschlossen“ erreicht.',true,'Der einzige Pfeil in den Endzustand kommt aus „geschlossen“.'],
 ['Der Text in eckigen Klammern ist ein Ereignis.',false,'In eckigen Klammern steht der Guard (Bedingung). Das Ereignis steht davor.'],
 ['„in Bearbeitung“ hat drei eingehende Transitionen.',true,'Aus „offen“, aus „wartend“ und aus „gelöst“.']]},
{id:'r-st8',type:'st',base:'st8',t:'Benutzerkonto lesen',st:[
 ['Jede Fehlanmeldung führt sofort zur Sperrung.',false,'Guard [zaehler < 2] lässt das Konto im Zustand „aktiv“.'],
 ['Die Transition von „aktiv“ nach „aktiv“ ist eine Selbsttransition.',true,'Ausgangs- und Zielzustand sind identisch.'],
 ['after(30 min) ist ein Zeitereignis.',true,'after(…) löst nach Ablauf der Zeit aus.'],
 ['Ein gesperrtes Konto kann direkt gelöscht werden.',false,'„löschen“ geht nur von „aktiv“ aus.'],
 ['„zaehler++“ ist ein Guard.',false,'Nach dem Schrägstrich steht der Effekt (Aktion beim Übergang).'],
 ['Ein unbestätigtes Konto kann gesperrt werden.',false,'Aus „unbestätigt“ führt nur der Übergang nach „aktiv“.']]},
{id:'r-ac5',type:'ac',base:'ac5',t:'Bestellabwicklung lesen',st:[
 ['„Ware verpacken“ und „Rechnung erstellen“ werden entweder-oder ausgeführt.',false,'Nach dem Fork laufen beide Pfade parallel.'],
 ['„Paket versenden“ beginnt erst, wenn Verpacken und Rechnung abgeschlossen sind.',true,'Ein Join wartet auf alle eingehenden Pfade.'],
 ['Nach „Bestellung stornieren“ wird das Paket versendet.',false,'Nach „stornieren“ folgt direkt der Endknoten.'],
 ['Der Knoten nach „Zahlung prüfen“ ist ein Fork.',false,'Das ist eine Decision: Raute mit Guards, es wird ein Pfad gewählt.'],
 ['Die Aktivität besitzt zwei Endknoten.',true,'Einer nach „stornieren“, der zweite am Ende des Hauptpfads.'],
 ['An den Ausgängen des Forks stehen Guards.',false,'Ein Fork hat keine Bedingungen: Alle Pfade werden gestartet.']]},
{id:'r-ac4',type:'ac',base:'ac4',t:'Login-Schleife lesen',st:[
 ['Die Fehlermeldung wird höchstens zweimal angezeigt.',true,'Nach dem dritten Fehler wird das Konto ohne Meldung gesperrt.'],
 ['Nach „Konto sperren“ kann der Benutzer es erneut versuchen.',false,'Nach „Konto sperren“ steht ein Endknoten.'],
 ['Die Raute vor „Zugangsdaten eingeben“ ist ein Merge.',true,'Zwei Eingänge (Start und Rückfluss), ein Ausgang.'],
 ['Die Schleife entsteht durch den Rückfluss von „Fehlermeldung anzeigen“.',true,'Die Rückkante führt zum Merge vor der Dateneingabe.'],
 ['Bei korrekten Daten wird der Fehlversuchszähler erhöht.',false,'Der Zähler wird nur im Zweig [Daten falsch] erhöht.'],
 ['Die Aktion „Zugangsdaten prüfen“ kann mehrmals ausgeführt werden.',true,'Sie liegt innerhalb der Schleife.']]},
{id:'r-sq7',type:'sq',base:'sq7',t:'Geldautomat lesen',st:[
 ['Der Beleg wird bei jeder Auszahlung gedruckt.',false,'Die Nachricht steht im Fragment opt.'],
 ['Der Geldautomat wartet auf die Antwort von pruefeDeckung(…).',true,'Das ist eine synchrone Nachricht.'],
 ['Der Geldautomat wartet, bis der Drucker fertig ist.',false,'druckeBeleg() ist asynchron: Der Sender wartet nicht.'],
 ['abbuchen(…) ist eine Operation der Klasse Bankserver.',true,'Eine Nachricht ist der Aufruf einer Operation des Empfängers.'],
 ['Ist das Konto nicht gedeckt, wird trotzdem abgebucht.',false,'abbuchen steht im Operanden [Konto gedeckt] des Fragments alt.'],
 ['Die erste Nachricht des Ablaufs sendet der Bankserver.',false,'Die erste Nachricht sendet der Kunde.']]},
{id:'r-sq6',type:'sq',base:'sq6',t:'Bestellung mit loop lesen',st:[
 ['pruefeBestand(…) wird genau einmal aufgerufen.',false,'Die Nachricht steht im Fragment loop: einmal pro Position.'],
 ['Das Objekt :Bestellung existiert schon zu Beginn der Interaktion.',false,'Es wird durch die Nachricht «create» erzeugt.'],
 ['Die Lebenslinie von :Bestellung beginnt erst bei der create-Nachricht.',true,'Der Kopf der Lebenslinie steht auf Höhe der Nachricht «create».'],
 ['Die Antwort „bestellNr“ geht an das Frontend.',true,'Die Antwort geht zurück zum Aufrufer.'],
 ['Das Lager ruft eine Operation des BestellService auf.',false,'Vom Lager kommt nur eine Antwort (gestrichelt).'],
 ['Der Kunde kommuniziert direkt mit dem Lager.',false,'Der Kunde kommuniziert nur mit dem Frontend.']]}
];

/* ================= FEHLERSUCHAUFGABEN ================= */
const FIND_TASKS=[
{id:'f-uc4',type:'uc',base:'uc4',t:'Online-Shop mit Fehlern',mut:(d,I,E,N)=>{const z=N('zd'),B=box(N('be'));z.x=Math.round(B.cx+78);z.y=Math.round(B.cy+74);E('be','bz').kind='assoc';const g=E('gu','be');[g.from,g.to]=[g.to,g.from];const k=E('ku','ga');[k.from,k.to]=[k.to,k.from];}},
{id:'f-uc5',type:'uc',base:'uc5',t:'Stadtbibliothek mit Fehlern',mut:(d,I,E,N,A)=>{const i=E('al','ap');[i.from,i.to]=[i.to,i.from];E('mg','zu').kind='include';A('assoc','le','bi');}},
{id:'f-cl4',type:'cl',base:'cl4',t:'Bestellung mit Fehlern',mut:(d,I,E,N)=>{const c=E('be','po');[c.from,c.to]=[c.to,c.from];const a=E('ku','be');a.m1='0..*';a.m2='1';N('ar').attrs='- artikelNr : int\nbezeichnung : String\n- preis : double';N('ku').attrs='- kundenNr : int\n- name : String\n+ getName() : String';}},
{id:'f-cl2',type:'cl',base:'cl2',t:'Fahrzeugvermietung mit Fehlern',mut:(d,I,E,N)=>{E('au','mi').kind='gen';E('fp','fz').kind='comp';delete N('fz').stereo;const g=E('mr','fz');[g.from,g.to]=[g.to,g.from];E('ku','fz').m2='viele';}},
{id:'f-st7',type:'st',base:'st7',t:'Support-Ticket mit Fehlern',mut:(d,I,E,N,A)=>{E('w','b').label='';d.edges.find(e=>e.from===I.g&&e.to===I.c).label='prüfen [bestätigt';A('trans','@final','o','wieder öffnen');d.edges.find(e=>e.from===I.b&&e.to===I.w).label='lösen';}},
{id:'f-st5',type:'st',base:'st5',t:'Bestellung mit Fehlern',mut:(d,I,E,N,A)=>{A('trans','o','@initial','zurück');E('b','v').label='';A('trans','@final','s','reaktivieren');E('v','z').label='zustellen [Adresse korrekt';}},
{id:'f-ac4',type:'ac',base:'ac4',t:'Login mit Fehlern',mut:(d,I,E,N,A)=>{E('d1','st').label='';const b=E('fm','m1');b.to=I.ein;A('flow','f2','m1');E('d2','ks').label='Fehlversuche = 3';}},
{id:'f-ac5',type:'ac',base:'ac5',t:'Bestellabwicklung mit Fehlern',mut:(d,I,E,N,A)=>{E('fork','wv').label='[Ware vorhanden]';d.edges.splice(d.edges.indexOf(E('sto','f2')),1);d.nodes.splice(d.nodes.indexOf(N('f2')),1);E('d','sto').label='Zahlung nicht eingegangen';}},
{id:'f-sq5',type:'sq',base:'sq5',t:'Login mit Fehlern',mut:(d,I,E,N)=>{const r=d.rows;const m=r.find(x=>x.k===3);[m.from,m.to]=[m.to,m.from];r.find(x=>x.kind==='frag').guard='';const q=r.find(x=>x.k===5);[q.from,q.to]=[q.to,q.from];}},
{id:'f-sq7',type:'sq',base:'sq7',t:'Geldautomat mit Fehlern',mut:(d,I,E,N)=>{const r=d.rows;r.find(x=>x.k===6).mtype='reply';const i=r.findIndex(x=>x.k===6);r.splice(i+1,0,{id:'rx1',kind:'else',guard:'else'},{id:'rx2',kind:'msg',from:r[i].from,to:r[i].to,mtype:'async',text:'keinBeleg()'});const q=r.find(x=>x.k===7);[q.from,q.to]=[q.to,q.from];}},
];
function findDoc(ft){const b=DRAW_TASKS.find(x=>x.id===ft.base);const d=docFromSpec(b);const I=d.ids||{};
 const N=k=>d.nodes.find(n=>n.id===I[k]);const E=(a,b2)=>d.edges.find(e=>(e.from===I[a]&&e.to===I[b2]))||d.edges.find(e=>(e.from===I[b2]&&e.to===I[a]));
 const A=(kind,a,b2,label)=>{const e={id:'ex'+d.edges.length,kind,from:I[a],to:I[b2],label:label||''};d.edges.push(e);return e;};
 ft.mut(d,I,E,N,A);return d;}
/* Fehlerstellen = Befunde des Prüf-Bots, nach Element gruppiert */
function findSpots(ft,d){const b=DRAW_TASKS.find(x=>x.id===ft.base);const R=d.type==='sq'?checkSpecSQ(d,b.spec):checkSpec(d,b.spec);
 const all=RULES[d.type](d).concat(R.iss).filter(f=>(f.lv==='err'||f.lv==='warn')&&f.ids&&f.ids.filter(Boolean).length);
 const spots=[];all.forEach(f=>{const ids=f.ids.filter(Boolean);let s=spots.find(s=>s.ids.some(i=>ids.includes(i)));if(!s){s={ids:[],why:[]};spots.push(s);}ids.forEach(i=>{if(!s.ids.includes(i))s.ids.push(i);});if(!s.why.includes(f.t))s.why.push(f.t);});
 return spots;}
