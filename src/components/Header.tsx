import { ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react'
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Link from '@mui/material/Link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import  LocalImage  from "@/app/components/Image";
const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
import { useSignOut } from 'react-auth-kit'
import { Home, Logout } from '@mui/icons-material';

const Header = (props: { showBackArrow?: boolean }) => {
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


  const items = [
    {
      label: 'Home/Menu',
      icon: 'pi pi-fw pi-home',
      link: '/'
    },
    {
      label: 'System',
      icon: 'pi pi-fw pi-desktop',
      items: [
        {
          label: 'Restart System',
          icon: 'pi pi-fw pi-refresh',
        },
        {
          label: 'Quit',
          icon: 'pi pi-fw pi-power-off'
        },
      ]
    },
    {
      label: 'Backups',
      icon: 'pi pi-fw pi-database',
      items: [
        {
          label: 'Create Backup Now',
          icon: 'pi pi-fw pi-cloud-download',
          link: '/create_backup'
        },
        {
          label: 'View/Restore Backups',
          icon: 'pi pi-fw pi-cloud-upload',
          link: '/restore_backups'
        }

      ]
    },
    {
      label: 'Users & Permissions',
      icon: 'pi pi-fw pi-user',
      link: '/users',
      items: [
        {
          label: 'New User',
          icon: 'pi pi-fw pi-user-plus',
          link: '/new_user'

        },
        {
          label: 'Manage Users',
          icon: 'pi pi-fw pi-users',
          link: '/users'
        },
        {
          label: 'New Role',
          icon: 'pi pi-fw pi-users',
          link: '/roles'
        },
        {
          label: 'Manage User Permissions',
          icon: 'pi pi-fw pi-users',
          link: '/permissions'
        }
      ]
    },
    {
      label: 'Settings',
      icon: 'pi pi-fw pi-cog',
      link: '/settings'
    },
    {
      label: 'Help',
      icon: 'pi pi-fw pi-power-off',

    }
  ];

  const logo = <label htmlFor=""> {title}</label>
  const search = <InputText placeholder="Search" type="text" className="w-full" />;
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const logout = () => {
    signOut();
    history("/login")
  }
  return (
    <AppBar className='margin-bottom-10' position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {props.showBackArrow ?
            <IconButton onClick={() => { window.history.back(); }} aria-label="delete">
              <ArrowBackIcon />
            </IconButton> : ''}

          <LocalImage height='35px' image='logo.png'  />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'flex' },
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Druglane
          </Typography>

          <Button
            component={RouterLink} 
            to={`/`}
            sx={{ my: 2, color: 'white', display: 'block' }}
            onClick={logout}
            startIcon={<Home />}
          >
             Home/Menu
          </Button>
          <Box sx={{ flexGrow: 1, display: 'flex' }}></Box>
          {/* <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
            {items.map((page) => (

              <Button component={RouterLink}
                to={`${page.link}`}
                key={page.label}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.label}
              </Button>
))}
          </Box> */}
          <Button 
            sx={{ my: 2, color: 'white', display: 'block' }}
            onClick={logout}
            endIcon={<Logout />}
          >
           Logout 
          </Button>


        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header

