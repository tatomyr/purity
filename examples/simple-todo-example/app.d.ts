export declare type Item = {
    id: string;
    text: string;
    checked: boolean;
};
export declare type AppState = {
    items: Item[];
    input: string;
};
export declare const mount: (f: <P>(props?: P | undefined, ...rest: any[]) => string) => void, rerender: () => void, getState: () => AppState, setState: (callback: (state: AppState) => Partial<AppState>) => void;
