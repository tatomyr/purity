import { render } from '/core.js'
import { mount, connect, dispatch } from './store-provider.js'

const Root = connect(
  ({ count }) => render`
    <div id="root">
      <h1>Counter</h1>
      <div id="count">${count}</div>
      <button
        id="inc"
        ::click=${e => {
          dispatch({ type: 'INCREMENT' })
        }}
      >
        ⊕
      </button>
      <button
        id="dec"
        ::click=${e => {
          dispatch({ type: 'DECREMENT' })
        }}
      >
        ⊖
      </button>
      <button id="reset" ::click=${e => {
        dispatch({ type: 'RESET' })
      }}>
        ⊗
      </button>
    </div>
  `
)

mount(Root)
