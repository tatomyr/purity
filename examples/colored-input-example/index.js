import { createStore, render } from '/core.js'

const stateHandler = (state = { color: 'black' }, action = {}) => {
  switch (action.type) {
    case 'CHANGE_COLOR':
      return { color: action.color }
    case 'INIT':
      return state
    default:
      return undefined
  }
}

const { mount, connect, dispatch } = createStore(stateHandler)

const Root = connect(
  ({ color }) => render`
    <div id="root">
      <input
        id="color"
        style="color: ${color};"
        ::keyup=${e => {
          dispatch({ type: 'CHANGE_COLOR', color: e.target.value })
        }}
      />
    </div>
  `
)

mount(Root)
