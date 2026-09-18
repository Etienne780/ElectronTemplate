import { getWindowControlsHTML, initWindowControls } from '@ui/windowControls.js';
import { onAppClose, confirmAppSaveComplete, isPlatformWeb, getPlatform } from '@core/Platform.js';
import { setHTML } from '@common/Common.js';

export async function bootstrap() {
  const info = document.getElementById('info');

  const versions = !isPlatformWeb()
    ? window.electronAPI.getVersions()
    : null;

  info.innerText = `Running on ${getPlatform()} platform. 
  ${versions ? 
    `Node.js: v${versions.node} 
     Chrome: v${versions.chrome} 
     Electron: v${versions.electron}` : 
     'version not available in web context.'}`;

  // Ping test
  if (!isPlatformWeb()) {
    console.log('Sending ping...');
    const response = await window.electronAPI.ping();
    console.log(response);
   
    onAppClose(async () => {
      // Save before close
      // notifiy electron that the app can close now
      confirmAppSaveComplete();
    });

    const container = document.getElementById('app_window_controls_container');
    const winControllsHTML = getWindowControlsHTML({
      maxClass: 'window-controls__maximize',
      closeClass: 'window-controls__close',
    });

    setHTML(container, winControllsHTML);
    initWindowControls();
  }
}