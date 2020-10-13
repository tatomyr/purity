/// <reference types="node" />
export declare const delay: (t: number) => {
    then: (resolve: {
        <T>(value: T | PromiseLike<T>): Promise<T>;
        (): Promise<void>;
    }) => NodeJS.Timeout;
};
