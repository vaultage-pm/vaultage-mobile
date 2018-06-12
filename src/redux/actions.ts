import { IVaultDBEntry, IVaultDBEntryAttrs } from "vaultage-client";


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

export function vaultChangeAction() {
    return baseAction('vaultChange', null);
}

export function updateCredentialsAction(creds: Credentials) {
    return baseAction('updateCreds', creds);
}

export function selectVaultEntryAction(entry: IVaultDBEntry) {
    return baseAction('selectEntry', entry);
}

export function beginEntryEditAction(entry: IVaultDBEntryAttrs & { id: string | null}) {
    return baseAction('beginEdit', entry);
}

export function updatePendingEntryAction(entry: Partial<IVaultDBEntryAttrs>) {
    return baseAction('updatePending', entry);
}

export function entrySavedAction(entry: IVaultDBEntry) {
    return baseAction('entrySaved', entry);
}

/**
 * Join here all possible actions
 */
export type AppActions =
        ReturnType<typeof loginStartAction> |
        ReturnType<typeof entrySavedAction> |
        ReturnType<typeof updatePendingEntryAction> |
        ReturnType<typeof beginEntryEditAction> |
        ReturnType<typeof loginSuccessAction> |
        ReturnType<typeof loginFailureAction> |
        ReturnType<typeof logOutAction> |
        ReturnType<typeof vaultChangeAction> |
        ReturnType<typeof updateCredentialsAction> |
        ReturnType<typeof selectVaultEntryAction>;
