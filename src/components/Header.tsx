import { ipcRenderer } from 'electron';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

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
const Header = ({ showBackArrow, showLogo }: { showBackArrow: boolean, showLogo: boolean }) => {
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


  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);



  const logout = () => {
    signOut();
    history("/login")
  }
  return (
    <header className="header">
      <div className="header-top">
        {showLogo && <div className='flex gap-1 items-center'> <Logo /> {globalContext.appName} </div>}

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
          <CustomButton className='self-end' >🔐 Login as the administrator</CustomButton>
        }

      </div>

    </header>
    // <AppBar classNameName='margin-bottom-10' position="static">
    //   <Container maxWidth="xl">
    //     <Toolbar disableGutters>
    //       {props.showBackArrow ?
    //         <IconButton onClick={() => { window.history.back(); }} aria-label="delete">
    //           <ArrowBackIcon />
    //         </IconButton> : ''}
    //       <div classNameName='flex gap-1'>
    //         <LocalImage classNameName='header-logo' height='35px' image='LogoShadowWhiteOutline' />
    //         <Typography
    //           variant="h6"
    //           noWrap
    //           component="a"
    //           href="/"
    //           sx={{
    //             mr: 2,
    //             display: { xs: 'flex', md: 'flex' },
    //             fontWeight: 700,
    //             letterSpacing: '.3rem',
    //             color: 'inherit',
    //             textDecoration: 'none',
    //           }}
    //         >
    //           Druglane 2.0
    //         </Typography>
    //       </div>

    //       <Box sx={{ flexGrow: 1, display: 'flex' }}></Box>
    //       <Button
    //         variant='outlined'
    //         href='/'
    //         sx={{ color: 'white' }}
    //         startIcon={<Home />}
    //       >
    //         Home/Menu
    //       </Button>
    //       <Button
    //         sx={{ color: 'white' }}
    //         onClick={logout}
    //         endIcon={<Logout />}
    //       >
    //         Logout
    //       </Button>


    //     </Toolbar>
    //   </Container>
    // </AppBar>
  )
}

export default Header

