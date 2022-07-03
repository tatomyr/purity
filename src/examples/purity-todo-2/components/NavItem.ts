import {render} from '../../../index.js'
import {setState, state, Task, ViewFilter} from '../app.js'
import {getJSON, saveJSON} from '../services/storage.js'
import {byInput, byStatus, groomTasks, useTasks} from '../services/tasks.js'

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
      class="nav-option ${
        isChosen(value, useTasks.getCached().data) && 'chosen'
      }"
      ::click=${async () => {
        if (useTasks.getCached().data?.some(({tmpFlag}) => tmpFlag)) {
          await getJSON({tasks: [] as Task[]})
            .then(tasks => {
              saveJSON({tasks: groomTasks(tasks)})
            })
            .then(() => useTasks.fire())
        }
        setState(() => ({view: value}))
      }}
    >
      ${label}
    </button>
  </li>
`
