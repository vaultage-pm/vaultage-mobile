import { AsyncStorage } from 'react-native';
import { Store } from 'redux';
import * as vaultage from 'vaultage-client';

import {
    AppActions,
    loginFailureAction,
    loginStartAction,
    loginSuccessAction,
    logOutAction,
    updateVaultAction,
    updateCredentialsAction,
} from '../redux/actions';
import { State } from '../redux/state';
import { IHttpParams } from 'vaultage-client';

export interface Credentials {
    username: string;
    password: string;
    host: string;
}

interface SavedCredentials {
    username: string;
    host: string;
    httpUser?: string;
    httpPassword?: string;
}

export class VaultService {

    private _vault: vaultage.Vault | null = null;

    constructor(private store: Store<State, AppActions>) {
        this.restoreCredentials();
    }

    async login(creds: Credentials, httpParams?: vaultage.IHttpParams) {
        this.store.dispatch(loginStartAction());

        try {
            this._vault = await vaultage.login(creds.host, creds.username, creds.password, httpParams);
            this.saveCredentials(creds, httpParams);
            this.store.dispatch(loginSuccessAction());
            this.search(this.store.getState().get('vault').get('searchQuery'));
        } catch (e) {
            this.store.dispatch(loginFailureAction(e.toString()));
        }
        
    }

    logout(): void {
        this._vault = null;
        this.store.dispatch(logOutAction());
    }

    search(query: string) {
        const entries = this.getVault().findEntries(query).map((e) => ({...e, key: e.id }));
        this.store.dispatch(updateVaultAction(query, entries));
    }

    async refresh() {
        try {
            await this.getVault().pull();
            this.search(this.store.getState().get('vault').get('searchQuery'));
        } catch (e) {
            if ((e as vaultage.VaultageError).code == vaultage.ERROR_CODE.BAD_CREDENTIALS) {
                this.store.dispatch(logOutAction());
            }
            throw e;
        }
    }

    private getVault(): vaultage.Vault {
        if (this._vault === null) {
            this.store.dispatch(logOutAction());
            throw new Error('Vault not initialized')
        }
        return this._vault;
    }

    private saveCredentials(creds: Credentials, httpParams?: IHttpParams): Promise<void> {
        const httpCreds = httpParams && httpParams.auth ?
            httpParams.auth :
            { username: undefined, password: undefined };
    
        const toSave: SavedCredentials = {
            host: creds.host,
            username: creds.username,
            httpPassword: httpCreds.password,
            httpUser: httpCreds.username
        }

        return AsyncStorage.setItem('vaultage.connection-settings', JSON.stringify(toSave));
    }

    private async restoreCredentials(): Promise<void> {
        try {
            const saved = await AsyncStorage.getItem('vaultage.connection-settings');
            const creds = JSON.parse(saved) as SavedCredentials;
            this.store.dispatch(updateCredentialsAction({
                username: creds.username,
                host: creds.host,
                httpPassword: creds.httpPassword,
                httpUser: creds.httpUser
            }));
        } catch (e) {
            // Nothing to restore
        }
    }
}