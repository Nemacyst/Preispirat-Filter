# Preispirat Filter

Eine kleine Chrome-Erweiterung, die Deal-Beiträge bestimmter Nutzer auf
https://www.preispirat.ch/ ausblendet.

## Installation (Entwicklermodus)

1. Diesen Ordner entpacken (falls als ZIP geliefert).
2. In Chrome zu `chrome://extensions` navigieren.
3. Oben rechts "Entwicklermodus" aktivieren.
4. Auf "Entpackte Erweiterung laden" klicken und diesen Ordner auswählen.
5. Die Erweiterung erscheint in der Symbolleiste (Puzzle-Icon, ggf. anpinnen).

## Benutzung

1. Auf das Erweiterungssymbol klicken.
2. Nutzernamen eintragen (z. B. "Arlinda") und mit "+" oder Enter bestätigen.
3. Preispirat.ch neu laden oder einfach weiterscrollen – Beiträge dieser
   Nutzer werden automatisch ausgeblendet, auch beim Nachladen weiterer
   Deals.
4. Zum Entfernen eines Nutzers aus der Liste auf das "✕" neben dem Namen
   klicken.

## Funktionsweise / Grenzen

Die Erweiterung sucht nach Textstellen, die exakt einem blockierten
Nutzernamen entsprechen, und blendet den umgebenden Deal-Container aus
(erkannt anhand von Bild + Preis/Zeitangabe in der Nähe). Da preispirat.ch
seine Seitenstruktur ändern kann, kann es vorkommen, dass gelegentlich ein
zu großer oder zu kleiner Bereich ausgeblendet wird. Sollte das auffallen,
gerne melden – die Erkennungslogik in `content.js` (Funktion
`looksLikeCard`) lässt sich leicht anpassen.

Die Blockliste wird über `chrome.storage.sync` gespeichert und damit (bei
aktiviertem Chrome-Sync) über mehrere Geräte hinweg synchronisiert.
