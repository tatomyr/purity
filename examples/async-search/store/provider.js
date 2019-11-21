import { createStore } from '/factory.js'
import { stateHandler } from './state-handler.js'
import { asyncWatcher } from './async-handler.js'

export const { mount, connect, dispatch } = createStore(
  stateHandler,
  asyncWatcher
)
