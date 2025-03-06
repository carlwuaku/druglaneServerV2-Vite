import { useEffect, useState } from "react";
import { ipcRenderer } from 'electron';
import { DATABASE_SETUP_EVENT, GET_SERVER_DATABASE_STATE, SERVER_DATABASE_STATE_CHANGED, SERVER_DATABASE_UPDATE,  } from "@/utils/stringKeys";
export default function useGetServerDatabaseState() {
    const [dbState, setDbState] = useState<string>('');
    const [dbStateLoading, setDbStateLoading] = useState<boolean>(true);
    useEffect(() => {
        setDbStateLoading(true);
        const handleDbStateReceived = async (event: any, data: any) => {
            console.log(data)
            setDbState(data.data);
            setDbStateLoading(false);

        }

        ipcRenderer.send(SERVER_DATABASE_UPDATE);

        ipcRenderer.on(DATABASE_SETUP_EVENT, handleDbStateReceived);

        return () => {
            ipcRenderer.removeListener(DATABASE_SETUP_EVENT, handleDbStateReceived);
        }
    }, [])

    return { dbState,  dbStateLoading };

}