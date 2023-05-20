export type Callback<P extends unknown[]> = (...args: P) => void

/**
 * Debounce
 *
 * @param {callback} callback function to be executed
 * @param {number} wait interval between calls
 *         positive for triggering the callback on the trailing edge
 *         negative for triggering the callback on the leading edge
 */

export const debounce = <P extends unknown[]>(
	callback: Callback<P>,
	wait = 100
): Callback<P> => {
	let timeout: number | undefined

	return (...args) => {
		if (timeout) {
			clearTimeout(timeout)
		} else if (wait < 0) {
			callback(...args)
		}

		timeout = setTimeout(() => {
			if (wait > 0) callback(...args)
			timeout = undefined
		}, Math.abs(wait))
	}
}
