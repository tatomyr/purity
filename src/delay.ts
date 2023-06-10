export const delay = (t = 0): PromiseLike<number> =>
	({
		then: (resolve: typeof Promise.resolve) => {
			const timeout = setTimeout(() => resolve(timeout), t)
		},
	} as PromiseLike<number>)
