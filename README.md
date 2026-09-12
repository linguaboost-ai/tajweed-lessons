# Quran verstehen lernen

Ein Kurs in 20 Lektionen als Folienpräsentation — reines HTML, CSS und JavaScript,
kein Build-Schritt, keine Abhängigkeiten. Einfach `index.html` im Browser öffnen.

## Aufbau

```
index.html              Übersicht: alle 20 Lektionen als Karten
assets/
  lessons.js            Kursverzeichnis — die einzige Liste aller Lektionen
  player.js             Maschinerie: Folien, Transkript, Tastatur, Fortschritt
  style.css             gemeinsame Styles für Übersicht und Player
lessons/
  lektion-01.html       eine Datei pro Lektion, enthält nur ihre Daten
  …
  lektion-20.html
```

Jede Lektionsdatei ist eigenständig aufrufbar und besteht aus einem knappen
Gerüst plus der Konstante `LESSON`. Die gesamte Logik liegt in `assets/player.js`
und wird von allen 20 Dateien geteilt.

## Bedienung

| Taste | Wirkung |
|---|---|
| `→` `←` `Leertaste` | vor und zurück (auch durch die Einblendungen) |
| `T` | Transkriptleiste ein-/ausblenden |
| `F` | Vollbild |
| `Esc` | zurück zur Übersicht |
| `N` `P` | nächste / vorige Lektion |
| `Home` `End` | erste / letzte Folie |

Klicken funktioniert ebenfalls: linkes Viertel zurück, sonst vor. Auf dem Handy
wird gewischt, und es ist immer nur die gerade aktive Transkriptbox sichtbar.
Der Lernfortschritt wird im `localStorage` des Browsers gemerkt — die Übersicht
zeigt dann „Weiter mit Lektion …“ und markiert durchgearbeitete Lektionen.

## Eine Lektion bearbeiten

Alles steht in der jeweiligen Datei unter `lessons/` in der Konstante `LESSON`:

```js
const LESSON = {
  no: 7,
  thema: "Mein, dein, sein",
  sections: [ … ],   // die Boxen der Transkriptleiste, von links nach rechts
  slides:   [ … ]    // die Folien, in der Reihenfolge der Präsentation
};
```

* `sections[i].label` ist die Überschrift der Box, `sections[i].html` ihr Inhalt.
* `slides[i].s` verweist auf die Box, die zu dieser Folie gehört (0 = erste Box).
  Beim Blättern leuchtet sie auf; ein Klick auf eine Box springt zu ihrer ersten Folie.
* Ein Element mit `class="step" data-step="1"` erscheint erst beim nächsten
  Tastendruck. Mehrere Stufen: `data-step="1"`, `"2"`, `"3"` …

Nützliche Bausteine aus `assets/style.css`: `.title`, `.kicker`, `.de`,
`.ar` mit `.ar-xl` / `.ar-l` / `.ar-m`, `.vocab` mit `.vrow`, `.parse` für die
Wort-für-Wort-Zerlegung, `.glue` für Verschmelzungen, `.pair` für
Gegenüberstellungen, `.rows` für Listen, `.gold` für Hervorhebungen.

## Eine Lektion hinzufügen

1. Eine bestehende Datei aus `lessons/` kopieren und umbenennen.
2. `LESSON` darin füllen (`no` nicht vergessen).
3. In `assets/lessons.js` einen Eintrag ergänzen — damit erscheint sie auf der
   Übersicht und in der Vor/Zurück-Navigation.
