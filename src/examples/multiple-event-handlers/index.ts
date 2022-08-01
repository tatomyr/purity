import {init, render} from '../../purity.js'

const {mount, getState, setState} = init({text: ''})

const App = () => render`
  <div id="root">
    <input
      type="text"
      ::keyup=${e => {
        setState(() => ({text: e.target.value}))
      }}
      ::click=${() => {
        setState(() => ({text: ''}))
      }}
    />
    <div id="text">${getState().text}</div>
  </div>
`

mount(App)
