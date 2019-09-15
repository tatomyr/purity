import { List } from './List.js'
import { InputForm } from './InputForm.js'
import { StatefulCounter } from './StatefulCounter.js'
import { Spinner } from './Spinner.js'

export const App = () => `
  <div id="root">
    <nav>
      <a href="#" onclick="setTimeout(() => rerender())">Items List</a>
      <a href="#counter" onclick="setTimeout(() => rerender())">Stateful Counter</a>
    </nav>
    ${window.location.hash === '' ? List() + InputForm() : ''}
    ${
      window.location.hash === '#counter'
        ? StatefulCounter({ id: 'counter' })
        : ''
    }
    ${Spinner()}
  </div>
`
