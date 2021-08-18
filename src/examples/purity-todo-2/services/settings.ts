import {setState} from '../app.js'
import {saveJSON} from './storage.js'
import {useTasks} from './tasks.js'
import {download, textFileReader} from './text-file-manager.js'

export const downloadUserData = async (): Promise<void> => {
  try {
    const {unwrap, fire} = useTasks()
    const tasks = await unwrap()
    const fileName = `TODO-backup-${new Date()
      .toDateString()
      .replace(/[ /]/g, '_')}.json`
    download(fileName, JSON.stringify(tasks))
    window.alert('Downloading your backup file')
  } catch (err) {
    window.alert(err.message)
  }
}

export const uploadUserData = async (file: File): Promise<void> => {
  const {unwrap, fire} = useTasks()
  const existingTasks = await unwrap()
  try {
    const text = await textFileReader(file)
    const tasks = JSON.parse(text)
    if (
      window.confirm(
        `Are you sure you want to replace current todo list in your storage (${existingTasks.length} items) with new one (${tasks.length} items)?`
      )
    ) {
      saveJSON({tasks})
      fire()
      setState(() => ({settingsModal: ''}))
    }
  } catch (err) {
    window.alert(err.message)
  }
}
