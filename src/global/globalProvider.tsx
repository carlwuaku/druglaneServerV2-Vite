import React, { ReactNode, useState } from 'react'
import GlobalContext from './global';



const GlobalProvider = ({children}:{children:ReactNode}) => {
    const [serverUrl, setServerUrl] = useState<string>("null");
    const [companyName, setCompanyName] = useState<string>("null");

    const globalState = {
        serverUrl,
        companyName,
        setCompanyName,
        setServerUrl
    };
    
  return (
      <GlobalContext.Provider value={globalState}>{children}</GlobalContext.Provider>
  )
}

export default GlobalProvider