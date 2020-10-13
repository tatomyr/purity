import { AppState } from './types.js';
export declare const mount: (f: import("../../src/purity.js").Component) => void, getState: () => AppState, setState: (callback: (state: AppState) => Partial<AppState>) => void;
