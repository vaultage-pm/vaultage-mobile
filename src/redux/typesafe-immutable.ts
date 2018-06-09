import { Map } from 'immutable';

interface TSMap<K> {
    get<T extends keyof K>(t: T): K[T];

    set<V>(t: string, v: V): TSMap<K & { t: V }>;

    toJS(): K;
}

export type Map = <K>(obj: K) => TSMap<K>;

export function tsMap<K>(obj: K): TSMap<K> {
    return Map(obj) as any as TSMap<K>;
}