export type Predicate<T> = (x: T) => boolean

export type PartitionTuple<T> = [T[], T[]]

export const partition =
	<T>(isValid: Predicate<T>) =>
	(array: T[]): PartitionTuple<T> =>
		array.reduce(
			([pass, fail], item) =>
				isValid(item) ? [[...pass, item], fail] : [pass, [...fail, item]],
			[[], []] as PartitionTuple<T>
		)
