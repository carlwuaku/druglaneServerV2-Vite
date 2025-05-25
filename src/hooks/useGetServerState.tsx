import { useEffect, useState } from "react";
import { ipcRenderer } from 'electron';
import { GET_SERVER_STATE, SERVER_STATE_CHANGED,  } from "@/utils/stringKeys";
export default function useGetServerState() {
    const [serverState, setServerState] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        setLoading(true);
        const handleServerStateReceived = async (event: any, data: any) => {
            console.log(data)
            setServerState(data.data);
            setLoading(false);
            
        }

        ipcRenderer.send(GET_SERVER_STATE);

        ipcRenderer.on(SERVER_STATE_CHANGED, handleServerStateReceived);
    
      return () => {
          ipcRenderer.removeListener(SERVER_STATE_CHANGED, handleServerStateReceived);
      }
    }, [])

    return { serverState, loading };
    
}