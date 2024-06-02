import React, { useState, useEffect, useContext } from 'react';

import { ipcRenderer } from 'electron';
import Header from '../components/Header';
import { BACKUP_TIME, CREATE_BACKUP, GET_PREFERENCES, GET_SERVER_URL, SERVER_URL_RECEIVED } from '@/utils/stringKeys';
import ServerState from '../components/ServerState';
import { Link, Link as RouterLink } from 'react-router-dom';
import ServerLogs from '../components/ServerLogs';
import { getData } from '@/utils/network';
import { Button, Card, CardContent, CardHeader, Typography } from '@mui/material';
import AppConfig from '../components/AppConfig';
// import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { Backup, CloudDownload, CloudSync, DisplaySettings, LockPerson, NotificationsOutlined, Person2Outlined, Settings } from '@mui/icons-material';
import DashboardTile from '../components/DashboardTile';
import SettingItem from '../components/SettingItem';
import GlobalContext from '../global/global';
import {useAuthUser} from 'react-auth-kit'
import useGetServerState from '@/hooks/useGetServerState';
import { useGlobalState } from '@/global/globalProvider';
// import logo from '@/app/assets/logo.png';

// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
// }));

const times = [
  { label: "12 AM", value: "0" },
  { label: "1 AM", value: "1" },
  { label: "2 AM", value: "2" },
  { label: "3 AM", value: "3" },
  { label: "4 AM", value: "4" },
  { label: "5 AM", value: "5" },
  { label: "6 AM", value: "6" },
  { label: "7 AM", value: "7" },
  { label: "8 AM", value: "8" },
  { label: "9 AM", value: "9" },
  { label: "10 AM", value: "10" },
  { label: "11AM", value: "11" },
  { label: "12PM", value: "12" },
  { label: "1 PM", value: "13" },
  { label: "2 PM", value: "14" },
  { label: "3 PM", value: "15" },
  { label: "4 PM", value: "16" },
  { label: "5 PM", value: "17" },
  { label: "6 PM", value: "18" },
  { label: "7 PM", value: "19" },
  { label: "8 PM", value: "20" },
  { label: "9 PM", value: "21" },
  { label: "10 PM", value: "22" },
  { label: "11 PM", value: "23" }
]

const Index = () => {

  // const auth = useAuthUser();
  // const [companyName, setCompanyName] = useState("Company Name");
  // const openPreferences = () => {
  //   ipcRenderer.send(GET_PREFERENCES)
  // }
  const {settings} = useGlobalState();
  const backupClicked = () => {
    console.log('backup clicked');
    ipcRenderer.send(CREATE_BACKUP);
  }

  // const serverState = useGetServerState();

  // useEffect(() => {
  //   const handleServerUrlReceived = async (event: any, data: any) => {
  //     let serverUrl = data.data;
  //     console.log('index server url ', serverUrl)
  //     //get the settings
  //     const getSettings = await getData<any>({ url: `${serverUrl}/api_admin/settings`, token: auth()?.token });
  //     setCompanyName(getSettings.data.company_name);
  //     ipcRenderer.removeListener(SERVER_URL_RECEIVED, handleServerUrlReceived);
  //   }

  //   ipcRenderer.send(GET_SERVER_URL);

  //   ipcRenderer.on(SERVER_URL_RECEIVED, handleServerUrlReceived);


    

  // }, []);





  return (
    <>
      <Header></Header>
      
      {/* <Button><Link to="/activate">Activation</Link></Button>
      <Button><Link to="/settings">settngs</Link></Button> */}
      <Box className="container">
        <h3>Druglane Management System</h3>
        <h4>Licensed to {settings?.company_name}</h4>
        <Grid container spacing={2}>
          
          <Grid xs={12} md={8} >
            <ServerState></ServerState>

          </Grid>
          <Grid xs={6} md={4} lg={4}>
            <SettingItem key={BACKUP_TIME} description='Backup time' name={BACKUP_TIME} type={'select'} options={times}></SettingItem>

          </Grid>
          
        </Grid>
        <Grid container spacing={2}>
          <Grid lg={3} md={3} sm={6}>
            <Link  to={''} className="unsetAll link ">
              <DashboardTile
                title={'Backup your database now'}
                subtitle={'Create a backup file of your database'}
                icon={<Backup sx={{ fontSize: 30 }}></Backup>}
                onClick={backupClicked}
              ></DashboardTile>
           </Link>
          </Grid>
          <Grid lg={3} md={3} sm={6}>
            <Link to={'backups'} className="unsetAll link">
              <DashboardTile
                title={'Restore data from a backup'}
                subtitle={'Revert your database to a previous state if there\'s been an error '}
                icon={<CloudSync sx={{ fontSize: 30 }}></CloudSync>} ></DashboardTile>
            </Link>
          </Grid>
          <Grid lg={3} md={3} sm={6}>
            <Link to={'settings'} className="unsetAll link">
              <DashboardTile
                title={'Edit system settings'}
                subtitle={'Edit the phone, email, address, etc'}
                icon={<DisplaySettings sx={{ fontSize: 30 }}></DisplaySettings>} ></DashboardTile>
            </Link>
          </Grid>
          <Grid lg={3} md={3} sm={6}>
            <Link to={'users'} className="unsetAll link">
              <DashboardTile
                title={'Manage system users'}
                subtitle={'Add, edit or view users of the system'}
                icon={<Person2Outlined sx={{ fontSize: 30 }}></Person2Outlined>} ></DashboardTile>
            </Link>
          </Grid>
          
        </Grid>

        <Grid container spacing={2}>
          <Grid lg={3} md={3} sm={6}>
            <Link to={'roles'} className="unsetAll link ">
              <DashboardTile
                title={'User Permissions'}
                subtitle={'Set/disable permissions for user groups'}
                icon={<LockPerson sx={{ fontSize: 30 }}></LockPerson>} ></DashboardTile>
            </Link>
          </Grid>
          <Grid lg={3} md={3} sm={6}>
            <Link to={''} className="unsetAll link">
              <DashboardTile
                title={'Manage Automatic Reminders'}
                subtitle={'Revert your database to a previous state if there\'s been an error '}
                icon={<NotificationsOutlined sx={{ fontSize: 30 }}></NotificationsOutlined>} ></DashboardTile>
            </Link>
          </Grid>
          

        </Grid>
       
      </Box>
      
    </>
  );
}

export default Index;