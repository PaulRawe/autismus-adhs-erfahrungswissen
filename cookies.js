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
// STICKY DOWNLOAD BUTTON - DUAL VERSION (Sams Helfer + Etsy)
// ==================================================
(function() {
    'use strict';
    
    function loadStickyButton() {
        // Prüfen ob Button bereits existiert
        if (document.getElementById('sticky-download-button')) {
            return;
        }
        
        // Relativen Pfad zu downloads.html berechnen
        const depth = (window.location.pathname.match(/\//g) || []).length - 1;
        const pathToDownloads = depth > 0 ? '../'.repeat(depth) + 'downloads.html' : 'downloads.html';

        // Dual Button HTML erstellen
        const buttonHTML = `
    <div id="sticky-download-button">
        <a href="${pathToDownloads}" class="sticky-btn primary" aria-label="Unsere erprobten Alltagshelfer ansehen">
            <span class="sticky-btn-icon">📚</span>
            <span class="sticky-btn-text">
                <strong>Sams Helfer</strong>
                <small>Bewährte Alltagshilfen</small>
            </span>
        </a>
        <a href="https://www.etsy.com/de/shop/NeuroTeacherTools" 
           class="sticky-btn etsy" 
           target="_blank" 
           rel="noopener"
           aria-label="Auf Etsy kaufen">
            <span class="sticky-btn-icon">🛍️</span>
            <span class="sticky-btn-text">
                <strong>Auf Etsy</strong>
                <small>Sicher kaufen</small>
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
            updateBodyClass();
            
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
// ==================================================
// STICKY BUTTON POSITION (Footer-Kollision vermeiden)
// ==================================================
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
// HILFE-HINWEIS nach Navigation einfügen (ALLE SEITEN)
// ==================================================
(function() {
    'use strict';

    function insertHelpBox() {
        // Prüfen ob bereits vorhanden
        if (document.getElementById('help-box-orientierung')) return;

        // Navigation finden
        const nav = document.querySelector('nav');
        if (!nav) return; // Keine Navigation, keine Box

        // Relativen Pfad berechnen basierend auf aktueller URL
        const currentPath = window.location.pathname;
        const depth = (currentPath.match(/\//g) || []).length - 1;
        
        let relativePathToFinder = '';
        if (depth === 0) {
            relativePathToFinder = 'alltags-helfer-finder/index.html';
        } else {
            relativePathToFinder = '../'.repeat(depth) + 'alltags-helfer-finder/index.html';
        }

        // Box HTML mit berechnetem relativen Pfad
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
                💡 Braucht ihr gerade Orientierung?
                <a href="${relativePathToFinder}"
                    style="color:#2f6f8f;font-weight:bold;text-decoration:underline;">
                    → Kurze Fragen, direkte Hilfe (2 Min.)
                </a>
            </div>
        `;

        // Box direkt NACH der Navigation einfügen
        nav.insertAdjacentHTML('afterend', boxHTML);
    }

    // Laden nach DOM Ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertHelpBox);
    } else {
        insertHelpBox();
    }
})();


