import {render} from '../../../index.js'
import {state} from '../app.js'
import {resetInput} from '../services/input-form.js'
import {byInput, byStatus, patchTask} from '../services/tasks.js'
import {
  ITEM_DESCRIPTION,
  TaskItem,
  TOGGLE_BUTTON,
  withItemDescription,
  withToggleButton,
} from './TaskItem.js'

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
      height: 100%;
      min-height: 100%;
      align-items: center;
      padding: 0;
    }

    ul#task-list .task-item .${ITEM_DESCRIPTION} {
      flex-grow: 1;
      padding: 2px 8px;
      max-height: 3rem;
      width: 100%;
      word-break: break-word;
      overflow: hidden;
    }

    ul#task-list .task-item.completed .${ITEM_DESCRIPTION} {
      color: lightgrey;
    }

    .${TOGGLE_BUTTON} {
      all: unset;
    }

    ul#task-list .task-item .${TOGGLE_BUTTON} {
      width: 3rem;
      min-width: 3rem;
      height: 100%;
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
  withToggleButton(e.target as HTMLElement)(({id, completed}) => {
    patchTask({id, completed: !completed})
    resetInput()
  })
  // TODO: do use this later
  // withItemDescription(e.target as HTMLElement)(({id})=>{
  //   setState(()=>({taskDetailId: id}))
  // })
}

export const TaskList = (): string => {
  const tasks = state.tasks.filter(byInput(state)).filter(byStatus(state))

  return render`
    <ul id="task-list" ::click=${handleClick}>
      ${tasks.map(TaskItem)}
    </ul>
    ${ListStyle()}
  `
}
