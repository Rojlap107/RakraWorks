# Multi-Language Support Implementation

## Overview

The Rakra Works website now supports two languages:

- **Tibetan** (བོད་) - Default language
- **English** - Alternative language

## Features

### 1. Language Switcher

- Located in the top navigation bar
- Two buttons: "བོད་" (Tibetan) and "English"
- Active button is highlighted in gold (#d4af37)
- Responsive design - adapts to mobile and tablet screens
- Language preference is saved to browser's localStorage

### 2. Automatic Language Persistence

- User's language choice is saved to localStorage with key `selectedLanguage`
- When returning to the website, the previously selected language is loaded
- Default language is Tibetan if no preference is saved

### 3. Comprehensive Translation Coverage

All main content areas are translated:

- Navigation links
- Page titles
- Section headings
- Body text
- Footer copyright
- Button labels

## Files Added/Modified

### New Files

1. **translations.json** - Contains all translations in Tibetan and English
2. **i18n.js** - International language manager module

### Modified Files

1. **index.html** - Added i18n.js script, data-i18n attributes
2. **about.html** - Added i18n.js script, data-i18n attributes
3. **about-us.html** - Added i18n.js script, data-i18n attributes
4. **gallery.html** - Added i18n.js script, data-i18n attributes
5. **programme.html** - Added i18n.js script, data-i18n attributes
6. **styles.css** - Added language switcher styles

## How It Works

### Translation System Architecture

```
┌─────────────────────────────────────────┐
│        Browser / User Interaction       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   i18n.js - Language Manager            │
│  - Loads translations.json              │
│  - Manages language state               │
│  - Updates DOM elements                 │
│  - Saves preference to localStorage     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   translations.json - Translation Store │
│  - Organized by page/component          │
│  - Both Tibetan and English versions    │
└─────────────────────────────────────────┘
```

### Translation Key Structure

```json
{
  "section_name": {
    "tibetan": { "key": "Tibetan text" },
    "english": { "key": "English text" }
  }
}
```

### How to Use in HTML

```html
<!-- Add data-i18n attribute with the translation key -->
<h1 data-i18n="navigation.about_rinpoche">About Rakra Thubten Choedar</h1>

<!-- The key format is: section.key_name -->
<!-- Example: navigation.about_rinpoche refers to:
    translations.json -> navigation -> about_rinpoche -> [tibetan/english]
-->
```

## Adding New Translations

### Step 1: Add to translations.json

```json
{
  "my_section": {
    "tibetan": {
      "my_key": "བོད་ཡིག་ཞིག"
    },
    "english": {
      "my_key": "English text"
    }
  }
}
```

### Step 2: Add data-i18n attribute to HTML

```html
<p data-i18n="my_section.my_key">English text (fallback)</p>
```

### Step 3: Save changes

The language manager will automatically pick up the new translations on page reload.

## JavaScript API

### Using the i18n object in JavaScript

```javascript
// Get current language
const currentLang = i18n.getLanguage(); // Returns 'tibetan' or 'english'

// Translate a key
const text = i18n.translate("navigation.about_rinpoche");

// Switch language
i18n.switchLanguage("english");

// Get language name in its own language
const langName = i18n.getLanguageName("tibetan"); // Returns 'བོད་'
```

## Browser Support

- Modern browsers with ES6 support
- localStorage support required
- Fetch API support required

## Accessibility Features

- Language switcher buttons have aria-labels
- HTML lang attribute updated based on selected language
- Document direction automatically adjusted (auto for Tibetan, ltr for English)

## Styling

### Language Switcher Styles

```css
.language-switcher-container {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.language-btn {
  background: transparent;
  border: 2px solid #d4af37;
  color: #d4af37;
  padding: 0.4rem 0.8rem;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.language-btn.active {
  background: #d4af37;
  color: #000;
}
```

## Performance Considerations

- Translations are cached after first load
- Language switcher uses event delegation
- No unnecessary DOM re-renders
- localStorage reduces API calls on subsequent visits

## Troubleshooting

### Translations not showing?

1. Check browser console for errors
2. Ensure `translations.json` is in the root directory
3. Check that data-i18n attributes match keys in translations.json
4. Clear browser cache and reload

### Language not persisting?

1. Check if localStorage is enabled in browser
2. Check browser console for storage quota errors
3. Try clearing browser storage and reload

### Language switcher not appearing?

1. Ensure i18n.js is loaded before script.js
2. Check browser console for JavaScript errors
3. Verify that .navbar element exists in HTML

## Future Enhancements

- Add more languages (Chinese, Sanskrit, etc.)
- Implement server-side language preference saving
- Add language selection in user profile/settings
- Implement RTL/LTR support improvements
- Add Tibetan font fallback system

## Support

For issues or questions about the language implementation, please check:

- Browser console for error messages
- translations.json for missing keys
- i18n.js for JavaScript errors
