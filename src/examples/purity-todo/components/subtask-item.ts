import {render, sanitize} from "../../../index.js"
import {patchTask} from "../services/tasks.js"
import {selectDetailedTask} from "../services/task-details.js"
import {ACTION_BUTTON} from "./app-style.js"
import type {Image, Subtask, Task} from "../app.js"
import type {EventHandler} from "../../../purity.js"

export const SMALL_BUTTON = "small-button"

const toggleSubtask =
  (subtaskIndex: number): EventHandler =>
  ({target: {checked}}) => {
    const {id, subtasks, completed} = selectDetailedTask()
    const newSubtasks = subtasks?.map((s, i) =>
      i === subtaskIndex ? {...s, checked: !s.checked} : s
    )
    const completedSubtasks = newSubtasks?.every(s => s.checked)
    patchTask({
      id: id,
      subtasks: newSubtasks,
      completed: completedSubtasks ?? completed,
    })
  }

const handleSubtaskChange =
  (subtaskIndex: number): EventHandler =>
  ({target: {value}}) => {
    const task = selectDetailedTask()
    const newSubtasks = task.subtasks?.map((s, i) =>
      i === subtaskIndex ? {...s, description: sanitize(value)} : s
    )
    patchTask({
      id: task.id,
      subtasks: newSubtasks,
    })
  }

const deleteSubtask =
  (subtaskIndex: number): EventHandler =>
  () => {
    const {id, subtasks, completed} = selectDetailedTask()
    const newSubtasks = subtasks?.filter((_, i) => i !== subtaskIndex)
    const completedSubtasks = newSubtasks?.every(s => s.checked)
    patchTask({
      id,
      subtasks: newSubtasks,
      completed: completedSubtasks ?? completed,
    })
  }

export const subtaskItem = (
  {description, checked}: Subtask,
  subtaskIndex: number
): string => {
  return render`
    <div class="subtask" id="subtask-${subtaskIndex}">
      <button
        id="toggle-subtask-${subtaskIndex}"
        class="${ACTION_BUTTON} ${SMALL_BUTTON}"
        title="Toggle"
        ::click=${toggleSubtask(subtaskIndex)}
      >
        ${checked ? "⊠" : "⊡"}
      </button>
      ${
        checked
          ? render`
            <div class="subtask-completed">${description}</div>
          `
          : render`
            <input
              class="subtask-input"
              value="${description}"
              ::change=${handleSubtaskChange(subtaskIndex)}
            />
          `
      }

      <button
        class="${ACTION_BUTTON} ${SMALL_BUTTON}"
        title="Delete"
        ::click=${deleteSubtask(subtaskIndex)}
      >
        ⊟
      </button>
    </div>

  `
}
