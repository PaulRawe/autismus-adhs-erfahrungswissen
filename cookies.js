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
                
