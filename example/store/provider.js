import { createStore } from '/factory.js'
import { stateHandler } from './state-handler.js'

export const { mount, connect, dispatch, getState } = createStore(stateHandler)

window.dispatch = dispatch
window.getState = getState
