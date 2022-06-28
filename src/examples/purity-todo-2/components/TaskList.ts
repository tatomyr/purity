import {render} from '../../../index.js'
import {state} from '../app.js'
import {resetInput} from '../services/input-form.js'
import {byInput, byStatus, patchTask, useTasks} from '../services/tasks.js'
import {Dataset, TaskItem, withToggleButton} from './TaskItem.js'

const ListStyle = () => render`
  <style id="task-list-style">
    ul#task-list {
      padding: 3rem 0;
      width: 100%;
      max-width: 100%;
    }

    ul#task-list .task-item {
      display: flex;
      border-bottom: 1px solid lightgrey;
      height: 3rem;
      min-height: 3rem;
      align-items: center;
      padding: 0;
    }

    ul#task-list .task-item .description {
      flex-grow: 1;
      padding: 2px 8px;
      max-height: 3rem;
      width: 100%;
      word-break: break-word;
      overflow: hidden;
    }

    ul#task-list .task-item.completed .description {
      color: lightgrey;
    }

    ul#task-list .task-item .toggle-button {
      all: unset;
      width: 3rem;
      min-width: 3rem;
      height: 3rem;
      text-align: center;
      font-size: 2rem;
      line-height: 1;
    }

    ul#task-list .task-item .toggle-button:active {
      background-color: grey;
    }

    ul#task-list .task-item > img {
      height: 3rem;
      min-height: 3rem;
      width: 3rem;
      min-width: 3rem;
      object-fit: cover;
    }

    ul#task-list .task-item.completed > img {
      filter: grayscale(1);
    }
  </style>
`

const handleClick = (e: Event): void => {
  withToggleButton(e.target as HTMLElement)(({id, completed}: Dataset) =>
    patchTask({id, completed: !completed, tmpFlag: true})
      .then(resetInput)
      .then(() => useTasks.fire())
  )
}

export const TaskList = (): string => {
  const {data = [], status} = useTasks.call()
  const tasks = data.filter(byInput).filter(byStatus(state))

  return render`
    <ul id="task-list" ::click=${handleClick}>
      ${status === 'pending' ? '…' : tasks.map(TaskItem)}
    </ul>
    ${ListStyle()}
  `
}
