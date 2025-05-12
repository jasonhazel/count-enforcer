const fs = require('fs');
const path = require('path');

// Dynamically load all language files from the current directory
const translations = {};
const langDir = __dirname;

// Read all files in the current directory except i18n.js
fs.readdirSync(langDir)
    .filter(file => file.endsWith('.lang.js'))
    .forEach(file => {
        // Extract language code from filename (e.g., 'en' from 'en.lang.js')
        const langCode = file.split('.')[0];
        // Load the language file
        translations[langCode] = require(path.join(langDir, file));
    });

function t(key, lang, ...args) {
    const l = translations[lang] ? lang : 'en';
    const value = translations[l][key];
    return typeof value === 'function' ? value(...args) : value;
}

// Export the list of supported language codes
const supportedLanguages = Object.keys(translations);

module.exports = { t, supportedLanguages }; 