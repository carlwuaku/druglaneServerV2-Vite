import { BrowserWindow, ipcMain } from "electron";
import { verifyLicenseKey } from "../appValidation";
// import { defaultOptions } from "../electronConstants";
import {
    ACTIVATION_RESULT, APP_VERSION_RECEIVED, BACKUP_COMPLETE, CALL_ACTIVATION, CREATE_BACKUP, GET_APP_DETAILS, GET_APP_VERSION, GET_PREFERENCE, GET_PREFERENCES,
    GET_SERVER_STATE, GET_SERVER_URL, PREFERENCE_RECEIVED, PREFERENCE_SET,
    RESTART_APPLICATION, RESTART_SERVER, SERVER_DATABASE_UPDATE,
    SERVER_RUNNING,
    SET_ADMIN_PASSWORD,
    SET_PREFERENCE
} from "../utils/stringKeys";
import Store from "electron-store";
import { startServer } from "../server/server";
import { getAppDetails, restartApp, savePreference, sendServerDatabaseUpdate, sendServerState, sendServerUrl, spawnServer } from "./app-functions";
import { appGlobals } from "./globals";
import { constants } from "../utils/constants";
import { backupDatabase } from "./backup";
import fs from "fs";
import path from "path";

export function registerIpcHandlers(win: BrowserWindow, store: Store, app: Electron.App) {

    /** run when user enters activation code from the ui */
    ipcMain.on(CALL_ACTIVATION, async (event, key) => {
        try {
            let data = await verifyLicenseKey(key);
            if (data.data.status === "1") {
                console.log('activation successful');
                console.log('server state', appGlobals.serverState)
                // in some cases the server might already be running, so we check the server state. e.g. if the user tried activation and did not complete it
                if (appGlobals.serverState !== SERVER_RUNNING) {
                    await startServer();
                }
                //create the jwt.key file in the settings folder and set the value
                fs.writeFileSync(path.join(constants.settings_location, 'jwt.key'), data.data.jwt_key);


            }
            win?.webContents?.send(ACTIVATION_RESULT, { data: data.data, error: false, message: "" })
        } catch (error) {
            win?.webContents?.send(ACTIVATION_RESULT, { data: null, error: true, message: error })
        }


    }
    )

    /** run when user requests the app details (app name and version) from the ui */
    ipcMain.on(GET_APP_DETAILS, () => getAppDetails(win));

    /** run when ui requests the server state */
    ipcMain.on(GET_SERVER_STATE, () => {
        sendServerState(appGlobals.serverState, win);
    })

    /** run when user requests to restart the server from the ui */
    ipcMain.on(RESTART_SERVER, async (event, data) => {
        await spawnServer();
    })

    ipcMain.on(RESTART_APPLICATION, async (event, data) => {
        restartApp();
    })

    ipcMain.on(GET_SERVER_URL, () => sendServerUrl(appGlobals.serverUrl, win));

    ipcMain.on(GET_PREFERENCE, (event, data: { key: string }) => {

        let value = store.get(data.key, constants.default_config[data.key as keyof typeof constants.default_config]);
        event.reply(PREFERENCE_RECEIVED, { name: data.key, value: value })
    }
    )

    ipcMain.on(GET_PREFERENCES, (event) => {
        store.openInEditor()
    })

    ipcMain.on(SET_PREFERENCE, (event, data: { key: string, value: any }) => {
        try {
            savePreference(store, data.key, data.value);
            event.reply(PREFERENCE_SET, { success: true, message: "Setting saved successfully" })
        } catch (error) {
            event.reply(PREFERENCE_SET, { success: false, message: error })

        }
    })

    ipcMain.on(SET_ADMIN_PASSWORD, (event, data: { password: string }) => {

    });

    ipcMain.on(CREATE_BACKUP, async (event) => {
        try {
            const backupResult = await backupDatabase();
            event.reply(BACKUP_COMPLETE, backupResult)
        } catch (error) {
            event.reply(BACKUP_COMPLETE, { localBackup: null, remoteBackup: null })
        }

    })


    ipcMain.on(SERVER_DATABASE_UPDATE, () => {
        sendServerDatabaseUpdate(appGlobals.databaseState, win)
    });

    ipcMain.on(GET_APP_VERSION, () => {
        win?.webContents?.send(APP_VERSION_RECEIVED, app.getVersion());
    })
}