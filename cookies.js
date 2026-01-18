// Cookie Consent Management
// Speichert Einstellungen in localStorage, damit sie nicht immer wieder abgefragt werden

(function() {
    'use strict';
    
    const COOKIE_CONSENT_KEY = 'autismus-adhs-cookie-consent';
    const COOKIE_CONSENT_VERSION = '1.0';
    
    // Prüfen ob Consent bereits gegeben wurde
    function hasConsent() {
        try {
            const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
            if (!consent) return false;
            
            const data = JSON.parse(consent);
            return data.version === COOKIE_CONSENT_VERSION && data.timestamp;
        } catch (e) {
            return false;
        }
    }
    
    // Consent speichern
    function saveConsent(analytics, marketing) {
        const consent = {
            version: COOKIE_CONSENT_VERSION,
            timestamp: Date.now(),
            analytics: analytics,
            marketing: marketing,
            necessary: true
        };
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
        loadAnalytics(analytics);
    }
    
    // Consent laden
    function loadConsent() {
        try {
            const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
            if (!consent) return null;
            return JSON.parse(consent);
        } catch (e) {
            return null;
        }
    }
    
    // Analytics laden (GoatCounter)
    function loadAnalytics(enabled) {
        if (enabled) {
            // GoatCounter Script laden wenn Analyse-Cookies akzeptiert
            if (!document.querySelector('script[data-goatcounter]')) {
                const script = document.createElement('script');
                script.setAttribute('data-goatcounter', 'https://autismus-adhs.goatcounter.com/count');
                script.async = true;
                script.src = '//gc.zgo.at/count.js';
                document.head.appendChild(script);
            }
        }
    }
    
    // Google AdSense laden
    function loadAdSense(enabled) {
        if (enabled) {
            // AdSense ist bereits im HTML eingebunden
            // Hier könnten zusätzliche Marketing-Scripte geladen werden
        }
    }
    
    // Banner anzeigen/verstecken
    function showBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.display = 'block';
            // Accessibility: Focus auf ersten Button setzen
            setTimeout(() => {
                const firstButton = banner.querySelector('button');
                if (firstButton) firstButton.focus();
            }, 100);
        }
    }
    
    function hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.display = 'none';
        }
    }
    
    // Modal anzeigen/verstecken
    function showModal() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.style.display = 'flex';
            // Bestehende Einstellungen laden
            const consent = loadConsent();
            if (consent) {
                document.getElementById('cookie-analytics').checked = consent.analytics;
                document.getElementById('cookie-marketing').checked = consent.marketing;
            }
        }
    }
    
    function hideModal() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    // Globale Funktionen für Buttons
    window.acceptCookies = function() {
        saveConsent(true, true);
        hideBanner();
    };
    
    window.declineCookies = function() {
        saveConsent(false, false);
        hideBanner();
    };
    
    window.openCookieSettings = function() {
        hideBanner();
        showModal();
    };
    
    window.closeCookieSettings = function() {
        hideModal();
        // Banner wieder anzeigen wenn kein Consent vorhanden
        if (!hasConsent()) {
            showBanner();
        }
    };
    
    window.saveCookieSettings = function() {
        const analytics = document.getElementById('cookie-analytics').checked;
        const marketing = document.getElementById('cookie-marketing').checked;
        saveConsent(analytics, marketing);
        hideModal();
    };
    
    // Cookie-Einstellungen aus Footer öffnen
    window.openCookieSettingsFromFooter = function() {
        showModal();
    };
    
    // Initialisierung beim Laden der Seite
    function init() {
        // Prüfen ob Consent bereits gegeben wurde
        if (hasConsent()) {
            hideBanner();
            const consent = loadConsent();
            if (consent) {
                loadAnalytics(consent.analytics);
                loadAdSense(consent.marketing);
            }
        } else {
            showBanner();
        }
    }
    
    // Warten bis DOM geladen ist
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();

// ==================================================
// STICKY DOWNLOAD BUTTON - Automatisch auf allen Seiten
// ==================================================
(function() {
    'use strict';
    
    function loadStickyButton() {
        // Prüfen ob Button bereits existiert
        if (document.getElementById('sticky-download-button')) {
            return;
        }
        
        // Button HTML erstellen und einfügen
        const buttonHTML = `
            <div id="sticky-download-button">
                <a href="downloads.html" class="sticky-btn" aria-label="Zu unseren Hilfsmaterialien">
                    <span class="sticky-btn-icon">📚</span>
                    <span class="sticky-btn-text">
                        <strong>Hilfsmaterialien</strong>
                        <small>für Autismus & ADHS</small>
                    </span>
                </a>
            </div>
        `;
        
        // Am Ende des Body einfügen
        const container = document.createElement('div');
        container.innerHTML = buttonHTML.trim();
        document.body.appendChild(container.firstElementChild);
        
        // Cookie-Banner Überwachung für Button-Position
        checkCookieBanner();
    }
    
    function checkCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            // Initial prüfen
            updateBodyClass();
            
            // Bei Änderungen am Banner reagieren
            const observer = new MutationObserver(function() {
                updateBodyClass();
            });
            
            observer.observe(banner, { attributes: true, attributeFilter: ['style'] });
        }
    }
    
    function updateBodyClass() {
        const banner = document.getElementById('cookie-banner');
        if (banner && banner.style.display !== 'none') {
            document.body.classList.add('cookie-banner-visible');
        } else {
            document.body.classList.remove('cookie-banner-visible');
        }
    }
    
    // Button laden wenn DOM bereit ist
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadStickyButton);
    } else {
        loadStickyButton();
    }
})();

