declare type Fn = (x: any) => any;
export declare type Pipe = (...funcs: Fn[]) => Fn;
export declare const pipe: Pipe;
export {};
