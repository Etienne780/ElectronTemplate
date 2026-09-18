import { sanitizeHTML } from '@common/Dom.js'

/**
 * Removes properties from an object that are not present in the reference object.
 *
 * @param {Object} object - The object to clean.
 * @param {Object} reference - The object defining the allowed properties.
 */
export function removeUnknownProperties(object, reference) {
  Object.keys(object).forEach(attribute => {
    if (!(attribute in reference)) {
      delete object[attribute];
    }
  });
}

/**
 * Recursively removes properties that are not present in the reference object.
 * Nested objects are processed recursively, while arrays are not processed.
 *
 * @param {Object} object - The object to clean.
 * @param {Object} reference - The object defining the allowed properties.
 */
export function removeUnknownPropertiesDeep(object, reference) {
  Object.keys(object).forEach(attribute => {
    if (!(attribute in reference)) {
      delete object[attribute];
      return;
    }

    if (
      object[attribute] !== null &&
      typeof object[attribute] === 'object' &&
      reference[attribute] !== null &&
      typeof reference[attribute] === 'object' &&
      !Array.isArray(object[attribute]) &&
      !Array.isArray(reference[attribute])
    ) {
      removeUnknownPropertiesDeep(object[attribute], reference[attribute]);
    }
  });
}

/**
 * Generates a short, collision-resistant unique ID.
 * @returns {string}
 */
export function generateId() {
  const array = new Uint32Array(2);
  crypto.getRandomValues(array);

  return (
    Date.now().toString(36) +
    array[0].toString(36) +
    array[1].toString(36)
  );
}

export function normalizeFileName(name) {
  return name
    .trim()
    .replace(/\s+/g, '_') // spaces -> underscore
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, ''); // remove illegal filename chars
}

/**
 * Format a timestamp into a human-readable relative time string.
 * @param {number|null} time - The timestamp in milliseconds.
 * @returns {string} - Human-readable string like "5 minutes ago".
 */
export function formatTimeString(time) {
  if (!time) 
    return 'unknown';
  
  const diff = Date.now() - time;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours   = Math.floor(minutes / 60);
  const days    = Math.floor(hours / 24);
  const weeks   = Math.floor(days / 7);
  const months  = Math.floor(days / 30);
  const years   = Math.floor(days / 365);
  
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (seconds < 60)  return rtf.format(-seconds, 'second');
  if (minutes < 60)  return rtf.format(-minutes, 'minute');
  if (hours < 24)    return rtf.format(-hours,   'hour');
  if (days < 7)      return rtf.format(-days,    'day');
  if (weeks < 5)     return rtf.format(-weeks,   'week');
  if (months < 12)   return rtf.format(-months,  'month');
  return rtf.format(-years,    'year');
}

/**
 * Deep-clones an object via JSON serialization.
 * @param {*} value
 * @returns {*}
 */
export function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

/**
 * Fast, non-cryptographic 32-bit hash (FNV-1a) used only to build compact
 * cache keys. Collisions are astronomically unlikely once combined with the
 * code's length and language name (see makeCacheKey), and even in the
 * theoretical case of one, the worst outcome is a cache miss that gets
 * re-highlighted correctly — never wrong output, since the actual code is
 * only ever read from `ctx.codeBlocks`, not reconstructed from the key.
 * @param {string} str
 * @returns {string} base36-encoded hash
 */
export function hashString(str) {
  let hash = 0x811c9dc5; // FNV offset basis
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193); // FNV prime
  }
  return (hash >>> 0).toString(36);
}

/**
 * Calculates a relevance score for a string match against a query.
 *
 * Scoring rules:
 * - 3: exact match
 * - 2: starts with query
 * - 1: contains query
 * - 0: no match
 *
 * Comparison is case-insensitive.
 *
 * @param {string} alias - The string to evaluate (e.g. name or tag)
 * @param {string} query - Search query to compare against
 * @returns {number} Match score (higher = better match)
 */
