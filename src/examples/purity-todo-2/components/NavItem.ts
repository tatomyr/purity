import {render} from '../../../index.js'
import {setState, state, ViewFilter} from '../app.js'
import {groomTasks} from '../services/tasks.js'

export type FilterOptionType = {value: ViewFilter; label: string}

export const NavItem = ({value, label}: FilterOptionType): string => render`
  <li id="${value}">
    <button
      class="nav-option ${(value === state.view || state.input) && 'chosen'}"
      ::click=${() => {
        setState(() => ({view: value}))
        groomTasks()
      }}
    >
      ${label}
    </button>
  </li>
`
