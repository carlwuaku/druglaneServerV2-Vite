import React, { useState } from 'react'
import Header from '../components/Header';

import SetAdminPassword from '../components/SetAdminPassword';
import { useNavigate } from 'react-router-dom';
const setAdminPassword = () => {
  const history = useNavigate();

    const [isLoaded, setIsLoaded] = useState(false);
  const formSubmitted = () => {
      history('/')
    }
  return (
    <>
      <Header></Header>
      <div className='container'>
        <SetAdminPassword onSubmit={formSubmitted} ></SetAdminPassword>
      </div>
    </>
    
  )
}

export default setAdminPassword