import React, { createContext } from 'react';
import { GlobalState } from '../models/globalState';

const GlobalContext = createContext<GlobalState>({
    serverUrl: "",
    serverState: "",
    settings: null,
    dbState: ""
});

export default GlobalContext;