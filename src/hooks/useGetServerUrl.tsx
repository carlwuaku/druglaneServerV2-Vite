import { useEffect, useState } from "react";
import { ipcRenderer } from 'electron';
import { GET_SERVER_URL, SERVER_URL_RECEIVED } from "@/utils/stringKeys";

export default function useGetServerUrl() {
    const [serverUrl, setServerUrl] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        setLoading(true);
        const handleServerUrlReceived = async (event: any, data: any) => {
            console.log('server url', data)
            setServerUrl(data.data);
            setLoading(false);

        }

        ipcRenderer.send(GET_SERVER_URL);

        ipcRenderer.on(SERVER_URL_RECEIVED, handleServerUrlReceived);

        return () => {
            ipcRenderer.removeListener(SERVER_URL_RECEIVED, handleServerUrlReceived);
        }
    }, [])

    return { serverUrl, serverUrlLoading: loading };

}