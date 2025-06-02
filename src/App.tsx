import CssBaseline from '@mui/material/CssBaseline';

import '@fontsource/lato';
import '@fontsource/ubuntu';
import '@/App.css'
import { Route, Routes } from "react-router-dom";
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
import ResetPassword from "./pages/resetPassword";
import { DatabaseSetup } from "./pages/databaseSetup";
import { useGlobalState } from './global/globalProvider';
import { APP_NOT_ACTIVATED, CHECKING_ACTIVATION, LOADING, UPDATING_DATABASE } from './utils/stringKeys';
import { DatabaseMigration } from './pages/databaseMigration';
import Loading from './components/Loading';

import RequireAuth from '@auth-kit/react-router/RequireAuth';
import { SnackbarProvider } from './global/SnackbarContext';

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
      <SnackbarProvider maxQueue={10} autoHideDuration={5000}>

        <Routes>
          <Route path='/activate' element={<Activate />} />
          <Route path='/help' element={<Index />} />
          <Route path='/settings' element={<RequireAuth fallbackPath={"/login"} ><SettingsPage /></RequireAuth>} />
          <Route path='/adminPassword' element={<SetAdminPassword />} />
          <Route path='/roles' element={<RequireAuth fallbackPath={"/login"} ><Roles /></RequireAuth>} />
          <Route path='/addRole' element={<AddRole />} />
          <Route path='/addRole/:id' element={<RequireAuth fallbackPath={"/login"}><AddRole /></RequireAuth>} />
          <Route path='/users' element={<RequireAuth fallbackPath={"/login"}><Users /></RequireAuth>} />
          <Route path='/addUser' element={<RequireAuth fallbackPath={"/login"}><AddUser /></RequireAuth>} />
          <Route path='/addUser/:id' element={<RequireAuth fallbackPath={"/login"}><AddUser /></RequireAuth>} />
          <Route path='/login' element={<Login />} />
          <Route path='/resetPassword' element={<ResetPassword />} />
          <Route path='/databaseSetup' element={<DatabaseSetup />} />
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SnackbarProvider>
      {/* <UpdateElectron /> */}
    </>

  )
}

export default App