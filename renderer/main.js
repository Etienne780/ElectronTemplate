import { initWindowControls } from './ui/windowControls.js';

/**
 * Returns platform string (win, linux, macOS, web, unknown)
 */
export function getPlatform() {
    if (window.electronAPI) {
        return window.electronAPI.getPlatform();
    }

    return 'web';
}

document.addEventListener('DOMContentLoaded', async () => {
    const info = document.getElementById('info');

    const versions = window.electronAPI
        ? window.electronAPI.getVersions()
        : null;

    info.innerText = `Running on ${getPlatform()} platform. 
    ${versions ? 
        `Node.js: v${versions.node} 
        Chrome: v${versions.chrome} 
        Electron: v${versions.electron}` : 
    'version not available in web context.'}`;

    // Ping test
    if (window.electronAPI) {
        console.log('Sending ping...');
        const response = await window.electronAPI.ping();
        console.log(response);
    }

    initWindowControls();
});