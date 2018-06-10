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
            return { ...state,
                'loginLoading': false,
                'currentScreen': 'app',
                creds: { ...state.creds,
                    password: '' // Reset the password field upon successful login
                }
            };
        case 'loginFailure':
            return { ...state, 'loginLoading': false};
        case 'logout':
            return { ...state, 'currentScreen': 'login', vault: {
                entries: [],
                searchQuery: '',
                selectedEntry: null
            }};
        case 'updateVaultEntries':
            return { ...state, 'vault': {...state.vault, ...action.payload} };
        case 'updateCreds':
            const creds = state.creds;
            return { ...state, 'creds': {
                host: action.payload.host !== undefined ? action.payload.host : creds.host,
                httpPassword: action.payload.httpPassword !== undefined ? action.payload.httpPassword : creds.httpPassword,
                httpUser: action.payload.httpUser !== undefined ? action.payload.httpUser : creds.httpUser,
                password: action.payload.password !== undefined ? action.payload.password : creds.password,
                username: action.payload.username !== undefined ? action.payload.username : creds.username,
            }};
        case 'selectEntry':
            return {...state,
                vault: {...state.vault, 
                    selectedEntry: action.payload
                }
            };
            
    }
}
