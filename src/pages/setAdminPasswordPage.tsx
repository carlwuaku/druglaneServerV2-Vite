import React, { useState } from 'react'
import Header from '../components/Header';

import SetAdminPassword from '../components/SetAdminPassword';
const setAdminPassword = () => {
    const [isLoaded, setIsLoaded] = useState(false);
  const formSubmitted = () => {
      console.log('form submitted')
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