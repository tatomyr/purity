import { createStore } from '/factory.js'

const initialState = {
  count: 0,
}

export const stateHandler = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 }
    case 'DECREMENT':
      return { count: state.count - 1 }
    case 'RESET':
      return { count: 0 }
    case 'INIT':
      return state
    default:
      return null
  }
}

export const { mount, connect, dispatch } = createStore(stateHandler)

window.dispatch = dispatch
