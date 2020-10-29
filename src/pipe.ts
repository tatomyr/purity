type Fn = (x: any) => any

export type Pipe = (...funcs: Fn[]) => Fn

export const pipe: Pipe = (...funcs) => x => funcs.reduce(($, f) => f($), x)
