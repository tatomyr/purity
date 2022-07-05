import {getJSON, saveJSON} from './storage.js'
import {groomTasks} from './tasks.js'

export const startup = (): void => {
  window.onbeforeunload = e => {
    getJSON({tasks: []})
      .then(groomTasks)
      .then(tasks => saveJSON({tasks: tasks}))
  }
}
