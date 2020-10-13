export declare type Callback = (...params: any[]) => void;
export declare const debounce: (callback: Callback, wait?: number) => (...args: any[]) => void;
