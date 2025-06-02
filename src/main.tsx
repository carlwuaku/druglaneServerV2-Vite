import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import './index.css'
import { HashRouter } from "react-router-dom";
import { GlobalProvider } from './global/globalProvider';
import AuthProvider from 'react-auth-kit';
import { store } from './config/authStore';
// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider store={store}>
      <HashRouter>
        <GlobalProvider>
          <div className="app-container">
            <App />
          </div>
        </GlobalProvider>
      </HashRouter>
    </AuthProvider>
  </React.StrictMode>,
)

postMessage({ payload: 'removeLoading' }, '*')
