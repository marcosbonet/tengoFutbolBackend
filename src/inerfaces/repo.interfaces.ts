export type id = string;

export interface PlayerRepoTypes<T> {
    get: () => Promise<Array<T>>;
    getOne: (id: id) => Promise<T>;
    query: (data: { [key: string]: string }) => Promise<T>;
    update: (id: id, data: Partial<T>) => Promise<T>;
    create: (data: Partial<T>) => Promise<T>;
    delete: (id: id) => Promise<id>;
}

export interface MatchRepoTypes<T> {
    get: () => Promise<Array<T>>;
    getOne: (id: id) => Promise<T>;
    update: (id: id, data: Partial<T>) => Promise<T>;
    query: (data: { [key: string]: string }) => Promise<T>;
    create: (data: Partial<T>) => Promise<T>;
    delete: (id: id) => Promise<id>;
}
