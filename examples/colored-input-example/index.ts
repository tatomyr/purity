import { init, render } from '../../core.js'

const { mount, getState, setState } = init({
  color: 'black',
})

const handleInput = (e: Event) => {
  setState(() => ({ color: (e.target as HTMLInputElement).value }))
}

const Root = () => render`
  <div id="root">
    <input
      id="color"
      style="color: ${getState().color};"
      ::input=${handleInput}
    />
  </div>
`

mount(Root)
