import {render} from '../../../core.js'
import {getState, setState} from '../app.js'
import {idIsNotEqual} from '../helpers.js'
import {Item} from '../types.js'

const Item = ({name, id}: Item) => render`
  <li
    ::click=${() => {
      setState(({chosenItems}) => ({
        chosenItems: chosenItems.filter(idIsNotEqual(id)),
      }))
    }}
  >
    ${name}
  </li>
`

export const ChosenItems = () => render`
  <ul id="chosen-items" class="chosen-items">
    ${getState().chosenItems.map(Item)}
  </ul>
`
