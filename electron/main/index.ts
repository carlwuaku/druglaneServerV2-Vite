import electron, { app, BrowserWindow, dialog, HandlerDetails, ipcMain, Menu, shell } from "electron";
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import { update } from './update'
import { isAppActivated, verifyLicenseKey } from "../appValidation";
import { logger } from "../../src/config/logger";
import { constants, defaultOptions } from "../electronConstants";
import serverEventEmitter from "../server/utils/ServerEvents";
import { ACTIVATION_RESULT, APP_NOT_ACTIVATED, CALL_ACTIVATION, COMPLTED_DATABASE_UPDATE, CREATE_BACKUP, DATABASE_SETUP_EVENT, ERROR_UPDATING_DATABASE, GET_APP_DETAILS, GET_PREFERENCE, GET_PREFERENCES, GET_SERVER_STATE, GET_SERVER_URL, PREFERENCE_RECEIVED, PREFERENCE_SET, RESTART_APPLICATION, RESTART_SERVER, SERVER_DATABASE_UPDATE, SERVER_MESSAGE_RECEIVED, SERVER_STATE_CHANGED, SERVER_URL_RECEIVED, SERVER_URL_UPDATED, SET_ADMIN_PASSWORD, SET_PREFERENCE, UPDATING_DATABASE } from "../utils/stringKeys";
import { runFolderCreation } from "@server/utils/directorySetup";
import Store from "electron-store";
import contextMenu from 'electron-context-menu';
import * as url from 'url';
import { startServer } from "../server/server";
const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
/**keep track of the server url and make sure it only updates the ui if there's an actual change */
let lastServerUrl: string = "";
let databaseUpdateWindow: BrowserWindow | undefined;
let serverState: "Application Activated" |
  "Application Not Activated" | "Server Started" | "Checking Activation"
  | "Server Starting" | "Server Stopping" = "Checking Activation";
const isDev = process.env.NODE_ENV === "development";//TODO: use vite env
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
process.env.APP_ROOT = path.join(__dirname, '../..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null
const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')
let serverUrl = "";
const store = new Store();
contextMenu({
  showSaveImageAs: true,
  showSelectAll: true,
  showInspectElement: isDev,
  showCopyLink: true,
});


const appmenu: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] = [

  {
    label: 'System',
    submenu: [
      {
        label: 'Quit',
        click: () => app.quit(),
        accelerator: 'CmdOrCtrl+w'
      },
      {
        label: 'Restart Sever',
        click: () => {
          app.relaunch()
          app.exit()
        },
        accelerator: 'CmdOrCtrl+r'
      }
    ]
  },

  {
    label: 'Goto Locations',
    submenu: [
      {
        label: 'Logs',
        click: () => openFolder(constants.logs_path),
        accelerator: 'CmdOrCtrl+w'
      },
      {
        label: 'Backups',
        click: () => openFolder(constants.internal_backups_path),
        accelerator: 'CmdOrCtrl+r'
      }
    ]
  }
]

//create backup folders
// runFolderCreation();


ipcMain.on(CALL_ACTIVATION, async (event, key) => {
  try {
    let data = await verifyLicenseKey(key);
    if (data.data.status === "1") {
      console.log('activation successful')
      await startServer();
    }
    win?.webContents?.send(ACTIVATION_RESULT, { data: data.data, error: false, message: "" })
  } catch (error) {
    win?.webContents?.send(ACTIVATION_RESULT, { data: null, error: true, message: error })
  }


}
)

ipcMain.on(GET_APP_DETAILS, getAppDetails)
ipcMain.on(GET_SERVER_STATE, () => {
  sendServerState(serverState)
})

ipcMain.on(RESTART_SERVER, async (event, data) => {
  await spawnServer()
})

ipcMain.on(RESTART_APPLICATION, async (event, data) => {
  restartApp()
})

ipcMain.on(GET_SERVER_URL, sendServerUrl)

ipcMain.on(GET_PREFERENCE, (event, data: { key: string }) => {

  let value = store.get(data.key, defaultOptions[data.key])
  event.reply(PREFERENCE_RECEIVED, { name: data.key, value: value })
}
)

ipcMain.on(GET_PREFERENCES, (event) => {
  store.openInEditor()
})

ipcMain.on(SET_PREFERENCE, (event, data: { key: string, value: any }) => {
  try {
    savePreference(data.key, data.value);
    event.reply(PREFERENCE_SET, { success: true, message: "Setting saved successfully" })
  } catch (error) {
    event.reply(PREFERENCE_SET, { success: false, message: error })

  }
})

ipcMain.on(SET_ADMIN_PASSWORD, (event, data: { password: string }) => {

});

ipcMain.on(CREATE_BACKUP, (event) => {
  //do a mysql dump

  console.log('create backup')
})

ipcMain.on(SERVER_DATABASE_UPDATE, (event, data: string) => {
  console.log('server database update', data)
  sendServerDatabaseUpdate(data);
})


function savePreference(key: string, value: any) {
  try {
    console.log(key, value)
    store.set(key, value);
  } catch (error: any) {
    throw new Error(error);

  }

}

function getAppDetails() {
  const title = `${constants.appname} v${app.getVersion()}`
  win?.webContents?.send("appDetailsSent", { title })
}

function restartApp() {
  app.relaunch()
  app.exit()
}

function sendServerState(state: string) {
  try {
    win?.webContents?.send(SERVER_STATE_CHANGED, { data: state, time: new Date().toLocaleString() })

  }
  catch (error) {
    logger.error({ message: error });
    dialog.showErrorBox("Internal error", "Failed to send server state")
  }

}

