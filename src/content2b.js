
/* ================= MEHR THEORIE, Teil 2: Zustands-, Aktivitäts-, Sequenzdiagramm ================= */
EXTRA.st={deep:`
<div class="card"><h3 style="margin-top:0">1. Was ist ein Zustand</h3>
<p>Ein Zustand ist eine <b>Situation im Leben eines einzelnen Objekts</b>, die eine gewisse Zeit andauert: Das Objekt wartet auf etwas oder tut etwas. Das Diagramm beschreibt immer <b>ein</b> Objekt (eine Klasse): Bestellung, Ticket, Gerät, Ampel.</p>
<table><tr><th>Richtig (Zustand)</th><th>Falsch (Aktion)</th></tr>
<tr><td>„Bestellt“, „In Bearbeitung“, „Versendet“</td><td>„Bestellung versenden“</td></tr>
<tr><td>„Verfügbar“, „Reserviert“, „Defekt“</td><td>„Gerät reservieren“</td></tr>
<tr><td>„Wartet auf Zahlung“</td><td>„Zahlung prüfen“ (das ist eine Aktion aus dem Aktivitätsdiagramm)</td></tr></table>
<div class="tip"><b>Probe:</b> Setze den Namen in den Satz „Das Objekt <u>ist</u> …“ ein. „Die Bestellung ist <i>versendet</i>“ klingt richtig, also ist es ein Zustand. „Die Bestellung ist <i>versenden</i>“ klingt falsch: Das ist eine Aktion.</div></div>

<div class="card"><h3 style="margin-top:0">2. Transition: die vollständige Syntax</h3>
<div class="q-box" style="font-size:18px;text-align:center"><code>Ereignis [Guard] / Effekt</code></div>
<table><tr><th>Teil</th><th>Bedeutung</th><th>Beispiel</th></tr>
<tr><td><b>Ereignis</b> (Trigger)</td><td>was passiert ist</td><td><code>bezahlen</code>, <code>karteEingeführt</code></td></tr>
<tr><td><b>[Guard]</b> (Bedingung)</td><td>Bedingung in eckigen Klammern; der Übergang schaltet nur, wenn sie wahr ist</td><td><code>[betrag &lt;= kontostand]</code></td></tr>
<tr><td><b>/ Effekt</b> (Aktion)</td><td>was <b>während</b> des Übergangs ausgeführt wird</td><td><code>/ quittungDrucken()</code></td></tr></table>
<p>Alle drei Teile sind optional. Vollständiges Beispiel: <code>pinEingegeben [pin korrekt] / menueAnzeigen()</code>.</p></div>

<div class="card"><h3 style="margin-top:0">3. Ereignisarten</h3>
<table><tr><th>Art</th><th>Notation</th><th>Signal im Text</th></tr>
<tr><td>Signal- oder Aufrufereignis</td><td><code>bestellen</code>, <code>abbrechen()</code></td><td>„der Kunde storniert“, „wird freigegeben“</td></tr>
<tr><td><b>Zeitereignis</b></td><td><code>after(30 s)</code>, <code>after(14 Tage)</code>, <code>at(00:00)</code></td><td>„nach 30 Sekunden“, „nach Ablauf von …“</td></tr>
<tr><td><b>Änderungsereignis</b></td><td><code>when(bestand &lt; 5)</code></td><td>„sobald der Bestand unter 5 fällt“</td></tr>
<tr><td>Ohne Ereignis (Completion)</td><td>nur ein Pfeil oder nur ein <code>[Guard]</code></td><td>der Übergang schaltet von selbst, sobald die do-Aktivität beendet ist</td></tr></table></div>

<div class="card"><h3 style="margin-top:0">4. Interne Aktionen: entry / do / exit</h3>
<pre class="code">┌──────────────────────────┐
│        Ausgeliehen       │
├──────────────────────────┤
│ entry / fristSetzen()    │   einmal beim Betreten
│ do    / tageZaehlen()    │   die ganze Zeit, solange der Zustand aktiv ist
│ exit  / fristLoeschen()  │   einmal beim Verlassen
└──────────────────────────┘</pre>
<ul class="clean"><li><b>entry</b> ist praktisch, wenn mehrere Pfeile in den Zustand führen und überall dieselbe Aktion nötig ist.</li>
<li><b>do</b> dauert an und kann durch ein Ereignis unterbrochen werden. Der Effekt eines Übergangs ist dagegen kurz und wird nicht unterbrochen.</li>
<li>Eine <b>Selbsttransition</b> (Pfeil aus dem Zustand in sich selbst) führt <code>exit</code> und erneut <code>entry</code> aus. Eine <b>interne Transition</b> (Zeile <code>ereignis / aktion</code> im Zustand) führt sie nicht aus.</li></ul></div>

<div class="card"><h3 style="margin-top:0">5. Guards und Verzweigung</h3>
<ul class="clean"><li>Gehen aus einem Zustand bei <b>demselben Ereignis</b> mehrere Pfeile ab, brauchen sie Guards, die <b>sich gegenseitig ausschließen</b>: <code>[pin korrekt]</code> und <code>[pin falsch]</code>.</li>
<li>Die Guards müssen alle Fälle abdecken. Praktisch: <code>[else]</code>.</li>
<li>Überschneiden sich Guards (<code>[x &gt; 5]</code> und <code>[x &gt; 3]</code>), ist der Automat <b>nicht deterministisch</b>: Das ist ein Fehler.</li>
<li>Man kann auch eine Raute (Entscheidung) zeichnen: Hinein führt ein Pfeil mit dem Ereignis, heraus führen Pfeile nur mit Guards.</li></ul></div>

<div class="card"><h3 style="margin-top:0">6. Startzustand, Endzustand und Weiteres</h3>
<table><tr><th>Element</th><th>Regeln</th></tr>
<tr><td><b>Startzustand</b> ●</td><td>genau einer; von ihm geht ein Pfeil <b>ohne Ereignis</b> aus (ein Effekt ist möglich); nichts führt hinein</td></tr>
<tr><td><b>Endzustand</b> ◉</td><td>es kann mehrere oder keinen geben (eine Ampel läuft endlos); nichts führt heraus</td></tr>
<tr><td><b>Zusammengesetzter Zustand</b></td><td>Zustand mit Unterzuständen im Inneren. Ein Pfeil vom Rahmen gilt für alle Unterzustände: praktisch für „abbrechen“ von jeder Stelle aus</td></tr>
<tr><td><b>History</b> (H)</td><td>bei der Rückkehr in den zusammengesetzten Zustand geht es in dem Unterzustand weiter, in dem man war</td></tr></table></div>

<div class="card"><h3 style="margin-top:0">7. Zustandsübergangstabelle</h3>
<p>In Aufgaben muss man manchmal eine Tabelle in ein Diagramm überführen oder umgekehrt. Beispiel für ein Support-Ticket:</p>
<table><tr><th>Ausgangszustand</th><th>Ereignis [Guard]</th><th>Aktion</th><th>Folgezustand</th></tr>
<tr><td>● (Start)</td><td></td><td></td><td>Offen</td></tr>
<tr><td>Offen</td><td>zuweisen</td><td>/ technikerBenachrichtigen()</td><td>In Bearbeitung</td></tr>
<tr><td>In Bearbeitung</td><td>rueckfrageStellen</td><td></td><td>Wartet auf Kunde</td></tr>
<tr><td>Wartet auf Kunde</td><td>antwortErhalten</td><td></td><td>In Bearbeitung</td></tr>
<tr><td>In Bearbeitung</td><td>loesen</td><td></td><td>Gelöst</td></tr>
<tr><td>Gelöst</td><td>after(7 Tage)</td><td></td><td>Geschlossen</td></tr></table>
<div class="tip">Jede Tabellenzeile ist genau ein Pfeil. Zeichne zuerst alle Zustände aus der ersten und der letzten Spalte, dann ergänze Zeile für Zeile die Pfeile.</div></div>

<div class="card"><h3 style="margin-top:0">8. Signalwörter: vom Text zum Diagramm</h3>
<table><tr><th>Im Text steht</th><th>Im Diagramm</th></tr>
<tr><td>„befindet sich im Zustand …“, „ist …“, „gilt als …“</td><td>Zustand</td></tr>
<tr><td>„Nach dem Anlegen ist … zunächst …“, „Ein neues … ist …“</td><td>Pfeil vom Startzustand</td></tr>
<tr><td>„wird …“, „sobald …“, „durch …“, „wenn der Kunde …“</td><td>Ereignis an der Transition</td></tr>
<tr><td>„nur wenn“, „falls“, „sofern“</td><td>[Guard]</td></tr>
<tr><td>„dabei wird …“, „gleichzeitig wird … verschickt“</td><td>/ Effekt</td></tr>
<tr><td>„nach 14 Tagen“, „nach Ablauf“</td><td>after(…)</td></tr>
<tr><td>„kann jederzeit“, „aus jedem Zustand“</td><td>Pfeile aus mehreren Zuständen (oder ein zusammengesetzter Zustand)</td></tr>
<tr><td>„endgültig“, „damit endet der Lebenszyklus“</td><td>Pfeil in den Endzustand</td></tr></table></div>

<div class="card"><h3 style="margin-top:0">9. Vom Diagramm zum Code</h3>
<p>Von Fachinformatikern wird oft die Umsetzung verlangt. Das klassische Muster: ein <code>enum</code> für die Zustände und eine Methode pro Ereignis.</p>
<pre class="code">enum Status { OFFEN, IN_BEARBEITUNG, GELOEST, GESCHLOSSEN }

class Ticket {
    private Status status = Status.OFFEN;          // Startzustand

    public void zuweisen() {                       // Ereignis
        if (status == Status.OFFEN) {              // Ausgangszustand
            technikerBenachrichtigen();            // Effekt
            status = Status.IN_BEARBEITUNG;        // Folgezustand
        }
    }
}</pre>
<p>Ein Ereignis in einem Zustand, in dem es dafür keinen Pfeil gibt, wird <b>ignoriert</b>: Das Objekt bleibt im selben Zustand.</p></div>

<div class="card"><h3 style="margin-top:0">10. Was das Diagramm nicht zeigt</h3>
<ul class="clean"><li>das Zusammenspiel <b>mehrerer</b> Objekte (dafür Sequenzdiagramm);</li><li>einen schrittweisen Ablauf mit Beteiligten (Aktivitätsdiagramm);</li><li>Attribute und Methoden einer Klasse (Klassendiagramm).</li></ul>
<div class="tip"><b>Zustands- oder Aktivitätsdiagramm?</b> Im Zustandsdiagramm sind die Knoten <i>Wartezustände</i> und die Pfeilbeschriftungen Ereignisse. Im Aktivitätsdiagramm sind die Knoten <i>Aktionen</i> und die Pfeile nur die Reihenfolge. Stehen in deinen Rechtecken Verben, zeichnest du ein Aktivitätsdiagramm.</div></div>`,
exam:`
<div class="card"><h3 style="margin-top:0">So wird gefragt</h3>
<ul class="clean"><li><b>„Erstellen Sie ein Zustandsdiagramm für das Objekt …“</b> Text mit einem Lebenszyklus (Bestellung, Ticket, Leihgerät, Benutzerkonto).</li>
<li><b>„Ergänzen Sie die fehlenden Zustände und Transitionen.“</b> Diagramm mit Lücken.</li>
<li><b>„Überführen Sie die Zustandsübergangstabelle in ein Diagramm“</b> oder umgekehrt.</li>
<li><b>„In welchem Zustand befindet sich das Objekt nach den Ereignissen a, b, c?“</b> Das Diagramm durchlaufen.</li>
<li><b>„Erläutern Sie die Beschriftung Ereignis [Bedingung] / Aktion.“</b></li>
<li><b>„Erläutern Sie den Unterschied zwischen entry-, do- und exit-Aktionen.“</b></li>
<li><b>„Implementieren Sie den Zustandsautomaten“</b> (enum + switch/if).</li></ul></div>
<div class="card"><h3 style="margin-top:0">Lösungsplan in 6 Schritten</h3>
<ol><li>Bestimme das <b>Objekt</b>, dessen Lebenszyklus beschrieben wird. Das Diagramm handelt nur von ihm.</li>
<li>Schreibe alle <b>Zustände</b> heraus (Adjektive und Partizipien).</li>
<li>Finde den Anfangszustand und zeichne den Startzustand mit einem Pfeil dorthin.</li>
<li>Frage bei jedem Zustand: „Was kann hier passieren und wohin führt das?“ Das ergibt die Pfeile mit Ereignissen.</li>
<li>Ergänze Guards („nur wenn“) und Effekte („dabei wird“).</li>
<li>Prüfe, ob jeder Zustand erreichbar ist und aus jedem (außer den Endzuständen) ein Weg herausführt. Wird ein Endzustand gebraucht?</li></ol></div>
<div class="card"><h3 style="margin-top:0">Checkliste vor der Abgabe</h3>
<ul class="clean"><li>Sind die Zustandsnamen Zustände und keine Aktionen?</li><li>Genau ein Startzustand, der Pfeil von dort ohne Ereignis?</li><li>Hat jeder andere Pfeil ein Ereignis (oder bewusst nur einen Guard)?</li><li>Stehen die Guards in eckigen Klammern und schließen sie sich gegenseitig aus?</li><li>Steht der Effekt nach dem Schrägstrich?</li><li>Gibt es keine „Sackgassen“ und keine unerreichbaren Zustände?</li><li>Sind alle Ereignisse aus dem Text verwendet?</li></ul></div>
<div class="card"><h3 style="margin-top:0">Fertige Formulierungen</h3>
<div class="q-box"><b>Zweck:</b> „Das Zustandsdiagramm zeigt, welche Zustände ein Objekt im Laufe seines Lebens annehmen kann und durch welche Ereignisse es von einem Zustand in einen anderen wechselt.“</div>
<div class="q-box"><b>Transition:</b> „Die Transition wird durch das Ereignis ausgelöst. Sie wird nur ausgeführt, wenn die Bedingung (Guard) in eckigen Klammern erfüllt ist. Beim Übergang wird die Aktion nach dem Schrägstrich ausgeführt.“</div>
<div class="q-box"><b>entry / do / exit:</b> „Die entry-Aktion wird einmal beim Betreten des Zustands ausgeführt, die do-Aktivität läuft, solange sich das Objekt im Zustand befindet, und die exit-Aktion wird einmal beim Verlassen ausgeführt.“</div>
<div class="q-box"><b>Zustand / Aktion:</b> „Ein Zustand hat eine Dauer: Das Objekt wartet auf ein Ereignis. Eine Aktion ist ein kurzer Vorgang ohne Dauer.“</div>
<div class="q-box"><b>Abgrenzung:</b> „Das Zustandsdiagramm betrachtet genau ein Objekt. Das Aktivitätsdiagramm beschreibt dagegen einen Ablauf, an dem mehrere Beteiligte mitwirken können.“</div></div>`};

