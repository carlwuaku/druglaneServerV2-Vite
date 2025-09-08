
import { ipcRenderer } from 'electron';
import Header from '../components/Header';
import { BACKUP_COMPLETE, BACKUP_TIME, CREATE_BACKUP } from '@/utils/stringKeys';
import ServerState from '../components/ServerState';
import { Link } from 'react-router-dom';
// import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Backup, CloudSync, LockPerson, NotificationsOutlined, Person2Outlined } from '@mui/icons-material';
import DashboardTile from '../components/DashboardTile';
import SettingItem from '../components/SettingItem';
import { useGlobalState } from '@/global/globalProvider';
import Grid from '@mui/material/Grid';
import Logo from '@/components/Logo';
import { useState } from 'react';
import { useSnackbar } from '@/global/SnackbarContext';
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

export default function Index() {

  const [loading, setLoading] = useState<boolean>(false);
  const { settings, appVersion } = useGlobalState();
  const snackbar = useSnackbar();
  const backupClicked = () => {
    const handleBackupComplete = async (event: any, data: { localBackup: string | null, remoteBackup: string | null }) => {

      setLoading(false);
      console.log('backup complete', data)
      if (data.localBackup) {
        snackbar.showSuccess(data.localBackup);
      }
      else {
        alert('Local backup failed');
      }
      if (data.remoteBackup) {
        snackbar.showSuccess(data.remoteBackup);
      }
      else {
        alert('Remote backup failed');
      }
    }
    ipcRenderer.send(CREATE_BACKUP);
    setLoading(true);
    ipcRenderer.on(BACKUP_COMPLETE, handleBackupComplete);

    return () => {
      ipcRenderer.removeListener(BACKUP_COMPLETE, handleBackupComplete);
    }
  }

  return (
    <div className='flex flex-col items-center h-full w-full'>
      <Header showBackArrow={false} showLogo={false}></Header>
      <div className="max-w-[800px] w-[80%] h-full flex flex-col items-center">

        <Logo className='self-center' />
        <h1 className="app-title">Druglane Pharmacy Management System v2</h1>
        <p className="app-subtitle">version {appVersion}</p>
        <div className="company-info">
          <span className="license-text">Licensed to:</span>
          <span className="company-name" id="companyName">{settings?.company_name}</span>
        </div>
        <Box className="w-full h-full p-4 flex flex-col gap-4">

          <div className="flex flex-col gap-2">
            <ServerState></ServerState>
            <section className="status-section">
              <div className="status-header">
                <h2 className="status-title">Database Backups</h2>
                <div className="status-indicator status-online" id="serverStatus">
                  <div className="status-dot dot-online" id="statusDot"></div>
                  <span id="statusText">Server Running</span>
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <div>Automatic backups are done once everyday. You can turn it off (not recommended), or change the time at which backups are done.</div>
                <SettingItem key={BACKUP_TIME} description='Backup time' name={BACKUP_TIME} type={'select'} options={times}></SettingItem>
              </div>
            </section>


          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to={''} className="unsetAll link ">
              <DashboardTile
                title={'Backup your database now'}
                subtitle={'Create a backup file of your database'}
                icon={<img src="/assets/002-backup.png" alt="Backup" />}
                onClick={backupClicked}
                isLoading={loading}
              ></DashboardTile>
            </Link>

            <Link to={'backups'} className="unsetAll link">
              <DashboardTile
                title={'Restore data from a backup'}
                subtitle={'Revert your database to a previous state if there\'s been an error '}
                icon={<img src="/assets/001-sync.png" alt="Restore" />} ></DashboardTile>
            </Link>

            <Link to={'settings'} className="unsetAll link">
              <DashboardTile
                title={'Edit system settings'}
                subtitle={'Edit the phone, email, address, etc'}
                icon={<img src="/assets/007-adjust.png" alt="Settings" />} ></DashboardTile>
            </Link>

            <Link to={'users'} className="unsetAll link">
              <DashboardTile
                title={'Manage system users'}
                subtitle={'Add, edit or view users of the system'}
                icon={<img src="/assets/012-connection-1.png" alt="Users" />} ></DashboardTile>
            </Link>

            <Link to={'roles'} className="unsetAll link ">
              <DashboardTile
                title={'User Permissions'}
                subtitle={'Set/disable permissions for user groups'}
                icon={<img src="/assets/011-blueprint.png" alt="Permissions" />} ></DashboardTile>
            </Link>

            <Link to={''} className="unsetAll link">
              <DashboardTile
                title={'Manage Automatic Reminders'}
                subtitle={'Add/Edit/View Automatic Reminders'}
                icon={<img src="/assets/004-cloud.png" alt="Permissions" />} ></DashboardTile>
            </Link>
          </div>


        </Box>

      </div>
    </div>

  );
}

