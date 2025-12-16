/**
 * Translation utilities for Connectum
 * Provides real-time translation via DeepL API with localStorage caching
 */

/**
 * Determine target language from browser settings
 * @returns {string} Two-letter language code (e.g., 'EN', 'RU', 'UK')
 */
export function getUserLanguage() {
  const browserLang = navigator.language?.split('-')[0]?.toUpperCase();
  
  // DeepL supported languages
  const supportedLangs = ['EN', 'DE', 'FR', 'ES', 'IT', 'PT', 'RU', 'JA', 'ZH', 'UK', 'NL', 'PL'];
  
  return supportedLangs.includes(browserLang) ? browserLang : 'EN';
}

/**
 * Get cached translation from localStorage
 * @param {string} text - Original text
 * @param {string} targetLang - Target language code
 * @returns {string|null} Cached translation or null
 */
export function getCachedTranslation(text, targetLang) {
  try {
    const CACHE_KEY = 'connectum_translations';
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    const cacheKey = `${targetLang}:${text.substring(0, 100)}`; // Use first 100 chars as key
    return cache[cacheKey] || null;
  } catch (error) {
    console.error('Error reading translation cache:', error);
    return null;
  }
}

/**
 * Save translation to localStorage cache
 * @param {string} text - Original text
 * @param {string} targetLang - Target language code
 * @param {string} translation - Translated text
 */
export function cacheTranslation(text, targetLang, translation) {
  try {
    const CACHE_KEY = 'connectum_translations';
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    const cacheKey = `${targetLang}:${text.substring(0, 100)}`;
    
    cache[cacheKey] = translation;
    
    // Limit cache size to 100 entries
    const entries = Object.entries(cache);
    if (entries.length > 100) {
      // Remove oldest entries (first 20)
      const newCache = Object.fromEntries(entries.slice(20));
      localStorage.setItem(CACHE_KEY, JSON.stringify(newCache));
    } else {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    }
  } catch (error) {
    console.error('Error saving translation cache:', error);
  }
}

/**
 * Translate text using DeepL API
 * @param {string} text - Text to translate
 * @param {string|null} targetLang - Target language (defaults to browser language)
 * @returns {Promise<string>} Translated text
 */
export async function translateText(text, targetLang = null) {
  if (!text || text.trim().length === 0) {
    throw new Error('Text is required for translation');
  }

  const lang = targetLang || getUserLanguage();
  
  // Check cache first
  const cached = getCachedTranslation(text, lang);
  if (cached) {
    console.log('✓ Translation loaded from cache');
    return cached;
  }
  
  console.log(`Translating to ${lang}...`);
  
  try {
    // Call translation API
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        text, 
        targetLang: lang 
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Translation failed: ${response.status}`);
    }
    
    const data = await response.json();
    const translatedText = data.translatedText;
    
    if (!translatedText) {
      throw new Error('No translation returned from API');
    }
    
    // Cache the result
    cacheTranslation(text, lang, translatedText);
    
    console.log('✓ Translation complete');
    return translatedText;
    
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}
