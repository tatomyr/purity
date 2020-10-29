export declare type Item = {
    id: string;
    text: string;
    checked: false;
    justAdded?: boolean;
};
export declare type AppState = {
    items: Item[];
    input: string;
    spinner: boolean;
};
export declare const mount: (f: import("../../purity.js").Component) => void, rerender: () => void, getState: () => AppState, setState: (callback: (state: AppState) => Partial<AppState>) => void;
