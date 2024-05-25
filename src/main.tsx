import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import './index.css'
import { AuthProvider } from "react-auth-kit";
import { HashRouter} from "react-router-dom";

import './demos/ipc'
// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider
      authType={"cookie"}
      authName={"_auth"}
      cookieDomain="druglane_home.com"
      cookieSecure={false}
    >
      <HashRouter> <App />
    </HashRouter>
  </AuthProvider>
  </React.StrictMode>,
)

postMessage({ payload: 'removeLoading' }, '*')
