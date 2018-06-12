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
                creds: { ...state.creds,
                    password: '' // Reset the password field upon successful login
                }
            };
        case 'loginFailure':
            return { ...state, 'loginLoading': false};
        case 'logout':
            return { ...state, vault: {
                searchQuery: '',
                version: 0,
                selectedEntry: null
            }};
        case 'vaultChange':
            return { ...state,
                    vault: {...state.vault,
                        version: state.vault.version + 1
                }
            };
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
        case 'beginEdit':
            return {...state,
                pendingEntry: action.payload
            };
        case 'updatePending':
            return {...state,
                pendingEntry: {
                    ...state.pendingEntry,
                    ...action.payload
                }
            };
        case 'entrySaved':
            return {...state,
                pendingEntry: {
                    id: null,
                    login: '',
                    password: '',
                    title: '',
                    url: ''
                },
                vault: {...state.vault,
                    selectedEntry: action.payload
                }
            };
    }
}
