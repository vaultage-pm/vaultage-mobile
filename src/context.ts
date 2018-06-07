import { VaultService } from './services/VaultService';
import { State } from "./redux/state";
import { Store } from 'redux';
import { AppActions } from "./redux/actions";

export class Context {

    public readonly vaultService: VaultService;

    constructor(public readonly store: Store<State, AppActions>) {
        this.vaultService = new VaultService(store);
    }

    dispatch(action: AppActions): void {
        this.store.dispatch(action);
    }
}

let ctx: Context | null = null;

export function getContext(): Context {
    if (ctx === null) {
        throw new Error('Context is not initialized');
    }
    return ctx;
}

export function initContext(store: Store<State, AppActions>) {
    if (ctx !== null) {
        throw new Error('Context is already initialized');
    }
    ctx = new Context(store);
}