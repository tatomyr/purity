import {render} from '../../../index.js'
import {state} from '../app.js'
import {resetInput} from '../services/input-form.js'
import {byInput, byStatus, deleteTask, patchTask} from '../services/tasks.js'
import {
  taskItem,
  withDeleteButton,
  withItemDescription,
  withToggleButton,
} from './task-item.js'
import {taskListStyle} from './task-list-style.js'
import type {EventHandler} from '../../../purity.js'


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

export const taskList = (): string => {
  const tasks = state.tasks.filter(byInput(state)).filter(byStatus(state))

  return render`
    <ol id="task-list" ::click=${handleClick}>
      ${tasks.map(taskItem)}
    </ol>
    ${taskListStyle()}
  `
}
