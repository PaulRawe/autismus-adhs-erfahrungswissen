# 🎯 Alltags-Helfer-Finder

Ein interaktiver Fragebogen-Funnel, der Besuchern personalisierte Produktempfehlungen gibt – mit echtem Mehrwert, ohne aufdringlichen Verkaufscharakter.

## 📂 Dateistruktur

```
alltags-helfer-finder/
├── index.html              # Hauptseite des Funnels
├── styles.css              # Komplettes Styling
├── app.js                  # Gesamte Logik
├── data/
│   ├── questions.json      # Alle Fragen + Mehrwert-Inhalte
│   └── products.json       # Produkte + Affiliates + Lead Magnet
├── assets/                 # Bilder (optional)
└── README.md              # Diese Datei
```

## 🚀 Installation

### Schritt 1: Ordner hochladen

Lade den kompletten `alltags-helfer-finder` Ordner in dein Website-Verzeichnis:

```
deine-website/
├── index.html
├── downloads.html
├── alltags-helfer-finder/    ← HIER
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── data/
└── ...
```

### Schritt 2: Sticky-Button anpassen

Öffne deine `scripts.js` und ändere den Sticky-Button:

**ALT:**
```javascript
<a href="downloads.html" class="sticky-btn">
```

**NEU:**
```javascript
<a href="alltags-helfer-finder/index.html" class="sticky-btn">
    <span class="sticky-btn-icon">🎯</span>
    <span class="sticky-btn-text">
        <strong>Finde deine Hilfen</strong>
        <small>in 2 Minuten</small>
    </span>
</a>
```

### Schritt 3: In Navigation einbinden (optional)

Füge in deinem Hauptmenü einen Link hinzu:

```html
<a href="alltags-helfer-finder/index.html">Hilfe-Finder</a>
```

## ✏️ Fragen anpassen

### Neue Frage hinzufügen

Öffne `data/questions.json` und füge eine neue Frage hinzu:

```json
{
  "id": 11,
  "question": "Deine neue Frage hier?",
  "type": "radio",
  "options": [
    {
      "value": "option1",
      "label": "Antwort 1",
      "score": {"tagesstruktur": 3, "regulation": 2}
    },
    {
      "value": "option2",
      "label": "Antwort 2",
      "score": {"tagesstruktur": 1, "regulation": 1}
    }
  ],
  "insight": {
    "helped_us": "Was euch geholfen hat...",
    "science": "Wissenschaftliche Einordnung...",
    "quick_tip": "Schneller Tipp..." // Optional
  }
}
```

**Kategorien für Scoring:**
- `tagesstruktur` - Tagesstruktur & Routinen
- `regulation` - Emotionale Regulation
- `kommunikation` - Kommunikation & Ausdruck
- `schule` - Schule & Lernen
- `soziales` - Soziales Umfeld
- `eltern` - Elterliche Selbstfürsorge

### Bestehende Frage ändern

1. Öffne `data/questions.json`
2. Suche die Frage anhand der ID
3. Ändere Texte, Optionen oder Insights
4. Speichern – fertig!

## 📦 Produkte verwalten

### Neues Produkt hinzufügen

Öffne `data/products.json` und füge ein neues Produkt hinzu:

```json
{
  "id": "neues-produkt",
  "name": "Vollständiger Produktname",
  "short_name": "Kurzer Name",
  "price": 19.99,
  "original_price": 24.99,  // Optional
  "savings": 5.00,           // Optional
  "description": "Kurze, prägnante Beschreibung",
  "image": "bild.png",
  "url": "https://dein-gumroad-link.com",
  "tags": ["tagesstruktur", "regulation", "schule"],
  "helps_with": [
    "Konkretes Problem 1",
    "Konkretes Problem 2",
    "Konkretes Problem 3"
  ],
  "priority_score": {
    "tagesstruktur": 8,
    "regulation": 6,
    "schule": 4
  }
}
```

**Priority Score erklärt:**
- Je höher der Wert (0-10), desto relevanter ist das Produkt für diese Kategorie
- Produkte mit hohen Scores in den Top-3-Kategorien des Users werden priorisiert
- Werte von 8-10 = sehr relevant
- Werte von 5-7 = relevant
- Werte von 1-4 = weniger relevant

### Produkt bearbeiten

1. Öffne `data/products.json`
2. Suche das Produkt anhand der ID
3. Ändere Preis, Beschreibung, Tags, etc.
4. Speichern – Änderungen sind sofort live!

### Affiliate-Produkte hinzufügen

Im gleichen `products.json` unter `"affiliates"`:

```json
{
  "id": "affiliate-id",
  "name": "Produktname",
  "description": "Kurze Beschreibung",
  "url": "https://amazon-affiliate-link.de",
  "tags": ["regulation", "soziales"],
  "priority_score": {
    "regulation": 5,
    "soziales": 3
  }
}
```

## 🎨 Design anpassen

### Farben ändern

Öffne `styles.css` und passe die Farben in den CSS-Variablen an:

