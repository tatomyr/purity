import { render } from '/core.js'
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
  const buttonProps = {
    parentId: id,
    handleClick,
  }

  return render`
    <div id="${id}">
      <pre id="${id}-count">${count}</pre>
      ${Button({ ...buttonProps, action: 'inc', caption: 'Increment' })}
      ${Button({ ...buttonProps, action: 'dec', caption: 'Decrement' })}
      ${Button({ ...buttonProps, action: 'reset', caption: 'Reset' })}
    </div>
  `
}
