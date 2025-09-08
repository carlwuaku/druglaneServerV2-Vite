import React, { useState } from 'react'
import Header from '../components/Header';

import SetAdminPassword from '../components/SetAdminPassword';
import { useNavigate } from 'react-router-dom';
export default function setAdminPassword() {
  const history = useNavigate();

  const formSubmitted = () => {
    history('/')
  }
  return (
    <>
      <Header showBackArrow={false} showLogo={true}></Header>
      <div className='page-container'>
        <SetAdminPassword onSubmit={formSubmitted} ></SetAdminPassword>
      </div>
    </>

  )
}

