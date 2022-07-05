type Fn = (x: unknown) => unknown

export type Pipe = (...funcs: Fn[]) => Fn

export const pipe: Pipe = (...funcs) => x => funcs.reduce(($, f) => f($), x)
