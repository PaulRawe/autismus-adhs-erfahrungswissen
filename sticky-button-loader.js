// Sticky Button Loader - Lädt den Button auf jeder Seite automatisch
(function() {
    'use strict';
    
    function loadStickyButton() {
        // Prüfen ob Button bereits geladen wurde
        if (document.getElementById('sticky-download-button')) {
            return;
        }
        
        // Button HTML laden und einfügen
        fetch('sticky-button.html')
            .then(response => response.text())
            .then(html => {
                const container = document.createElement('div');
                container.innerHTML = html;
                document.body.appendChild(container.firstElementChild);
                
                // CSS ist im HTML eingebunden, wird automatisch geladen
                
                // Cookie-Banner Klasse hinzufügen wenn Banner sichtbar
                checkCookieBanner();
            })
            .catch(error => {
                console.error('Sticky Button konnte nicht geladen werden:', error);
            });
    }
    
    function checkCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.attributeName === 'style') {
                        updateBodyClass();
                    }
                });
            });
            
            observer.observe(banner, { attributes: true });
            updateBodyClass();
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
    
    // Laden wenn DOM bereit ist
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadStickyButton);
    } else {
        loadStickyButton();
    }
})();
