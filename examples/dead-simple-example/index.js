import { mount, connect } from './store-provider.js'

const App = connect(
  ({ count }) => `
    <div id="root">
      <h1>Counter</h1>
      <div id="count">${count}</div>
      <button id="inc" onclick="dispatch({ type: 'INCREMENT' })">⊕</button>
      <button id="dec" onclick="dispatch({ type: 'DECREMENT' })">⊖</button>
      <button id="reset" onclick="dispatch({ type: 'RESET' })">⊗</button>
    </div>
  `
)

mount(App)
