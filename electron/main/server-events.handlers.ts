import { BrowserWindow, dialog } from "electron";
import serverEventEmitter from "../server/utils/ServerEvents";
import {
    COMPLETED_DATABASE_UPDATE, ERROR_UPDATING_DATABASE,

    SERVER_DATABASE_UPDATE, SERVER_MESSAGE_RECEIVED,
    SERVER_STATE_CHANGED, SERVER_URL_UPDATED,
    UPDATING_DATABASE
} from "../utils/stringKeys";
import { createChildWindow, sendServerDatabaseUpdate, sendServerState, sendServerUrl, sendWindowMessage } from "./app-functions";
import { appGlobals } from "./globals";
let serverState: "Application Activated" |
    "Application Not Activated" | "Server Started" | "Checking Activation"
    | "Server Starting" | "Server Stopping" | "Server Running" = "Checking Activation";

export type serverStateType = typeof serverState;
export function registerServerEventHandlers(window: BrowserWindow, databaseUpdateWindow: BrowserWindow | undefined) {
    serverEventEmitter.on(SERVER_STATE_CHANGED, (data: serverStateType) => {
        appGlobals.serverState = data;
        sendServerState(data, window);
    })

    serverEventEmitter.on(SERVER_MESSAGE_RECEIVED, (data: string) => {
        sendWindowMessage(window, SERVER_MESSAGE_RECEIVED, { data, time: new Date().toLocaleString() });
    })

    serverEventEmitter.on(SERVER_URL_UPDATED, (data: string) => {
        appGlobals.serverUrl = data;

        if (appGlobals.lastServerUrl !== appGlobals.serverUrl) {
            sendServerUrl(appGlobals.serverUrl, window);
            appGlobals.lastServerUrl = data;
        }
    });

    serverEventEmitter.on(SERVER_DATABASE_UPDATE, (data) => {
        appGlobals.databaseState = data;
        sendServerDatabaseUpdate(data, window);
        switch (data) {
            case UPDATING_DATABASE:
                //create the window if it doesn't exist
                if (!databaseUpdateWindow) {
                    databaseUpdateWindow = createChildWindow("electronPages/runningMigrations.html", { title: "Running Migrations", parent: window })
                }
                break;
            case COMPLETED_DATABASE_UPDATE:
                //create the window if it doesn't exist
                if (databaseUpdateWindow) {
                    databaseUpdateWindow.close();

                }
                dialog.showMessageBox(window, {
                    type: "info",
                    message: "Database updated successfully",
                })
                break;

            case ERROR_UPDATING_DATABASE:
                //close the window if it was open
                if (databaseUpdateWindow) {
                    databaseUpdateWindow.close();

                }
                dialog.showMessageBox(window, {
                    type: "error",
                    message: "There was a problem updating the database. Please restart the application to try again, or contact us for help",
                })
                break;
            default:
                break;
        }

    })
}