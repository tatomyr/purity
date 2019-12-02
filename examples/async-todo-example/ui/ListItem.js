import { render } from '/core.js'
import { dispatch } from '../store/provider.js'

export const ListItem = ({ id, text, checked, justAdded }) => render`
  <li
    id="${id}"
    class="${checked ? 'checked' : ''} ${justAdded ? 'highlighted' : ''}"
    title="${id}"
  >
    <input
      type="checkbox"
      ${checked ? 'checked' : ''}
      ::change=${({ target: { checked } }) => {
        dispatch({ type: 'TOGGLE_ITEM', id, checked })
      }}
    />
    <span>${text}</span>
    <button
      type="button"
      ::click=${e => {
        dispatch({ type: 'DELETE_ITEM', id })
      }}
    >
      x
    </button>
  </li>
`
