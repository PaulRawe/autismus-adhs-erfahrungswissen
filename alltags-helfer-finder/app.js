// ===================================
// ALLTAGS-HELFER-FINDER APP
// Modulare, erweiterbare Logik
// ===================================

class AlltagsHelferFinder {
    constructor() {
        this.questions = [];
        this.products = [];
        this.affiliates = [];
        this.leadMagnet = null;
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.scores = {
            tagesstruktur: 0,
            regulation: 0,
            kommunikation: 0,
            schule: 0,
            soziales: 0,
            eltern: 0
        };
        
        this.init();
    }
    
    async init() {
        await this.loadData();
        this.renderQuestion();
        this.updateProgress();
    }
    
    async loadData() {
        try {
            // Lade Fragen
            const questionsResponse = await fetch('data/questions.json');
            const questionsData = await questionsResponse.json();
            this.questions = questionsData.questions;
            
            // Lade Produkte
            const productsResponse = await fetch('data/products.json');
            const productsData = await productsResponse.json();
            this.products = productsData.products;
            this.affiliates = productsData.affiliates || [];
            this.leadMagnet = productsData.lead_magnet;
        } catch (error) {
            console.error('Fehler beim Laden der Daten:', error);
        }
    }
    
    updateProgress() {
        const progressPercent = ((this.currentQuestionIndex) / this.questions.length) * 100;
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressFill) {
            progressFill.style.width = `${progressPercent}%`;
        }
        
