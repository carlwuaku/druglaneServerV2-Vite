import { Alert, IconButton } from '@mui/material'
import Snackbar from '@mui/material/Snackbar'
import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { NotificationSeverity } from '../models/notificationSeverityInterface';

const Notification = (props:{message:string, open:boolean, severity: NotificationSeverity}) => {
  const [open, setOpen] = React.useState(props.open);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  }; 

  const action = <React.Fragment>
    
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  </React.Fragment>
  
  return (
    
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      action={action}
      
    >
      <Alert onClose={handleClose} severity={props.severity} sx={{ width: '100%' }}>
        {props.message}
      </Alert> 
    </Snackbar>
  )
}

export default Notification