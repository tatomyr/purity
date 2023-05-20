// FIXME: types
type Fn = (x: any) => any

export type Pipe = (...funcs: Fn[]) => Fn

export const pipe: Pipe =
	(f, ...rest) =>
	x =>
		rest.length === 0 ? f(x) : pipe(...rest)(f(x))