        if (progressText) {
            progressText.textContent = `Frage ${this.currentQuestionIndex} von ${this.questions.length}`;
        }
    }
    
    renderQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        if (!question) return;
        
        const questionCard = document.getElementById('question-card');
        if (!questionCard) return;
        
        // Fade out
        questionCard.style.opacity = '0';
        
        setTimeout(() => {
            questionCard.innerHTML = `
                <div class="question-number">Frage ${this.currentQuestionIndex + 1} von ${this.questions.length}</div>
                <h2 class="question-text">${question.question}</h2>
                
                <div class="answer-options">
                    ${question.options.map((option, index) => `
                        <div class="answer-option" data-value="${option.value}">
                            <input type="radio" 
                                   name="question-${question.id}" 
                                   id="option-${index}" 
                                   value="${option.value}">
                            <label for="option-${index}">${option.label}</label>
                        </div>
                    `).join('')}
                </div>
                
                <div id="insight-box" class="insight-box">
                    <div class="insight-item">
                        <div class="insight-label">💡 Das hat uns geholfen</div>
                        <div class="insight-text">${question.insight.helped_us}</div>
                    </div>
                    <div class="insight-item">
                        <div class="insight-label">🔬 Das sagt die Wissenschaft</div>
                        <div class="insight-text">${question.insight.science}</div>
                    </div>
                    ${question.insight.quick_tip ? `
                        <div class="insight-item">
                            <div class="insight-label">✅ Schneller Tipp</div>
                            <div class="insight-text">${question.insight.quick_tip}</div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="button-group">
                    <button class="btn btn-secondary" id="prev-btn" ${this.currentQuestionIndex === 0 ? 'disabled' : ''}>
                        ← Zurück
                    </button>
                    <button class="btn btn-primary" id="next-btn" disabled>
                        ${this.currentQuestionIndex === this.questions.length - 1 ? 'Auswertung anzeigen →' : 'Weiter →'}
                    </button>
                </div>
            `;
            
            // Fade in
            questionCard.style.opacity = '1';
            
            // Event Listeners
            this.attachEventListeners();
            
            // Restore previous answer if exists
            this.restoreAnswer();
        }, 300);
    }
    
    attachEventListeners() {
        const options = document.querySelectorAll('.answer-option');
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');
        const insightBox = document.getElementById('insight-box');
        
        options.forEach(option => {
            option.addEventListener('click', () => {
                // Remove previous selection
                options.forEach(opt => opt.classList.remove('selected'));
                
                // Select this option
                option.classList.add('selected');
                const radio = option.querySelector('input[type="radio"]');
                radio.checked = true;
                
                // Save answer
                this.saveAnswer(radio.value);
                
                // Show insight
                if (insightBox) {
                    insightBox.classList.add('visible');
                }
                
                // Enable next button
                if (nextBtn) {
                    nextBtn.disabled = false;
                }
            });
        });
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousQuestion());
        }
    }
    
    saveAnswer(value) {
        const question = this.questions[this.currentQuestionIndex];
        const selectedOption = question.options.find(opt => opt.value === value);
        
        this.answers[question.id] = {
            question: question.question,
            value: value,
            label: selectedOption.label,
            score: selectedOption.score
        };
    }
    
    restoreAnswer() {
        const question = this.questions[this.currentQuestionIndex];
        const savedAnswer = this.answers[question.id];
        
        if (savedAnswer) {
            const option = document.querySelector(`[data-value="${savedAnswer.value}"]`);
            const radio = option?.querySelector('input[type="radio"]');
            const insightBox = document.getElementById('insight-box');
            const nextBtn = document.getElementById('next-btn');
            
            if (option && radio) {
                option.classList.add('selected');
                radio.checked = true;
                
                if (insightBox) {
                    insightBox.classList.add('visible');
                }
                
                if (nextBtn) {
                    nextBtn.disabled = false;
                }
            }
        }
    }
    
    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.renderQuestion();
            this.updateProgress();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            this.showResults();
        }
    }
    
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.renderQuestion();
            this.updateProgress();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    calculateScores() {
        // Reset scores
        Object.keys(this.scores).forEach(key => {
            this.scores[key] = 0;
        });
        
        // Calculate from answers
        Object.values(this.answers).forEach(answer => {
            if (answer.score) {
                Object.keys(answer.score).forEach(category => {
                    this.scores[category] += answer.score[category];
                });
            }
        });
    }
    
    getPriorityAreas() {
        this.calculateScores();
        
        const areas = Object.entries(this.scores)
            .map(([category, score]) => ({
                category,
                score,
                name: this.getCategoryName(category),
                description: this.getCategoryDescription(category)
            }))
            .filter(area => area.score > 0)
            .sort((a, b) => b.score - a.score);
        
        return areas;
    }
    
    getCategoryName(category) {
        const names = {
            tagesstruktur: 'Tagesstruktur & Routinen',
            regulation: 'Emotionale Regulation',
            kommunikation: 'Kommunikation & Ausdruck',
            schule: 'Schule & Lernen',
            soziales: 'Soziales Umfeld',
            eltern: 'Elterliche Selbstfürsorge'
        };
        return names[category] || category;
    }
    
    getCategoryDescription(category) {
        const descriptions = {
            tagesstruktur: 'Euer Alltag braucht mehr Vorhersehbarkeit und klare Strukturen, um Stress zu reduzieren.',
            regulation: 'Emotionale Überforderung ist ein zentrales Thema. Früherkennung und Regulationsstrategien können helfen.',
            kommunikation: 'Bedürfnisse und Gefühle besser ausdrücken zu können, würde vieles erleichtern.',
            schule: 'Der Schulalltag ist herausfordernd. Klarheit und Unterstützung sind wichtig.',
            soziales: 'Soziale Situationen kosten viel Energie. Strategien für den Umgang damit können entlasten.',
            eltern: 'Ihr als Eltern braucht auch Unterstützung. Selbstfürsorge ist keine Schwäche, sondern Notwendigkeit.'
        };
        return descriptions[category] || '';
    }
    
    getRecommendedProducts() {
        const priorityAreas = this.getPriorityAreas();
        const topCategories = priorityAreas.slice(0, 3).map(area => area.category);
        
        // Score products based on priority areas
        const scoredProducts = this.products.map(product => {
            let score = 0;
            
            topCategories.forEach((category, index) => {
                const weight = 3 - index; // Higher weight for top priorities
                if (product.priority_score && product.priority_score[category]) {
                    score += product.priority_score[category] * weight;
                }
            });
            
            return { ...product, matchScore: score };
        });
        
        // Sort by score
        scoredProducts.sort((a, b) => b.matchScore - a.matchScore);
        
        // Check if bundle makes sense
        const shouldRecommendBundle = topCategories.includes('tagesstruktur') && 
                                       topCategories.includes('regulation');
        
        // Return top recommendations
        if (shouldRecommendBundle) {
            const bundle = scoredProducts.find(p => p.is_bundle);
            const others = scoredProducts.filter(p => !p.is_bundle).slice(0, 2);
            return [bundle, ...others].filter(Boolean);
        } else {
            return scoredProducts.slice(0, 3);
        }
    }
    
    getRelevantAffiliates() {
        const priorityAreas = this.getPriorityAreas();
        const topCategories = priorityAreas.slice(0, 2).map(area => area.category);
        
        return this.affiliates
            .filter(affiliate => {
                return affiliate.tags.some(tag => topCategories.includes(tag));
            })
            .slice(0, 4);
    }
    
    showResults() {
        const questionsContainer = document.getElementById('questions-container');
        const resultsContainer = document.getElementById('results-container');
        
        if (questionsContainer) {
            questionsContainer.style.display = 'none';
        }
        
        if (resultsContainer) {
            resultsContainer.classList.add('active');
            this.renderResults();
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    renderResults() {
        const resultsContainer = document.getElementById('results-container');
        if (!resultsContainer) return;
        
        const priorityAreas = this.getPriorityAreas();
        const recommendedProducts = this.getRecommendedProducts();
        const relevantAffiliates = this.getRelevantAffiliates();
        
        resultsContainer.innerHTML = `
            <div class="results-header">
                <h2>Eure persönliche Auswertung</h2>
                <p>Basierend auf euren Antworten haben wir eure Hauptthemen identifiziert.</p>
            </div>
            
            ${this.renderPriorityAreas(priorityAreas)}
            ${this.renderProductRecommendations(recommendedProducts)}
            ${this.renderLeadMagnet()}
            ${relevantAffiliates.length > 0 ? this.renderAffiliates(relevantAffiliates) : ''}
            
            <div class="back-to-top">
                <a href="../index.html">← Zurück zur Startseite</a>
            </div>
        `;
    }
    
    renderPriorityAreas(areas) {
        if (areas.length === 0) return '';
        
        return `
            <div class="priority-areas">
                <h3>🎯 Eure drei wichtigsten Themen</h3>
                ${areas.slice(0, 3).map((area, index) => {
                    const priority = index === 0 ? 'high' : index === 1 ? 'medium' : 'low';
                    const label = index === 0 ? 'Höchste Priorität' : index === 1 ? 'Mittlere Priorität' : 'Wichtig';
                    
                    return `
                        <div class="priority-card">
                            <span class="priority-badge priority-${priority}">${label}</span>
                            <h4>${area.name}</h4>
                            <p>${area.description}</p>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    renderProductRecommendations(products) {
        if (products.length === 0) return '';
        
        return `
            <div class="recommendations">
                <h3>📚 Unsere Empfehlungen für euch</h3>
                <p style="margin-bottom: 2rem; color: var(--text-light);">
                    Diese Hilfsmaterialien passen zu euren größten Herausforderungen:
                </p>
                
                ${products.map((product, index) => {
                    const isFeatured = index === 0;
                    
                    return `
                        <div class="product-card ${isFeatured ? 'featured' : ''}">
                            ${isFeatured ? '<div class="featured-badge">⭐ Top-Empfehlung für euch</div>' : ''}
                            
                            <h4>${product.name}</h4>
                            
                            <div class="product-price">
                                ${product.price.toFixed(2)}€
                                ${product.original_price ? `
                                    <span class="original-price">${product.original_price.toFixed(2)}€</span>
                                    <span class="savings-badge">✨ Du sparst ${product.savings.toFixed(2)}€</span>
                                ` : ''}
                            </div>
                            
                            <p class="product-description">${product.description}</p>
                            
                            ${product.helps_with ? `
                                <div class="helps-with">
                                    <h5>Das hilft euch konkret bei:</h5>
                                    <ul>
                                        ${product.helps_with.map(help => `<li>${help}</li>`).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                            
                            <a href="${product.url}" class="product-cta" target="_blank" rel="noopener">
                                Jetzt ansehen →
                            </a>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    renderLeadMagnet() {
        if (!this.leadMagnet || !this.leadMagnet.available) return '';
        
        return `
            <div class="lead-magnet">
                <h3>🎁 Bonus für dich</h3>
                <p>${this.leadMagnet.description}</p>
                <button class="btn" onclick="window.open('data/${this.leadMagnet.file}', '_blank')">
                    Kostenlos herunterladen
                </button>
            </div>
        `;
    }
    
    renderAffiliates(affiliates) {
        return `
            <div class="affiliates">
                <h3>🛍️ Weitere hilfreiche Produkte</h3>
                <p style="margin-bottom: 1.5rem; color: var(--text-light); font-size: 0.9rem;">
                    Diese Alltagshelfer nutzen wir selbst und können sie empfehlen:
                </p>
                
                <div class="affiliate-grid">
                    ${affiliates.map(affiliate => `
                        <div class="affiliate-card">
                            <h5>${affiliate.name}</h5>
                            <p>${affiliate.description}</p>
                            <a href="${affiliate.url}" class="affiliate-link" target="_blank" rel="noopener">
                                Bei Amazon ansehen →
                            </a>
                        </div>
                    `).join('')}
                </div>
                
                <p style="font-size: 0.85rem; color: var(--text-light); margin-top: 1rem;">
                    ℹ️ Die Amazon-Links sind Affiliate-Links. Ihr unterstützt uns damit, ohne mehr zu bezahlen.
                </p>
            </div>
        `;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AlltagsHelferFinder();
});
