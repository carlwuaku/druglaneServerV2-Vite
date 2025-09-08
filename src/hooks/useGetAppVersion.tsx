import { ipcRenderer } from "electron";
import { APP_VERSION_RECEIVED, GET_APP_VERSION } from "@/utils/stringKeys";
import { useEffect, useState } from "react";

export default function useGetAppVersion() {
    const [appVersion, setAppVersion] = useState<string>('');
    useEffect(() => {
        const handleVersionReceived = (event: any, data: string) => {
            setAppVersion(data);
        }
        ipcRenderer.send(GET_APP_VERSION);
        ipcRenderer.on(APP_VERSION_RECEIVED, handleVersionReceived);
        return () => {
            ipcRenderer.removeAllListeners(APP_VERSION_RECEIVED);
        }
    }, [])

    return appVersion;
}