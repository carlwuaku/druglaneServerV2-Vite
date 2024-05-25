import React, { createContext } from 'react';
import { GlobalState } from '../models/globalState';

const GlobalContext = createContext<GlobalState>({
    serverUrl: "",
    companyName: "",
    setServerUrl: () =>{},
    setCompanyName: () => {}
});

export default GlobalContext;