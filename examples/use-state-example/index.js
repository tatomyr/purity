import { createStore } from '/factory.js'
import { App } from './App.js'

export const { mount, rerender } = createStore(() => ({}))

mount(App)
