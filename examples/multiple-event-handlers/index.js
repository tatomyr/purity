import { createStore, render } from '../../core.js'

const stateHandler = (state = { text: '' }, action) => {
  switch (action.type) {
    case 'CHANGE_TEXT':
      return { text: action.text }
    case 'CLEAR_TEXT':
      return { text: '' }
    case 'INIT':
      return state
    default:
      return {}
  }
}

const { mount, dispatch, getState } = createStore(stateHandler)

const App = () => render`
  <div id="root">
    <input
      type="text"
      ::keyup=${e => {
        dispatch({ type: 'CHANGE_TEXT', text: e.target.value })
      }}
      ::click=${e => {
        dispatch({ type: 'CLEAR_TEXT' })
      }}
    />
    <div id="text">${getState().text}</div>
  </div>
`

mount(App)
