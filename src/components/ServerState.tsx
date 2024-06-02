import { APP_NOT_ACTIVATED, COMPANY_NAME_RECEIVED, GET_SERVER_STATE, GET_SERVER_URL, RESTART_SERVER, SERVER_MESSAGE_RECEIVED, SERVER_RUNNING, SERVER_STARTING, SERVER_STATE_CHANGED, SERVER_STOPPED, SERVER_URL_RECEIVED } from "@/utils/stringKeys";
import { Alert, AlertTitle, CardActionArea, CardActions, CardContent, CardHeader, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import { ipcRenderer } from "electron";
import { Button } from "primereact/button";
import { Button as MatButton } from "@mui/material"
import React, { useEffect, useState } from "react";
import Hub from '@mui/icons-material/Hub';
import { Link, useNavigate } from "react-router-dom";
import { useGlobalState } from "@/global/globalProvider";

const ServerState = () => {
    const appData = useGlobalState();
    // const [serverState, setServerState] = useState("...");
    // const [serverUrl, setServerUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    // const title = "Server State";
    // const subtitle = "Shows the state of the main application server";
    // const restartButton = <Button loading={loading} onClick={restartServer} label="Restart" icon="pi pi-refresh" />
    // const navigate = useNavigate();
    function restartServer() {
        setLoading(true);
        ipcRenderer.send(RESTART_SERVER);
    };
    

    // useEffect(() => {
    //     const handleServerStateReceived = (event: any, data: any) => {
    //         setLoading(false)
    //         setServerState(data.data) 
    //         console.log(SERVER_STATE_CHANGED, data == APP_NOT_ACTIVATED)
    //         if (data.data === APP_NOT_ACTIVATED){
    //             //navigate to the activation page
    //             // navigate('/activate');
    //         }
    //     }
    //     ipcRenderer.send(GET_SERVER_STATE);

    //     ipcRenderer.on(SERVER_STATE_CHANGED, handleServerStateReceived);
       



    //     const handleServerUrlReceived = (event: any, data: any) => {
    //         console.log(SERVER_URL_RECEIVED, data.data)
    //         setServerUrl(data.data);
    //         ipcRenderer.removeListener(SERVER_URL_RECEIVED, handleServerUrlReceived);
    //     }

    //     ipcRenderer.send(GET_SERVER_URL);

    //     ipcRenderer.on(SERVER_URL_RECEIVED, handleServerUrlReceived);

    


    // }, [])
    switch (appData.serverState) {
        case SERVER_RUNNING:
            return <Card >
                <CardHeader
                    avatar={
                        <Hub color="primary"></Hub>
                    }
                    title="Open the main application"

                ></CardHeader>
                <CardContent>
                    <h5>Welcome to the Server!</h5>
                    <p>Scroll down to manage the users, permissions, backups, and other system settings.</p>
                    
                    <p className="text-primary">
                        To make sales, manage your inventory, or do any other day-to-day activities,&nbsp;
                        <a className="unsetAll" href={`${appData.serverUrl}/client`} target="_blank" rel="noopener noreferrer">
                            <MatButton variant="contained" size="small">
                                click here</MatButton>
                        </a>&nbsp; to login to the main application.
                       
                    </p>
                    <p>
                        To run the main application on other computers or phones connected to the same network , open a browser (preferably
                        Google Chrome, Microsoft Edge or Firefox) on the device,
                        and enter the following url in the address bar:
                            <br />
                        {appData.serverUrl}/client.
                    </p>

                    


                </CardContent>
                <CardActions >
                    

                </CardActions>



            </Card>
        case SERVER_STARTING:
            return <Card >
                <CardContent>
                    <Alert severity="warning">
                        <AlertTitle>{appData.serverState}</AlertTitle>
                        <b>
                            Please wait for the server to get fired up!
                        </b>
                    </Alert>
                </CardContent>
            </Card>
        case APP_NOT_ACTIVATED:
            return <Card >
                <CardContent>
                    <Alert severity="warning">
                        <AlertTitle>{appData.serverState}</AlertTitle>
                        <b>
                            This app has not been activated. Please go to the activation page and 
                            enter your activation key.
                        </b>
                    </Alert>
                </CardContent>
                <CardActions>
                    <Button><Link to="/activate">Activate</Link></Button>
                </CardActions>

            </Card>

        default:
            return <Card >
                <CardContent>
                    <Alert severity="error">
                        <AlertTitle>{appData.serverState}</AlertTitle>
                        <b>
                            The server process has stopped. Use the controls to restart it
                        </b>
                    </Alert>
                </CardContent>
                    <CardActions>
                    <Button loading={loading} onClick={restartServer} label="Restart" icon="pi pi-refresh" />
                    </CardActions>

            </Card>


    }
}

export default ServerState