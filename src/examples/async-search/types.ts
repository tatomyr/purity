export type Item = {
	id: number
	name: string
}

export type AppState = {
	input: string
	items: Item[]
	isLoading: boolean
	error: string
	chosenItems: Item[]
}
