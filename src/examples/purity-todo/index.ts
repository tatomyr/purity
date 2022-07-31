import {mount} from './app.js'
import {App} from './components/App.js'
import {dev} from './dev.js'

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
    .catch(err => {
      console.info(
        '[purity-todo.sw.js] Service worker registration failed, error:',
        err
      )
    })
}
