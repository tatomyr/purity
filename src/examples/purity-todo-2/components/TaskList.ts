import {render} from '../../../index.js'
import {state} from '../app.js'
import {resetInput} from '../services/input-form.js'
import {byInput, byStatus, patchTask, useTasks} from '../services/tasks.js'
import {Dataset, TaskItem, TOGGLE_BUTTON, withToggleButton} from './TaskItem.js'

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

    .${TOGGLE_BUTTON} {
      all: unset;
    }

    ul#task-list .task-item .${TOGGLE_BUTTON} {
      width: 3rem;
      min-width: 3rem;
      height: 3rem;
      text-align: center;
      font-size: 2rem;
      line-height: 1;
    }

    ul#task-list .task-item .${TOGGLE_BUTTON}:active {
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

    .being-processed {
      color: lightgrey;
    }
  </style>
`

const handleClick = (e: Event): void => {
  withToggleButton(e.target as HTMLElement)(({id, completed}: Dataset) => {
    const optimisticData = (useTasks.getCached().data || []).map(task =>
      task.id === id
        ? {
            ...task,
            tmpFlag: true,
            completed: !completed,
            updatedAt: Date.now(),
            isBeingUpdated: true,
          }
        : task
    )
    useTasks.fire({
      optimisticData,
      mutation: () =>
        patchTask({id, completed: !completed, tmpFlag: true}).then(resetInput),
    })
  })
}

export const TaskList = (): string => {
  const {data = []} = useTasks.call()
  const tasks = data.filter(byInput(state)).filter(byStatus(state))

  return render`
    <ul id="task-list" ::click=${handleClick}>
      ${tasks.map(TaskItem)}
    </ul>
    ${ListStyle()}
  `
}
