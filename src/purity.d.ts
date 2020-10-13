declare type Allowed = string | number;
declare type Rejected = undefined | null | false;
declare type Simple = Allowed | Rejected;
declare type Argument = Simple | string[];
export declare type Component = <P>(props?: P, ...rest: any[]) => string;
export declare type App<State> = {
    mount: (f: Component) => void;
    rerender: () => void;
    getState: () => State;
    setState(callback: (state: State) => Partial<State>): void;
};
export declare const init: <State>(initialState: State) => App<State>;
export declare const render: ([first, ...strings]: TemplateStringsArray, ...args: Array<Argument | EventHandlerNonNull>) => string;
export {};
