import { Item } from './app.js';
export declare const getItems: () => Promise<Item[]>;
export declare const addItem: (text: string) => Promise<any>;
export declare const toggleItem: (id: string, checked: boolean) => Promise<any>;
export declare const deleteItem: (id: string) => Promise<any>;