```css
:root {
    --primary-color: #4a7c59;      /* Hauptfarbe */
    --accent-color: #f4a261;       /* Akzentfarbe */
    --bg-color: #faf9f7;          /* Hintergrund */
    /* ... */
}
```

### Schriftarten ändern

In `styles.css`:

```css
body {
    font-family: 'Deine Schrift', -apple-system, sans-serif;
}
```

## 📊 Wie funktioniert das Matching?

### 1. Scoring

Jede Antwort gibt Punkte für verschiedene Kategorien:

```json
"score": {
  "tagesstruktur": 3,  // 3 Punkte für Tagesstruktur
  "regulation": 2      // 2 Punkte für Regulation
}
```

### 2. Prioritäten ermitteln

Am Ende werden die Top 3 Kategorien mit den höchsten Punktzahlen identifiziert.

### 3. Produkte matchen

Produkte werden nach ihren `priority_score` Werten für diese Kategorien sortiert.

**Beispiel:**

User hat Top 3: `regulation` (15 Punkte), `tagesstruktur` (12 Punkte), `schule` (8 Punkte)

Produkt A:
- `regulation`: 10
- `tagesstruktur`: 8
- `schule`: 4
- **Gesamt-Score: 10×3 + 8×2 + 4×1 = 50**

Produkt B:
- `regulation`: 6
- `tagesstruktur`: 10
- `schule`: 8
- **Gesamt-Score: 6×3 + 10×2 + 8×1 = 46**

→ **Produkt A wird höher empfohlen**

### 4. Bundle-Empfehlung

Wenn sowohl `tagesstruktur` als auch `regulation` in den Top 3 sind, wird automatisch das Bundle an erster Stelle empfohlen.

## 🎁 Lead Magnet verwalten

Der kostenlose Download am Ende kann in `products.json` angepasst werden:

```json
"lead_magnet": {
  "id": "notfall_checkliste",
  "name": "Notfall-Checkliste: Meltdown-Prävention",
  "description": "Kostenlose PDF mit 5 konkreten Strategien",
  "file": "notfall-checkliste.pdf",  // Datei in data/ Ordner
  "available": true                   // true/false
}
```

## 📱 Mobile Optimierung

Der Funnel ist vollständig mobile-optimiert:

- Responsive Design für alle Bildschirmgrößen
- Touch-freundliche Buttons und Optionen
- Optimierte Schriftgrößen
- Schnelle Ladezeiten

## 🔧 Fehlerbehebung

### Fragen werden nicht geladen

1. Prüfe, ob `data/questions.json` korrekt formatiert ist (JSON-Validator nutzen)
2. Prüfe Browser-Konsole (F12) auf Fehler
3. Stelle sicher, dass alle Pfade korrekt sind

### Produkte werden nicht angezeigt

1. Prüfe `data/products.json` auf korrekte JSON-Syntax
2. Stelle sicher, dass `priority_score` gesetzt ist
3. Prüfe, ob die Tags mit den Fragen-Kategorien übereinstimmen

### Styling sieht anders aus

1. Prüfe, ob `styles.css` korrekt eingebunden ist
2. Leere Browser-Cache (Strg + F5)
3. Prüfe auf CSS-Konflikte mit anderen Stylesheets

## 📈 Conversion-Tipps

### DO's ✅

- Halte Fragen kurz und klar
- Gib bei jeder Frage echten Mehrwert
- Nutze persönliche Erfahrungen ("Das hat uns geholfen")
- Zeige Produkte nur, wenn sie wirklich passen
- Biete kostenlosen Download an

### DON'Ts ❌

- Zu viele Fragen (max. 12)
- Zu aufdringliche Verkaufssprache
- Produkte ohne echte Relevanz zeigen
- Keine wissenschaftliche Einordnung geben
- Insights weglassen

## 🚀 Erweiterungen

### Weitere Ideen

- **E-Mail-Erfassung:** Ergebnisse per E-Mail zusenden
- **PDF-Report:** Personalisierte Auswertung zum Download
- **Social Sharing:** "Hilf anderen Eltern – teile den Finder"
- **Fortschritt speichern:** LocalStorage nutzen für Wiederaufnahme
- **A/B-Testing:** Verschiedene Fragenreihenfolgen testen

### Integration mit Newsletter

Am Ende der Auswertung einen Opt-in einbauen:

```html
<div class="newsletter-signup">
    <h3>Möchtest du mehr Alltags-Tipps?</h3>
    <p>Melde dich für unseren Newsletter an.</p>
    <form action="dein-newsletter-dienst">
        <input type="email" placeholder="deine@email.de">
        <button type="submit">Anmelden</button>
    </form>
</div>
```

## 📧 Support

Bei Fragen oder Problemen:
- E-Mail: rawe.p@freenet.de
- Dokumentation: Diese README
- JSON-Validator: https://jsonlint.com/

## 📝 Changelog

**Version 1.0** (Januar 2025)
- Initiale Version
- 10 Fragen mit Insights
- 4 Produkte + 5 Affiliates
- Mobil-optimiert
- Lead Magnet Integration

---

**Viel Erfolg mit deinem Alltags-Helfer-Finder! 🎯**
