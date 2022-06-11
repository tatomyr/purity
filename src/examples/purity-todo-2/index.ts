import {mount} from './app.js'
import {App} from './components/App.js'

mount(App)

if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
  navigator.serviceWorker.register('./service-worker.js')
}
