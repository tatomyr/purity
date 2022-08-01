import {render} from '../../index.js'
import {useState} from './useState.js'
import {Button, Actions} from './Button.js'
import type {EventHandler} from '../../purity.js'

export type StatefulCounterProps = {id: string}

export const StatefulCounter = ({id}: StatefulCounterProps): string => {
  const count = useState(id)(0)
  const handleClick: EventHandler = e => {
    const {counter} = e.target.dataset as {counter: Actions}
    count.set({inc: count.get() + 1, dec: count.get() - 1, reset: 0}[counter])
  }

  return render`
    <div id="${id}">
      <pre id="${id}-count">${count.get()}</pre>
      ${Button({action: 'inc', caption: 'Increment', handleClick})}
      ${Button({action: 'dec', caption: 'Decrement', handleClick})}
      ${Button({action: 'reset', caption: 'Reset', handleClick})}
    </div>
  `
}
