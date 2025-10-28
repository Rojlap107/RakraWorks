// Language Manager for Rakra Works
class LanguageManager {
    constructor() {
        this.translations = {};
        this.currentLanguage = localStorage.getItem('selectedLanguage') || 'tibetan';
        this.isLoading = false;
    }

    // Load translations from JSON file
    async loadTranslations() {
        if (this.isLoading) return;
        this.isLoading = true;
        
        try {
            const response = await fetch('translations.json');
            if (!response.ok) {
                throw new Error(`Failed to load translations: ${response.status}`);
            }
            this.translations = await response.json();
            console.log('✓ Translations loaded successfully:', Object.keys(this.translations));
            this.isLoading = false;
            return true;
        } catch (error) {
            console.error('✗ Error loading translations:', error);
            console.error('Translation file path: translations.json');
            console.error('Current URL:', window.location.href);
            this.isLoading = false;
            return false;
        }
    }

    // Get translation value using dot notation path
    getTranslation(path) {
        const keys = path.split('.');
        let value = this.translations;
        
        for (let key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return null;
            }
        }
        
        return value;
    }

    // Translate specific key
    translate(key) {
        // Parse the key to get the section and item
        // e.g., "navigation.about_rinpoche" -> get translations.navigation[language].about_rinpoche
        const parts = key.split('.');
        
        if (parts.length >= 2) {
            // Reconstruct path as section.language.item
            const section = parts[0];
            const items = parts.slice(1).join('.');
            const translationKey = `${section}.${this.currentLanguage}.${items}`;
            const value = this.getTranslation(translationKey);
            return value || key;
        }
        
        return key;
    }

    // Set current language
    setLanguage(language) {
        if (language === 'tibetan' || language === 'english') {
            this.currentLanguage = language;
            localStorage.setItem('selectedLanguage', language);
            return true;
        }
        return false;
    }

    // Translate specific key
    translate(key) {
        // Parse the key to get the section and item
        // e.g., "navigation.about_rinpoche" -> get translations.navigation[language].about_rinpoche
        const parts = key.split('.');
        
        if (parts.length >= 2) {
            // Reconstruct path as section.language.item
            const section = parts[0];
            const items = parts.slice(1).join('.');
            const translationKey = `${section}.${this.currentLanguage}.${items}`;
            const value = this.getTranslation(translationKey);
            return value || key;
        }
        
        return key;
    }

    // Update all elements with data-i18n attributes
    updatePageLanguage() {
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.translate(key);
            
            // Only update if translation was found (not just the key itself)
            const hasValidTranslation = translation && translation !== key;
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.type === 'submit' || element.type === 'button') {
                    if (hasValidTranslation) {
                        element.value = translation;
                    }
                } else if (element.hasAttribute('placeholder')) {
                    if (hasValidTranslation) {
                        element.placeholder = translation;
                    }
                }
            } else if (element.hasAttribute('title')) {
                if (hasValidTranslation) {
                    element.title = translation;
                }
            } else {
                // Update text content for all other elements (including links)
                if (hasValidTranslation) {
                    element.textContent = translation;
                }
                // Otherwise keep the original text (the fallback text in HTML)
            }
        });

        // Handle hardcoded bilingual content (toggle visibility)
        const tibetanElements = document.querySelectorAll('[data-lang="tibetan"]');
        const englishElements = document.querySelectorAll('[data-lang="english"]');
        
        tibetanElements.forEach(el => {
            if (this.currentLanguage === 'tibetan') {
                // Determine appropriate display based on tag type
                const displayType = el.tagName === 'A' ? 'inline-block' : 'block';
                el.style.display = displayType;
            } else {
                el.style.display = 'none';
            }
        });
        
        englishElements.forEach(el => {
            if (this.currentLanguage === 'english') {
                // Determine appropriate display based on tag type
                const displayType = el.tagName === 'A' ? 'inline-block' : 'block';
                el.style.display = displayType;
            } else {
                el.style.display = 'none';
            }
        });
        
        // Set document language attribute for text direction
        document.documentElement.lang = this.currentLanguage === 'tibetan' ? 'bo' : 'en';
        
        // Update text direction for Tibetan
        if (this.currentLanguage === 'tibetan') {
            document.documentElement.dir = 'auto';
        } else {
            document.documentElement.dir = 'ltr';
        }
    }

    // Initialize language switcher button
    initLanguageSwitcher() {
        // Check if switcher already exists, if so, don't create another
        if (document.getElementById('language-switcher')) {
            this.attachLanguageSwitcherEvents();
            return;
        }

        const body = document.body;
        if (!body) return;

        // Create language switcher container (dropdown)
        const switcherContainer = document.createElement('div');
        switcherContainer.className = 'language-switcher-container';
        switcherContainer.id = 'language-switcher';

        // Create main dropdown button
        const dropdownBtn = document.createElement('div');
        dropdownBtn.className = 'language-dropdown-btn';
        
        // Create flag image
        const flagImg = document.createElement('img');
        flagImg.className = 'language-flag';
        flagImg.src = this.currentLanguage === 'tibetan' ? 'img/flags/tibetan.jpg' : 'img/flags/english.jpg';
        flagImg.alt = this.currentLanguage === 'tibetan' ? 'Tibetan' : 'English';
        flagImg.id = 'current-flag';
        
        // Create label text
        const label = document.createElement('span');
        label.className = 'language-label';
        label.textContent = this.currentLanguage === 'tibetan' ? 'བོད།' : 'ENG';
        label.id = 'current-label';
        
        // Create dropdown arrow
        const arrow = document.createElement('span');
        arrow.className = 'dropdown-arrow';
        arrow.textContent = '▼';
        
        dropdownBtn.appendChild(flagImg);
        dropdownBtn.appendChild(label);
        dropdownBtn.appendChild(arrow);

        // Create dropdown menu
        const dropdownMenu = document.createElement('div');
        dropdownMenu.className = 'language-dropdown-menu';

        // Tibetan option
        const tibetanOption = document.createElement('div');
        tibetanOption.className = 'language-option';
        tibetanOption.setAttribute('data-language', 'tibetan');
        
        const tibetanFlag = document.createElement('img');
        tibetanFlag.className = 'language-option-flag';
        tibetanFlag.src = 'img/flags/tibetan.jpg';
        tibetanFlag.alt = 'Tibetan';
        
        const tibetanText = document.createElement('span');
        tibetanText.textContent = 'བོད་ཡིག།';
        
        tibetanOption.appendChild(tibetanFlag);
        tibetanOption.appendChild(tibetanText);

        // English option
        const englishOption = document.createElement('div');
        englishOption.className = 'language-option';
        englishOption.setAttribute('data-language', 'english');
        
        const englishFlag = document.createElement('img');
        englishFlag.className = 'language-option-flag';
        englishFlag.src = 'img/flags/english.jpg';
        englishFlag.alt = 'English';
        
        const englishText = document.createElement('span');
        englishText.textContent = 'English';
        
        englishOption.appendChild(englishFlag);
        englishOption.appendChild(englishText);

        dropdownMenu.appendChild(tibetanOption);
        dropdownMenu.appendChild(englishOption);

        switcherContainer.appendChild(dropdownBtn);
        switcherContainer.appendChild(dropdownMenu);
        body.appendChild(switcherContainer);

        this.attachLanguageSwitcherEvents();
    }

    // Attach events to language switcher buttons
    attachLanguageSwitcherEvents() {
        const dropdownBtn = document.querySelector('.language-dropdown-btn');
        const dropdownMenu = document.querySelector('.language-dropdown-menu');
        const options = document.querySelectorAll('.language-option');
        
        if (!dropdownBtn || !dropdownMenu) return;

        // Toggle dropdown on button click
        dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');
        });

        // Handle language selection
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const language = option.getAttribute('data-language');
                this.switchLanguage(language);
                dropdownMenu.classList.remove('active');
                this.updateDropdownDisplay();
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#language-switcher')) {
                dropdownMenu.classList.remove('active');
            }
        });
    }

    // Update dropdown display
    updateDropdownDisplay() {
        const flagImg = document.getElementById('current-flag');
        const label = document.getElementById('current-label');
        
        if (flagImg) {
            flagImg.src = this.currentLanguage === 'tibetan' ? 'img/flags/tibetan.jpg' : 'img/flags/english.jpg';
            flagImg.alt = this.currentLanguage === 'tibetan' ? 'Tibetan' : 'English';
        }
        
        if (label) {
            label.textContent = this.currentLanguage === 'tibetan' ? 'བོད།' : 'ENG';
        }
    }

    // Switch language and update UI
    switchLanguage(language) {
        if (this.setLanguage(language)) {
            this.updatePageLanguage();
            this.updateDropdownDisplay();
        }
    }

    // Initialize on page load
    async initialize() {
        const loaded = await this.loadTranslations();
        if (loaded) {
            this.initLanguageSwitcher();
            this.updatePageLanguage();
        } else {
            console.error('Failed to initialize language manager');
        }
    }
}

// Create global instance
const i18n = new LanguageManager();

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        i18n.initialize();
    });
} else {
    i18n.initialize();
}
