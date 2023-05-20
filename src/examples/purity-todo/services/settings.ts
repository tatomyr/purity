import {setState, state} from '../app.js'
import {handleError} from './error.js'
import {put} from './storage.js'
import {groomTasks} from './tasks.js'
import {download, textFileReader} from './text-file-manager.js'
import type {BaseTask} from '../app.js'
import type {EventHandler} from '../../../purity.js'

export const downloadUserData = async (): Promise<void> => {
	try {
		const fileName = `TODO-${new Date()
			.toDateString()
			.replace(/[ /]/g, '-')}.backup.json`
		download(fileName, JSON.stringify(groomTasks(state.tasks)))
		window.alert('Downloading your backup file')
		closeSettings()
	} catch (err) {
		handleError(err)
	}
}

export const uploadUserData: EventHandler = async ({target: {files}}) => {
	const [file] = files!
	try {
		const text = await textFileReader(file)
		const tasks: BaseTask[] = JSON.parse(text)
		if (
			window.confirm(
				`Are you sure you want to replace current todo list in your storage (${state.tasks.length} items) with new one (${tasks.length} items)?`
			)
		) {
			setState(() => ({tasks}))
			put({tasks})
			closeSettings()
		}
	} catch (err) {
		handleError(err)
	}
}

export const closeSettings = (): void =>
	setState(() => ({isSettingsModalOpen: false}))

export const openSettings = (): void =>
	setState(() => ({isSettingsModalOpen: true}))
