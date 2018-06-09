import { tsMap } from './typesafe-immutable';
import { AppActions } from './actions';
import { State } from './state';

export function reducer(state: State, action: AppActions): State {
    if (action.type.startsWith('@@')) {
        return state;
    }
    switch (action.type) {
        case 'loginStart':
            return state.set('loginLoading', true).set('error', undefined);
        case 'loginSuccess':
            return state.set('loginLoading', false).set('currentScreen', 'app');
        case 'loginFailure':
            return state.set('loginLoading', false).set('error', action.payload.error);
        case 'logout':
            return state.set('currentScreen', 'login');
        case 'updateVault':
            return state.set('vault', tsMap(action.payload));
        case 'updateCreds':
            const creds = state.get('creds');
            return state.set('creds', tsMap({
                host: action.payload.host !== undefined ? action.payload.host : creds.get('host'),
                httpPassword: action.payload.httpPassword !== undefined ? action.payload.httpPassword : creds.get('httpPassword'),
                httpUser: action.payload.httpUser !== undefined ? action.payload.httpUser : creds.get('httpUser'),
                password: action.payload.password !== undefined ? action.payload.password : creds.get('password'),
                username: action.payload.username !== undefined ? action.payload.username : creds.get('username'),
            }));
    }
}
