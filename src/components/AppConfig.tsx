import React from 'react';
import List from '@mui/material/List';
import SettingItem from './SettingItem';
import { PORT, BACKUP_TIME } from '@/utils/stringKeys';

const AppConfig = () => {
  
  return (
      <List className=''>
      <SettingItem key={PORT} description='The port for the running server. Do not edit this' name={PORT} type={'input'}></SettingItem>

    </List>
  )
}

export default AppConfig