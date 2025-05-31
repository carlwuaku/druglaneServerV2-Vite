import { useEffect, useState } from 'react'
import UpdateElectron from '@/components/update'
import logoVite from './assets/logo-vite.svg'
import logoElectron from './assets/logo-electron.svg'
import CssBaseline from '@mui/material/CssBaseline';

import "primereact/resources/themes/md-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import 'primeflex/primeflex.css';
import '@fontsource/lato';
import '@fontsource/ubuntu';
import '@/App.css'
import { HashRouter, Route, Routes } from "react-router-dom";
import Activate from "./pages/activate";
import Index from "./pages";
import NotFound from "./pages/notFound";
import SettingsPage from "./pages/settings";
import SetAdminPassword from "./pages/setAdminPasswordPage";
import Roles from "./pages/roles";
import AddRole from "./pages/addRole";
import Users from "./pages/users";
import AddUser from "./pages/addUser";
import Login from "./pages/login";
import { AuthProvider, RequireAuth } from "react-auth-kit";
import ResetPassword from "./pages/resetPassword";
import { DatabaseSetup } from "./pages/databaseSetup";
import { useGlobalState } from './global/globalProvider';
import { APP_NOT_ACTIVATED, CHECKING_ACTIVATION, DATABASE_SETUP_EVENT, LOADING, UPDATING_DATABASE } from './utils/stringKeys';
import { DatabaseMigration } from './pages/databaseMigration';
import Loading from './components/Loading';

function App() {
  const globalState = useGlobalState();
  console.log("Global State", globalState);

  //if globalState.settings is
  if (globalState.serverState === LOADING || globalState.dbState === UPDATING_DATABASE || globalState.serverState === CHECKING_ACTIVATION) {
    return <div className='w-full h-full flex flex-col justify-center items-center'>
      <Loading />
      <div className='text-2xl font-bold text-center mt-4'>{globalState.serverState}</div>
    </div>
  }

  if (globalState.serverState === APP_NOT_ACTIVATED) {
    return <Activate />
  }
  if (globalState.dbState === UPDATING_DATABASE) {
    return <DatabaseMigration />
  }

  return (
    <>
      <CssBaseline />
      <Routes>

        <Route path='/activate' element={<Activate />} />
        <Route path='/help' element={<Index />} />
        <Route path='/settings' element={<RequireAuth loginPath={"/login"} ><SettingsPage /></RequireAuth>} />
        <Route path='/adminPassword' element={<SetAdminPassword />} />
        <Route path='/roles' element={<RequireAuth loginPath={"/login"} ><Roles /></RequireAuth>} />
        <Route path='/addRole' element={<AddRole />} />
        <Route path='/addRole/:id' element={<RequireAuth loginPath={"/login"}><AddRole /></RequireAuth>} />
        <Route path='/users' element={<RequireAuth loginPath={"/login"}><Users /></RequireAuth>} />
        <Route path='/addUser' element={<RequireAuth loginPath={"/login"}><AddUser /></RequireAuth>} />
        <Route path='/addUser/:id' element={<RequireAuth loginPath={"/login"}><AddUser /></RequireAuth>} />
        <Route path='/login' element={<Login />} />
        <Route path='/resetPassword' element={<ResetPassword />} />
        <Route path='/databaseSetup' element={<DatabaseSetup />} />
        <Route path="/" element={<Index />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
      {/* <UpdateElectron /> */}
    </>

  )
}

export default App