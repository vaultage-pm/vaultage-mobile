import { IVaultDBEntry } from "vaultage-client";


interface Credentials {
    username?: string;
    host?: string;
    password?: string;
    httpUser?: string;
    httpPassword?: string;
}

export function baseAction<T extends string, PAYLOAD>(type: T, payload: PAYLOAD) {
    return {
        type,
        payload
    };
}

export function loginStartAction() {
    return baseAction('loginStart', null);
}

export function loginSuccessAction() {
    return baseAction('loginSuccess', null);
}

export function loginFailureAction(err: string) {
    return baseAction('loginFailure', { error: err });
}

export function logOutAction() {
    return baseAction('logout', null);
}

export function updateVaultAction(searchQuery: string, entries: IVaultDBEntry[]) {
    return baseAction('updateVaultEntries', {searchQuery, entries});
}

export function updateCredentialsAction(creds: Credentials) {
    return baseAction('updateCreds', creds);
}

export function selectVaultEntryAction(entry: IVaultDBEntry) {
    return baseAction('selectEntry', entry);
}

/**
 * Join here all possible actions
 */
export type AppActions =
        ReturnType<typeof loginStartAction> |
        ReturnType<typeof loginSuccessAction> |
        ReturnType<typeof loginFailureAction> |
        ReturnType<typeof logOutAction> |
        ReturnType<typeof updateVaultAction> |
        ReturnType<typeof updateCredentialsAction> |
        ReturnType<typeof selectVaultEntryAction>;
