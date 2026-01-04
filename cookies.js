// Cookie Consent Management mit GoatCounter Integration
(function() {
    'use strict';

    const COOKIE_CONSENT_KEY = 'cookieConsent';
    const COOKIE_SETTINGS_KEY = 'cookieSettings';
    
    // Standard-Einstellungen
    const defaultSettings = {
        necessary: true,      // Immer aktiv
        analytics: false,     // GoatCounter
        marketing: false      // Zukünftige Marketing-Cookies
    };

    // Cookie Banner initialisieren
    function initCookieBanner() {
        const consent = getConsent();
        
        if (consent === null) {
            showBanner();
        } else if (consent === 'accepted') {
            loadAnalytics();
        }
    }

    // Consent Status abrufen
    function getConsent() {
        return localStorage.getItem(COOKIE_CONSENT_KEY);
    }

    // Cookie-Einstellungen abrufen
    function getSettings() {
        const saved = localStorage.getItem(COOKIE_SETTINGS_KEY);
        return saved ? JSON.parse(saved) : defaultSettings;
    }

    // Cookie-Einstellungen speichern
    function saveSettings(settings) {
        localStorage.setItem(COOKIE_SETTINGS_KEY, JSON.stringify(settings));
    }

    // Banner anzeigen
    function showBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.display = 'block';
        }
    }

    // Banner ausblenden
    function hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.display = 'none';
        }
    }

    // Alle Cookies akzeptieren
    window.acceptCookies = function() {
        const settings = {
            necessary: true,
            analytics: true,
            marketing: false
        };
        
        localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
        saveSettings(settings);
        hideBanner();
        loadAnalytics();
    };

    // Nur notwendige Cookies
    window.declineCookies = function() {
        const settings = {
            necessary: true,
            analytics: false,
            marketing: false
        };
        
        localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
        saveSettings(settings);
        hideBanner();
    };

    // Einstellungen öffnen
    window.openCookieSettings = function() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.classList.add('active');
            loadCurrentSettings();
        }
    };

    // Einstellungen schließen
    window.closeCookieSettings = function() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    };

    // Aktuelle Einstellungen in Modal laden
    function loadCurrentSettings() {
        const settings = getSettings();
        
        const analyticsToggle = document.getElementById('cookie-analytics');
        const marketingToggle = document.getElementById('cookie-marketing');
        
        if (analyticsToggle) analyticsToggle.checked = settings.analytics;
        if (marketingToggle) marketingToggle.checked = settings.marketing;
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
        
        saveSettings(settings);
        localStorage.setItem(COOKIE_CONSENT_KEY, 'custom');
        
        closeCookieSettings();
        hideBanner();
        
        // Analytics aktivieren/deaktivieren
        if (settings.analytics) {
            loadAnalytics();
        } else {
            removeAnalytics();
        }
    };

    // GoatCounter Analytics laden
    function loadAnalytics() {
        const settings = getSettings();
        
        if (!settings.analytics) {
            return;
        }
        
        // Prüfen ob GoatCounter bereits geladen wurde
        if (window.goatcounter) {
            return;
        }
        
        // GoatCounter Script laden
        const script = document.createElement('script');
        script.async = true;
        script.src = '//gc.zgo.at/count.js';
        script.setAttribute('data-goatcounter', 'https://pauleheissta.goatcounter.com/count');
        
        // Optional: Kein automatisches Tracking, nur manuelle Events
        // script.setAttribute('data-goatcounter-settings', '{"no_onload": true}');
        
        document.head.appendChild(script);
        
        console.log('GoatCounter Analytics geladen');
    }

    // Analytics entfernen
    function removeAnalytics() {
        // GoatCounter Script entfernen falls vorhanden
        const scripts = document.querySelectorAll('script[data-goatcounter]');
        scripts.forEach(script => script.remove());
        
        // GoatCounter Objekt entfernen
        if (window.goatcounter) {
            delete window.goatcounter;
        }
        
        console.log('GoatCounter Analytics entfernt');
    }

    // Consent zurücksetzen (für Entwicklung/Testing)
    window.resetCookieConsent = function() {
        localStorage.removeItem(COOKIE_CONSENT_KEY);
        localStorage.removeItem(COOKIE_SETTINGS_KEY);
        location.reload();
    };

    // Bei Seitenladen initialisieren
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCookieBanner);
    } else {
        initCookieBanner();
    }

})();

// Hilfsfunktion: Manuelles Event-Tracking mit GoatCounter
window.trackEvent = function(eventName, eventData = {}) {
    const settings = JSON.parse(localStorage.getItem('cookieSettings') || '{}');
    
    if (!settings.analytics || !window.goatcounter) {
        console.log('Analytics deaktiviert oder nicht geladen');
        return;
    }
    
    window.goatcounter.count({
        path: eventName,
        title: eventData.title || eventName,
        event: true
    });
};