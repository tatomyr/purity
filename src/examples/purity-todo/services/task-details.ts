import {setState, state} from "../app.js"
import {patchTask} from "./tasks.js"
import type {Task} from "../app.js"
import type {EventHandler} from "../../../purity.js"

export const closeTaskDetails: EventHandler = () => {
  const task = selectDetailedTask()
  const validSubtasks =
    task.subtasks?.filter(({description}) => description) || []
  const subtasksCompleted =
    validSubtasks.length > 0
      ? validSubtasks.every(s => s.checked)
      : task.completed

  patchTask(
    {
      ...task,
      subtasks: validSubtasks,
      completed: subtasksCompleted,
    },
    true
  )
  setState(() => ({taskDetailId: undefined}))
}

export const openTaskDetails: EventHandler = e => {
  const {id} = e.currentTarget.dataset
  setState(() => ({taskDetailId: id}))
}

export const selectDetailedTask = (): Task =>
  state.tasks.find(({id}) => id === state.taskDetailId) as Task
