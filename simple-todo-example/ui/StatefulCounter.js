import { htmx } from '/htmx.js'
import { useState } from './useState.js'

export const StatefulCounter = ({ id }) => {
  let [count, setCount] = useState(0)
  const handleClick = e => {
    const {
      target: {
        dataset: { counter },
      },
    } = e
    setCount({ inc: count + 1, dec: count - 1, reset: 0 }[counter])
  }

  return htmx({})`
    <div id="${id}">
      <pre id="${id}-count">${count}</pre>

      <button
        id="${id}-inc-button"
        data-counter="inc"
        ::click=${handleClick}
      >
        Increment
      </button>
      <button
        id="${id}-dec-button"
        data-counter="dec"
        ::click=${handleClick}
      >
        Decrement
      </button>
      <button
        id="${id}-reset-button"
        data-counter="reset"
        ::click=${handleClick}
      >
        Reset
      </button>
    </div>
  `
}
