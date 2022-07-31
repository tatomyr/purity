import {render} from '../../../index.js'
import {IMAGES} from '../config/images.js'
import {openTaskDetails} from '../services/task-details.js'
import type {Task} from '../app.js'

export const TOGGLE_BUTTON = 'toggle-button'
export const withToggleButton =
  ($target: HTMLElement) =>
  (callback: (dataset: Pick<Task, 'id' | 'completed'>) => void): void => {
    if ([...$target.classList].includes(TOGGLE_BUTTON)) {
      callback($target.dataset as unknown as Pick<Task, 'id' | 'completed'>)
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

export const TaskItem = ({
  description,
  id,
  completed,
  image,
  isImageLoading,
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
      ${description}
    </div>
    <button
      id="toggle-${id}"
      class="
        ${TOGGLE_BUTTON} 
        ${isImageLoading && 'being-processed'}
      "
      data-id="${id}"
      data-completed="${completed && 'true'}"
    >
      ${completed ? '⊠' : '⊡'}
    </button>
  </li>
`
