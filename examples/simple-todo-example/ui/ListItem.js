import { render } from '/core.js'
import { dispatch } from '../store/provider.js'

export const ListItem = ({ id, text, checked }) => render`
  <li id="${id}" class="${checked ? 'checked' : ''}" title="${id}">
    <input
      type="checkbox"
      ${checked ? 'checked' : ''}
      ::change=${e => {
        dispatch({ type: 'TOGGLE_ITEM', id, checked: e.target.checked })
      }}
    />
    <span>${text}</span>
    <button
      type="button"
      ::click=${() => {
        dispatch({ type: 'DELETE_ITEM', id })
      }}
    >
      x
    </button>
  </li>
`
