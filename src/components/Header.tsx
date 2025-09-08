import { ipcRenderer } from 'electron';
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalImage from "@/components/Image";
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { Home, Logout } from '@mui/icons-material';
import Logo from './Logo';
import { useGlobalState } from '@/global/globalProvider';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import CustomButton from './Button';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
const Header = ({ showBackArrow, showLogo, showLoginButton = true }: { showBackArrow: boolean, showLogo: boolean, showLoginButton?: boolean }) => {
  const [title, setTitle] = useState("...");
  const history = useNavigate();
  useEffect(() => {
    ipcRenderer.send("getAppDetails");
    ipcRenderer.on("appDetailsSent", (event: any, data: any) => {
      setTitle(data.title)
    })
  },
    []);
  const signOut = useSignOut()
  const globalContext = useGlobalState();
  const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser<{ token: string }>()

  const logout = () => {
    signOut();
    history("/login")
  }
  return (
    <header className="header bg-white border-b border-blue-300 w-full">
      <div className="header-top">
        {showBackArrow ?
          <IconButton onClick={() => { window.history.back(); }} aria-label="Go back">
            <ArrowBackIcon />
          </IconButton> : ''}

        <Link to={'/'} className="unsetAll link "><CustomButton className='self-end' >🏠 Home</CustomButton></Link>
        <div className="flex justify-center flex-auto">
          {showLogo && <div className='flex gap-1 items-center self-center'> <Logo /> {globalContext.appName} </div>}

        </div>

        {isAuthenticated ? <div className="flex gap-1">
          <div className="admin-info">
            <div className="admin-avatar">
              <span className="admin-initials">AD</span>
            </div>
            <div className="admin-details">
              <span className="admin-name">Administrator</span>
              <span className="admin-role">System Admin</span>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            <span className="logout-icon">🚪</span>
            Logout
          </button>
        </div> :
          <>{showLoginButton && <Link to={'login'} className="unsetAll link "><CustomButton className='self-end' >🔐 Login as the administrator</CustomButton></Link>}</>
        }

      </div>

    </header>
  )
}

export default Header

