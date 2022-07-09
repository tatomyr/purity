import {mount} from './app.js'
import {App} from './components/App.js'
import {getJSON, saveJSON} from './services/storage.js'
import {groomTasks} from './services/tasks.js'

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
  getJSON({tasks: []})
    .then(groomTasks)
    .then(tasks => saveJSON({tasks: tasks}))
}
