import {init, render} from "../../index.js"
import type {EventHandler} from "../../purity.js"

export const {mount, getState, setState} = init({
  color: "black",
})

const handleInput: EventHandler = e => {
  setState(() => ({color: e.target.value}))
}

export const root = () => render`
  <div id="root">
    <input
      id="color"
      style="color: ${getState().color};"
      ::input=${handleInput}
    />
  </div>
`
