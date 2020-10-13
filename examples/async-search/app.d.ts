import { AppState } from './types.js';
export declare const mount: (f: <P>(props?: P | undefined, ...rest: any[]) => string) => void, getState: () => AppState, setState: (callback: (state: AppState) => Partial<AppState>) => void;
