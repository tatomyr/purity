import {Component, render} from '../../../purity.js'
import {setState, state, View} from '../app.js'
import {groomTasks} from '../services/tasks.js'

export type FilterOptionType = {value: View; label: string}

export const NavItem: Component<FilterOptionType> = ({
  value,
  label,
}: FilterOptionType): string => render`
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
