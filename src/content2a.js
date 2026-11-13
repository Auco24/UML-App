
/* ================= MEHR THEORIE: Vertiefung + Prüfungsleitfaden je Diagramm ================= */
const EXTRA={};
const OPERATOREN=`<table><tr><th>Operator</th><th>Was verlangt ist</th><th>Umfang der Antwort</th></tr>
<tr><td><b>nennen</b></td><td>aufzählen, ohne Erklärung</td><td>Stichworte oder kurze Punkte</td></tr>
<tr><td><b>beschreiben</b></td><td>mit eigenen Worten beschreiben, was zu sehen ist oder wie etwas aufgebaut ist</td><td>2–4 Sätze</td></tr>
<tr><td><b>erläutern / erklären</b></td><td>mit Grund und Beispiel erklären</td><td>3–5 Sätze, unbedingt mit „weil …“ oder einem Beispiel</td></tr>
<tr><td><b>begründen</b></td><td>die Wahl begründen</td><td>Aussage + Argument</td></tr>
<tr><td><b>vergleichen / unterscheiden</b></td><td>Gemeinsamkeiten und Unterschiede nach Kriterien nennen</td><td>am besten als Tabelle oder „X …, Y dagegen …“</td></tr>
<tr><td><b>erstellen / zeichnen / modellieren</b></td><td>ein Diagramm nach Text zeichnen</td><td>vollständiges Diagramm in korrekter Notation</td></tr>
<tr><td><b>ergänzen / vervollständigen</b></td><td>ein vorhandenes Diagramm ergänzen</td><td>nur die fehlenden Elemente</td></tr>
<tr><td><b>überprüfen / Fehler finden</b></td><td>Fehler finden und korrigieren</td><td>Fehler + Korrektur</td></tr>
<tr><td><b>beurteilen / bewerten</b></td><td>nach Kriterien bewerten und ein Fazit ziehen</td><td>Argumente dafür und dagegen + Fazit</td></tr></table>`;

