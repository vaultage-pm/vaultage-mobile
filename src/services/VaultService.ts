import { AsyncStorage } from 'react-native';
import { Store } from 'redux';
import * as vaultage from 'vaultage-client';

import {
    AppActions,
    logOutAction,
    vaultChangeAction,
    updateCredentialsAction,
    entrySavedAction,
} from '../redux/actions';
import { State } from '../redux/state';
import { IHttpParams, IVaultDBEntryAttrs, IVaultDBEntry } from 'vaultage-client';

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

export class VaultReadAccess {

    constructor(private getVault: () => vaultage.Vault | null) {

    }

    search(query: string): IVaultDBEntry[] {
        const v = this.getVault();
        if (v == null) {
            return [];
        }
        return v.findEntries(query).map((e) => ({...e, key: e.id }));
    }
}

export class VaultService {

    private _vault: vaultage.Vault | null = null;

    private _access: VaultReadAccess = new VaultReadAccess(() => this._vault);

    constructor(private store: Store<State, AppActions>) {
        this.restoreCredentials();
    }

    /**
     * Returns a read access to the vault.
     *
     * This method is key to adapting vaultage to redux. By forcing components to provide
     * a version number whenever they want to read the database, and by updating this version number
     * whenever the database changes, we ensure that there will be no stale reads.
     */
    access(v: number): VaultReadAccess {
        if (v != this.store.getState().vault.version) {
            console.warn('Warning: time travel is not possible in the vault');
        }
        return this._access;
    }

    login(vault: vaultage.Vault): void {
        this._vault = vault;
        this.notifyMutation();
    }

    logout(): void {
        this._vault = null;
        this.store.dispatch(logOutAction());
        this.notifyMutation();
    }


    async updateEntry(id: string, data: IVaultDBEntryAttrs) {
        const vault = this.getVault();
        const entry = vault.updateEntry(id, data);
        await vault.save();
        this.store.dispatch(entrySavedAction(entry));
        this.notifyMutation();
    }

    async addEntry(data: IVaultDBEntryAttrs) {
        const vault = this.getVault();
        const id = vault.addEntry(data);
        const entry = vault.getEntry(id);
        this.store.dispatch(entrySavedAction(entry));
        await vault.save();
        this.notifyMutation();
    }

    async refresh() {
        try {
            await this.getVault().pull();
            this.notifyMutation();
        } catch (e) {
            if ((e as vaultage.VaultageError).code == vaultage.ERROR_CODE.BAD_CREDENTIALS) {
                this.store.dispatch(logOutAction());
            }
            throw e;
        }
    }

    private notifyMutation() {
        this.store.dispatch(vaultChangeAction());
    }

    private getVault(): vaultage.Vault {
        if (this._vault === null) {
            this.store.dispatch(logOutAction());
            throw new Error('Vault not initialized')
        }
        return this._vault;
    }

    saveCredentials(creds: Credentials, httpCreds?: IHttpParams['auth']): Promise<void> {
    
        const toSave: SavedCredentials = {
            host: creds.host,
            username: creds.username,
            httpPassword: httpCreds && httpCreds.password,
            httpUser: httpCreds && httpCreds.username
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