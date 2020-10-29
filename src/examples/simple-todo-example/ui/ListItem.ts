import {render} from '../../../purity.js'
import {setState} from '../app.js'
import {Item} from '../types.js'

export const ListItem = ({id, text, checked}: Item) => render`
  <li id="${id}" class="${checked ? 'checked' : ''}" title="${id}">
    <input
      type="checkbox"
      ${checked ? 'checked' : ''}
      ::change=${e => {
        setState(({items}) => ({
          items: items.map(item =>
            item.id === id ? {...item, checked: !item.checked} : item
          ),
        }))
      }}
    />
    <span>${text}</span>
    <button
      type="button"
      ::click=${() => {
        setState(({items}) => ({
          items: items.filter(item => item.id !== id),
        }))
      }}
    >
      x
    </button>
  </li>
`