function sendServerDatabaseUpdate(state: string) {
  try {
    console.log(state, 'server database update');
    win?.webContents?.send(DATABASE_SETUP_EVENT, { data: state, time: new Date().toLocaleString() })

  }
  catch (error) {
    logger.error({ message: error });
    dialog.showErrorBox("Internal error", "Failed to send server state")
  }

}

serverEventEmitter.on(SERVER_STATE_CHANGED, (data) => {
  serverState = data;
  sendServerState(data);
})

serverEventEmitter.on(SERVER_MESSAGE_RECEIVED, (data) => {
  // logs.unshift(data);
  win?.webContents?.send(SERVER_MESSAGE_RECEIVED, { data, time: new Date().toLocaleString() })

})
serverEventEmitter.on(SERVER_URL_UPDATED, (data) => {
  serverUrl = data;
  // logs.unshift(data);
  if (lastServerUrl !== serverUrl) {
    sendServerUrl();
    lastServerUrl = serverUrl;
  }
});

serverEventEmitter.on(SERVER_DATABASE_UPDATE, (data) => {
  sendServerDatabaseUpdate(data);
  switch (data) {
    case UPDATING_DATABASE:
      //create the window if it doesn't exist
      if (!databaseUpdateWindow) {
        databaseUpdateWindow = createChildWindow("electronPages/runningMigrations.html", { title: "Running Migrations", parent: win! })
      }
      break;
    case COMPLTED_DATABASE_UPDATE:
      //create the window if it doesn't exist
      if (databaseUpdateWindow) {
        databaseUpdateWindow.close();

      }
      dialog.showMessageBox(win!, {
        type: "info",
        message: "Database updated successfully",
      })
      break;

    case ERROR_UPDATING_DATABASE:
      //create the window if it doesn't exist
      if (databaseUpdateWindow) {
        databaseUpdateWindow.close();

      }
      dialog.showMessageBox(win!, {
        type: "error",
        message: "There was a problem updating the database. Please restart the application to try again, or contact us for help",
      })
      break;
    default:
      break;
  }

})




function sendServerUrl() {

  win?.webContents?.send(SERVER_URL_RECEIVED, { data: serverUrl, time: new Date().toLocaleString() }, serverUrl);


}

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      spellcheck: true
    },
    width: 800,
  })
  console.log(VITE_DEV_SERVER_URL)

  if (VITE_DEV_SERVER_URL) { // #298
    win.loadURL(VITE_DEV_SERVER_URL)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.webContents.openDevTools()
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })
  const mainMenu = Menu.buildFromTemplate(appmenu);
  Menu.setApplicationMenu(mainMenu)

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  // Auto update
  update(win)
}

app.whenReady().then(() => {

  createWindow();
  spawnServer();
  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow;


    spawnServer();
  });
})

app.on('window-all-closed', () => {
  win = null
  logger.info({ message: "app terminated" });

  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
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

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
});


export async function spawnServer() {
  try {
    serverEventEmitter.emit(SERVER_STATE_CHANGED, "Checking Activation")
    //check if the app is activated. if it is, start the server. else go the activation page
    const appActivated = await isAppActivated();
    if (appActivated) {
      serverEventEmitter.emit(SERVER_STATE_CHANGED, "Server Starting")

      //spawn server->runmigrations
      // const serverPath = path.join(__dirname, 'server/server')
      // serverProcess = fork(serverPath);
      await startServer();

      // serverProcess.on('exit', (code: number, signal) => {
      //     logger.error({
      //         message: 'serverProcess process exited with ' +
      //             `code ${code} and signal ${signal}`
      //     });
      //     serverEventEmitter.emit(SERVER_STATE_CHANGED, "Server Stopped")
      // });
      // serverProcess.on('error', (error) => {
      //     serverEventEmitter.emit(SERVER_STATE_CHANGED, "Server Error")
      //     console.log('serverProcess process error ', error)
      // });

      // serverProcess.on('spawn', () => {
      //     serverEventEmitter.emit(SERVER_STATE_CHANGED, "Server Running")
      //     console.log('serverProcess spawned')
      //     //TODO: check if the company details has been set. then check if the admin password has been set

      // });
      // serverProcess.on('disconnect', () => {
      //     serverEventEmitter.emit(SERVER_STATE_CHANGED, "Server Disconnected")
      //     console.log('serverProcess disconnected')
      //     spawnServer()
      // });

      // serverProcess.on('message', (message: any, handle: SendHandle) => {
      //     console.log("serverProcess sent a message", message)

      //     serverEventEmitter.emit(message.event, message.message)
      // });

    }
    else {
      serverEventEmitter.emit(SERVER_STATE_CHANGED, APP_NOT_ACTIVATED)
      console.log("app not activated")
      loadActivationPage();
    }
  } catch (error) {
    //start the server the old fashioned way
    serverEventEmitter.emit(SERVER_STATE_CHANGED, "Server Error " + error)

    console.log(error)
  }
}

export function loadActivationPage(): void {
  // win?.loadURL(winUrl + "/activate")
  openReactUrl("activate");
}

function openFolder(location: string) {
  shell.showItemInFolder(location)
}

function openReactUrl(url: string) {
  win?.webContents.executeJavaScript(`window.history.pushState({}, '', '${url}');`);

}

function createChildWindow(path: string, options?: {
  title: string,
  width?: number, height?: number,
  parent?: BrowserWindow
}): BrowserWindow {
  const window = new BrowserWindow({
    width: options?.width || 300,
    height: options?.height || 200,
    frame: false, // Remove the window frame
    transparent: true, // Make the window transparent
    alwaysOnTop: true, // Keep the window always on top
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    ...(options?.parent && { modal: true }),
    ...(options?.parent && { parent: win! }),

  });

  // Load the HTML file that contains your loading message
  window.loadFile(path);

  return window;
}