document.addEventListener("DOMContentLoaded", () => {
    const sticky = document.getElementById("sticky-download-button");
    const footer = document.querySelector("footer");

    if (!sticky || !footer) return;

    const baseOffset = 2; // entspricht deinem bottom: 2rem

    function updateSticky() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        const footerTop = footer.offsetTop;
        const stickyHeight = sticky.offsetHeight;

        // Wo wäre die Unterkante des Sticky Buttons?
        const stickyBottom = scrollY + windowHeight - baseOffset;

        // Wo beginnt der Footer?
        const footerTrigger = footerTop;

        if (stickyBottom >= footerTrigger) {
            // Button trifft Footer → fixieren
            sticky.style.position = "absolute";
            sticky.style.bottom = "auto";
            sticky.style.top = (footerTrigger - stickyHeight - baseOffset) + "px";
        } else {
            // Normalzustand
            sticky.style.position = "fixed";
            sticky.style.top = "auto";
            sticky.style.bottom = baseOffset + "px";
        }
    }

    window.addEventListener("scroll", updateSticky);
    window.addEventListener("resize", updateSticky);
    updateSticky();
});
     // ==================================================
// MEDIZINISCHER DISCLAIMER – Automatisch unter Header einfügen
// ==================================================
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {

        // Prüfe, ob Disclaimer bereits existiert
        if (document.getElementById('medical-disclaimer')) return;

        // Header finden
        const header = document.querySelector('header');
        if (!header) return; // Falls Seite keinen Header hat – Abbruch

        // Disclaimer-HTML
        const disclaimerHTML = `
            <div id="medical-disclaimer" style="
                background: #fff3cd;
                color: #5c4700;
                padding: 1rem;
                margin-top: 0;
                border-bottom: 2px solid #f0d98c;
                font-size: 0.9rem;
                line-height: 1.5;
                text-align: center;
            ">
                <strong>Wichtiger Hinweis:</strong> 
                Diese Seite ersetzt keine medizinische oder therapeutische Beratung. 
                Alle Inhalte basieren auf unseren persönlichen Erfahrungen als Familie.
            </div>
        `;

        // Disclaimer direkt nach dem Header einfügen
        header.insertAdjacentHTML('afterend', disclaimerHTML);
    });

})();           
// ==================================================
// HILFE-HINWEIS unter dem Disclaimer einfügen
// ==================================================
(function() {
    'use strict';

    function insertHelpBox() {
        // Prüfen ob bereits vorhanden
        if (document.getElementById('help-box-orientierung')) return;

        // Disclaimer suchen (steht direkt unter <header>)
        const disclaimer = document.getElementById('medical-disclaimer');
        if (!disclaimer) return;

        // Box HTML
        const boxHTML = `
            <div id="help-box-orientierung" style="
                max-width: 900px;
                margin: 1rem auto;
                padding: 0.8rem 1rem;
                background: #f4f6f8;
                border-left: 4px solid #2f6f8f;
                border-radius: 6px;
                font-size: 0.95rem;
                line-height: 1.5;
                color: #2b2b2b;
            ">
                Braucht ihr gerade Orientierung?
                <a href="/alltags-helfer-finder/index.html"
                    style="color:#2f6f8f;font-weight:bold;text-decoration:underline;">
                    → Kurze Fragen, direkte Hilfe
                </a>
            </div>
        `;

        // Box nach dem Disclaimer einfügen
        disclaimer.insertAdjacentHTML('afterend', boxHTML);
    }

    // Laden nach DOM Ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertHelpBox);
    } else {
        insertHelpBox();
    }
})();
// ==================================================
// HILFE-HINWEIS unter Disclaimer ODER Header einfügen
// ==================================================
(function() {
    'use strict';

    function insertHelpBox() {
        if (document.getElementById('help-box-orientierung')) return;

        // 1️⃣ Erst versuchen: Disclaimer finden
        let anchor = document.getElementById('medical-disclaimer');

        // 2️⃣ Wenn nicht vorhanden → Header verwenden
        if (!anchor) {
            anchor = document.querySelector('header');
        }

        // Wenn beides nicht existiert, abbrechen
        if (!anchor) return;

        const boxHTML = `
            <div id="help-box-orientierung" style="
                max-width: 900px;
                margin: 1rem auto;
                padding: 0.8rem 1rem;
                background: #f4f6f8;
                border-left: 4px solid #2f6f8f;
                border-radius: 6px;
                font-size: 0.95rem;
                line-height: 1.5;
                color: #2b2b2b;
            ">
                Braucht ihr gerade Orientierung?
                <a href="/alltags-helfer-finder/index.html"
                    style="color:#2f6f8f;font-weight:bold;text-decoration:underline;">
                    → Kurze Fragen, direkte Hilfe
                </a>
            </div>
        `;

        anchor.insertAdjacentHTML('afterend', boxHTML);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertHelpBox);
    } else {
        insertHelpBox();
    }
})();