export function getMatchScore(alias, query) {
  if (!query)
    return 0;

  const a = String(alias).toLowerCase();
  const q = String(query).toLowerCase();

  if (a === q)
    return 3;

  if (a.startsWith(q))
    return 2;

  if (a.includes(q))
    return 1;

  return 0;
}

// Darkens a hex color by a given factor (0–1)
export function darkenColor(hex, factor = 0.1) {
  // Remove '#' if present
  hex = hex.replace('#', '');

  // Parse RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Reduce each channel
  r = Math.max(0, Math.floor(r * (1 - factor)));
  g = Math.max(0, Math.floor(g * (1 - factor)));
  b = Math.max(0, Math.floor(b * (1 - factor)));

  // Convert back to hex
  return (
    '#' +
    r.toString(16).padStart(2, '0') +
    g.toString(16).padStart(2, '0') +
    b.toString(16).padStart(2, '0')
  );
}

export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Escapes special RegEx characters in a string.
 * @param {string} string
 * @returns {string}
 */
export function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Escapes special HTML characters in a string.
 * @param {string} string
 * @returns {string}
 */
export function escapeHTML(string) {
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * CSP-safe alternative to setting innerHTML directly.
 * Inline styles in the HTML string are stripped from the attribute
 * and re-applied via the DOM style API, which is CSP-compliant.
 *
 * @param {Element} element - Target DOM element
 * @param {string}  html    - HTML string, may contain inline style attributes
 * @throws {TypeError} If the element is not a DOM Element.
 */
export function setHTML(element, html) {
  if (!(element instanceof Element))
    throw new TypeError('element must be a DOM Element');

  element.innerHTML = sanitizeHTML(html);
}

/**
 * Inserts sanitized HTML at the beginning or end of an element.
 *
 * @param {Object} options
 * @param {Element} options.element - Target DOM element.
 * @param {string} options.html - HTML string to sanitize and insert.
 * @param {'begin'|'end'} options.type - Insertion position inside the element.
 * @throws {TypeError} If the element is not a DOM Element.
 * @throws {TypeError} If the insertion type is invalid.
 */
export function insertHTML({ element, html, type }) {
  if (!(element instanceof Element))
    throw new TypeError('element must be a DOM Element');

  const htmlType = {
    begin: 'afterbegin',
    end: 'beforeend',
  }[type];

  if (!htmlType)
    throw new TypeError(
      'invalid type, valid types are "begin" and "end"',
    );

  element.insertAdjacentHTML(htmlType, sanitizeHTML(html));
}

/**
 * Sets the content of an iframe using a Blob URL and automatically cleans up
 * any previously assigned Blob URL to prevent memory leaks.
 *
 * This function generates a Blob from the provided HTML string, creates an
 * object URL, assigns it to the iframe's `src` attribute, and revokes any
 * existing Blob URL that was previously set on the same iframe.
 *
 * @param {HTMLIFrameElement} iframe - The target iframe element whose content
 *                                     will be replaced.
 * @param {string}            html   - The complete HTML string to render inside
 *                                     the iframe.
 *
 * @example
 * const previewFrame = document.getElementById('preview');
 * const docHtml = buildNodePreview(markdown, theme);
 * setIframeContent(previewFrame, docHtml);
 */
export function setIframeContent(iframe, html) {
  iframe.removeAttribute('srcdoc');

  const blob = new Blob([html], { type: 'text/html' });
  const newUrl = URL.createObjectURL(blob);

  if (iframe.src && iframe.src.startsWith('blob:')) {
    URL.revokeObjectURL(iframe.src);
  }

  iframe.src = newUrl;
}

/**
 * Debounces a function so it is only executed after a delay
 * since the last call.
 *
 * @param {Function} fn Function to debounce
 * @param {number} delay Delay in milliseconds
 * @returns {Function} Debounced function with .cancel()
 */
export function debounce(fn, delay = 300) {
  let timeoutId = null;

  function debounced(...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  }

  debounced.cancel = () => {
    clearTimeout(timeoutId);
  };

  return debounced;
}