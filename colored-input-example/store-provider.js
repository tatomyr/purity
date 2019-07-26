import { createStore } from '/factory.js'

const initialState = {
  color: 'black',
}

export const stateHandler = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'CHANGE_COLOR':
      return { color: action.color }
    case 'INIT':
      return state
    default:
      return null
  }
}

export const { mount, connect, dispatch } = createStore(stateHandler)

window.dispatch = dispatch
