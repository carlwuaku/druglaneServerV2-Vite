import { GET_SERVER_STATE, GET_SERVER_URL, GET_COMPANY_NAME, SERVER_MESSAGE_RECEIVED, SERVER_STATE_CHANGED, COMPANY_NAME_RECEIVED } from '@/utils/stringKeys';
import { ipcRenderer } from 'electron';
import { Card } from 'primereact/card'
import React, { useEffect, useState } from 'react'
interface logItem{
    time: string;
    data: string;
}

const ServerLogs = () => {
    
    const [logs, setLogs] = useState<logItem[]>([]);
    useEffect(() => {

        ipcRenderer.send(GET_SERVER_STATE);

        ipcRenderer.send(GET_SERVER_URL);
        ipcRenderer.send(GET_COMPANY_NAME);


        ipcRenderer.on(SERVER_MESSAGE_RECEIVED, (event: any, data: any) => {
            // console.log(SERVER_MESSAGE_RECEIVED, data)
            //add it to the server logs
            setLogs([...logs, data]);
            console.log(logs, typeof (logs))
        });

        ipcRenderer.on(SERVER_STATE_CHANGED, (event: any, data: any) => {
            // console.log(SERVER_STATE_CHANGED, data)
            //add it to the server logs
            setLogs([...logs, data]);
            console.log(logs, typeof(logs))
        });



    }, [])
  return (
      <div>
          <h5>Server Logs</h5>
          {
              logs.map(log => {
                  return <Card key={Math.random()}  footer={log.time}>{log.data} </Card>
              })
        }
    </div>
  )
}

export default ServerLogs