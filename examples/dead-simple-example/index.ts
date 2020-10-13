import {render, init} from '../../src/purity.js'

const {mount, getState, setState} = init({
  count: 0,
})

const increment = () => setState(({count}) => ({count: count + 1}))

const decrement = () => setState(({count}) => ({count: count - 1}))

const reset = () => setState(() => ({count: 0}))

const Root = () => render`
  <div id="root">
    <h1>Counter</h1>
    <div id="count">${getState().count}</div>
    <button id="inc" ::click=${increment}>⊕</button>
    <button id="dec" ::click=${decrement}>⊖</button>
    <button id="reset" ::click=${reset}>
      ⊗
    </button>
  </div>
`

mount(Root)