EXTRA.uc={deep:`
<div class="card"><h3 style="margin-top:0">1. Akteure im Detail</h3>
<p>Ein Akteur ist eine <b>Rolle</b>, die jemand oder etwas gegenüber dem System einnimmt. Er steht immer <b>außerhalb</b> des Systems.</p>
<table><tr><th>Art</th><th>Beispiel</th><th>Woran man ihn im Text erkennt</th></tr>
<tr><td>Mensch in einer Rolle</td><td>Kunde, Mitarbeiter, Administrator</td><td>„Kunden können …“, „Der Mitarbeiter soll …“</td></tr>
<tr><td>Externes System (Fremdsystem)</td><td>Zahlungsdienst, Bank, E-Mail-System, ERP</td><td>„externes System“, „Schnittstelle zu …“, „wird von … geliefert“</td></tr>
<tr><td>Zeit (Timer)</td><td>Zeit, Scheduler</td><td>„jede Nacht“, „monatlich automatisch“</td></tr>
<tr><td>Gerät</td><td>Sensor, Kartenleser</td><td>„der Sensor meldet …“</td></tr></table>
<ul class="clean"><li>Der <b>Primärakteur</b> löst den Use Case aus und erhält das Ergebnis (meist links). Der <b>Sekundärakteur</b> wird vom System zur Ausführung benötigt (meist rechts).</li>
<li>Eine Person kann mehrere Rollen einnehmen: Zeichne Rollen, keine Personen.</li>
<li>Die eigene Datenbank des Systems ist <b>kein</b> Akteur: Sie ist Teil des Systems. Akteur ist nur, was außerhalb der Systemgrenze liegt.</li></ul></div>

<div class="card"><h3 style="margin-top:0">2. Wie man Use Cases findet</h3>
<p>Suche im Text nach <b>Verben</b> bei den Rollen: „Kunden können Geräte <u>suchen</u>, <u>reservieren</u> …“. Prüfe jeden Kandidaten mit drei Fragen:</p>
<ol><li>Ist es eine <b>abgeschlossene Handlung</b> mit einem Ergebnis, das dem Akteur nützt?</li><li>Wird er <b>von einem Akteur ausgelöst</b> (oder von einem anderen Use Case über «include»/«extend» benötigt)?</li><li>Geht es darum, <b>was</b> das System tut, nicht <b>wie</b>? („Button klicken“, „Passwort eintippen“ sind Schritte, keine Use Cases.)</li></ol>
<div class="tip">Name: <b>Substantiv + Verb im Infinitiv</b>: „Gerät reservieren“, „Rechnung erstellen“. Mehrere Operationen auf demselben Objekt (anlegen, ändern, löschen) kann man zusammenfassen: „Gerätedaten verwalten“.</div></div>

<div class="card"><h3 style="margin-top:0">3. Signalwörter: vom Text zur Beziehung</h3>
<table><tr><th>Im Text steht</th><th>Im Diagramm</th></tr>
<tr><td>„kann“, „soll … können“, „hat die Möglichkeit“</td><td>Assoziation Akteur — Use Case</td></tr>
<tr><td>„immer“, „jedes Mal“, „dabei wird stets“, „muss vorher“, „nur angemeldet möglich“, „setzt voraus“</td><td><b>«include»</b> (vom Basis-UC zum eingebundenen)</td></tr>
<tr><td>„falls“, „wenn“, „bei Bedarf“, „optional“, „kann zusätzlich“, „im Fehlerfall“, „auf Wunsch“</td><td><b>«extend»</b> (von der Erweiterung zum Basis-UC) + Condition</td></tr>
<tr><td>„kann alles, was … kann, und zusätzlich“, „ist ein spezieller …“</td><td>Generalisierung zwischen Akteuren</td></tr>
<tr><td>„entweder per … oder per …“, „Arten von …“</td><td>Generalisierung zwischen Use Cases</td></tr>
<tr><td>„externes System“, „Dienstleister“, „über die Schnittstelle“</td><td>System als Akteur, rechts</td></tr></table></div>

<div class="card"><h3 style="margin-top:0">4. «include», «extend», Generalisierung: so verwechselst du sie nicht</h3>
<table><tr><th></th><th>«include»</th><th>«extend»</th><th>Generalisierung (UC)</th></tr>
<tr><td>Wann ausgeführt</td><td>immer</td><td>nur unter einer Bedingung</td><td>eine der Spezialisierungen statt des allgemeinen UC</td></tr>
<tr><td>Basis-UC ohne den zweiten</td><td><b>unvollständig</b></td><td>vollständig und eigenständig</td><td>oft abstrakt</td></tr>
<tr><td>Pfeilrichtung</td><td>zum eingebundenen UC</td><td>zum Basis-UC</td><td>zum allgemeinen UC</td></tr>
<tr><td>Linie</td><td>gestrichelt, offene Pfeilspitze</td><td>gestrichelt, offene Pfeilspitze</td><td>durchgezogen, leeres Dreieck</td></tr></table>
<div class="tip">Richtungsregel: Der Abhängigkeitspfeil geht von dem aus, <b>der den anderen kennt</b>. Der Basis-UC kennt den eingebundenen («include» vom Basis-UC aus). Die Erweiterung kennt den Basis-UC, der Basis-UC die Erweiterung aber nicht («extend» von der Erweiterung aus).</div>
<p>Häufiger Fehler: «include» wird benutzt, um die <b>Reihenfolge</b> von Schritten zu zeigen. Das ist falsch: «include» bedeutet „ist verpflichtender Bestandteil“, nicht „wird danach ausgeführt“.</p></div>

<div class="card"><h3 style="margin-top:0">5. Anwendungsfallbeschreibung (Texttabelle)</h3>
<p>Zum Diagramm wird in Klassenarbeiten oft verlangt, einen Use Case als Tabelle zu beschreiben. Die Felder solltest du auswendig kennen:</p>
<table><tr><th>Feld</th><th>Beispiel „Gerät reservieren“</th></tr>
<tr><td>Name</td><td>Gerät reservieren</td></tr>
<tr><td>Kurzbeschreibung</td><td>Ein Kunde reserviert ein verfügbares Gerät für einen Zeitraum.</td></tr>
<tr><td>Akteure</td><td>Kunde</td></tr>
<tr><td>Auslöser</td><td>Kunde klickt bei einem Gerät auf „Reservieren“.</td></tr>
<tr><td>Vorbedingung</td><td>Kunde ist angemeldet; Gerät ist verfügbar.</td></tr>
<tr><td>Standardablauf</td><td>1. Kunde wählt Zeitraum. 2. System prüft Verfügbarkeit. 3. System legt Reservierung an. 4. System zeigt Bestätigung.</td></tr>
<tr><td>Alternativablauf</td><td>2a. Gerät nicht verfügbar: System zeigt Hinweis, Kunde wählt anderen Zeitraum.</td></tr>
<tr><td>Nachbedingung</td><td>Reservierung ist gespeichert; Gerät hat den Status „reserviert“.</td></tr></table>
<p>Genau hier, nicht im Diagramm, stehen die Reihenfolge der Schritte und die Ausnahmen.</p></div>

<div class="card"><h3 style="margin-top:0">6. Was das Diagramm nicht zeigt</h3>
<ul class="clean"><li>Reihenfolge und Zeitpunkt der Ausführung (dafür Aktivitäts- oder Sequenzdiagramm);</li><li>Bedingungen und Schleifen (außer der Condition bei «extend»);</li><li>den inneren Aufbau: Klassen, Datenbanken, Oberfläche;</li><li>wie oft ein Use Case ausgeführt wird.</li></ul></div>`,
exam:`
<div class="card"><h3 style="margin-top:0">So wird gefragt</h3>
<ul class="clean"><li><b>„Erstellen Sie ein Anwendungsfalldiagramm für …“</b> Ein Text mit Anforderungen, aus dem Akteure, Use Cases und Beziehungen herauszuarbeiten sind. Der häufigste Typ.</li>
<li><b>„Ergänzen Sie das Diagramm um …“</b> Ein fertiges Diagramm und eine neue Anforderung („Zusätzlich soll der Kunde …“).</li>
<li><b>„Erläutern Sie den Unterschied zwischen «include» und «extend»“</b> Theorie mit Beispiel.</li>
<li><b>„Beschreiben Sie den Anwendungsfall … tabellarisch“</b> Anwendungsfallbeschreibung.</li>
<li><b>„Welche Fehler enthält das Diagramm?“</b> Akteur innerhalb des Systems, Linie zwischen Use Cases, falsche Pfeilrichtung.</li>
<li><b>„Welche Aussagen lassen sich aus dem Diagramm ableiten?“</b> Diagramm lesen.</li></ul></div>
<div class="card"><h3 style="margin-top:0">Lösungsplan in 6 Schritten</h3>
<ol><li>Markiere im Text die <b>Rollen</b> (wer?) in einer Farbe und die <b>Verben</b> (was tut er?) in einer anderen.</li>
<li>Zeichne die Systemgrenze und beschrifte das System.</li>
<li>Setze die Akteure nach außen: Menschen links, externe Systeme rechts.</li>
<li>Trage die Use Cases innen ein und verbinde sie mit den Akteuren durch einfache Linien.</li>
<li>Geh die Signalwörter durch: „immer“ ergibt «include», „falls / bei Bedarf“ ergibt «extend», „kann alles, was …“ ergibt Generalisierung.</li>
<li>Prüfe die Pfeilrichtungen und ergänze die Condition bei «extend».</li></ol></div>
<div class="card"><h3 style="margin-top:0">Checkliste vor der Abgabe</h3>
<ul class="clean"><li>Alle Akteure außen, alle Use Cases im Rahmen?</li><li>Hat das System einen Namen?</li><li>Hat jeder Use Case einen Namen mit Verb?</li><li>Gibt es keine einfachen Linien zwischen zwei Use Cases?</li><li>Zeigt «include» zum eingebundenen und «extend» zum Basis-UC?</li><li>Versuchst du etwa, eine Reihenfolge von Schritten zu zeigen?</li><li>Ist jede Anforderung aus dem Text abgebildet?</li></ul></div>
<div class="card"><h3 style="margin-top:0">Fertige Formulierungen</h3>
<div class="q-box"><b>«include»:</b> „Der Anwendungsfall A schließt den Anwendungsfall B immer ein. B ist ein notwendiger Teil von A und wird bei jeder Ausführung von A durchlaufen.“</div>
<div class="q-box"><b>«extend»:</b> „Der Anwendungsfall B erweitert den Anwendungsfall A nur unter einer bestimmten Bedingung. A ist auch ohne B vollständig.“</div>
<div class="q-box"><b>Akteur:</b> „Ein Akteur ist eine Rolle außerhalb des Systems, die mit dem System interagiert. Das kann eine Person, ein Fremdsystem oder ein Zeitgeber sein.“</div>
<div class="q-box"><b>Zweck:</b> „Das Anwendungsfalldiagramm zeigt, welche Funktionen ein System aus Sicht der Akteure bietet. Es zeigt keine Abläufe und keine Reihenfolge.“</div></div>`};

