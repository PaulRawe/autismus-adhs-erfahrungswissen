// disclaimer.js - Medizinischer Haftungsausschluss
// Direkt nach dem <body>-Tag einfügen

document.addEventListener('DOMContentLoaded', function() {
    const disclaimerHTML = `
        <div id="medical-disclaimer" style="
            background: linear-gradient(135deg, #fff3cd 0%, #fff8e1 100%);
            border-left: 5px solid #ff9800;
            padding: 1.5rem;
            margin: 1.5rem auto;
            max-width: 1100px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        ">
            <div style="display: flex; align-items: start; gap: 1rem;">
                <div style="font-size: 2rem; flex-shrink: 0;">⚠️</div>
                <div style="flex: 1;">
                    <h3 style="
                        margin: 0 0 0.8rem 0;
                        color: #e65100;
                        font-size: 1.1rem;
                        font-weight: bold;
                    ">Wichtiger Hinweis</h3>
                    <p style="
                        margin: 0 0 0.5rem 0;
                        line-height: 1.6;
                        color: #333;
                        font-size: 0.95rem;
                    ">
                        Die Inhalte dieser Website basieren auf <strong>persönlichen Erfahrungen</strong> 
                        und ersetzen <strong>keine professionelle medizinische, therapeutische oder 
                        pädagogische Beratung</strong>.
                    </p>
                    <p style="
                        margin: 0;
                        line-height: 1.6;
                        color: #333;
                        font-size: 0.95rem;
                    ">
                        Bei Fragen zu Diagnose, Therapie oder Förderung wenden Sie sich bitte an 
                        qualifizierte Fachkräfte (Kinderärzte, Therapeuten, Psychologen).
                    </p>
                </div>
            </div>
        </div>
    `;
    
    // Direkt nach dem <header> einfügen
    const header = document.querySelector('header');
    if (header) {
        header.insertAdjacentHTML('afterend', disclaimerHTML);
    }
});
