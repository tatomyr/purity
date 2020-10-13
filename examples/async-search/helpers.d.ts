import { Item } from './types.js';
export declare const fakeEndpoint: (request: string) => Promise<Item[]>;
export declare const idEquals: (externalId: number) => ({ id }: Item) => boolean;
export declare const idIsNotEqual: (externalId: number) => ({ id }: Item) => boolean;
