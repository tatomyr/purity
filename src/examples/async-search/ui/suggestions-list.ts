import {isTruthy, render} from "../../../purity.js"
import {idEquals} from "../helpers.js"
import {getState, setState} from "../app.js"
import type {Item} from "../types.js"

const item = ({name, id}: Item) => render`
  <li
    ::click=${() => {
      setState(({items, chosenItems}) => ({
        chosenItems: [
          ...chosenItems,
          !chosenItems.some(idEquals(id)) && items.find(idEquals(id)),
        ].filter(isTruthy),
      }))
    }}
  >
    ${name}
  </li>
`

export const suggestionsList = (): string => render`
  <ul id="list">
    ${getState().items.map(item)}
  </ul>
`
