export const handleError = (err: unknown): void => {
	console.error(err)
	window.alert((err as Error)?.message || err)
}
