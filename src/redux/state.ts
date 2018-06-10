import { IVaultDBEntry } from "vaultage-client";

export type Screen = 'login' | 'app';

export function initialState() {
    return {
        currentScreen: 'login' as Screen,
        loginLoading: false,
        error: undefined as string | undefined,
        vault: {
            searchQuery: '',
            entries: [] as IVaultDBEntry[],
            selectedEntry: null as IVaultDBEntry | null
        },
        creds: {
            username: '',
            password: '',
            host: '',
            httpUser: '',
            httpPassword: ''
        },
    };
};

export type State = ReturnType<typeof initialState>;
