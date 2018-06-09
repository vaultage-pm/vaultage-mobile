import { IVaultDBEntry } from "vaultage-client";
import { tsMap } from "./typesafe-immutable";

export type Screen = 'login' | 'app';

export function initialState() {
    return tsMap({
        currentScreen: 'login' as Screen,
        loginLoading: false,
        error: undefined as string | undefined,
        vault: tsMap({
            searchQuery: '',
            entries: [] as IVaultDBEntry[]
        }),
        creds: tsMap({
            username: '',
            password: '',
            host: '',
            httpUser: '',
            httpPassword: ''
        })
    });
};

export type State = ReturnType<typeof initialState>;
