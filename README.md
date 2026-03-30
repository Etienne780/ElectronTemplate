# ElectronTemplate

A clean and minimal Electron template using Vite for the renderer.
Designed for fast setup, good structure, and easy scalability.

---

## Features

* Electron (Main Process)
* Vite (Renderer / Frontend)
* Clean IPC communication via preload
* Custom titlebar (Windows/Linux)
* Native macOS window controls preserved
* Development + Production setup
* Simple and extendable structure

---

## Project Structure

```
Electron_app/
│
├── main/
│   └── electronMain.js      # Electron main process
│
├── renderer/
│   ├── index.html
│   ├── main.js              # Renderer entry
│   ├── windowcontrols.js    # Window control logic
│   ├── main.css
│   └── dist/                # Build output (generated)
│
├── preload.js               # Secure bridge (IPC)
├── package.json
└── forge.config.js          # Packaging config
```

---

## Installation

```bash
npm install
```

---

## Development

Runs Vite and Electron in parallel:

```bash
npm run dev
```

* Renderer: http://localhost:5173
* Electron loads the dev server

---

## Production Build

Build the renderer:

```bash
npm run build
```

Then start Electron in production mode:

```bash
npm start
```

Electron will load:

```
renderer/dist/index.html
```

---

## Packaging (optional)

If using Electron Forge:

```bash
npm run make
```

This creates installable builds for your platform.

---

## IPC Communication

All communication between renderer and main process goes through `preload.js`.

Example:

```js
// renderer
window.electronAPI.send('channel', data);

// main
ipcMain.on('channel', (event, data) => {
  // handle data
});
```

---

## Window Controls

* Windows/Linux:

  * Custom titlebar
  * Custom minimize / maximize / close

* macOS:

  * Native traffic lights are preserved
  * No custom controls applied

---

## Notes

* `npm install` is enough to set up the project on another machine
* No need to reinstall Electron/Vite manually
* `renderer/dist` is generated automatically via `npm run build`

---

## License

MIT
