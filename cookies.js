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
// STICKY FUNNEL BUTTON MIT DOWNLOAD-MENÜ
// ==================================================
(function() {
    'use strict';

    function loadStickyButton() {
        // Prüfen ob Button bereits existiert
        if (document.getElementById('sticky-download-button')) return;

        // Button HTML erstellen
        const buttonHTML = `
            <div id="sticky-download-button">
                <a href="/alltags-helfer-finder/index.html" class="sticky-btn">
                    <span class="sticky-btn-icon">🎯</span>
                    <span class="sticky-btn-text">
                        <strong>Finde deine Hilfen</strong>
                        <small>in 2 Minuten</small>
                    </span>
                </a>
            </div>
        `;

        const container = document.createElement('div');
        container.innerHTML = buttonHTML.trim();
        document.body.appendChild(container.firstElementChild);

        checkCookieBanner();
    }

    function checkCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        if (!banner) return;

        updateBodyClass();

        const observer = new MutationObserver(updateBodyClass);
        observer.observe(banner, { attributes: true, attributeFilter: ['style'] });
    }

    function updateBodyClass() {
        const banner = document.getElementById('cookie-banner');
        if (banner && banner.style.display !== 'none') {
            document.body.classList.add('cookie-banner-visible');
        } else {
            document.body.classList.remove('cookie-banner-visible');
        }
    }

    // DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadStickyButton);
    } else {
        loadStickyButton();
    }
})();

// ==================================================
// STICKY BUTTON POSITION AN FOOTER ANPASSEN
// ==================================================
document.addEventListener("DOMContentLoaded", () => {
    const sticky = document.getElementById("sticky-download-button");
    const footer = document.querySelector("footer");

    if (!sticky || !footer) return;

    const baseOffset = 2;

    function updateSticky() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const footerTop = footer.offsetTop;
        const stickyHeight = sticky.offsetHeight;

        const stickyBottom = scrollY + windowHeight - baseOffset;

        if (stickyBottom >= footerTop) {
            sticky.style.position = "absolute";
            sticky.style.bottom = "auto";
            sticky.style.top = (footerTop - stickyHeight - baseOffset) + "px";
        } else {
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
// AUSKLAPP-MENÜ (DOWNLOADS) FÜR STICKY BUTTON
// ==================================================
(function() {
    'use strict';

    function initExpandableMenu() {
        const sticky = document.getElementById('sticky-download-button');
        if (!sticky) return;

        if (document.getElementById('sticky-expanded-menu')) return;

        const menuHTML = `
            <div id="sticky-expanded-menu" style="
                display:none;
                position:fixed;
                right:1.2rem;
                bottom:4.8rem;
                background:#1b1b1b;
                border-radius:14px;
                padding:0.9rem 1.2rem;
                box-shadow:0 4px 14px rgba(0,0,0,0.25);
                z-index:9999;
                width:max-content;
            ">
                <a href="/downloads.html" style="
                    color:white;
                    text-decoration:none;
                    font-size:1rem;
                    font-weight:500;
                    display:block;
                ">
                    📂 Alle Downloads & Materialien
                </a>
            </div>
        `;

        const container = document.createElement('div');
        container.innerHTML = menuHTML.trim();
        document.body.appendChild(container.firstElementChild);

        const menu = document.getElementById('sticky-expanded-menu');
        const btn = sticky.querySelector('.sticky-btn');
        let isOpen = false;

        btn.addEventListener('click', function(e) {
            const linkClicked = e.target.closest('a');
            if (linkClicked && !isOpen) return; // Funnel normal öffnen

            e.preventDefault();
            isOpen = !isOpen;
            menu.style.display = isOpen ? 'block' : 'none';
        });

        document.addEventListener('click', function(e) {
            if (!isOpen) return;
            if (!sticky.contains(e.target) && !menu.contains(e.target)) {
                isOpen = false;
                menu.style.display = 'none';
            }
        });
    }

    function waitForSticky() {
        const interval = setInterval(() => {
            if (document.getElementById('sticky-download-button')) {
                clearInterval(interval);
                initExpandableMenu();
            }
        }, 100);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForSticky);
    } else {
        waitForSticky();
    }
})();
