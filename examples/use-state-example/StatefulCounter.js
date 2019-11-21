import { htmx } from '/htmx.js'
import { useState } from './useState.js'
import { Button } from './Button.js'

export const StatefulCounter = ({ id }) => {
  let [count, setCount] = useState(id)(0)
  const handleClick = e => {
    const {
      target: {
        dataset: { counter },
      },
    } = e
    setCount({ inc: count + 1, dec: count - 1, reset: 0 }[counter])
  }

  return htmx({ Button })`
    <div id="${id}">
      <pre id="${id}-count">${count}</pre>
      <Button parentId=${id} action=${'inc'} caption=${'Increment'} handleClick=${handleClick} />
      <Button parentId=${id} action=${'dec'} caption=${'Decrement'} handleClick=${handleClick} />
      <Button parentId=${id} action=${'reset'} caption=${'Reset'} handleClick=${handleClick} />
    </div>
  `
}