EXTRA.ac={deep:`
<div class="card"><h3 style="margin-top:0">1. Die Idee: Ein Token läuft durch das Diagramm</h3>
<p>Stell dir eine Spielmarke (<b>Token</b>) vor, die im Startknoten losläuft und den Pfeilen folgt. Eine Aktion wird ausgeführt, sobald ein Token bei ihr ankommt. Alle Regeln des Diagramms lassen sich über das Token erklären:</p>
<ul class="clean"><li><b>Entscheidung</b> (Raute): Das Token nimmt genau <b>einen</b> Zweig.</li>
<li><b>Fork</b> (Balken): Das Token wird auf alle Ausgänge <b>kopiert</b>, die Zweige laufen parallel.</li>
<li><b>Join</b> (Balken): wartet auf ein Token an <b>allen</b> Eingängen und verschmilzt sie zu einem.</li>
<li><b>Aktivitätsende</b> ◉: vernichtet alle Tokens, die gesamte Aktivität ist beendet.</li>
<li><b>Ablaufende</b> ⊗: vernichtet nur ein Token, die übrigen Zweige laufen weiter.</li></ul></div>

<div class="card"><h3 style="margin-top:0">2. Aktionen</h3>
<p>Eine Aktion ist ein Schritt des Ablaufs in einem Rechteck mit abgerundeten Ecken. Name: <b>Substantiv + Verb</b>: „Bestellung prüfen“, „Rechnung erstellen“.</p>
<ul class="clean"><li>Eine normale Aktion hat <b>einen Eingang und einen Ausgang</b>. Verzweigen und Zusammenführen erfolgt über Raute oder Balken.</li>
<li>Führen zwei Pfeile ohne Merge in eine Aktion, ist das nach UML ein <b>implizites Join</b>: Die Aktion wartet auf ein Token an beiden Pfeilen und startet bei alternativen Zweigen nie. Setze deshalb eine Raute (Zusammenführung) davor.</li>
<li>Halte den Detailgrad einheitlich: Mische nicht „Bestellung abwickeln“ mit „Button klicken“.</li></ul></div>

<div class="card"><h3 style="margin-top:0">3. Entscheidung und Zusammenführung</h3>
<table><tr><th></th><th>Entscheidung (Decision)</th><th>Zusammenführung (Merge)</th></tr>
<tr><td>Pfeile</td><td>1 Eingang, mehrere Ausgänge</td><td>mehrere Eingänge, 1 Ausgang</td></tr>
<tr><td>Beschriftung</td><td>an <b>jedem</b> Ausgang ein Guard: <code>[Lager &gt; 0]</code>, <code>[else]</code></td><td>ohne Beschriftung</td></tr>
<tr><td>Bedeutung</td><td>Auswahl eines Zweigs</td><td>alternative Zweige laufen wieder zusammen</td></tr></table>
<ul class="clean"><li>Guards müssen <b>sich gegenseitig ausschließen</b> und <b>alle Fälle abdecken</b>.</li>
<li>Die Entscheidungsfrage kann neben der Raute oder in der vorherigen Aktion stehen („Lagerbestand prüfen“).</li>
<li>In der Raute steht <b>kein Text</b> (anders als im Programmablaufplan).</li></ul></div>

<div class="card"><h3 style="margin-top:0">4. Schleifen</h3>
<p>Ein eigenes Schleifensymbol gibt es nicht: Eine Schleife ist ein Pfeil zurück zu einem Merge.</p>
<pre class="code">kopfgesteuert (while)                fußgesteuert (do-while)

   ●                                    ●
   ▼                                    ▼
   ◇◄──────────────┐  Merge             ◇◄──────────────┐  Merge
   ▼               │                    ▼               │
   ◇ Entscheidung  │                 [ Aktion ]         │
   │[weiter]       │                    ▼               │
   ▼               │                    ◇ Entscheidung  │
[ Aktion ]─────────┘                    │[nochmal]──────┘
   │[fertig]                            │[fertig]
   ▼                                    ▼
   ◉                                    ◉</pre>
<p>Typisches Beispiel: „PIN eingeben“ wird wiederholt, solange die PIN falsch ist und weniger als drei Versuche gemacht wurden. Der Pfeil zurück führt <b>in den Merge</b> vor der Aktion, nicht direkt in die Aktion.</p></div>

<div class="card"><h3 style="margin-top:0">5. Parallelität: Fork und Join</h3>
<table><tr><th></th><th>Entscheidung / Merge ◇</th><th>Fork / Join ▬</th></tr>
<tr><td>Logik</td><td><b>ODER</b>: ein Zweig wird ausgeführt</td><td><b>UND</b>: alle Zweige werden ausgeführt</td></tr>
<tr><td>Beschriftung</td><td>Guards sind Pflicht</td><td>Guards werden <b>nicht notiert</b></td></tr>
<tr><td>Wird geschlossen durch</td><td>Merge (Raute)</td><td>Join (Balken)</td></tr>
<tr><td>Signal im Text</td><td>„falls“, „wenn“, „entweder … oder“</td><td>„gleichzeitig“, „parallel“, „währenddessen“, „unabhängig voneinander“</td></tr></table>
<div class="tip"><b>Der Hauptfehler:</b> einen Fork öffnen und mit einer Raute schließen (oder umgekehrt). Was ein Balken öffnet, schließt ein Balken. Was eine Raute öffnet, schließt eine Raute.</div></div>

<div class="card"><h3 style="margin-top:0">6. Swimlanes (Partitionen)</h3>
<ul class="clean"><li>Jede Bahn ist ein <b>Verantwortungsbereich</b>: Rolle, Abteilung oder System („Kunde“, „Vertrieb“, „Lager“, „System“).</li>
<li>Eine Aktion steht in der Bahn dessen, der sie <b>ausführt</b>.</li>
<li>Pfeile dürfen Bahngrenzen frei überqueren: So sieht man die Übergabe der Verantwortung.</li>
<li>Der Startknoten steht in der Bahn dessen, der den Ablauf beginnt.</li>
<li>Auch Rauten und Balken liegen in einer Bahn, meist dort, wo die Entscheidung getroffen wird.</li></ul></div>

<div class="card"><h3 style="margin-top:0">7. Weitere Elemente</h3>
<table><tr><th>Element</th><th>Art</th><th>Bedeutung</th></tr>
<tr><td><b>Objektknoten</b></td><td>Rechteck mit dem Objektnamen, optional mit Zustand: <code>Rechnung [bezahlt]</code></td><td>Daten, die zwischen Aktionen übergeben werden (Objektfluss)</td></tr>
<tr><td><b>Signal senden</b></td><td>Fünfeck mit „Pfeil“ nach rechts</td><td>ein Signal senden, ohne auf Antwort zu warten</td></tr>
<tr><td><b>Signal empfangen</b></td><td>Fünfeck mit Einkerbung</td><td>auf ein externes Ereignis warten</td></tr>
<tr><td><b>Zeitereignis</b></td><td>Sanduhr</td><td>„3 Tage warten“, „jeden Montag“</td></tr>
<tr><td><b>Aufruf einer Aktivität</b></td><td>Aktion mit dem „Harken“-Symbol</td><td>der Schritt ist in einem eigenen Diagramm verfeinert</td></tr></table></div>

<div class="card"><h3 style="margin-top:0">8. Code ↔ Aktivitätsdiagramm</h3>
<table><tr><th>Im Code / Pseudocode</th><th>Im Diagramm</th></tr>
<tr><td><code>a(); b();</code></td><td>Aktion a, Pfeil, Aktion b</td></tr>
<tr><td><code>if (x) { a(); } else { b(); }</code></td><td>Entscheidung mit <code>[x]</code> und <code>[else]</code>, zwei Zweige, danach Merge</td></tr>
<tr><td><code>if (x) { a(); }</code></td><td>Entscheidung: Zweig <code>[x]</code> mit Aktion und leerer Zweig <code>[else]</code> direkt in den Merge</td></tr>
<tr><td><code>while (x) { a(); }</code></td><td>Merge, Entscheidung, <code>[x]</code> in die Aktion und zurück in den Merge, <code>[else]</code> weiter</td></tr>
<tr><td><code>do { a(); } while (x);</code></td><td>Merge, Aktion, Entscheidung, <code>[x]</code> zurück in den Merge</td></tr>
<tr><td><code>for (i = 0; i &lt; n; i++)</code></td><td>Aktion „i = 0“, dann wie while mit „i erhöhen“ am Ende des Rumpfs</td></tr>
<tr><td><code>switch (x)</code></td><td>eine Entscheidung mit mehreren Ausgängen</td></tr>
<tr><td><code>return</code> innerhalb eines Zweigs</td><td>Pfeil zum Aktivitätsende</td></tr></table></div>

<div class="card"><h3 style="margin-top:0">9. Signalwörter: vom Text zum Diagramm</h3>
<table><tr><th>Im Text steht</th><th>Im Diagramm</th></tr>
<tr><td>„zuerst“, „anschließend“, „danach“, „zum Schluss“</td><td>Kontrollfluss (Pfeil)</td></tr>
<tr><td>„falls“, „wenn … sonst“, „abhängig von“, „bei Erfolg / bei Fehler“</td><td>Entscheidung mit Guards</td></tr>
<tr><td>„gleichzeitig“, „parallel“, „währenddessen“</td><td>Fork und Join</td></tr>
<tr><td>„solange“, „bis“, „erneut“, „wiederholen“, „maximal dreimal“</td><td>Schleife: Pfeil zurück zum Merge</td></tr>
<tr><td>„Der Kunde …“, „Das Lager …“, „Die Buchhaltung …“</td><td>Swimlanes</td></tr>
<tr><td>„Der Vorgang wird abgebrochen“</td><td>Aktivitätsende in diesem Zweig</td></tr></table></div>

<div class="card"><h3 style="margin-top:0">10. Was das Diagramm nicht zeigt</h3>
<ul class="clean"><li>die Klassenstruktur und die Daten (Klassendiagramm);</li><li>den genauen Nachrichtenaustausch zwischen Objekten (Sequenzdiagramm);</li><li>die Zustände eines einzelnen Objekts (Zustandsdiagramm).</li></ul></div>`,
exam:`
<div class="card"><h3 style="margin-top:0">So wird gefragt</h3>
<ul class="clean"><li><b>„Stellen Sie den Ablauf als Aktivitätsdiagramm dar.“</b> Text mit einer Prozessbeschreibung, oft mit Abteilungen (Swimlanes).</li>
<li><b>„Erstellen Sie ein Aktivitätsdiagramm zu folgendem Pseudocode / Quellcode.“</b></li>
<li><b>„Ergänzen Sie das Diagramm um …“</b> Einen Zweig, eine Schleife oder einen parallelen Abschnitt hinzufügen.</li>
<li><b>„Erläutern Sie den Unterschied zwischen Entscheidung und Parallelisierung.“</b></li>
<li><b>„Welche Aktionen werden ausgeführt, wenn …?“</b> Das Diagramm mit konkreten Werten durchlaufen.</li>
<li><b>„Finden Sie die Fehler.“</b> Fehlende Guards, Fork mit Raute geschlossen, kein Startknoten, Sackgasse.</li></ul></div>
<div class="card"><h3 style="margin-top:0">Lösungsplan in 6 Schritten</h3>
<ol><li>Markiere die <b>Aktionen</b> (Verben) und die <b>Ausführenden</b>.</li>
<li>Gibt es mehrere Ausführende, zeichne gleich Swimlanes.</li>
<li>Setze den Startknoten und baue den „Gutfall“ vom Anfang bis zum Aktivitätsende auf.</li>
<li>Ergänze Entscheidungen mit Guards und alternative Zweige; führe jeden bis zu einem Merge oder bis zum Ende.</li>
<li>Ergänze Schleifen (Pfeil zurück in den Merge) und parallele Abschnitte (Fork … Join).</li>
<li>Fahre mit dem Finger wie ein Token durch: Gibt es überall einen Ausgang? Sind alle Bedingungen aus dem Text berücksichtigt?</li></ol></div>
<div class="card"><h3 style="margin-top:0">Checkliste vor der Abgabe</h3>
<ul class="clean"><li>Gibt es genau einen Startknoten und mindestens einen Endknoten?</li><li>Steht an jedem Ausgang jeder Entscheidung ein Guard in eckigen Klammern?</li><li>Laufen Zweige über einen Merge (Raute) zusammen und nicht direkt in eine Aktion?</li><li>Ist jeder Fork durch einen Join geschlossen, und haben Balken keine Guards?</li><li>Hat jede Aktion einen Eingang und einen Ausgang?</li><li>Sind die Aktionen mit Verben benannt und stehen sie in den richtigen Swimlanes?</li><li>Haben die Pfeile eine Richtung?</li></ul></div>
<div class="card"><h3 style="margin-top:0">Fertige Formulierungen</h3>
<div class="q-box"><b>Zweck:</b> „Das Aktivitätsdiagramm beschreibt den Ablauf eines Prozesses: die einzelnen Aktionen, ihre Reihenfolge, Verzweigungen, Schleifen und parallele Abläufe.“</div>
<div class="q-box"><b>Entscheidung / Parallelisierung:</b> „Bei einer Entscheidung (Raute) wird abhängig von den Bedingungen genau ein Zweig durchlaufen. Bei einer Parallelisierung (Balken) werden alle Zweige nebenläufig ausgeführt. Erst wenn alle Zweige beendet sind, geht es nach der Synchronisation weiter.“</div>
<div class="q-box"><b>Swimlanes:</b> „Verantwortungsbereiche (Partitionen) ordnen die Aktionen den Beteiligten zu. So ist erkennbar, wer welche Aktion ausführt.“</div>
<div class="q-box"><b>Aktivitätsende / Ablaufende:</b> „Das Aktivitätsende beendet die gesamte Aktivität. Das Ablaufende beendet nur den einen Kontrollfluss, alle anderen laufen weiter.“</div>
<div class="q-box"><b>Schleife:</b> „Eine Schleife entsteht, indem der Kontrollfluss nach einer Entscheidung über einen Verbindungsknoten zu einer früheren Aktion zurückgeführt wird.“</div></div>`};

