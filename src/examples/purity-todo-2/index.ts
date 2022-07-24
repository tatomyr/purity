import {mount} from './app.js'
import {App} from './components/App.js'
import {getJSON, saveJSON} from './services/storage.js'
import {groomTasks, useTasks} from './services/tasks.js'

mount(App)

if (
  'serviceWorker' in navigator &&
  window.location.hostname !== 'localhost' &&
  window.location.protocol !== 'http:'
) {
  navigator.serviceWorker.register('./service-worker.js')
}

window.onbeforeunload = e => {
  // Works only for `delay(0)`
  // FIXME: Doesn't work on close on mobile. Try to fix during refactoring to use explicit state for operating the tasks
  if (useTasks.getCached().data?.some(({tmpFlag}) => tmpFlag)) {
    getJSON({tasks: []})
      .then(groomTasks)
      .then(tasks => saveJSON({tasks: tasks}))
  }
}
