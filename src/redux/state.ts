import { IVaultDBEntry } from "vaultage-client";

export function initialState() {
    return {
        loginLoading: false,
        error: undefined as string | undefined,
        vault: {
            searchQuery: '',
            version: 0,
            selectedEntry: null as IVaultDBEntry | null
        },
        /**
         * The temporary entry which is being edited.
         */
        pendingEntry: {
            id: '' as string | null,
            title: '',
            password: '',
            login: '',
            url: ''
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
