import { createStore } from '../../../core.js'
import { stateHandler } from './state-handler.js'
import { asyncWatcher } from './async-handler.js'

export const { mount, connect, dispatch, rerender, getState } = createStore(
  stateHandler,
  asyncWatcher
)

window.getState = getState
