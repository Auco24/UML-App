# UML-App

Dieses Programm wird zur Vorbereitung auf das Erstellen von UML-Diagrammen verwendet.

Der **UML-Trainer** ist eine Lern-App für das Lernfeld 11 und die Abschlussprüfung Teil 2 (AP2) der Fachinformatiker für Anwendungsentwicklung. Die ganze App steckt in einer einzigen HTML-Datei und läuft ohne Installation und ohne Internet direkt im Browser.

## Starten

`UML-Trainer.html` herunterladen und per Doppelklick im Browser öffnen. Mehr ist nicht nötig.

Der Lernfortschritt wird nur lokal im Browser gespeichert (`localStorage`). Über die Seite „Sicherung“ lässt er sich als Datei exportieren und auf einem anderen Gerät wieder einlesen.

## Inhalt

Behandelt werden die fünf Diagrammarten, die in Klassenarbeiten und in der AP2 vorkommen:

- Anwendungsfalldiagramm
- Klassendiagramm
- Zustandsdiagramm
- Aktivitätsdiagramm
- Sequenzdiagramm

Zu jeder Diagrammart gibt es:

- **Theorie** mit Notation, Vertiefung, typischen Fehlern und einem Prüfungsleitfaden
- **Quiz** und **offene Fragen** mit Musterantworten
- **Zeichenaufgaben** im Diagrammeditor, die ein Prüf-Bot mit der Musterlösung vergleicht
- **Leseaufgaben** („Diagramm lesen“) und **Fehlersuchaufgaben**

Dazu kommen übergreifende Funktionen:

- **Aufgabensammlung** und **Prüfungsmodus** mit Zeitbegrenzung und Punkten
- **Lernkarten** nach dem Leitner-System
- **Schwachstellen**: Fragen, die oft falsch beantwortet wurden, gezielt wiederholen
- **Bildexport**: das gezeichnete Diagramm als PNG speichern

Der KI-Tutor und die KI-generierten Aufgaben funktionieren nur in der Online-Variante. In der lokalen Datei erscheint an dieser Stelle nur ein Hinweis, alles andere läuft offline.

## Aufbau des Repositorys

| Pfad | Inhalt |
| --- | --- |
| `UML-Trainer.html` | Die fertige App. Diese Datei wird aus `src/` erzeugt. |
| `src/template.html` | Grundgerüst: Layout, Theorie der fünf Module, Quiz-Engine |
| `src/practice.js`, `src/sqmouse.js` | Diagrammeditor und Sequenzdiagramm-Editor |
| `src/check.js` | Prüf-Bot: Vergleich der Zeichnung mit der Musterlösung |
| `src/engine2.js` | Musterdiagramme und statische Darstellung |
| `src/tasks2.js` | Zeichen-, Lese- und Fehlersuchaufgaben |
| `src/content2a.js`, `src/content2b.js`, `src/content2c.js` | Zusätzliche Theorie, Quizfragen und offene Fragen |
| `src/page.js` | Übungsseite und KI-Tutor |
| `src/bank.js` | Aufgabensammlung und Prüfungsmodus |
| `src/review.js` | Schwachstellen, Lernkarten, Sicherung, Bildexport |
| `src/practice.css` | Styles für Editor, Aufgabensammlung und Prüfung |
| `src/build.py` | Build-Skript: setzt alle Teile zu einer Datei zusammen |
| `img/` | Bilder der Beispielaufgaben, werden beim Build in die HTML-Datei eingebettet |

## Selbst bauen

Voraussetzung ist Python 3, zusätzliche Pakete werden nicht gebraucht.

```bash
python3 src/build.py
```

Das Skript schreibt `UML-Trainer.html` neu in das Hauptverzeichnis. Zusätzlich entsteht unter `build/artifact/` die Online-Variante, die nur den Inhalt von `<body>` enthält. Der Ordner `build/` wird nicht eingecheckt.

Änderungen immer in `src/` vornehmen und danach neu bauen, nicht direkt in `UML-Trainer.html`.

## Sprache

Oberfläche, Inhalte, Kommentare im Code und Commit-Nachrichten sind auf Deutsch.
