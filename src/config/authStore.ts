import createStore from 'react-auth-kit/createStore';

export const store = createStore({
    authName: '_auth',
    authType: 'cookie',
    cookieDomain: 'druglane_home.com',
    cookieSecure: window.location.protocol === 'https:',
})