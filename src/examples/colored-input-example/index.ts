import {init, render} from '../../index.js'
import type {EventHandler} from '../../purity.js'

const {mount, getState, setState} = init({
  color: 'black',
})

const handleInput: EventHandler = e => {
  setState(() => ({color: e.target.value}))
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
