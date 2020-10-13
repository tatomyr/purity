import {render} from '../../../core.js'
import {idEquals} from '../helpers.js'
import {getState, setState} from '../app.js'
import {Item} from '../types.js'

const Item = ({name, id}: Item) => render`
  <li
    ::click=${() => {
      setState(({items, chosenItems}) => ({
        chosenItems: [
          ...chosenItems,
          !chosenItems.some(idEquals(id)) && items.find(idEquals(id)),
        ].filter(Boolean) as Item[],
      }))
    }}
  >
    ${name}
  </li>
`

export const SuggestionsList = () => render`
  <ul id="list">
    ${getState().items.map(Item)}
  </ul>
`
