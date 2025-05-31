export const appGlobals: { serverUrl: string, lastServerUrl: string, databaseState: string, serverState: serverStateType } = {
    serverUrl: "",
    lastServerUrl: "",
    databaseState: "",
    serverState: "Checking Activation"
}

export type serverStateType = "Application Activated" |
    "Application Not Activated" | "Server Started" | "Checking Activation"
    | "Server Starting" | "Server Stopping" | "Server Running";