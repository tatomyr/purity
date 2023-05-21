import {render, sanitize} from '../../../index.js'
import {patchTask} from '../services/tasks.js'
import {selectDetailedTask} from '../services/task-details.js'
import {ACTION_BUTTON} from './app-style.js'
import type {Image, Subtask, Task} from '../app.js'
import type {EventHandler} from '../../../purity.js'

export const SMALL_BUTTON = 'small-button'

const toggleSubtask =
	(subtaskIndex: number): EventHandler =>
	({target: {checked}}) => {
		const {id, subtasks} = selectDetailedTask()
		patchTask({
			id: id,
			subtasks: subtasks?.map((subtask, i) =>
				i === subtaskIndex ? {...subtask, checked: !subtask.checked} : subtask
			),
		})
	}

const handleSubtaskChange =
	(subtaskIndex: number): EventHandler =>
	({target: {value}}) => {
		const task = selectDetailedTask()
		patchTask({
			id: task.id,
			subtasks: task.subtasks?.map((subtask, i) =>
				i === subtaskIndex ? {...subtask, description: value} : subtask
			),
		})
	}

const deleteSubtask =
	(subtaskIndex: number): EventHandler =>
	() => {
		const {id, subtasks} = selectDetailedTask()
		patchTask({id, subtasks: subtasks?.filter((_, i) => i !== subtaskIndex)})
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
				${checked ? '⊠' : '⊡'}
			</button>
			${
				checked
					? render`
						<div style="text-decoration: line-through; width: 100%; padding: 4px 8px; ">${description}</div>
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