EXTRA.cl={deep:`
<div class="card"><h3 style="margin-top:0">1. Klasse und Objekt</h3>
<p>Eine <b>Klasse</b> ist ein Bauplan: Sie beschreibt, welche Attribute und Methoden alle ihre Objekte haben. Ein <b>Objekt</b> (Instanz) ist ein konkretes Exemplar mit eigenen Attributwerten.</p>
<p>Im <b>Objektdiagramm</b> notiert man ein Objekt als <code>k1 : Kunde</code> (unterstrichen), im Attributbereich stehen die Werte: <code>name = "Müller"</code>.</p></div>

<div class="card"><h3 style="margin-top:0">2. Attribute und Methoden: die vollständige Syntax</h3>
<pre class="code">Sichtbarkeit name : Datentyp [Multiplizität] = Initialwert {Eigenschaft}
Sichtbarkeit name(parameter : Typ, ...) : Rückgabetyp</pre>
<table><tr><th>Notation</th><th>Bedeutung</th></tr>
<tr><td><code>- preis : double = 0.0</code></td><td>private-Attribut mit Anfangswert</td></tr>
<tr><td><code>- telefon : String [0..2]</code></td><td>0 bis 2 Werte</td></tr>
<tr><td><code>/ alter : int</code></td><td><b>abgeleitetes Attribut</b>: wird aus anderen berechnet (aus geburtsdatum)</td></tr>
<tr><td><u><code>- anzahl : int</code></u></td><td><b>Klassenattribut</b> (static): unterstrichen, einmal für die ganze Klasse</td></tr>
<tr><td><code>+ MWST : double = 0.19 {readOnly}</code></td><td>Konstante</td></tr>
<tr><td><code>+ Kunde(name : String)</code></td><td>Konstruktor: Name wie die Klasse, ohne Rückgabetyp</td></tr>
<tr><td><i><code>+ berechnePreis() : double</code></i></td><td>abstrakte Methode: kursiv, ohne Implementierung</td></tr></table>
<div class="tip"><b>Kapselung:</b> Attribute werden <code>private</code> deklariert, der Zugriff erfolgt über Methoden (<code>getName()</code>, <code>setName()</code>). So kontrolliert die Klasse selbst, welche Werte zulässig sind.</div></div>

<div class="card"><h3 style="margin-top:0">3. Multiplizitäten: lesen und setzen</h3>
<p>Die Zahl steht bei der <b>gegenüberliegenden</b> Klasse. Lies immer in beide Richtungen, beginnend mit „<b>Ein</b> …“:</p>
<pre class="code">Kunde 1 ——————— 0..* Bestellung
„Ein Kunde hat beliebig viele (0..*) Bestellungen.“
„Eine Bestellung gehört zu genau einem (1) Kunden.“</pre>
<table><tr><th>Im Text</th><th>Multiplizität</th></tr>
<tr><td>„genau ein“, „immer ein“</td><td><code>1</code></td></tr>
<tr><td>„höchstens ein“, „kann ein … haben“, „optional“</td><td><code>0..1</code></td></tr>
<tr><td>„beliebig viele“, „mehrere“, „kein oder mehrere“</td><td><code>0..*</code> (oder <code>*</code>)</td></tr>
<tr><td>„mindestens ein“</td><td><code>1..*</code></td></tr>
<tr><td>„zwei bis fünf“</td><td><code>2..5</code></td></tr></table>
<p>Eine <b>n:m</b>-Beziehung (<code>*</code> auf beiden Seiten) mit eigenen Daten löst man über eine <b>Assoziationsklasse</b> oder eine eigene Klasse auf: Kunde — <b>Reservierung</b> — Gerät (Reservierung hat beginn und ende).</p></div>

<div class="card"><h3 style="margin-top:0">4. Beziehungsarten: die entscheidenden Fragen</h3>
<ol><li><b>„Ist ein …?“</b> (Laptop ist ein Gerät) → Generalisierung, Dreieck zur Oberklasse.</li>
<li><b>„Verspricht nur Methoden?“</b> → Realisierung zum «interface», gestrichelt mit Dreieck.</li>
<li><b>„Besteht aus / hat Teile?“</b> Dann frage: <b>Verschwinden die Teile zusammen mit dem Ganzen?</b> Ja → Komposition ◆. Nein → Aggregation ◇. Die Raute steht immer beim <b>Ganzen</b>.</li>
<li><b>„Kennt / gehört zu / hat?“</b> ohne Teil-Ganzes-Beziehung → Assoziation.</li>
<li><b>„Benutzt nur kurz?“</b> (als Parameter oder lokale Variable) → Abhängigkeit, gestrichelt mit offener Pfeilspitze.</li></ol>
<p>Zusätzlich kann eine Assoziation haben: <b>Rollenname</b> am Ende (<code>+inhaber</code>), <b>Assoziationsname</b> mit Leserichtung (<code>leiht ▶</code>), <b>Navigierbarkeit</b> (Pfeil: wer kennt wen) und <b>reflexive Assoziation</b> (Mitarbeiter — Mitarbeiter: „ist Vorgesetzter von“).</p>
<div class="tip">Bei einer Komposition darf auf der Seite des Ganzen nur <code>1</code> (oder <code>0..1</code>) stehen: Ein Teil gehört zu genau einem Ganzen.</div></div>

<div class="card"><h3 style="margin-top:0">5. Abstrakte Klasse und Interface</h3>
<table><tr><th></th><th>Abstrakte Klasse</th><th>Interface</th></tr>
<tr><td>Objekte</td><td>nicht erzeugbar</td><td>nicht erzeugbar</td></tr>
<tr><td>Enthält</td><td>Attribute, fertige und abstrakte Methoden</td><td>nur Methodensignaturen (und Konstanten)</td></tr>
<tr><td>Beziehung in UML</td><td>Generalisierung (durchgezogen)</td><td>Realisierung (gestrichelt)</td></tr>
<tr><td>In Java</td><td><code>extends</code>, nur eine Oberklasse</td><td><code>implements</code>, mehrere möglich</td></tr>
<tr><td>Bedeutung</td><td>gemeinsame Basis für verwandte Klassen</td><td>gemeinsamer „Vertrag“ für beliebige Klassen</td></tr></table>
<p><b>Polymorphie:</b> Unterklassen überschreiben eine Methode der Oberklasse. Derselbe Aufruf <code>zahlung.bezahlen()</code> führt je nach tatsächlicher Klasse des Objekts unterschiedlichen Code aus.</p></div>

<div class="card"><h3 style="margin-top:0">6. UML ↔ Code</h3>
<p>In der Prüfung kommt beides vor: „Erstellen Sie das Klassendiagramm zum Code“ und „Implementieren Sie die Klasse“.</p>
<table><tr><th>UML</th><th>Java</th></tr>
<tr><td>Klasse</td><td><code>public class Kunde { }</code></td></tr>
<tr><td><code>- name : String</code></td><td><code>private String name;</code></td></tr>
<tr><td><code>+ getName() : String</code></td><td><code>public String getName() { return name; }</code></td></tr>
<tr><td>Generalisierung</td><td><code>class Laptop extends Geraet</code></td></tr>
<tr><td>Realisierung</td><td><code>class Auto implements Mietbar</code></td></tr>
<tr><td>«abstract»</td><td><code>abstract class Fahrzeug</code></td></tr>
<tr><td>Assoziation zu <code>1</code></td><td><code>private Kunde kunde;</code></td></tr>
<tr><td>Assoziation zu <code>0..*</code></td><td><code>private List&lt;Bestellung&gt; bestellungen;</code></td></tr>
<tr><td>Komposition</td><td>das Teil wird im Ganzen erzeugt: <code>this.motor = new Motor();</code></td></tr>
<tr><td>Aggregation</td><td>das Teil wird von außen übergeben: <code>void add(Fahrzeug f)</code></td></tr>
<tr><td>static</td><td><code>private static int anzahl;</code></td></tr></table>
<div class="tip">Ein Attribut, dessen Typ eine andere Klasse des Modells ist, zeichnet man als <b>Assoziation</b> und wiederholt es nicht im Attributbereich.</div></div>

<div class="card"><h3 style="margin-top:0">7. Vom Text zu den Klassen</h3>
<table><tr><th>Im Text</th><th>Im Diagramm</th></tr>
<tr><td>Substantiv, das Eigenschaften hat</td><td>Klasse</td></tr>
<tr><td>Eigenschaft („hat einen Namen, eine Nummer“)</td><td>Attribut</td></tr>
<tr><td>Verb („kann storniert werden“, „soll prüfen“)</td><td>Methode</td></tr>
<tr><td>„ist ein“, „spezielle Art von“, „zusätzlich hat ein …“</td><td>Generalisierung</td></tr>
<tr><td>„besteht aus“, „ohne … existiert nicht“</td><td>Komposition</td></tr>
<tr><td>„enthält“, „… bleiben bestehen“</td><td>Aggregation</td></tr>
<tr><td>„gibt vor“, „muss umsetzen“, „Schnittstelle“</td><td>Interface + Realisierung</td></tr></table></div>`,
exam:`
<div class="card"><h3 style="margin-top:0">So wird gefragt</h3>
<ul class="clean"><li><b>„Erstellen Sie ein Klassendiagramm …“</b> nach Text: Klassen, Attribute mit Typen, Methoden, Beziehungen, Multiplizitäten.</li>
<li><b>„Ergänzen Sie das Klassendiagramm um …“</b> Eine neue Klasse oder Beziehung in einem fertigen Diagramm. In der AP2 ist das die häufigste Variante.</li>
<li><b>„Erstellen Sie das Klassendiagramm zum folgenden Quellcode“</b> und umgekehrt: <b>„Implementieren Sie die Klasse …“</b></li>
<li><b>„Erläutern Sie den Unterschied zwischen Aggregation und Komposition“</b>, „… zwischen abstrakter Klasse und Interface“.</li>
<li><b>„Was bedeuten die Multiplizitäten an der Assoziation …?“</b> In beide Richtungen lesen.</li>
<li><b>„Welche Attribute und Methoden besitzt ein Objekt der Klasse Laptop?“</b> Eigene plus geerbte.</li></ul></div>
<div class="card"><h3 style="margin-top:0">Lösungsplan</h3>
<ol><li>Markiere die <b>Substantive</b>: Kandidaten für Klassen und Attribute. Was eigene Eigenschaften hat, wird eine Klasse.</li>
<li>Notiere die Klassen mit Attributen: <code>- name : Typ</code>. Den Typ nimmst du aus dem Text; fehlt er, wähle einen sinnvollen (String, int, double, boolean, Date).</li>
<li>Mache aus den Verben Methoden: <code>+ name() : Rückgabetyp</code>.</li>
<li>Finde die Vererbung („ist ein“). Gemeinsame Attribute ziehst du in die Oberklasse hoch.</li>
<li>Verbinde die übrigen Klassen: Assoziation, Aggregation oder Komposition.</li>
<li>Setze Multiplizitäten <b>an beide Enden</b> und lies jede Beziehung laut in beide Richtungen.</li></ol></div>
<div class="card"><h3 style="margin-top:0">Checkliste vor der Abgabe</h3>
<ul class="clean"><li>Hat jedes Attribut Sichtbarkeit und Datentyp?</li><li>Hat jede Methode Klammern und Rückgabetyp?</li><li>Zeigt das Vererbungsdreieck auf die Oberklasse?</li><li>Steht die Raute beim Ganzen?</li><li>Stehen an beiden Enden der Beziehungen Multiplizitäten?</li><li>Gibt es keine Attribute, die eine Beziehung doppelt abbilden?</li><li>Sind abstrakte Klassen und Interfaces gekennzeichnet?</li></ul></div>
<div class="card"><h3 style="margin-top:0">Fertige Formulierungen</h3>
<div class="q-box"><b>Aggregation / Komposition:</b> „Beide beschreiben eine Teil-Ganzes-Beziehung. Bei der Aggregation können die Teile ohne das Ganze weiter existieren (leere Raute). Bei der Komposition sind die Teile existenzabhängig: Wird das Ganze gelöscht, werden auch die Teile gelöscht (ausgefüllte Raute).“</div>
<div class="q-box"><b>Abstrakte Klasse / Interface:</b> „Von beiden können keine Objekte erzeugt werden. Eine abstrakte Klasse kann Attribute und implementierte Methoden enthalten und wird vererbt. Ein Interface gibt nur Methodensignaturen vor, die von den implementierenden Klassen umgesetzt werden müssen. Eine Klasse kann mehrere Interfaces implementieren.“</div>
<div class="q-box"><b>Multiplizität:</b> „Ein Kunde kann beliebig viele Bestellungen haben (0..*). Eine Bestellung gehört zu genau einem Kunden (1).“</div>
<div class="q-box"><b>Kapselung:</b> „Die Attribute sind private und können nur über öffentliche Methoden gelesen oder geändert werden. So schützt die Klasse ihre Daten vor ungültigen Zugriffen.“</div>
<div class="q-box"><b>Vererbung:</b> „Die Unterklasse erbt alle Attribute und Methoden der Oberklasse und kann sie um eigene erweitern oder überschreiben.“</div></div>`};
