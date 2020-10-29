import {render} from '../../purity.js'
import {useState} from './useState.js'
import {Button, Actions} from './Button.js'

export type StatefulCounterProps = {id: string}

export const StatefulCounter = ({id}: StatefulCounterProps) => {
  let count = useState(id)(0)
  const handleClick: EventHandlerNonNull = e => {
    const {counter} = (e.target as HTMLButtonElement).dataset
    count.set(
      {inc: count.get() + 1, dec: count.get() - 1, reset: 0}[counter as Actions]
    )
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
