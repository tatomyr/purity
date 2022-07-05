import {render} from '../../../index.js'
import {Task} from '../app.js'
import {IMAGES} from '../config/images.js'

export type Dataset = Pick<Task, 'id' | 'completed'>

export const TOGGLE_BUTTON = 'toggle-button'

export const withToggleButton =
  ($target: HTMLElement) =>
  (callback: (dataset: Dataset) => void): void => {
    if ([...$target.classList].includes(TOGGLE_BUTTON)) {
      callback($target.dataset as unknown as Dataset)
    }
  }

export const TaskItem = ({
  description,
  id,
  completed,
  image,
  isBeingCreated,
  isBeingUpdated,
}: Task): string => render`
  <li id="${id}" class="task-item ${completed && 'completed'}">
    <img
      src="${image.link}"
      onerror="this.onerror = null; this.src = '${IMAGES.BROKEN}'"
      loading="lazy"
    />
    <div class="description">
      ${description}
    </div>
    <button
      id="toggle-${id}"
      class="${TOGGLE_BUTTON} ${
        (isBeingCreated || isBeingUpdated) && 'being-processed'
      }"
      data-id="${id}"
      data-completed="${completed && 'true'}"
    >
      ${completed ? '⊠' : '⊡'}
    </button>
  </li>
`
