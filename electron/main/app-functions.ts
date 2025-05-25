import { app, BrowserWindow, dialog, Menu, shell } from "electron";
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { update } from './update'
import { isAppActivated } from "../appValidation";
import { logger } from "../../src/config/logger";
import { constants } from "../electronConstants";
import serverEventEmitter from "../server/utils/ServerEvents";
import {
    APP_NOT_ACTIVATED, DATABASE_SETUP_EVENT,


    SERVER_STATE_CHANGED, SERVER_URL_RECEIVED
} from "../utils/stringKeys";
import Store from "electron-store";
import { startServer } from "../server/server";
const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**keep track of the server url and make sure it only updates the ui if there's an actual change */
let lastServerUrl: string = "";

let databaseUpdateWindow: BrowserWindow | undefined;

let serverState: "Application Activated" |
    "Application Not Activated" | "Server Started" | "Checking Activation"
    | "Server Starting" | "Server Stopping" | "Server Running" = "Checking Activation";
process.env.APP_ROOT = path.join(__dirname, '../..')

export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
    ? path.join(process.env.APP_ROOT, 'public')
    : RENDERER_DIST;

const indexHtml = path.join(RENDERER_DIST, 'index.html');

/** main desktop app menu */
const appMenu: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] = [

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

export function savePreference(store: Store, key: string, value: any) {
    try {
        console.log(key, value)
        store.set(key, value);
    } catch (error: any) {
        throw new Error(error);

    }

}

export function getAppDetails(win: BrowserWindow | null) {
    const title = `${constants.appname} v${app.getVersion()}`
    win?.webContents?.send("appDetailsSent", { title })
}

export function restartApp() {
    app.relaunch()
    app.exit()
}

export function sendServerState(state: string, win: BrowserWindow) {
    try {
        win?.webContents?.send(SERVER_STATE_CHANGED, { data: state, time: new Date().toLocaleString() })

    }
    catch (error) {
        logger.error({ message: error });
        dialog.showErrorBox("Internal error", "Failed to send server state")
    }

}

export function sendServerDatabaseUpdate(state: string, win: BrowserWindow) {
    try {
        console.log(state, 'server database update');
        win?.webContents?.send(DATABASE_SETUP_EVENT, { data: state, time: new Date().toLocaleString() })

    }
    catch (error) {
        logger.error({ message: error });
        dialog.showErrorBox("Internal error", "Failed to send server state")
    }

}





export function sendServerUrl(serverUrl: string, win: BrowserWindow) {

    win?.webContents?.send(SERVER_URL_RECEIVED, { data: serverUrl, time: new Date().toLocaleString() }, serverUrl);


}


export function createWindow(): BrowserWindow {
    const win = new BrowserWindow({
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
    const mainMenu = Menu.buildFromTemplate(appMenu);
    Menu.setApplicationMenu(mainMenu)

    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:')) shell.openExternal(url)
        return { action: 'deny' }
    })

    // Auto update
    update(win)
    return win;
}


export async function spawnServer() {
    try {
        serverEventEmitter.emit(SERVER_STATE_CHANGED, "Checking Activation")
        //check if the app is activated. if it is, start the server. else go the activation page
        const appActivated = await isAppActivated();
        if (appActivated) {
            serverEventEmitter.emit(SERVER_STATE_CHANGED, "Server Starting")
            await startServer();
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

export function openFolder(location: string) {
    shell.showItemInFolder(location)
}

export function openReactUrl(url: string, win: BrowserWindow | null = null) {
    win?.webContents.executeJavaScript(`window.history.pushState({}, '', '${url}');`);

}

export function createChildWindow(path: string, options?: {
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
        ...(options?.parent && { parent: options.parent! }),

    });

    // Load the HTML file that contains your loading message
    window.loadFile(path);

    return window;
}

export function sendWindowMessage(win: BrowserWindow, channel: string, data: any) {
    if (win.webContents) {
        win.webContents.send(channel, data);
    } else {
        logger.error({ message: "Failed to send message to window", channel, data });
    }
}