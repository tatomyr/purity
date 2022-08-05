import {render} from '../../../index.js'
import {setState, state, Task, ViewFilter} from '../app.js'
import {byInput, byStatus, groomTasks} from '../services/tasks.js'
import {ACTION_BUTTON} from './AppStyle.js'

export type FilterOptionType = {value: ViewFilter; label: string}

const isChosen = (value: ViewFilter, tasks?: Task[]): boolean =>
  !!tasks
    ?.filter(byInput(state))
    .filter(byStatus(state))
    .some(
      ({completed}) =>
        (value === 'active' && !completed) ||
        (value === 'completed' && completed)
    )

export const NavItem = ({value, label}: FilterOptionType): string => render`
  <li id="${value}">
    <button
      class="${ACTION_BUTTON} ${isChosen(value, state.tasks) && 'chosen'}"
      ::click=${() => {
        setState(({tasks}) => ({view: value, tasks: groomTasks(tasks)}))
      }}
    >
      ${label}
    </button>
  </li>
`