EXTRA.sq={deep:`
<div class="card"><h3 style="margin-top:0">1. Lebenslinien</h3>
<p>Jeder Beteiligte ist ein Rechteck mit einer gestrichelten Linie nach unten. Beschriftung: <code>name : Klasse</code>.</p>
<table><tr><th>Notation</th><th>Bedeutung</th></tr>
<tr><td><code>k1 : Kunde</code></td><td>Objekt k1 der Klasse Kunde</td></tr>
<tr><td><code>: Warenkorb</code></td><td>anonymes Objekt der Klasse Warenkorb (die häufigste Variante)</td></tr>
<tr><td><code>shop</code></td><td>nur der Name des Objekts oder der Rolle</td></tr>
<tr><td>Strichmännchen</td><td>Akteur: Mensch oder externes System, das das Szenario auslöst</td></tr></table>
<ul class="clean"><li>Der <b>Aktivierungsbalken</b> (schmales Rechteck auf der Linie) zeigt, dass das Objekt gerade eine Methode ausführt.</li>
<li>Reihenfolge von links nach rechts: meist Akteur, dann Oberfläche, Logik, Daten.</li>
<li>Die horizontale Position hat keine Bedeutung. Die Zeit läuft nur <b>von oben nach unten</b>.</li></ul></div>

<div class="card"><h3 style="margin-top:0">2. Nachrichtenarten</h3>
<table><tr><th>Art</th><th>Pfeil</th><th>Bedeutung</th></tr>
<tr><td><b>synchron</b></td><td>durchgezogene Linie, <b>gefüllte</b> Pfeilspitze ▶</td><td>Methodenaufruf: Der Sender <b>wartet</b> auf die Antwort</td></tr>
<tr><td><b>asynchron</b></td><td>durchgezogene Linie, <b>offene</b> Pfeilspitze &gt;</td><td>Signal: Der Sender <b>wartet nicht</b> und arbeitet weiter</td></tr>
<tr><td><b>Antwort</b> (Rückgabe)</td><td><b>gestrichelt</b>, offene Pfeilspitze</td><td>Rückgabe des Ergebnisses auf einen synchronen Aufruf</td></tr>
<tr><td><b>Erzeugung</b></td><td>gestrichelt zum <b>Kopf</b> der neuen Linie, «create»</td><td>das Objekt wird in diesem Moment erzeugt (<code>new</code>)</td></tr>
<tr><td><b>Zerstörung</b></td><td>die Linie endet mit einem Kreuz ✕</td><td>das Objekt ist gelöscht</td></tr>
<tr><td><b>Selbstaufruf</b></td><td>Pfeilschleife auf dieselbe Linie</td><td>das Objekt ruft eine eigene Methode auf</td></tr></table>
<p>Beschriftung einer Nachricht: <code>methodenName(parameter)</code>, zum Beispiel <code>pruefePin(pin)</code>. Beschriftung einer Antwort: der Rückgabewert, zum Beispiel <code>true</code>, <code>preis</code> oder <code>ok = pruefePin(pin)</code>.</p>
<div class="tip"><b>Regel:</b> Zeichne zu jedem synchronen Aufruf, dessen Ergebnis wichtig ist, eine Antwort. Antworten auf Aufrufe ohne Ergebnis (<code>void</code>) darf man weglassen, dann aber einheitlich im ganzen Diagramm.</div></div>

<div class="card"><h3 style="margin-top:0">3. Kombinierte Fragmente</h3>
<p>Rahmen mit dem Operator in der linken oberen Ecke und dem Guard in eckigen Klammern.</p>
<table><tr><th>Operator</th><th>Bedeutung</th><th>Entsprechung im Code</th></tr>
<tr><td><b>alt</b></td><td>Alternativen: mehrere Bereiche, durch gestrichelte Linien getrennt, jeder mit Guard; genau einer wird ausgeführt</td><td><code>if … else</code></td></tr>
<tr><td><b>opt</b></td><td>Option: ein Bereich, wird nur ausgeführt, wenn der Guard wahr ist</td><td><code>if</code> ohne else</td></tr>
<tr><td><b>loop</b></td><td>Wiederholung: <code>loop [für jede Position]</code>, <code>loop(1,3)</code></td><td><code>for</code>, <code>while</code></td></tr>
<tr><td><b>par</b></td><td>die Bereiche werden parallel ausgeführt</td><td>Threads</td></tr>
<tr><td><b>break</b></td><td>ist der Guard wahr, wird der Bereich ausgeführt und das umgebende Fragment verlassen</td><td><code>break</code>, <code>return</code></td></tr>
<tr><td><b>ref</b></td><td>Verweis auf ein anderes Sequenzdiagramm</td><td>Aufruf eines Unterprogramms</td></tr></table>
<ul class="clean"><li>Der Rahmen muss <b>alle Lebenslinien</b> umfassen, die an den Nachrichten darin beteiligt sind.</li>
<li>Fragmente lassen sich verschachteln: <code>loop</code> mit <code>alt</code> darin.</li>
<li>Ein <b>alt</b> hat mindestens zwei Bereiche; der letzte ist oft <code>[else]</code>. Ein einzelner Bereich mit Bedingung ist ein <b>opt</b>.</li></ul></div>

<div class="card"><h3 style="margin-top:0">4. Bezug zum Klassendiagramm</h3>
<p>Das ist eine beliebte Stelle für Fragen wie „Welche Methoden muss die Klasse … besitzen?“.</p>
<ul class="clean"><li>Eine Nachricht <code>m()</code> von A an B bedeutet: Die Methode <code>m()</code> ist in der Klasse des <b>Empfängers B</b> deklariert.</li>
<li>Damit A B aufrufen kann, braucht es zwischen ihren Klassen eine <b>Assoziation</b> (A kennt B).</li>
<li>Parameter und Rückgabewerte müssen zu den Signaturen im Klassendiagramm passen.</li>
<li>«create» entspricht dem Aufruf des Konstruktors.</li></ul></div>

<div class="card"><h3 style="margin-top:0">5. Code ↔ Sequenzdiagramm</h3>
<pre class="code">class Kasse {
    void verkaufe(Artikel a, Lager lager) {
        if (lager.istVerfuegbar(a)) {          // synchron + Antwort
            double p = a.getPreis();           // synchron + Antwort
            Beleg b = new Beleg(p);            // «create»
            b.drucken();                       // synchron
        } else {
            anzeigen("nicht lieferbar");       // Selbstaufruf
        }
    }
}</pre>
<table><tr><th>Im Code</th><th>Im Diagramm</th></tr>
<tr><td><code>objekt.methode(x)</code></td><td>synchrone Nachricht <code>methode(x)</code> an die Linie objekt</td></tr>
<tr><td><code>wert = objekt.methode()</code></td><td>Nachricht und gestrichelte Antwort <code>wert</code></td></tr>
<tr><td><code>new Klasse()</code></td><td>«create» zum Kopf der neuen Lebenslinie</td></tr>
<tr><td><code>if / else</code></td><td>alt mit zwei Bereichen</td></tr>
<tr><td><code>if</code> ohne else</td><td>opt</td></tr>
<tr><td><code>for</code>, <code>while</code></td><td>loop</td></tr>
<tr><td><code>this.methode()</code></td><td>Selbstaufruf</td></tr></table></div>

<div class="card"><h3 style="margin-top:0">6. Signalwörter: vom Text zum Diagramm</h3>
<table><tr><th>Im Text steht</th><th>Im Diagramm</th></tr>
<tr><td>„ruft … auf“, „fragt … ab“, „prüft bei …“, „wartet auf das Ergebnis“</td><td>synchron + Antwort</td></tr>
<tr><td>„benachrichtigt“, „sendet eine E-Mail“, „ohne auf Antwort zu warten“, „stößt an“</td><td>asynchron</td></tr>
<tr><td>„liefert … zurück“, „meldet … zurück“, „antwortet mit“</td><td>Antwort (gestrichelt)</td></tr>
<tr><td>„wenn … sonst …“, „bei Erfolg … andernfalls …“</td><td>alt</td></tr>
<tr><td>„falls gewünscht“, „optional“, „nur wenn“</td><td>opt</td></tr>
<tr><td>„für jede Position“, „solange“, „bis zu dreimal“</td><td>loop</td></tr>
<tr><td>„wird erzeugt“, „legt ein neues … an“</td><td>«create»</td></tr></table></div>

<div class="card"><h3 style="margin-top:0">7. Typische Kette in einer Anwendung</h3>
<pre class="code">Benutzer → : Oberfläche → : Controller / Service → : Datenbank / Repository</pre>
<p>Die Anfrage läuft von links nach rechts, die Antworten kommen in umgekehrter Reihenfolge zurück: Wer zuletzt aufgerufen hat, bekommt zuerst die Antwort. Ein Objekt kann nicht antworten, solange es selbst auf die Antwort des nächsten wartet.</p></div>

<div class="card"><h3 style="margin-top:0">8. Was das Diagramm nicht zeigt</h3>
<ul class="clean"><li>alle möglichen Wege auf einmal: Ein Sequenzdiagramm zeigt <b>ein Szenario</b> (mit Fragmenten einige Varianten);</li><li>Attribute und die vollständige Klassenstruktur (Klassendiagramm);</li><li>die Zustände eines Objekts (Zustandsdiagramm);</li><li>den Ablauf aus Sicht der Abteilungen (Aktivitätsdiagramm).</li></ul></div>`,
exam:`
<div class="card"><h3 style="margin-top:0">So wird gefragt</h3>
<ul class="clean"><li><b>„Erstellen Sie ein Sequenzdiagramm für den beschriebenen Ablauf.“</b> Text eines Szenarios mit Beteiligten.</li>
<li><b>„Erstellen Sie ein Sequenzdiagramm zum Quellcode.“</b> Eine Methode in Java/C#, die Aufrufe sind darzustellen.</li>
<li><b>„Ergänzen Sie die fehlenden Nachrichten / das Fragment.“</b></li>
<li><b>„Welche Methoden benötigt die Klasse …?“</b> An den eingehenden Pfeilen ablesen.</li>
<li><b>„Erläutern Sie den Unterschied zwischen synchronen und asynchronen Nachrichten.“</b></li>
<li><b>„Erklären Sie die Fragmente alt, opt und loop.“</b></li>
<li><b>„Finden Sie die Fehler.“</b> Antwort mit durchgezogener Linie, Antwort vor dem Aufruf, alt mit nur einem Bereich, Nachricht aus dem Nichts.</li></ul></div>
<div class="card"><h3 style="margin-top:0">Lösungsplan in 6 Schritten</h3>
<ol><li>Schreibe die <b>Beteiligten</b> in der Reihenfolge ihres Auftretens heraus und zeichne die Lebenslinien von links nach rechts.</li>
<li>Geh den Text Satz für Satz durch: Jedes „A tut etwas bei B“ ist ein Pfeil von A nach B.</li>
<li>Entscheide für jeden Pfeil: synchron (wartet) oder asynchron (wartet nicht).</li>
<li>Ergänze gestrichelte Antworten dort, wo ein Ergebnis zurückkommt.</li>
<li>Finde Bedingungen und Wiederholungen und rahme die betroffenen Nachrichten mit alt / opt / loop samt Guards ein.</li>
<li>Prüfe: Die Pfeile laufen zeitlich strikt von oben nach unten, zu jedem Aufruf gibt es einen Empfänger mit dieser Methode.</li></ol></div>
<div class="card"><h3 style="margin-top:0">Checkliste vor der Abgabe</h3>
<ul class="clean"><li>Haben alle Lebenslinien eine Beschriftung (<code>: Klasse</code>)?</li><li>Aufrufe durchgezogen, Antworten gestrichelt?</li><li>Pfeilspitzen: gefüllt für synchron, offen für asynchron und Antwort?</li><li>Ist jede Nachricht beschriftet?</li><li>Haben die Fragmente Operator und Guard, hat alt mindestens zwei Bereiche?</li><li>Steht die Antwort unter ihrem Aufruf und läuft sie in die Gegenrichtung?</li><li>Entspricht die Reihenfolge der Nachrichten dem Text?</li></ul></div>
<div class="card"><h3 style="margin-top:0">Fertige Formulierungen</h3>
<div class="q-box"><b>Zweck:</b> „Das Sequenzdiagramm zeigt den zeitlichen Ablauf des Nachrichtenaustauschs zwischen Objekten in einem konkreten Szenario. Die Zeit verläuft von oben nach unten.“</div>
<div class="q-box"><b>synchron / asynchron:</b> „Bei einer synchronen Nachricht wartet der Sender, bis der Empfänger die Verarbeitung beendet hat und antwortet (ausgefüllte Pfeilspitze). Bei einer asynchronen Nachricht arbeitet der Sender sofort weiter, ohne auf eine Antwort zu warten (offene Pfeilspitze).“</div>
<div class="q-box"><b>alt / opt / loop:</b> „alt beschreibt Alternativen, von denen genau eine ausgeführt wird (if-else). opt beschreibt einen optionalen Teil, der nur bei erfüllter Bedingung ausgeführt wird (if ohne else). loop beschreibt eine Wiederholung, solange die Bedingung gilt.“</div>
<div class="q-box"><b>Lebenslinie / Aktivierung:</b> „Die Lebenslinie stellt die Existenz eines Objekts über die Zeit dar. Der Aktivierungsbalken zeigt, in welchem Zeitraum das Objekt eine Methode ausführt.“</div>
<div class="q-box"><b>Bezug zum Klassendiagramm:</b> „Jede Nachricht entspricht einer Methode in der Klasse des Empfängers. Zwischen den Klassen von Sender und Empfänger muss eine Beziehung bestehen.“</div></div>`};
