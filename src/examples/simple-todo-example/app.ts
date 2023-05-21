import {init} from "../../index.js"

export type Item = {
	id: string
	text: string
	checked: boolean
}

export type AppState = {
	items: Item[]
	input: string
}

export const {mount, rerender, getState, setState} = init<AppState>({
	items: [],
	input: "",
})
