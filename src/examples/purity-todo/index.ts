import {mount} from './app.js'
import {App} from './components/App.js'
import {dev} from './dev.js'
import {getJSON, saveJSON} from './services/storage.js'
import {groomTasks} from './services/tasks.js'

mount(App)

if ('serviceWorker' in navigator && !dev) {
  navigator.serviceWorker
    .register('./purity-todo.sw.js')
    .then(registration => {
      console.info(
        '[purity-todo.sw.js] Registration successful, scope is:',
        registration.scope
      )
    })
    .catch(error => {
      console.info(
        '[purity-todo.sw.js] Service worker registration failed, error:',
        error
      )
    })
}

window.onbeforeunload = e => {
  // Works only for `delay(0)`
  // FIXME: Doesn't work on close on mobile. Try to fix during refactoring to use explicit state for operating the tasks
  getJSON({tasks: []})
    .then(groomTasks)
    .then(tasks => saveJSON({tasks: tasks}))
}
