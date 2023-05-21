import {render} from '../../../index.js'
import {IMAGES} from '../config/images.js'
import {openTaskDetails} from '../services/task-details.js'
import {ACTION_BUTTON} from './app-style.js'
import type {Task} from '../app.js'

export const TOGGLE_BUTTON = 'toggle-button'
export const withToggleButton =
	($target: HTMLElement) =>
	(callback: (dataset: Pick<Task, 'id' | 'completed'>) => void): void => {
		if ([...$target.classList].includes(TOGGLE_BUTTON)) {
			callback($target.dataset as unknown as Pick<Task, 'id' | 'completed'>)
		}
	}

export const DELETE_BUTTON = 'delete-button'
export const withDeleteButton =
	($target: HTMLElement) =>
	(callback: (dataset: Pick<Task, 'id'>) => void): void => {
		if ([...$target.classList].includes(DELETE_BUTTON)) {
			callback($target.dataset as unknown as Pick<Task, 'id'>)
		}
	}

export const ITEM_DESCRIPTION = 'item-description'
export const withItemDescription =
	($target: HTMLElement) =>
	(callback: (dataset: Pick<Task, 'id'>) => void): void => {
		if ([...$target.classList].includes(ITEM_DESCRIPTION)) {
			callback($target.dataset as unknown as Pick<Task, 'id'>)
		}
	}

const formatDescription = (description: string): string => {
	const [first, ...rest] = description.trim().split('\n')
	return `${first}${rest.map(item => render`<span> ⊡ ${item}</span>`).join('')}`
}

export const taskItem = ({
	description,
	id,
	completed,
	image,
}: Task): string => render`
	<li id="${id}" class="task-item ${completed && 'completed'}">
		<img
			src="${image.link}"
			onerror="this.onerror = null; this.src = '${IMAGES.BROKEN}'"
			loading="lazy"
		/>
		<div 
			class="${ITEM_DESCRIPTION}" 
			data-id="${id}" 
			::click=${openTaskDetails}
		>
			${formatDescription(description)}
		</div>
		<button 
			id="delete-${id}"
			class="${ACTION_BUTTON} ${DELETE_BUTTON} ${!completed && 'hidden'}"
			data-id="${id}"
			title="Delete"
		>
			⊟
		</button>
		<button
			id="toggle-${id}"
			class="${ACTION_BUTTON} ${TOGGLE_BUTTON}"
			data-id="${id}"
			data-completed="${completed && 'true'}"
			title="Toggle"
		>
			${completed ? '⊠' : '⊡'}
		</button>
	</li>
`
