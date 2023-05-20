import {ls} from '../../../index.js'
import type {BaseTask} from '../app.js'

export type JSONValue =
	| string
	| number
	| boolean
	| null
	| JSONValue[]
	| {[key: string]: JSONValue}

export const {put, get} = ls<{tasks: BaseTask[]}>('purity-todo')

const migrate = () => {
	// Migrate 2.9 -> 2.10
	if (!localStorage['purity-todo'] && localStorage.tasks) {
		console.warn('Migrating to v2.10')

		const retrieveJSON = <D extends JSONValue>(obj: {[key: string]: D}): D => {
			const [[key, defaultValue]] = Object.entries(obj)
			try {
				return (
					JSON.parse(window.localStorage.getItem(key) as string) || defaultValue
				)
			} catch (err) {
				return defaultValue
			}
		}

		console.warn('Previous:', localStorage.tasks)

		const tasks = retrieveJSON({tasks: []})
		put({tasks})
		localStorage.removeItem('tasks')
	}
}

migrate()
