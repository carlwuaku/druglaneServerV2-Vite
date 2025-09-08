import createStore from 'react-auth-kit/createStore';

export const store = createStore({
    authName: 'druglane_auth_token',
    authType: 'localstorage',
})