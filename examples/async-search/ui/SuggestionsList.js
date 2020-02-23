import { render } from '../../../core.js'
import { connect, dispatch } from '../store/provider.js'
import { types } from '../types.js'

const Item = ({ name, id }) => render`
  <li
    ::click=${() => {
      dispatch({ type: types.CHOOSE_ITEM, id })
    }}
  >
    ${name}
  </li>
`

export const SuggestionsList = connect(
  ({ items }) => render`
    <ul id="list">
      ${items.map(Item)}
    </ul>
  `
)
