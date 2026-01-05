// Cookie Consent Management mit GoatCounter Integration
// DSGVO-konform: Opt-in, localStorage statt Cookies, klare Nutzerführung
(function() {
    'use strict';

    const COOKIE_CONSENT_KEY = 'cookieConsent';
    const COOKIE_SETTINGS_KEY = 'cookieSettings';
    const CONSENT_VERSION = '1.0'; // Version der Consent-Einstellungen
    const CONSENT_VERSION_KEY = 'cookieConsentVersion';
    
    // Standard-Einstellungen (alle optional deaktiviert)
    const defaultSettings = {
        necessary: true,      // Immer aktiv (localStorage für Consent)
        analytics: false,     // GoatCounter - muss explizit aktiviert werden
        marketing: false      // Zukünftige Marketing-Cookies
    };

    // Cookie Banner initialisieren
    function initCookieBanner() {
        const consent = getConsent();
        const version = localStorage.getItem(CONSENT_VERSION_KEY);
        
        // Banner anzeigen wenn:
        // - Kein Consent vorhanden ODER
        // - Consent-Version veraltet
        if (consent === null || version !== CONSENT_VERSION) {
            showBanner();
        } else {
            // Consent vorhanden und aktuell
            const settings = getSettings();
            if (settings.analytics) {
                loadAnalytics();
            }
        }
    }

    // Consent Status abrufen
    function getConsent() {
        try {
            return localStorage.getItem(COOKIE_CONSENT_KEY);
        } catch (e) {
            console.warn('LocalStorage nicht verfügbar:', e);
            return null;
        }
    }

    // Cookie-Einstellungen abrufen
    function getSettings() {
        try {
            const saved = localStorage.getItem(COOKIE_SETTINGS_KEY);
            return saved ? JSON.parse(saved) : defaultSettings;
        } catch (e) {
            console.warn('Fehler beim Laden der Einstellungen:', e);
            return defaultSettings;
        }
    }

    // Cookie-Einstellungen speichern
    function saveSettings(settings) {
        try {
            localStorage.setItem(COOKIE_SETTINGS_KEY, JSON.stringify(settings));
            localStorage.setItem(CONSENT_VERSION_KEY, CONSENT_VERSION);
        } catch (e) {
            console.error('Fehler beim Speichern der Einstellungen:', e);
        }
    }

    // Banner anzeigen
    function showBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.display = 'block';
            banner.setAttribute('aria-hidden', 'false');
        }
    }

    // Banner ausblenden
    function hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.display = 'none';
            banner.setAttribute('aria-hidden', 'true');
        }
    }

    // Alle Cookies akzeptieren
    window.acceptCookies = function() {
        const settings = {
            necessary: true,
            analytics: true,
            marketing: false
        };
        
        try {
            localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
            saveSettings(settings);
            hideBanner();
            loadAnalytics();
            
            console.log('Cookie-Einstellungen gespeichert: Alle akzeptiert');
        } catch (e) {
            console.error('Fehler beim Speichern der Zustimmung:', e);
        }
    };

    // Nur notwendige Cookies
    window.declineCookies = function() {
        const settings = {
            necessary: true,
            analytics: false,
            marketing: false
        };
        
        try {
            localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
            saveSettings(settings);
            hideBanner();
            removeAnalytics();
            
            console.log('Cookie-Einstellungen gespeichert: Nur notwendige');
        } catch (e) {
            console.error('Fehler beim Speichern der Ablehnung:', e);
        }
    };

    // Einstellungen öffnen
    window.openCookieSettings = function() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            loadCurrentSettings();
            
            // Focus auf erstes interaktives Element
            const firstToggle = modal.querySelector('input[type="checkbox"]');
            if (firstToggle) {
                setTimeout(() => firstToggle.focus(), 100);
            }
        }
    };

    // Einstellungen schließen (ohne zu speichern)
    window.closeCookieSettings = function() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
        }
    };

    // Aktuelle Einstellungen in Modal laden
    function loadCurrentSettings() {
        const settings = getSettings();
        
        const analyticsToggle = document.getElementById('cookie-analytics');
        const marketingToggle = document.getElementById('cookie-marketing');
        
        if (analyticsToggle) {
            analyticsToggle.checked = settings.analytics;
        }
        if (marketingToggle) {
            marketingToggle.checked = settings.marketing;
        }
    }

    // Einstellungen speichern
    window.saveCookieSettings = function() {
        const analyticsToggle = document.getElementById('cookie-analytics');
        const marketingToggle = document.getElementById('cookie-marketing');
        
        const settings = {
            necessary: true,
            analytics: analyticsToggle ? analyticsToggle.checked : false,
            marketing: marketingToggle ? marketingToggle.checked : false
        };
        
        try {
            saveSettings(settings);
            localStorage.setItem(COOKIE_CONSENT_KEY, 'custom');
            
            closeCookieSettings();
            hideBanner();
            
            // Analytics aktivieren/deaktivieren basierend auf Einstellungen
            if (settings.analytics) {
                loadAnalytics();
            } else {
                removeAnalytics();
            }
            
            console.log('Cookie-Einstellungen gespeichert:', settings);
        } catch (e) {
            console.error('Fehler beim Speichern der benutzerdefinierten Einstellungen:', e);
        }
    };

    // GoatCounter Analytics laden (nur wenn Zustimmung vorliegt)
    function loadAnalytics() {
        const settings = getSettings();
        
        // Doppelprüfung: Nur laden wenn explizit zugestimmt
        if (!settings.analytics) {
            console.log('Analytics deaktiviert - wird nicht geladen');
            return;
        }
        
        // Prüfen ob GoatCounter bereits geladen wurde
        if (window.goatcounter && document.querySelector('script[data-goatcounter]')) {
            console.log('GoatCounter bereits geladen');
            return;
        }
        
        // GoatCounter Script laden
        const script = document.createElement('script');
        script.async = true;
        script.src = '//gc.zgo.at/count.js';
        script.setAttribute('data-goatcounter', 'https://pauleheissta.goatcounter.com/count');
        
        // Fehlerbehandlung
        script.onerror = function() {
            console.error('Fehler beim Laden von GoatCounter');
        };
        
        script.onload = function() {
            console.log('GoatCounter Analytics erfolgreich geladen');
        };
        
        document.head.appendChild(script);
    }

    // Analytics entfernen
    function removeAnalytics() {
        // GoatCounter Script entfernen falls vorhanden
        const scripts = document.querySelectorAll('script[data-goatcounter]');
        scripts.forEach(script => {
            script.remove();
            console.log('GoatCounter Script entfernt');
        });
        
        // GoatCounter Objekt entfernen
        if (window.goatcounter) {
            delete window.goatcounter;
            console.log('GoatCounter Objekt entfernt');
        }
    }

    // Consent zurücksetzen (für Entwicklung/Testing oder wenn User neu entscheiden will)
    window.resetCookieConsent = function() {
        try {
            localStorage.removeItem(COOKIE_CONSENT_KEY);
            localStorage.removeItem(COOKIE_SETTINGS_KEY);
            localStorage.removeItem(CONSENT_VERSION_KEY);
            removeAnalytics();
            console.log('Cookie-Consent zurückgesetzt');
            location.reload();
        } catch (e) {
            console.error('Fehler beim Zurücksetzen:', e);
        }
    };

    // Consent-Status abfragen (für externe Nutzung)
    window.getCookieConsent = function() {
        return {
            consent: getConsent(),
            settings: getSettings(),
            version: localStorage.getItem(CONSENT_VERSION_KEY)
        };
    };

    // Bei Seitenladen initialisieren
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCookieBanner);
    } else {
        initCookieBanner();
    }

    // Sicherstellen dass Banner bei Navigation angezeigt wird (für SPAs)
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            initCookieBanner();
        }
    });

})();

// Hilfsfunktion: Manuelles Event-Tracking mit GoatCounter
// Nur wenn Analytics aktiviert ist
window.trackEvent = function(eventName, eventData = {}) {
    try {
        const settings = JSON.parse(localStorage.getItem('cookieSettings') || '{}');
        
        if (!settings.analytics) {
            console.log('Analytics deaktiviert - Event nicht getrackt:', eventName);
            return false;
        }
        
        if (!window.goatcounter || typeof window.goatcounter.count !== 'function') {
            console.warn('GoatCounter nicht verfügbar - Event nicht getrackt:', eventName);
            return false;
        }
        
        window.goatcounter.count({
            path: eventName,
            title: eventData.title || eventName,
            event: true
        });
        
        console.log('Event getrackt:', eventName);
        return true;
    } catch (e) {
        console.error('Fehler beim Event-Tracking:', e);
        return false;
    }
};
