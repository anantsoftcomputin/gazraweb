import { useEffect, useState } from 'react';
import { Languages } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', short: 'EN', htmlLang: 'en-IN' },
  { code: 'gu', short: 'ગુ', htmlLang: 'gu-IN' },
  { code: 'hi', short: 'हि', htmlLang: 'hi-IN' }
];

const STORAGE_KEY = 'gazra_language';
const TRANSLATION_CACHE_KEY = 'gazra_translation_cache_v1';
const TRANSLATABLE_ATTRIBUTES = ['placeholder', 'aria-label', 'title', 'alt'];
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'SVG', 'CANVAS', 'CODE', 'PRE', 'TEXTAREA', 'SELECT']);

const textNodeOriginals = new WeakMap();
let translationCache = null;

const getStoredLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  return localStorage.getItem(STORAGE_KEY) || 'en';
};

const getTranslationCache = () => {
  if (translationCache) return translationCache;

  try {
    translationCache = JSON.parse(localStorage.getItem(TRANSLATION_CACHE_KEY) || '{}');
  } catch {
    translationCache = {};
  }

  return translationCache;
};

const saveTranslationCache = () => {
  try {
    localStorage.setItem(TRANSLATION_CACHE_KEY, JSON.stringify(translationCache || {}));
  } catch {
    // Best effort only. If storage is full or unavailable, translation still works.
  }
};

const shouldSkipElement = (element) => {
  if (!element) return true;
  if (SKIP_TAGS.has(element.tagName)) return true;
  return Boolean(element.closest?.('.notranslate, [data-no-translate], [translate="no"], .admin-heritage'));
};

const shouldTranslateText = (value) => {
  const text = value.replace(/\s+/g, ' ').trim();
  if (text.length < 2) return false;
  if (/^[\d\s₹$.,:+\-–—/()]+$/.test(text)) return false;
  if (/^[\w.+-]+@[\w.-]+\.\w+$/.test(text)) return false;
  if (/^https?:\/\//i.test(text)) return false;
  return /[A-Za-z]/.test(text);
};

const collectTextNodes = (root = document.body) => {
  const nodes = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (shouldSkipElement(node.parentElement)) return NodeFilter.FILTER_REJECT;
      if (!textNodeOriginals.has(node) && !shouldTranslateText(node.nodeValue || '')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  while (walker.nextNode()) nodes.push(walker.currentNode);
  return nodes;
};

const collectAttributeElements = (root = document.body) => {
  const selector = TRANSLATABLE_ATTRIBUTES.map((attribute) => `[${attribute}]`).join(',');
  return Array.from(root.querySelectorAll(selector)).filter((element) => !shouldSkipElement(element));
};

const translateText = async (text, languageCode) => {
  if (languageCode === 'en' || !shouldTranslateText(text)) return text;

  const cache = getTranslationCache();
  const cacheKey = `${languageCode}:${text}`;
  if (cache[cacheKey]) return cache[cacheKey];

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${languageCode}&dt=t&q=${encodeURIComponent(text)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Translation failed: ${response.status}`);

  const result = await response.json();
  const translated = (result?.[0] || []).map((segment) => segment?.[0] || '').join('').trim();
  const finalText = translated || text;

  cache[cacheKey] = finalText;
  saveTranslationCache();
  return finalText;
};

const runWithConcurrency = async (items, worker, limit = 6) => {
  let index = 0;
  await Promise.all(Array.from({ length: limit }, async () => {
    while (index < items.length) {
      const currentIndex = index;
      index += 1;
      await worker(items[currentIndex]);
    }
  }));
};

const translateDocument = async (languageCode) => {
  window.__gazraTranslationBusy = true;

  try {
    document.documentElement.lang = LANGUAGES.find((language) => language.code === languageCode)?.htmlLang || 'en-IN';

    const textNodes = collectTextNodes();
    if (languageCode === 'en') {
      textNodes.forEach((node) => {
        if (textNodeOriginals.has(node)) {
          node.nodeValue = textNodeOriginals.get(node);
        }
      });

      collectAttributeElements().forEach((element) => {
        TRANSLATABLE_ATTRIBUTES.forEach((attribute) => {
          const original = element.dataset?.[`i18nOriginal${attribute.replace(/(^|-)([a-z])/g, (_, __, char) => char.toUpperCase())}`];
          if (original) element.setAttribute(attribute, original);
        });
      });
      return;
    }

    await runWithConcurrency(textNodes, async (node) => {
      if (!textNodeOriginals.has(node)) textNodeOriginals.set(node, node.nodeValue);
      const original = textNodeOriginals.get(node);
      node.nodeValue = await translateText(original, languageCode);
    });

    const elements = collectAttributeElements();
    await runWithConcurrency(elements, async (element) => {
      for (const attribute of TRANSLATABLE_ATTRIBUTES) {
        const value = element.getAttribute(attribute);
        if (!value) continue;

        const key = `i18nOriginal${attribute.replace(/(^|-)([a-z])/g, (_, __, char) => char.toUpperCase())}`;
        if (!element.dataset[key]) element.dataset[key] = value;
        if (!shouldTranslateText(element.dataset[key])) continue;
        element.setAttribute(attribute, await translateText(element.dataset[key], languageCode));
      }
    });
  } finally {
    window.__gazraTranslationBusy = false;
  }
};

const ensureTranslator = () => {
  if (window.__gazraTranslator) return window.__gazraTranslator;

  let currentLanguage = getStoredLanguage();
  let queued = null;
  let timeoutId = null;

  const apply = async (languageCode) => {
    currentLanguage = languageCode;
    queued = languageCode;

    if (window.__gazraTranslationBusy) return;

    const languageToApply = queued;
    queued = null;
    await translateDocument(languageToApply);

    if (queued && queued !== languageToApply) {
      await apply(queued);
    }
  };

  const schedule = () => {
    if (currentLanguage === 'en' || window.__gazraTranslationBusy) return;
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => apply(currentLanguage), 350);
  };

  const observer = new MutationObserver((mutations) => {
    if (window.__gazraTranslationBusy) return;
    if (mutations.some((mutation) => mutation.addedNodes.length > 0 || mutation.type === 'characterData')) {
      schedule();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });

  window.__gazraTranslator = { apply, schedule };
  return window.__gazraTranslator;
};

const LanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    const languageCode = getStoredLanguage();
    const validLanguage = LANGUAGES.some((language) => language.code === languageCode) ? languageCode : 'en';
    const translator = ensureTranslator();

    setSelectedLanguage(validLanguage);
    translator.apply(validLanguage);
  }, []);

  const handleLanguageChange = async (event) => {
    const languageCode = event.target.value;
    const language = LANGUAGES.find((item) => item.code === languageCode) || LANGUAGES[0];

    setSelectedLanguage(language.code);
    localStorage.setItem(STORAGE_KEY, language.code);
    await ensureTranslator().apply(language.code);
  };

  return (
    <div className="notranslate relative inline-flex items-center" translate="no">
      <Languages className="pointer-events-none absolute left-2.5 h-4 w-4 text-primary-700" />
      <select
        aria-label="Select language"
        value={selectedLanguage}
        onChange={handleLanguageChange}
        className="h-9 rounded-lg border border-primary-200 bg-[rgba(251,244,231,0.86)] pl-8 pr-7 text-xs font-bold text-primary-800 shadow-sm outline-none transition hover:border-primary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
      >
        {LANGUAGES.map((language) => (
          <option key={language.code} value={language.code}>
            {language.short}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
