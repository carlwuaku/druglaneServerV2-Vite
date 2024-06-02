import React, { ReactNode, useContext, useEffect, useState } from 'react'
import GlobalContext from './global';
import useGetServerState from '@/hooks/useGetServerState';
import useGetServerUrl from '@/hooks/useGetServerUrl';
import { SERVER_RUNNING } from '@/utils/stringKeys';
import { getData } from '@/utils/network';
import { ISettings } from '@/models/globalState';



export const GlobalProvider = ({children}:{children:ReactNode}) => {
    const {serverState, loading} = useGetServerState();
    const {serverUrl, serverUrlLoading} = useGetServerUrl();
    const [settings , setSettings] = useState<ISettings|null>(null);

    const globalState = {
        serverUrl: serverUrl,
        serverState: serverState,
        settings,
    };

    useEffect(() => { 
        if (serverUrl && !serverUrlLoading &&
            serverState === SERVER_RUNNING
            && !loading) { 
            console.log(serverUrl, serverState)
            //get the settings
            getData<ISettings>({
                url: `${serverUrl}/api_admin/settings`,
                token: ""
            }).then((data) => { 
                console.log(data.data);
                setSettings(data.data);
            }).catch((error) => { 
                setSettings(null);
            });
            
        }
    },[serverState, serverUrl]);
    
  return (
      <GlobalContext.Provider value={globalState}>{children}</GlobalContext.Provider>
  )
}

export function useGlobalState() { 
    return useContext(GlobalContext);
}