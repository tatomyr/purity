import { render } from '/index.js'
import { connect, dispatch } from '../store/provider.js'
import { types } from '../types.js'

const Item = ({ name, id }) => render`
  <li
    ::click=${() => {
      dispatch({ type: types.REMOVE_FROM_CHOSEN, id })
    }}
  >
    ${name}
  </li>
`

export const ChosenItems = connect(
  ({ chosenItems }) => render`
    <ul id="chosen-items" class="chosen-items">
      ${chosenItems.map(Item)}
    </ul>
  `
)
