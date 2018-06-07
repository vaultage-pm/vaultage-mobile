import { AppActions } from './actions';
import { State } from './state';

export function reducer(state: State, action: AppActions): State {
    if (action.type.startsWith('@@')) {
        return state;
    }
    switch (action.type) {
        case 'loginStart':
            return { ...state, loginLoading: true, error: undefined };
        case 'loginSuccess':
            return { ...state, loginLoading: false, currentScreen: 'app'};
        case 'loginFailure':
            return { ...state, loginLoading: false, error: action.payload.error };
        case 'logout':
            return { ...state, currentScreen: 'login' };
        case 'updateVault':
            return { ...state, vault: action.payload };
        case 'updateCreds':
            return { ...state, creds: {
                host: action.payload.host !== undefined ? action.payload.host : state.creds.host,
                httpPassword: action.payload.httpPassword !== undefined ? action.payload.httpPassword : state.creds.httpPassword,
                httpUser: action.payload.httpUser !== undefined ? action.payload.httpUser : state.creds.httpUser,
                password: action.payload.password !== undefined ? action.payload.password : state.creds.password,
                username: action.payload.username !== undefined ? action.payload.username : state.creds.username,
            }};
    }
}
