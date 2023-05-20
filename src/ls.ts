export const ls = <D extends Record<string, unknown>>(key: string) => {
	const get = <P extends Partial<D>>(defaultData: P = {} as P): D | P => {
		try {
			const dataFromStorage: D =
				JSON.parse(localStorage.getItem(key) as string) || {}
			return {...defaultData, ...dataFromStorage}
		} catch (err) {
			return defaultData
		}
	}

	const put = async <P extends Partial<D>>(data: P): Promise<void> => {
		localStorage.setItem(key, JSON.stringify({...get(), ...data}))
	}

	const drop = (): void => {
		localStorage.removeItem(key)
	}

	return {
		get,
		put,
		drop,
	}
}
