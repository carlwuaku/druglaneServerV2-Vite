import React, { ReactNode, useContext, useEffect, useState } from 'react'
import GlobalContext from './global';
import useGetServerState from '@/hooks/useGetServerState';
import useGetServerUrl from '@/hooks/useGetServerUrl';
import { COMPLETED_DATABASE_UPDATE, SERVER_RUNNING } from '@/utils/stringKeys';
import { getData } from '@/utils/network';
import { ISettings } from '@/models/globalState';
import useGetServerDatabaseState from '@/hooks/useGetServerDatabaseState';
import { useNavigate } from 'react-router-dom';



export const GlobalProvider = ({ children }: { children: ReactNode }) => {
    const { serverState, loading } = useGetServerState();
    const { serverUrl, serverUrlLoading } = useGetServerUrl();
    const { dbState, dbStateLoading } = useGetServerDatabaseState();
    const [settings, setSettings] = useState<ISettings | null>(null);
    const history = useNavigate();
    const globalState = {
        serverUrl: serverUrl,
        serverState: serverState,
        settings,
        dbState
    };

    useEffect(() => {
        if (serverUrl && !serverUrlLoading &&
            serverState === SERVER_RUNNING && dbState === COMPLETED_DATABASE_UPDATE
            && !loading && !dbStateLoading) {
            console.log(serverUrl, serverState, dbState, dbStateLoading)
            //get the settings
            getData<ISettings>({
                url: `${serverUrl}/api_admin/settings`,
                token: ""
            }).then((data) => {
                setSettings(data.data);
                //if the company name is not set, then redirect to the activation page
                if (!data.data.company_name) {
                    history('/activate');
                }
                // else if (!data.data.admin_password) {
                //     history('/adminPassword');
                // }
            }).catch((error) => {
                setSettings(null);
            });

        }
    }, [serverState, serverUrl, loading, dbStateLoading, dbState]);

    return (
        <GlobalContext.Provider value={globalState}>{children}</GlobalContext.Provider>
    )
}

export function useGlobalState() {
    return useContext(GlobalContext);
}