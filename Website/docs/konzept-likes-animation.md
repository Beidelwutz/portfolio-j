# Konzept: Likes ansprechender & mit Animation

## Ausgangslage

- **Aktuell:** Views- und Likes-Badges erscheinen als gleich gestaltete Pillen (Emoji 👁/❤ + Zahl), mit einer gemeinsamen Fade/Slide-Animation beim Hover/In-View.
- **Probleme:** Keine eigene, erkennbare „Likes“-Geste – wirkt beliebig; Optik wirkt trist (graue/weiße Flächen, kaum emotionaler Akzent); beide Badges sehen nahezu identisch aus.

---

## Ziel

- **Likes** visuell und emotional klar vom Views-Badge abheben.
- **Likes-spezifische Animation** (Herz-Pulse, dezenter Glow, ggf. Count-up), die professionell und clean bleibt.
- **Gesamtoptik** der Stats-Badges aufwerten: weniger trist, klarer und einladender, ohne übertrieben zu wirken.

---

## 1. Optik: Likes-Badge hervorheben

**Unterscheidung Views vs. Likes**

- **Views:** weiterhin neutral/technisch (z.B. helles Grau, dezent). Icon: Auge als SVG für einheitlichen Look.
- **Likes:** emotionaler Akzent
  - Leicht warmer Farbton für den Likes-Badge: z.B. `rgba(255, 107, 74, 0.15)` als Hintergrund (an Akzentfarbe angelehnt) oder dezentes Rosa/Rost.
  - Dezente linke Randlinie oder Icon-Farbe in Akzent/Herz-Rot, damit der Badge sofort als „Likes“ lesbar ist.
  - Herz als **SVG** (nicht Emoji), gleiche Größe wie Auge – wirkt schärfer und konsistenter.

**Beide Badges weniger trist**

- Leichter **Glow** oder weicher Schatten in der jeweiligen Logik (Views: neutral, Likes: warmer Ton).
- **Backdrop-Blur** beibehalten, ggf. Sättigung der Hintergrundfarbe leicht erhöhen (nicht nur flaches Grau).
- Optional: sehr zarte Verlaufskante oder 1px-Border in einer definierten Farbe (z.B. `--color-accent` bei Likes), um die Karten-Optik aufzuwerten.

**Umsetzung**

- In [src/styles/global.css](src/styles/global.css): Klasse `.stats-badge--likes` (oder Datenattribut `data-type="likes"`) für den Likes-Badge nutzen, mit eigenem Hintergrund, Border/Icon-Farbe und Schatten.
- In [PortfolioGrid.astro](src/components/PortfolioGrid.astro): zweiten Badge mit dieser Klasse/Attribut versehen; Icons von Emoji auf inline SVG umstellen (ein Auge, ein Herz).

---

## 2. Likes-Animation (Herz & Zahl)

**Herz-Icon**

- **Pulse beim Erscheinen:** Wenn die Badges sichtbar werden (Hover/In-View), das Herz einmal kurz skalieren (z.B. `scale(1) → 1.15 → 1`) mit `transform` und ~250–350 ms, damit es lebendig wirkt, ohne zu hüpfen.
- Optional: sehr dezentem **Glow** um das Herz (z.B. `box-shadow` oder `filter: drop-shadow`) beim Erscheinen kurz aufblitzen lassen.

**Zahlen**

- **Count-up (optional):** Beim Einblenden der Badges die Likes-Zahl von 0 bis zum angezeigten Wert animieren (z.B. über 400–500 ms). Dafür in [main.js](src/scripts/main.js) beim Setzen von `is-active` / bei Hover-Erkennung (z.B. via CSS-Klasse oder Data-Attribut) ein kurzes Skript ausführen: Element mit der Likes-Zahl finden, `data-value` mit der echten Zahl setzen, von 0 hochzählen. Nur wenn `prefers-reduced-motion` nicht aktiv.
- Ohne Count-up: die bestehende Fade/Slide-Animation beibehalten, aber die **Likes-Badge** mit leichter **Verzögerung** (z.B. 80–120 ms) nach dem Views-Badge einblenden, damit eine klare, gestaffelte Reihenfolge entsteht.

**Timing**

- Badges-Container: weiterhin ~180–200 ms für Opacity/Transform.
- Likes-Badge: `transition-delay: 80ms` (oder 100ms), damit Views zuerst da ist, Likes „folgt“.
- Herz-Pulse: eigene `@keyframes` oder kurze transition beim Erscheinen (z.B. wenn Parent `.stats-badges` visible wird).

---

## 3. Technische Umsetzung (kurz)

1. **PortfolioGrid.astro:**  
   - Zwei Badges mit unterscheidbaren Klassen/Attributen (z.B. `stats-badge stats-badge--views` / `stats-badge stats-badge--likes`).  
   - Icons als SVG (Auge, Herz) inline einbauen, sauber mit `aria-hidden="true"`.

2. **global.css:**  
   - `.stats-badge--likes`: eigener Hintergrund (warmer Ton), evtl. Border/Glow, Herz-Farbe.  
   - Gestaffeltes Erscheinen: `.stats-badge--likes { transition-delay: 100ms; }` (beim Parent-Transition mit delay).  
   - Keyframe `@keyframes heartPulse` (scale), angewandt auf das Herz-SVG oder seinen Wrapper, nur wenn `.stats-badges` sichtbar (z.B. Parent hat Klasse/Attribut, unter der die Animation startet).

3. **main.js (optional für Count-up):**  
   - Beim Aktivieren der Badges (IntersectionObserver oder passendes Event) alle `.stats-badge--likes` im sichtbaren Bereich durchgehen, `data-value` auslesen, Zahl über requestAnimationFrame oder setInterval von 0 hochzählen bis `data-value`, dann finale Zahl ins DOM.  
   - `prefers-reduced-motion` berücksichtigen: dann keinen Count-up, nur Fade/Slide.

4. **Barrierefreiheit:**  
   - `aria-hidden` auf den dekorativen SVG-Icons belassen; die semantische Info („X Likes“) bleibt im `aria-label` der Card.

---

## 4. Erwartetes Ergebnis

- **Likes** sind auf den ersten Blick erkennbar (Farbe, Herz, evtl. Glow).
- **Animation:** Herz macht einen kurzen, ruhigen Pulse beim Erscheinen; optional zählt die Likes-Zahl sauber hoch.
- **Gesamtbild:** Stats-Bereich wirkt klarer, weniger trist, emotionaler bei Likes, ohne verspielt zu wirken.
