import {setState, Task} from '../app.js'
import {getJSON, saveJSON} from './storage.js'
import {download, textFileReader} from './text-file-manager.js'

export const downloadUserData = async (): Promise<void> => {
  try {
    const tasks = await getJSON({tasks: [] as Task[]})
    const fileName = `todo-${new Date()
      .toDateString()
      .replace(/[ /]/g, '-')}.backup.json`
    download(fileName, JSON.stringify(tasks))
    window.alert('Downloading your backup file')
  } catch (err) {
    console.error(err)
    window.alert((err as Error).message)
  }
}

export const uploadUserData = async (file: File): Promise<void> => {
  const existingTasks = await getJSON({tasks: [] as Task[]})
  try {
    const text = await textFileReader(file)
    const tasks = JSON.parse(text)
    if (
      window.confirm(
        `Are you sure you want to replace current todo list in your storage (${existingTasks.length} items) with new one (${tasks.length} items)?`
      )
    ) {
      saveJSON({tasks})
      closeSettings()
    }
  } catch (err) {
    console.error(err)
    window.alert((err as Error).message)
  }
}

export const closeSettings = (): void =>
  setState(() => ({isSettingsModalOpen: false}))

export const openSettings = (): void =>
  setState(() => ({isSettingsModalOpen: true}))
