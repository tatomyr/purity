import { init, render } from '../../core.js'

const { mount, getState, setState } = init({ text: '' })

const App = () => render`
  <div id="root">
    <input
      type="text"
      ::keyup=${e => {
        setState(() => ({ text: (e.target as HTMLInputElement).value }))
      }}
      ::click=${e => {
        setState(() => ({ text: '' }))
      }}
    />
    <div id="text">${getState().text}</div>
  </div>
`

mount(App)
