import {render} from '../../../index.js'
import type {EventHandler} from '../../../purity.js'
import {state} from '../app.js'
import {resetInput} from '../services/input-form.js'
import {byInput, byStatus, deleteTask, patchTask} from '../services/tasks.js'
import {
  TaskItem,
  withDeleteButton,
  withItemDescription,
  withToggleButton,
} from './TaskItem.js'
import {TaskListStyle} from './TaskListStyle.js'

const handleClick: EventHandler = e => {
  withToggleButton(e.target)(({id, completed}) => {
    patchTask({id, completed: !completed})
    resetInput()
  })
  withDeleteButton(e.target)(({id}) => {
    deleteTask(id)
  })
  // TODO: do use this later
  // withItemDescription(e.target as HTMLElement)(({id})=>{
  //   setState(()=>({taskDetailId: id}))
  // })
}

export const TaskList = (): string => {
  const tasks = state.tasks.filter(byInput(state)).filter(byStatus(state))

  return render`
    <ol id="task-list" ::click=${handleClick}>
      ${tasks.map(TaskItem)}
    </ol>
    ${TaskListStyle()}
  `
}
