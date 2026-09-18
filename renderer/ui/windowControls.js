import { isPlatformMacOS, isPlatformWeb } from '@core/Platform.js';

export function getWindowControlsHTML(opt) {
  const { minClass, maxClass, closeClass } = opt;

  return `<button class="${minClass ?? ''}" data-win-min><span>—</span></button>
    <button class="${maxClass ?? ''}" data-win-max><span>□</span></button>
    <button class="${closeClass ?? ''}" data-win-close><span>✕</span></button>`;
}

// Handle custom titlebar interactions
export function initWindowControls() {
  if (isPlatformMacOS() || isPlatformWeb() || !window.electronAPI)
    return;

  document.querySelectorAll('[data-win-bar]').forEach(btn => {
    btn.addEventListener('dblclick', (event) => {
      if (event.target === event.currentTarget) {
        window.electronAPI.maximize();
      }
    });
  });

  document.querySelectorAll('[data-win-min]').forEach(btn => {
    btn.addEventListener('click', () => window.electronAPI.minimize());
  });

  document.querySelectorAll('[data-win-max]').forEach(btn => {
    btn.addEventListener('click', () => window.electronAPI.maximize());
  });

  document.querySelectorAll('[data-win-close]').forEach(btn => {
    btn.addEventListener('click', () => window.electronAPI.close());
  });
}