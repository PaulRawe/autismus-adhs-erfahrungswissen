# Integration Guide: Cookie Consent & Tracking

## 📋 Übersicht

Diese Anleitung zeigt dir, wie du das Cookie-Consent-System mit GoatCounter-Tracking in deine Website integrierst.

## 📁 Dateistruktur

```
/
├── index.html
├── consent.css
├── cookies.js
├── cookies.html
├── robots.txt
├── sitemap.xml
├── .htaccess
├── 404.html
└── [weitere HTML-Seiten]
```

## 🚀 Schritt-für-Schritt Integration

### 1. GoatCounter Account einrichten

1. Gehe zu [goatcounter.com](https://www.goatcounter.com)
2. Erstelle einen kostenlosen Account
3. Wähle deinen Code: z.B. `autismus-adhs` → `autismus-adhs.goatcounter.com`
4. Notiere dir deinen Code für Schritt 3

### 2. Dateien hochladen

Lade alle Dateien auf deinen Webserver hoch:
- `consent.css`
- `cookies.js`
- `cookies.html`
- `robots.txt`
- `sitemap.xml`
- `.htaccess` (falls Apache-Server)
- `404.html`

### 3. GoatCounter Code in cookies.js eintragen

Öffne `cookies.js` und suche diese Zeile (ca. Zeile 116):

```javascript
script.setAttribute('data-goatcounter', 'https://DEIN-CODE.goatcounter.com/count');
```

Ersetze `DEIN-CODE` durch deinen GoatCounter-Code:

```javascript
script.setAttribute('data-goatcounter', 'https://autismus-adhs.goatcounter.com/count');
```

### 4. Cookie Banner in JEDE HTML-Seite einbinden

Füge **vor dem schließenden `</body>`-Tag** auf JEDER Seite ein:

```html
<!-- Cookie Consent System -->
<link rel="stylesheet" href="/consent.css">

<!-- Cookie Banner -->
<div id="cookie-banner" style="display: none;">
    <div class="banner-content">
        <p>
            Diese Website verwendet Cookies, um Ihnen die bestmögliche Nutzererfahrung zu bieten. 
            Wir nutzen GoatCounter für datenschutzfreundliche Statistiken. 
            Weitere Informationen finden Sie in unserer 
            <a href="/datenschutz.html">Datenschutzerklärung</a> und den 
            <a href="/cookies.html">Cookie-Einstellungen</a>.
        </p>
        <div class="button-group">
            <button class="btn-accept" onclick="acceptCookies()">Alle akzeptieren</button>
            <button class="btn-decline" onclick="declineCookies()">Nur notwendige</button>
            <button class="btn-settings" onclick="openCookieSettings()">Einstellungen</button>
        </div>
    </div>
</div>

<!-- Cookie Settings Modal -->
<div id="cookie-settings-modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Cookie-Einstellungen</h2>
        </div>
        
        <div class="modal-body">
            <!-- Notwendige Cookies -->
            <div class="cookie-category">
                <h3>Notwendige Cookies</h3>
                <p>Diese Cookies sind für die Grundfunktionen der Website erforderlich.</p>
                <div class="cookie-toggle">
                    <label>Status: Immer aktiv</label>
                    <label class="toggle-switch">
                        <input type="checkbox" checked disabled>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
            
            <!-- Analytics Cookies -->
            <div class="cookie-category">
                <h3>Analyse & Statistik</h3>
                <p>GoatCounter – datenschutzfreundliches, DSGVO-konformes Analytics.</p>
                <div class="cookie-toggle">
                    <label>Analytics erlauben</label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="cookie-analytics">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
            
            <!-- Marketing Cookies -->
            <div class="cookie-category">
                <h3>Marketing & Werbung</h3>
                <p>Derzeit nicht in Verwendung.</p>
                <div class="cookie-toggle">
                    <label>Marketing erlauben</label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="cookie-marketing" disabled>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
        </div>
        
        <div class="modal-footer">
            <button class="btn-cancel" onclick="closeCookieSettings()">Abbrechen</button>
            <button class="btn-save" onclick="saveCookieSettings()">Speichern</button>
        </div>
    </div>
</div>

<script src="/cookies.js"></script>
```

### 5. Domain in Dateien anpassen

Ersetze in allen Dateien `https://deine-domain.de/` durch deine echte Domain:

**In folgenden Dateien:**
- `sitemap.xml` (alle `<loc>` Tags)
- `robots.txt` (Sitemap-Zeile)
- `.htaccess` (bei Weiterleitungen)

**Beispiel sitemap.xml:**
```xml
<loc>https://autismus-familie.de/</loc>
```

### 6. robots.txt & sitemap.xml verlinken

Stelle sicher, dass beide Dateien im Root-Verzeichnis liegen:
- `https://deine-domain.de/robots.txt`
- `https://deine-domain.de/sitemap.xml`

### 7. Bei Google Search Console anmelden

1. Gehe zu [search.google.com/search-console](https://search.google.com/search-console)
2. Füge deine Domain hinzu
3. Reiche die `sitemap.xml` ein

## ✅ Testing

### Cookie Banner testen:

1. Öffne deine Website im Inkognito-Modus
2. Der Cookie-Banner sollte erscheinen
3. Teste alle drei Buttons:
   - "Alle akzeptieren" → GoatCounter lädt
   - "Nur notwendige" → GoatCounter lädt NICHT
   - "Einstellungen" → Modal öffnet sich

### GoatCounter testen:

1. Akzeptiere Analytics-Cookies
2. Navigiere auf mehreren Seiten
3. Gehe zu `https://DEIN-CODE.goatcounter.com`
4. Login und prüfe ob Seitenaufrufe gezählt werden

### Consent zurücksetzen (für Tests):

Öffne Browser-Konsole (F12) und führe aus:
```javascript
localStorage.clear();
location.reload();
```

## 🔧 Erweiterte Funktionen

### Manuelles Event-Tracking

```javascript
// Download-Button tracken
trackEvent('/download/morgenroutine-pdf', { title: 'Morgenroutine PDF Download' });

// Formular-Absendung tracken
trackEvent('/kontakt/formular-gesendet', { title: 'Kontaktformular abgeschickt' });
```

### Cookie-Status programmatisch prüfen

```javascript
// Prüfen ob Analytics erlaubt ist
const settings = JSON.parse(localStorage.getItem('cookieSettings') || '{}');
if (settings.analytics) {
    // Analytics-Code ausführen
}
```

## 📊 GoatCounter Dashboard

Zugriff auf Statistiken:
- URL: `https://DEIN-CODE.goatcounter.com`
- Login mit deinem Account
- Zeigt: Seitenaufrufe, Referrer, Browser, Länder

**GoatCounter Vorteile:**
- ✅ DSGVO-konform ohne Consent
- ✅ Keine Cookies nötig
- ✅ Keine IP-Speicherung
- ✅ Open Source
- ✅ Kostenloses Hosting

## 🛡️ Datenschutz

In deiner `datenschutz.html` solltest du erwähnen:

```
Wir verwenden GoatCounter für Website-Statistiken:
- Anbieter: GoatCounter (gc.zgo.at)
- Zweck: Anonyme Seitenaufruf-Statistiken
- Rechtsgrundlage: Berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO)
- Speicherung: Keine personenbezogenen Daten
- Weitere Infos: https://www.goatcounter.com/help/gdpr
```

## 🐛 Troubleshooting

### Banner erscheint nicht
- Prüfe ob `cookies.js` korrekt eingebunden ist
- Öffne Browser-Konsole (F12) und prüfe auf Fehler
- Lösche localStorage: `localStorage.clear()`

### GoatCounter zählt nicht
- Prüfe ob der Code korrekt ist: `https://DEIN-CODE.goatcounter.com/count`
- Prüfe ob Analytics-Cookies akzeptiert wurden
- Warte 5-10 Minuten, Statistiken sind nicht Echtzeit

### Styles werden nicht angewendet
- Prüfe Pfad zu `consent.css`: `/consent.css` oder `../consent.css`
- Öffne CSS-Datei direkt im Browser: `https://deine-domain.de/consent.css`
- Prüfe Browser-Cache (Strg+F5 zum harten Neuladen)

## 📝 Checkliste vor Go-Live

- [ ] GoatCounter-Code in `cookies.js` eingetragen
- [ ] Domain in `sitemap.xml` ersetzt
- [ ] Domain in `robots.txt` ersetzt
- [ ] Cookie-Banner auf allen Seiten eingebunden
- [ ] `consent.css` und `cookies.js` hochgeladen
- [ ] `robots.txt` im Root-Verzeichnis
- [ ] `sitemap.xml` im Root-Verzeichnis
- [ ] `.htaccess` hochgeladen (Apache-Server)
- [ ] 404-Seite erstellt
- [ ] Google Search Console eingerichtet
- [ ] Sitemap bei Google eingereicht
- [ ] Cookie-Banner im Inkognito-Modus getestet
- [ ] GoatCounter-Tracking verifiziert
- [ ] Datenschutzerklärung aktualisiert

## 💡 Nächste Schritte

1. **Google AdSense hinzufügen**: Falls du Werbung schalten willst
2. **Newsletter**: Opt-in-Formular für E-Mail-Liste
3. **Affiliate-Links**: Amazon Associates einbinden
4. **Shop-System**: Für digitale Downloads

## 📞 Support

Bei Problemen:
- GoatCounter Help: https://www.goatcounter.com/help
- DSGVO-Info: https://www.goatcounter.com/help/gdpr