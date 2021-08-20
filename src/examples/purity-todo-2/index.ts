import {mount} from './app.js'
import {App} from './components/App.js'

mount(App)

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
}
