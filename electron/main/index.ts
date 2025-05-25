import { app, BrowserWindow } from "electron";
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import { logger } from "../../src/config/logger";
import Store from "electron-store";
import contextMenu from 'electron-context-menu';
import { createWindow, spawnServer } from "./app-functions";
import { registerServerEventHandlers } from "./server-events.handlers";
import { registerIpcHandlers } from "./ipc.handlers";
const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**keep track of the server url and make sure it only updates the ui if there's an actual change */
let lastServerUrl: string = "";

let databaseUpdateWindow: BrowserWindow | undefined;



const isDev = process.env.NODE_ENV === "development";
// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')


// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let mainWindow: BrowserWindow | null = null;
const preload = path.join(__dirname, '../preload/index.mjs');


/**the url of the local running druglane server */
let serverUrl = "";
/** the current state of the database. useful for tracking migration states and the like  */
let dbState = "";

const store = new Store();

contextMenu({
  showSaveImageAs: true,
  showSelectAll: true,
  showInspectElement: isDev,
  showCopyLink: true,
});






app.whenReady().then(() => {

  mainWindow = createWindow();
  registerIpcHandlers(mainWindow, store);
  registerServerEventHandlers(mainWindow, databaseUpdateWindow);
  spawnServer();
  // app.on("activate", function () {
  //   // On macOS it's common to re-create a window in the app when the
  //   // dock icon is clicked and there are no other windows open.
  //   if (BrowserWindow.getAllWindows().length === 0) {createWindow();}


  //   spawnServer();
  // });
})

app.on('window-all-closed', () => {
  mainWindow = null
  logger.info({ message: "app terminated" });

  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (mainWindow) {
    // Focus on the main window if the user tried to open another
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})




