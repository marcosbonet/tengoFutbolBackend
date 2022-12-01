export type id = string;

export interface PlayerRepoTypes<T> {
    get: () => Promise<Array<T>>;
    query: (data: any) => Promise<T>;
    create: (data: Partial<T>) => Promise<T>;
    delete: (id: id) => Promise<void>;
    update: (id: id, data: Partial<T>) => Promise<T>;
    getOne: (id: id) => Promise<T>;
}

export interface MatchRepoTypes<T> {
    get: () => Promise<Array<T>>;
    patch: (id: id, data: Partial<T>) => Promise<T>;
    create: (data: Partial<T>) => Promise<T>;
    update: (id: id, data: Partial<T>) => Promise<T>;
    getOne: (id: id) => Promise<T>;
    delete: (id: id) => Promise<void>;
    query: (data: any) => Promise<T>;
}
